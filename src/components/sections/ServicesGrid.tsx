import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from '../../lib/gsap';
import { SERVICES } from '../../data/content';
import { SplitReveal } from '../anim/SplitReveal';
import { RevealGroup } from '../anim/Reveal';
import { DishArt } from '../art/DishArt';
import { ChevronRule } from '../art/Patterns';

const ART_BY_SERVICE = ['risotto', 'beef', 'quail', 'chocolate'] as const;

/**
 * Services grid. Each card tilts toward the pointer and reveals a dish
 * illustration on hover, with a spotlight that follows the cursor.
 */
export function ServicesGrid({ heading = true }: { heading?: boolean }) {
  const gridRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;

    gsap.to(card, {
      rotateY: (px - 0.5) * 9,
      rotateX: -(py - 0.5) * 9,
      transformPerspective: 900,
      duration: 0.6,
      ease: 'power3.out',
    });
    card.style.setProperty('--mx', `${px * 100}%`);
    card.style.setProperty('--my', `${py * 100}%`);
  };

  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.8,
      ease: 'power3.out',
    });
  };

  return (
    <section className="section services" id="services">
      <div className="shell">
        {heading && (
          <div className="services__head">
            <div>
              <p className="eyebrow">How I work with you</p>
              <SplitReveal className="services__title" as="h2">
                Four ways to share a table
              </SplitReveal>
            </div>
            <RevealGroup className="services__head-note">
              <p className="lead">
                Every engagement begins the same way — with a conversation, and
                ends the same way: with you not wanting the evening to end.
              </p>
            </RevealGroup>
          </div>
        )}

        <ChevronRule className="services__rule" />

        <div ref={gridRef} className="services__grid">
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              className="service-card card"
              onMouseMove={onMove}
              onMouseLeave={onLeave}
              data-cursor="Explore"
            >
              <span className="service-card__spot" aria-hidden="true" />

              <div className="service-card__art" aria-hidden="true">
                <DishArt variant={ART_BY_SERVICE[i]} />
              </div>

              <div className="service-card__body">
                <span className="service-card__index">{s.index}</span>
                <h3 className="service-card__title">{s.title}</h3>
                <p className="service-card__tagline">{s.tagline}</p>
                <p className="service-card__text">{s.body}</p>

                <ul className="service-card__list">
                  {s.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>

                <div className="service-card__foot">
                  <span className="service-card__price">{s.priceFrom}</span>
                  <Link
                    to={`/booking?service=${s.id}`}
                    className="service-card__link"
                    aria-label={`Enquire about ${s.title}`}
                  >
                    <span>Enquire</span>
                    <span className="btn__arrow">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
