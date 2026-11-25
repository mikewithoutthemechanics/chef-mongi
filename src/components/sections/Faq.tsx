import { useRef, useState } from 'react';
import { gsap, EASE } from '../../lib/gsap';
import { FAQS } from '../../data/content';
import { SplitReveal } from '../anim/SplitReveal';

/** Accessible accordion with a height-animated panel. */
export function Faq({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<number | null>(0);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);

  const items = limit ? FAQS.slice(0, limit) : FAQS;

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    setOpen(next);

    const panel = panelRefs.current[i];
    if (!panel) return;

    if (next === i) {
      gsap.to(panel, {
        height: 'auto',
        opacity: 1,
        duration: 0.6,
        ease: EASE.inOutQuart,
        onStart: () => gsap.set(panel, { height: 'auto' }),
        startAt: { height: 0, opacity: 0 },
      });
    } else {
      gsap.to(panel, {
        height: 0,
        opacity: 0,
        duration: 0.5,
        ease: EASE.inOutQuart,
      });
    }
  };

  return (
    <section className="section faq">
      <div className="shell faq__inner">
        <div className="faq__head">
          <p className="eyebrow">Good to know</p>
          <SplitReveal className="faq__title" as="h2">
            Questions, answered
          </SplitReveal>
          <p className="lead faq__lede">
            Anything else, ask me directly. I answer every enquiry myself,
            usually within a few hours.
          </p>
        </div>

        <div className="faq__list">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className={`faq__item ${isOpen ? 'is-open' : ''}`} key={item.q}>
                <h3 className="faq__q-wrap">
                  <button
                    type="button"
                    id={`faq-btn-${i}`}
                    className="faq__q"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => toggle(i)}
                  >
                    <span className="faq__q-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="faq__q-text">{item.q}</span>
                    <span className="faq__icon" aria-hidden="true">
                      <span />
                      <span />
                    </span>
                  </button>
                </h3>

                <div
                  id={`faq-panel-${i}`}
                  ref={(el) => {
                    panelRefs.current[i] = el;
                  }}
                  className="faq__panel"
                  role="region"
                  aria-labelledby={`faq-btn-${i}`}
                  style={{ height: isOpen ? 'auto' : 0 }}
                >
                  <p className="faq__a">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
