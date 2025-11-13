import { formatDuration } from '@shared/lib/helpers';
import ChevronDownIcon from '@shared/svg/ChevronDown.svg?react';
import LoopIcon from '@shared/svg/Loop.svg?react';
import NextIcon from '@shared/svg/Next.svg?react';
import PauseIcon from '@shared/svg/Pause.svg?react';
import PlayIcon from '@shared/svg/Play.svg?react';
import PrevIcon from '@shared/svg/Prev.svg?react';
import TagIcon from '@shared/svg/Tag.svg?react';
import VolumeHighIcon from '@shared/svg/VolumeHigh.svg?react';
import VolumeLowIcon from '@shared/svg/VolumeLow.svg?react';
import VolumeMuteIcon from '@shared/svg/VolumeMute.svg?react';
import { Icon, Modal, Slider } from '@shared/ui';
import React from 'react';

import s from './NowPlayingSheet.module.scss';
import { useI18n } from '../../lib';

interface NowPlayingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  artist: string;
  imageUrl?: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  currentTime: number;
  duration: number;
  onSeek: (v: number) => void;
  onSeekCommit: () => void;
  onEditTags?: () => void;
  volume: number;
  onSetVolume: (v: number) => void;
  onToggleMute: () => void;
}

export const NowPlayingSheet: React.FC<NowPlayingSheetProps> = ({
  isOpen,
  onClose,
  name,
  artist,
  imageUrl,
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  isLooping,
  onToggleLoop,
  currentTime,
  duration,
  onSeek,
  onSeekCommit,
  onEditTags,
  volume,
  onSetVolume,
  onToggleMute,
}) => {
  const { t } = useI18n();
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volPct = Math.max(0, Math.min(100, (volume || 0) * 100));

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
        <div className={s.volumeTop}>
          <button className={s.volumeBtn} onClick={onToggleMute} aria-label={t('aria.volume')}>
            {volume === 0 ? (
              <Icon component={VolumeMuteIcon} width={22} height={22} />
            ) : volume < 0.5 ? (
              <Icon component={VolumeLowIcon} width={22} height={22} />
            ) : (
              <Icon component={VolumeHighIcon} width={22} height={22} />
            )}
          </button>
          <div className={s.volumeSlider}>
            <Slider
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={onSetVolume}
              className={s.volumeInput}
              style={{
                background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${volPct}%, var(--color-border) ${volPct}%, var(--color-border) 100%)`,
              }}
              ariaLabel={t('aria.volume')}
            />
          </div>
        </div>

        <div className={s.progress}>
          <Slider
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={onSeek}
            onCommit={onSeekCommit}
            className={s.slider}
            style={{
              background: `linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) ${progress}%, var(--color-border) ${progress}%, var(--color-border) 100%)`,
            }}
          />
        </div>
        <div className={s.progressTimes}>
          <div className={s.time}>{formatDuration(currentTime)}</div>
          <div className={s.time}>{formatDuration(duration)}</div>
        </div>
        <div className={s.buttons}>
          {onEditTags && (
            <button
              className={s.btn}
              onClick={onEditTags}
              aria-label={t('buttons.editTags')}
              title={t('buttons.tags')}
            >
              <Icon component={TagIcon} width={20} height={20} />
            </button>
          )}
          <button className={s.btn} onClick={onPrev} aria-label={t('buttons.previous')}>
            <Icon component={PrevIcon} width={28} height={28} />
          </button>
          <button
            className={`${s.btn} ${s.play}`}
            onClick={onTogglePlay}
            aria-label={t('buttons.pausePlay')}
          >
            {isPlaying ? (
              <Icon component={PauseIcon} width={32} height={32} />
            ) : (
              <Icon component={PlayIcon} width={32} height={32} />
            )}
          </button>
          <button className={s.btn} onClick={onNext} aria-label={t('buttons.next')}>
            <Icon component={NextIcon} width={28} height={28} />
          </button>
          <button
            className={`${s.btn} ${isLooping ? s.btnActive : ''}`}
            onClick={onToggleLoop}
            aria-label={isLooping ? t('buttons.loopOn') : t('buttons.loopOff')}
            title={isLooping ? t('buttons.loopOn') : t('buttons.loopOff')}
          >
            <Icon component={LoopIcon} width={20} height={20} />
          </button>
        </div>
      </div>
    </Modal>
  );
};
