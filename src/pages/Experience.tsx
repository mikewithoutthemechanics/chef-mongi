import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { PageHero, CtaBand } from '../components/sections/CtaBand';
import { ServicesGrid } from '../components/sections/ServicesGrid';
import { Process } from '../components/sections/Process';
import { Testimonials, TestimonialsHeading } from '../components/sections/Testimonials';
import { Stats } from '../components/sections/Stats';
import { SplitReveal } from '../components/anim/SplitReveal';
import { Reveal } from '../components/anim/Reveal';
import { JOURNEY } from '../data/content';
import { AdinkraMark, KenteBand } from '../components/art/Patterns';

export default function Experience() {
  useDocumentMeta({
    title: 'Experience',
    description:
      'Private dining, weddings and celebrations, destination residencies and culinary consulting with chef Mongi Fana.',
    path: '/experience',
  });

  return (
    <>
      <PageHero
        eyebrow="The experience"
        title="An evening, not a service"
        lede="There is no ticket, no timed seating and no staff hovering. Just a chef, a table, and food that arrives exactly when it should."
      />

      <Stats />

      <ServicesGrid />

      <section className="section journey">
        <div className="shell">
          <div className="journey__head">
            <div>
              <p className="eyebrow">The arc of a service</p>
              <SplitReveal className="journey__title" as="h2">
                Night by night
              </SplitReveal>
            </div>
            <AdinkraMark className="journey__mark" aria-hidden="true" />
          </div>

          <div className="journey__list">
            {JOURNEY.map((j, i) => (
              <Reveal className="journey__item" key={j.year} delay={i * 0.05}>
                <span className="journey__year">{j.year}</span>
                <div className="journey__body">
                  <h3 className="journey__item-title">{j.title}</h3>
                  <p className="journey__text">{j.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <KenteBand className="journey__band" />

      <Process />

      <section className="section">
        <div className="shell">
          <TestimonialsHeading />
          <Testimonials />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
