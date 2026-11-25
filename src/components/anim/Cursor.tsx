import { useEffect, useRef, useState } from 'react';
import { gsap, EASE } from '../../lib/gsap';

/**
 * A bespoke cursor: a small brass dot that follows precisely, ringed by a
 * lagging circle. Expands and changes label over interactive elements.
 * Desktop / fine-pointer only.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;

    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: EASE.outExpo });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: EASE.outExpo });

    const onMove = (e: MouseEvent) => {
      setVisible(true);
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);

      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        'a, button, [data-cursor]',
      );
      if (target) {
        setLabel(target.dataset.cursor ?? 'View');
        gsap.to(ring, { scale: 2.6, duration: 0.4, ease: EASE.outExpo });
        gsap.to(dot, { scale: 0, duration: 0.3, ease: EASE.outExpo });
      } else {
        setLabel('');
        gsap.to(ring, { scale: 1, duration: 0.4, ease: EASE.outExpo });
        gsap.to(dot, { scale: 1, duration: 0.3, ease: EASE.outExpo });
      }
    };

    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.body.classList.remove('has-custom-cursor');
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="cursor-layer" aria-hidden="true" data-visible={visible}>
      <div ref={ringRef} className="cursor-ring">
        {label && <span className="cursor-ring__label">{label}</span>}
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
