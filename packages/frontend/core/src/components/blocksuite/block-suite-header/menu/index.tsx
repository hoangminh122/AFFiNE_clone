import { toast } from '@affine/component';
import {
  Menu,
  MenuIcon,
  MenuItem,
  MenuSeparator,
} from '@affine/component/ui/menu';
import { openHistoryTipsModalAtom } from '@affine/core/atoms';
import { PageHistoryModal } from '@affine/core/components/affine/page-history-modal';
import { Export, MoveToTrash } from '@affine/core/components/page-list';
import { useBlockSuiteMetaHelper } from '@affine/core/hooks/affine/use-block-suite-meta-helper';
import { useExportPage } from '@affine/core/hooks/affine/use-export-page';
import { useTrashModalHelper } from '@affine/core/hooks/affine/use-trash-modal-helper';
import { useAsyncCallback } from '@affine/core/hooks/affine-async-hooks';
import { mixpanel } from '@affine/core/utils';
import { WorkspaceFlavour } from '@affine/env/workspace';
import { useAFFiNEI18N } from '@affine/i18n/hooks';
import {
  DuplicateIcon,
  EdgelessIcon,
  EditIcon,
  FavoritedIcon,
  FavoriteIcon,
  HistoryIcon,
  ImportIcon,
  PageIcon,
} from '@blocksuite/icons';
import {
  DocService,
  useLiveData,
  useService,
  WorkspaceService,
} from '@toeverything/infra';
import { useSetAtom } from 'jotai';
import { useCallback, useState } from 'react';

import { HeaderDropDownButton } from '../../../pure/header-drop-down-button';
import { usePageHelper } from '../../block-suite-page-list/utils';
import { useFavorite } from '../favorite';

type PageMenuProps = {
  rename?: () => void;
  pageId: string;
  isJournal?: boolean;
};
// fixme: refactor this file
export const PageHeaderMenuButton = ({
  rename,
  pageId,
  isJournal,
}: PageMenuProps) => {
  const t = useAFFiNEI18N();

  const workspace = useService(WorkspaceService).workspace;
  const docCollection = workspace.docCollection;

  const doc = useService(DocService).doc;
  const isInTrash = useLiveData(doc.meta$.map(m => m.trash));
  const currentMode = useLiveData(doc.mode$);

  const { favorite, toggleFavorite } = useFavorite(pageId);

  const { duplicate } = useBlockSuiteMetaHelper(docCollection);
  const { importFile } = usePageHelper(docCollection);
  const { setTrashModal } = useTrashModalHelper(docCollection);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const setOpenHistoryTipsModal = useSetAtom(openHistoryTipsModalAtom);

  const openHistoryModal = useCallback(() => {
    if (workspace.flavour === WorkspaceFlavour.AFFINE_CLOUD) {
      return setHistoryModalOpen(true);
    }
    return setOpenHistoryTipsModal(true);
  }, [setOpenHistoryTipsModal, workspace.flavour]);

  const handleOpenTrashModal = useCallback(() => {
    setTrashModal({
      open: true,
      pageIds: [pageId],
      pageTitles: [doc.meta$.value.title ?? ''],
    });
  }, [doc.meta$.value.title, pageId, setTrashModal]);

  const handleSwitchMode = useCallback(() => {
    doc.toggleMode();
    toast(
      currentMode === 'page'
        ? t['com.affine.toastMessage.edgelessMode']()
        : t['com.affine.toastMessage.pageMode']()
    );
  }, [currentMode, doc, t]);
  const menuItemStyle = {
    padding: '4px 12px',
    transition: 'all 0.3s',
  };

  const exportHandler = useExportPage(doc.blockSuiteDoc);

  const handleDuplicate = useCallback(() => {
    duplicate(pageId);
    mixpanel.track('DocCreated', {
      segment: 'editor header',
      module: 'header menu',
      control: 'copy doc',
      type: 'doc duplicate',
      category: 'doc',
    });
  }, [duplicate, pageId]);

  const onImportFile = useAsyncCallback(async () => {
    const options = await importFile();
    if (options.isWorkspaceFile) {
      mixpanel.track('WorkspaceCreated', {
        segment: 'editor header',
        module: 'header menu',
        control: 'import button',
        type: 'imported workspace',
      });
    } else {
      mixpanel.track('DocCreated', {
        segment: 'editor header',
        module: 'header menu',
        control: 'import button',
        type: 'imported doc',
      });
    }
  }, [importFile]);

  const EditMenu = (
    <>
      {!isJournal && (
        <MenuItem
          preFix={
            <MenuIcon>
              <EditIcon />
            </MenuIcon>
          }
          data-testid="editor-option-menu-rename"
          onSelect={rename}
          style={menuItemStyle}
        >
          {t['Rename']()}
        </MenuItem>
      )}
      <MenuItem
        preFix={
          <MenuIcon>
            {currentMode === 'page' ? <EdgelessIcon /> : <PageIcon />}
          </MenuIcon>
        }
        data-testid="editor-option-menu-edgeless"
        onSelect={handleSwitchMode}
        style={menuItemStyle}
      >
        {t['Convert to ']()}
        {currentMode === 'page'
          ? t['com.affine.pageMode.edgeless']()
          : t['com.affine.pageMode.page']()}
      </MenuItem>
      <MenuItem
        data-testid="editor-option-menu-favorite"
        onSelect={toggleFavorite}
        style={menuItemStyle}
        preFix={
          <MenuIcon>
            {favorite ? (
              <FavoritedIcon style={{ color: 'var(--affine-primary-color)' }} />
            ) : (
              <FavoriteIcon />
            )}
          </MenuIcon>
        }
      >
        {favorite
          ? t['com.affine.favoritePageOperation.remove']()
          : t['com.affine.favoritePageOperation.add']()}
      </MenuItem>
      {/* {TODO: add tag function support} */}
      {/* <MenuItem
        icon={<TagsIcon />}
        data-testid="editor-option-menu-add-tag"
        onClick={() => {}}
        style={menuItemStyle}
      >
        {t['com.affine.header.option.add-tag']()}
      </MenuItem> */}
      <MenuSeparator />
      {!isJournal && (
        <MenuItem
          preFix={
            <MenuIcon>
              <DuplicateIcon />
            </MenuIcon>
          }
          data-testid="editor-option-menu-duplicate"
          onSelect={handleDuplicate}
          style={menuItemStyle}
        >
          {t['com.affine.header.option.duplicate']()}
        </MenuItem>
      )}
      <MenuItem
        preFix={
          <MenuIcon>
            <ImportIcon />
          </MenuIcon>
        }
        data-testid="editor-option-menu-import"
        onSelect={onImportFile}
        style={menuItemStyle}
      >
        {t['Import']()}
      </MenuItem>
      <Export exportHandler={exportHandler} pageMode={currentMode} />

      {runtimeConfig.enablePageHistory ? (
        <MenuItem
          preFix={
            <MenuIcon>
              <HistoryIcon />
            </MenuIcon>
          }
          data-testid="editor-option-menu-history"
          onSelect={openHistoryModal}
          style={menuItemStyle}
        >
          {t['com.affine.history.view-history-version']()}
        </MenuItem>
      ) : null}

      <MenuSeparator />
      <MoveToTrash
        data-testid="editor-option-menu-delete"
        onSelect={handleOpenTrashModal}
      />
    </>
  );
  if (isInTrash) {
    return null;
  }
  return (
    <>
      <Menu
        items={EditMenu}
        contentOptions={{
          align: 'center',
        }}
      >
        <HeaderDropDownButton />
      </Menu>
      {workspace.flavour === WorkspaceFlavour.AFFINE_CLOUD ? (
        <PageHistoryModal
          docCollection={workspace.docCollection}
          open={historyModalOpen}
          pageId={pageId}
          onOpenChange={setHistoryModalOpen}
        />
      ) : null}
    </>
  );
};
