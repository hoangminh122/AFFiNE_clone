import { apis, events } from '@affine/electron-api';
import { useAtomValue } from 'jotai';
import { atomWithObservable } from 'jotai/utils';
import { useCallback } from 'react';
import { combineLatest, map, Observable } from 'rxjs';

import * as style from './style.css';

const maximized$ = new Observable<boolean>(subscriber => {
  subscriber.next(false);
  if (events) {
    return events.ui.onMaximized(res => {
      subscriber.next(res);
    });
  }
  return () => {};
});

const fullscreen$ = new Observable<boolean>(subscriber => {
  subscriber.next(false);
  if (events) {
    return events.ui.onFullScreen(res => {
      subscriber.next(res);
    });
  }
  return () => {};
});

const maximizedAtom = atomWithObservable(() => {
  return combineLatest([maximized$, fullscreen$]).pipe(
    map(([maximized, fullscreen]) => maximized || fullscreen)
  );
});

const minimizeSVG = (
  <svg
    width="10"
    height="1"
    viewBox="0 0 10 1"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.498047 1C0.429688 1 0.364583 0.986979 0.302734 0.960938C0.244141 0.934896 0.192057 0.899089 0.146484 0.853516C0.100911 0.807943 0.0651042 0.755859 0.0390625 0.697266C0.0130208 0.635417 0 0.570312 0 0.501953C0 0.433594 0.0130208 0.370117 0.0390625 0.311523C0.0651042 0.249674 0.100911 0.195964 0.146484 0.150391C0.192057 0.101562 0.244141 0.0641276 0.302734 0.0380859C0.364583 0.0120443 0.429688 -0.000976562 0.498047 -0.000976562H9.50195C9.57031 -0.000976562 9.63379 0.0120443 9.69238 0.0380859C9.75423 0.0641276 9.80794 0.101562 9.85352 0.150391C9.89909 0.195964 9.9349 0.249674 9.96094 0.311523C9.98698 0.370117 10 0.433594 10 0.501953C10 0.570312 9.98698 0.635417 9.96094 0.697266C9.9349 0.755859 9.89909 0.807943 9.85352 0.853516C9.80794 0.899089 9.75423 0.934896 9.69238 0.960938C9.63379 0.986979 9.57031 1 9.50195 1H0.498047Z"
      fill="currentColor"
    />
  </svg>
);

const closeSVG = (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 5.70801L0.854492 9.85352C0.756836 9.95117 0.639648 10 0.50293 10C0.359701 10 0.239258 9.9528 0.141602 9.8584C0.0472005 9.76074 0 9.6403 0 9.49707C0 9.36035 0.0488281 9.24316 0.146484 9.14551L4.29199 5L0.146484 0.854492C0.0488281 0.756836 0 0.638021 0 0.498047C0 0.429688 0.0130208 0.364583 0.0390625 0.302734C0.0651042 0.240885 0.100911 0.188802 0.146484 0.146484C0.192057 0.100911 0.245768 0.0651042 0.307617 0.0390625C0.369466 0.0130208 0.43457 0 0.50293 0C0.639648 0 0.756836 0.0488281 0.854492 0.146484L5 4.29199L9.14551 0.146484C9.24316 0.0488281 9.36198 0 9.50195 0C9.57031 0 9.63379 0.0130208 9.69238 0.0390625C9.75423 0.0651042 9.80794 0.100911 9.85352 0.146484C9.89909 0.192057 9.9349 0.245768 9.96094 0.307617C9.98698 0.366211 10 0.429688 10 0.498047C10 0.638021 9.95117 0.756836 9.85352 0.854492L5.70801 5L9.85352 9.14551C9.95117 9.24316 10 9.36035 10 9.49707C10 9.56543 9.98698 9.63053 9.96094 9.69238C9.9349 9.75423 9.89909 9.80794 9.85352 9.85352C9.8112 9.89909 9.75911 9.9349 9.69727 9.96094C9.63542 9.98698 9.57031 10 9.50195 10C9.36198 10 9.24316 9.95117 9.14551 9.85352L5 5.70801Z"
      fill="currentColor"
    />
  </svg>
);

const maximizeSVG = (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.47461 10C1.2793 10 1.09212 9.96094 0.913086 9.88281C0.734049 9.80143 0.576172 9.69401 0.439453 9.56055C0.30599 9.42383 0.198568 9.26595 0.117188 9.08691C0.0390625 8.90788 0 8.7207 0 8.52539V1.47461C0 1.2793 0.0390625 1.09212 0.117188 0.913086C0.198568 0.734049 0.30599 0.577799 0.439453 0.444336C0.576172 0.307617 0.734049 0.200195 0.913086 0.12207C1.09212 0.0406901 1.2793 0 1.47461 0H8.52539C8.7207 0 8.90788 0.0406901 9.08691 0.12207C9.26595 0.200195 9.4222 0.307617 9.55566 0.444336C9.69238 0.577799 9.7998 0.734049 9.87793 0.913086C9.95931 1.09212 10 1.2793 10 1.47461V8.52539C10 8.7207 9.95931 8.90788 9.87793 9.08691C9.7998 9.26595 9.69238 9.42383 9.55566 9.56055C9.4222 9.69401 9.26595 9.80143 9.08691 9.88281C8.90788 9.96094 8.7207 10 8.52539 10H1.47461ZM8.50098 8.99902C8.56934 8.99902 8.63281 8.986 8.69141 8.95996C8.75326 8.93392 8.80697 8.89811 8.85254 8.85254C8.89811 8.80697 8.93392 8.75488 8.95996 8.69629C8.986 8.63444 8.99902 8.56934 8.99902 8.50098V1.49902C8.99902 1.43066 8.986 1.36719 8.95996 1.30859C8.93392 1.24674 8.89811 1.19303 8.85254 1.14746C8.80697 1.10189 8.75326 1.06608 8.69141 1.04004C8.63281 1.014 8.56934 1.00098 8.50098 1.00098H1.49902C1.43066 1.00098 1.36556 1.014 1.30371 1.04004C1.24512 1.06608 1.19303 1.10189 1.14746 1.14746C1.10189 1.19303 1.06608 1.24674 1.04004 1.30859C1.014 1.36719 1.00098 1.43066 1.00098 1.49902V8.50098C1.00098 8.56934 1.014 8.63444 1.04004 8.69629C1.06608 8.75488 1.10189 8.80697 1.14746 8.85254C1.19303 8.89811 1.24512 8.93392 1.30371 8.95996C1.36556 8.986 1.43066 8.99902 1.49902 8.99902H8.50098Z"
      fill="currentColor"
    />
  </svg>
);

const unmaximizedSVG = (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.99902 2.96387C8.99902 2.69368 8.94531 2.43978 8.83789 2.20215C8.73047 1.96126 8.58398 1.75293 8.39844 1.57715C8.21615 1.39811 8.00293 1.25814 7.75879 1.15723C7.5179 1.05306 7.264 1.00098 6.99707 1.00098H2.08496C2.13704 0.851237 2.21029 0.714518 2.30469 0.59082C2.39909 0.467122 2.50814 0.361328 2.63184 0.273438C2.75553 0.185547 2.89062 0.118815 3.03711 0.0732422C3.18685 0.0244141 3.34147 0 3.50098 0H6.99707C7.41048 0 7.79948 0.0797526 8.16406 0.239258C8.52865 0.395508 8.84603 0.608724 9.11621 0.878906C9.38965 1.14909 9.60449 1.46647 9.76074 1.83105C9.92025 2.19564 10 2.58464 10 2.99805V6.49902C10 6.65853 9.97559 6.81315 9.92676 6.96289C9.88118 7.10938 9.81445 7.24447 9.72656 7.36816C9.63867 7.49186 9.53288 7.60091 9.40918 7.69531C9.28548 7.78971 9.14876 7.86296 8.99902 7.91504V2.96387ZM1.47461 10C1.2793 10 1.09212 9.96094 0.913086 9.88281C0.734049 9.80143 0.576172 9.69401 0.439453 9.56055C0.30599 9.42383 0.198568 9.26595 0.117188 9.08691C0.0390625 8.90788 0 8.7207 0 8.52539V3.47656C0 3.27799 0.0390625 3.09082 0.117188 2.91504C0.198568 2.736 0.30599 2.57975 0.439453 2.44629C0.576172 2.30957 0.732422 2.20215 0.908203 2.12402C1.08724 2.04264 1.27604 2.00195 1.47461 2.00195H6.52344C6.72201 2.00195 6.91081 2.04264 7.08984 2.12402C7.26888 2.20215 7.42513 2.30794 7.55859 2.44141C7.69206 2.57487 7.79785 2.73112 7.87598 2.91016C7.95736 3.08919 7.99805 3.27799 7.99805 3.47656V8.52539C7.99805 8.72396 7.95736 8.91276 7.87598 9.0918C7.79785 9.26758 7.69043 9.42383 7.55371 9.56055C7.42025 9.69401 7.264 9.80143 7.08496 9.88281C6.90918 9.96094 6.72201 10 6.52344 10H1.47461ZM6.49902 8.99902C6.56738 8.99902 6.63086 8.986 6.68945 8.95996C6.7513 8.93392 6.80501 8.89811 6.85059 8.85254C6.89941 8.80697 6.93685 8.75488 6.96289 8.69629C6.98893 8.63444 7.00195 8.56934 7.00195 8.50098V3.50098C7.00195 3.43262 6.98893 3.36751 6.96289 3.30566C6.93685 3.24382 6.90104 3.1901 6.85547 3.14453C6.8099 3.09896 6.75619 3.06315 6.69434 3.03711C6.63249 3.01107 6.56738 2.99805 6.49902 2.99805H1.49902C1.43066 2.99805 1.36556 3.01107 1.30371 3.03711C1.24512 3.06315 1.19303 3.10059 1.14746 3.14941C1.10189 3.19499 1.06608 3.2487 1.04004 3.31055C1.014 3.36914 1.00098 3.43262 1.00098 3.50098V8.50098C1.00098 8.56934 1.014 8.63444 1.04004 8.69629C1.06608 8.75488 1.10189 8.80697 1.14746 8.85254C1.19303 8.89811 1.24512 8.93392 1.30371 8.95996C1.36556 8.986 1.43066 8.99902 1.49902 8.99902H6.49902Z"
      fill="currentColor"
    />
  </svg>
);

export const WindowsAppControls = () => {
  const handleMinimizeApp = useCallback(() => {
    apis?.ui.handleMinimizeApp().catch(err => {
      console.error(err);
    });
  }, []);
  const handleMaximizeApp = useCallback(() => {
    apis?.ui.handleMaximizeApp().catch(err => {
      console.error(err);
    });
  }, []);
  const handleCloseApp = useCallback(() => {
    apis?.ui.handleCloseApp().catch(err => {
      console.error(err);
    });
  }, []);

  const maximized = useAtomValue(maximizedAtom);

  return (
    <div
      data-platform-target="win32"
      className={style.windowAppControlsWrapper}
    >
      <button
        data-type="minimize"
        className={style.windowAppControl}
        onClick={handleMinimizeApp}
      >
        {minimizeSVG}
      </button>
      <button
        data-type="maximize"
        className={style.windowAppControl}
        onClick={handleMaximizeApp}
      >
        {maximized ? unmaximizedSVG : maximizeSVG}
      </button>
      <button
        data-type="close"
        className={style.windowAppControl}
        onClick={handleCloseApp}
      >
        {closeSVG}
      </button>
    </div>
  );
};
