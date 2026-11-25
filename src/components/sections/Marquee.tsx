import { useEffect, useRef } from 'react';
import { gsap } from '../../lib/gsap';

/**
 * Infinite horizontal ticker. Two copies of the content run in opposite
 * directions and both loop seamlessly.
 */
export function Marquee({
  items,
  speed = 34,
  reverse = false,
  className = '',
  separator = '✦',
}: {
  items: string[];
  /** Seconds for one full loop. */
  speed?: number;
  reverse?: boolean;
  className?: string;
  separator?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const ctx = gsap.context(() => {
      const half = track.scrollWidth / 2;
      if (!half) return;

      // The row is duplicated, so travelling exactly one half-width and
      // snapping back to 0 lands on an identical frame — a seamless loop.
      gsap.fromTo(
        track,
        { x: reverse ? half : -half },
        {
          x: 0,
          duration: speed,
          ease: 'none',
          repeat: -1,
        },
      );
    }, track);

    return () => ctx.revert();
  }, [speed, reverse]);

  const content = (
    <>
      {items.map((item, i) => (
        <span className="marquee__item" key={`${item}-${i}`}>
          {item}
          <span className="marquee__sep" aria-hidden="true">
            {separator}
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div className={`marquee ${className}`}>
      <div ref={trackRef} className="marquee__track">
        <div className="marquee__row">{content}</div>
        {/* Duplicate keeps the loop seamless */}
        <div className="marquee__row" aria-hidden="true">
          {content}
        </div>
      </div>
    </div>
  );
}
