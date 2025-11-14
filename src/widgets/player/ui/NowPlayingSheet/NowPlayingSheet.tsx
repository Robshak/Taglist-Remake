import ChevronDownIcon from '@shared/svg/ChevronDown.svg?react';
import { Icon, Modal } from '@shared/ui';
import React, { useMemo } from 'react';

import { useI18n } from '../../lib';
import { ControlButtons } from '../ControlButtons';
import { ProgressSection } from '../ProgressSection';
import { VolumeSection } from '../VolumeSection';
import s from './NowPlayingSheet.module.scss';

interface ITrackInfo {
  name: string;
  artist: string;
  imageUrl?: string;
}

interface IPlaybackControls {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  isLooping: boolean;
  onToggleLoop: () => void;
}

interface IProgressState {
  currentTime: number;
  duration: number;
  onSeek: (v: number) => void;
  onSeekCommit: () => void;
}

interface IVolumeControl {
  volume: number;
  onSetVolume: (v: number) => void;
  onToggleMute: () => void;
}

interface INowPlayingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  trackInfo: ITrackInfo;
  playbackControls: IPlaybackControls;
  progressState: IProgressState;
  volumeControl: IVolumeControl;
  onEditTags?: () => void;
}

export const NowPlayingSheet: React.FC<INowPlayingSheetProps> = ({
  isOpen,
  onClose,
  trackInfo,
  playbackControls,
  progressState,
  volumeControl,
  onEditTags,
}) => {
  const { name, artist, imageUrl } = trackInfo;
  const { isPlaying, onTogglePlay, onPrev, onNext, isLooping, onToggleLoop } = playbackControls;
  const { currentTime, duration, onSeek, onSeekCommit } = progressState;
  const { volume, onSetVolume, onToggleMute } = volumeControl;
  const { t } = useI18n();

  const controlTranslations = useMemo(
    () => ({
      editTags: t('buttons.editTags'),
      tags: t('buttons.tags'),
      previous: t('buttons.previous'),
      pausePlay: t('buttons.pausePlay'),
      next: t('buttons.next'),
      loopOn: t('buttons.loopOn'),
      loopOff: t('buttons.loopOff'),
    }),
    [t]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      overlayClassName={s.overlay}
      contentClassName={s.sheet}
      contentMotionProps={
        typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
          ? {
              drag: 'y',
              dragConstraints: { top: 0, bottom: 0 },
              dragElastic: 0.2,
              onDragEnd: (_e, info) => {
                if (info.offset.y > 120 || info.velocity.y > 800) {
                  onClose();
                }
              },
            }
          : undefined
      }
    >
      <div className={s.header}>
        <button className={s.btn} onClick={onClose} aria-label={t('buttons.collapse')}>
          <Icon component={ChevronDownIcon} width={20} height={20} />
        </button>
        <div className={s.title}>{t('title')}</div>
        <div style={{ width: 48 }} />
      </div>

      <div className={s.content}>
        {imageUrl && <img className={s.cover} src={imageUrl} alt={name} />}
        <div className={s.info}>
          <div className={s.name}>{name}</div>
          <div className={s.artist}>{artist}</div>
        </div>
      </div>

      <div className={s.controls}>
        <VolumeSection
          volume={volume}
          onSetVolume={onSetVolume}
          onToggleMute={onToggleMute}
          ariaLabel={t('aria.volume')}
        />
        <ProgressSection
          currentTime={currentTime}
          duration={duration}
          onSeek={onSeek}
          onSeekCommit={onSeekCommit}
        />
        <ControlButtons
          isPlaying={isPlaying}
          isLooping={isLooping}
          onTogglePlay={onTogglePlay}
          onPrev={onPrev}
          onNext={onNext}
          onToggleLoop={onToggleLoop}
          onEditTags={onEditTags}
          translations={controlTranslations}
        />
      </div>
    </Modal>
  );
};
