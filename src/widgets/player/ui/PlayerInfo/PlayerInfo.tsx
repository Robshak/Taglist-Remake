import { TagsLine } from '@entities/tag';
import type { ITrack } from '@shared/types';
import { type animationControls, motion } from 'motion/react';
import { memo, type RefObject } from 'react';

import s from './PlayerInfo.module.scss';

interface ISwiperProps {
  controls: ReturnType<typeof animationControls>;
  detailsRef: RefObject<HTMLDivElement | null>;
  detailsW: number;
  onSwipe: (dx: number) => Promise<void>;
}

interface IPlayerInfoProps {
  currentTrack: ITrack;
  isMobile: boolean;
  onOpenNowPlaying: () => void;
  onEditTags: () => void;
  swiper?: ISwiperProps;
  tracks?: ITrack[];
}

export const PlayerInfo = memo(
  ({ currentTrack, isMobile, onOpenNowPlaying, onEditTags, swiper, tracks }: IPlayerInfoProps) => {
    return (
      <div
        className={s.info}
        onClick={isMobile ? onOpenNowPlaying : undefined}
        role={isMobile ? 'button' : undefined}
      >
        {isMobile ? (
          <>
            {currentTrack.imageUrl && (
              <img
                src={currentTrack.imageUrl}
                alt={currentTrack.name}
                className={s.cover}
                onClick={onOpenNowPlaying}
              />
            )}
            <div className={s.detailsSwiper} ref={swiper?.detailsRef}>
              <motion.div
                className={s.swiper}
                drag="x"
                dragConstraints={{ left: -2 * (swiper?.detailsW || 0), right: 0 }}
                animate={swiper?.controls}
                onDragEnd={async (_, info) => {
                  if (!isMobile || !swiper?.onSwipe) return;
                  await swiper.onSwipe(info.offset.x);
                }}
                style={{ width: swiper?.detailsW ? swiper.detailsW * 3 : '100%' }}
              >
                {(() => {
                  const list = tracks || [];
                  const idx = Math.max(
                    0,
                    list.findIndex((t) => t.id === currentTrack.id)
                  );
                  const prevIdx = idx === 0 ? list.length - 1 : idx - 1;
                  const nextIdx = (idx + 1) % (list.length || 1);
                  const prevTrack = list[prevIdx];
                  const nextTrack = list[nextIdx];

                  const render = (t: ITrack | undefined, key: string) => (
                    <div
                      key={key}
                      className={s.slide}
                      style={{ width: swiper?.detailsW || '100%' }}
                    >
                      <div className={s.details}>
                        <div className={s.name}>{t?.name}</div>
                        <div className={s.artist}>{t?.artist}</div>
                      </div>
                    </div>
                  );

                  return (
                    <>
                      {render(prevTrack, `prev-${prevTrack?.id || 'empty'}`)}
                      {render(currentTrack, `current-${currentTrack.id}`)}
                      {render(nextTrack, `next-${nextTrack?.id || 'empty'}`)}
                    </>
                  );
                })()}
              </motion.div>
            </div>
          </>
        ) : (
          <>
            {currentTrack.imageUrl && (
              <img
                src={currentTrack.imageUrl}
                alt={currentTrack.name}
                className={s.cover}
                onClick={onOpenNowPlaying}
              />
            )}
            <div className={s.details}>
              <div className={s.name} onClick={onOpenNowPlaying}>
                {currentTrack.name}
              </div>
              <div className={s.artist} onClick={onOpenNowPlaying}>
                {currentTrack.artist}
              </div>
              <TagsLine tags={currentTrack.customTags || []} onEdit={onEditTags} maxWidth={320} />
            </div>
          </>
        )}
      </div>
    );
  }
);

PlayerInfo.displayName = 'PlayerInfo';
