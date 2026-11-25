import { useEffect, useRef, useState } from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { PageHero, CtaBand } from '../components/sections/CtaBand';
import { DishArt } from '../components/art/DishArt';
import { gsap, EASE } from '../lib/gsap';
import { GALLERY } from '../data/gallery';

const VARIANTS = ['risotto', 'beef', 'okra', 'wine', 'tart', 'chocolate'] as const;
const TAGS = ['All', 'Signature', 'Starter', 'Main', 'Dessert', 'Pairing'] as const;

export default function Gallery() {
  useDocumentMeta({
    title: 'Gallery',
    description:
      'A selection of plates from recent services by chef Mongi Fana — jollof risotto, suya, okra and aged tenderloin, palm wine pairings.',
    path: '/gallery',
  });

  const [tag, setTag] = useState<(typeof TAGS)[number]>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const items = tag === 'All' ? GALLERY : GALLERY.filter((g) => g.tag === tag);

  /* Animate the grid whenever the filter changes */
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gal__item',
        { opacity: 0, y: 36, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.06,
          ease: EASE.outExpo,
        },
      );
    }, el);
    return () => ctx.revert();
  }, [tag]);

  /* Lightbox open/close animation */
  useEffect(() => {
    if (openIndex === null) {
      document.body.style.overflow = '';
      return;
    }
    document.body.style.overflow = 'hidden';
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.lightbox',
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: EASE.soft },
      );
      gsap.fromTo(
        '.lightbox__frame',
        { scale: 0.92, y: 30 },
        { scale: 1, y: 0, duration: 0.7, ease: EASE.outExpo },
      );
    });
    return () => {
      ctx.revert();
      document.body.style.overflow = '';
    };
  }, [openIndex]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (openIndex === null) return;
      if (e.key === 'Escape') setOpenIndex(null);
      if (e.key === 'ArrowRight') setOpenIndex((i) => ((i ?? 0) + 1) % items.length);
      if (e.key === 'ArrowLeft')
        setOpenIndex((i) => ((i ?? 0) - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openIndex, items.length]);

  const active = openIndex === null ? null : items[openIndex];

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="The pass, in pictures"
        lede="A selection of plates from recent services. Nothing is ever repeated exactly — but the standard is constant."
      >
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            className={`filter-chip ${tag === t ? 'is-active' : ''}`}
            onClick={() => {
              setTag(t);
              setOpenIndex(null);
            }}
          >
            {t}
          </button>
        ))}
      </PageHero>

      <section className="section gal">
        <div className="shell">
          <div ref={gridRef} className="gal__grid">
            {items.map((g, i) => (
              <button
                type="button"
                className={`gal__item gal__item--${g.span}`}
                key={g.id}
                onClick={() => setOpenIndex(i)}
                data-cursor="Open"
                aria-label={`Open ${g.caption}`}
              >
                <DishArt
                  variant={VARIANTS[GALLERY.indexOf(g) % VARIANTS.length]}
                  label={g.caption}
                />
                <span className="gal__overlay">
                  <span className="gal__tag">{g.tag}</span>
                  <span className="gal__caption">{g.caption}</span>
                </span>
              </button>
            ))}
          </div>

          <p className="gal__foot lead">
            Images are stylised renderings of each composition. Every service is
            photographed and shared with the guest afterwards.
          </p>
        </div>
      </section>

      {active && openIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={() => setOpenIndex(null)}
        >
          <button
            type="button"
            className="lightbox__close"
            onClick={() => setOpenIndex(null)}
            aria-label="Close"
          >
            ✕
          </button>

          <figure
            className="lightbox__frame"
            onClick={(e) => e.stopPropagation()}
          >
            <DishArt
              variant={VARIANTS[GALLERY.indexOf(active) % VARIANTS.length]}
              label={active.caption}
            />
            <figcaption>
              <span className="gal__tag">{active.tag}</span>
              <span>{active.caption}</span>
            </figcaption>
          </figure>

          <div className="lightbox__nav" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpenIndex((openIndex - 1 + items.length) % items.length)}
              aria-label="Previous"
            >
              ←
            </button>
            <span>
              {String(openIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => setOpenIndex((openIndex + 1) % items.length)}
              aria-label="Next"
            >
              →
            </button>
          </div>
        </div>
      )}

      <CtaBand />
    </>
  );
}
