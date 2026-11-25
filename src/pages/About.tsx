import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { PageHero, CtaBand } from '../components/sections/CtaBand';
import { Philosophy } from '../components/sections/Philosophy';
import { Process } from '../components/sections/Process';
import { Stats } from '../components/sections/Stats';
import { ChefPortrait } from '../components/art/ChefPortrait';
import { SplitReveal } from '../components/anim/SplitReveal';
import { Reveal, RevealGroup } from '../components/anim/Reveal';
import { Magnetic } from '../components/anim/Magnetic';
import { Link } from 'react-router-dom';
import { KenteBand } from '../components/art/Patterns';

const CREDENTIALS = [
  { year: '2021', title: 'Founded Mongi Fana Private Dining', detail: 'London E8' },
  { year: '2018', title: 'Head Chef, one Michelin star', detail: 'London W1' },
  { year: '2015', title: 'Chef de Partie, Restaurant La Treille', detail: 'Marseille' },
  { year: '2014', title: 'Stage & Commis, Palais de la Méditerranée', detail: 'Nice' },
  { year: '2011', title: 'Diplôme de Chef de Cuisine', detail: 'Accra' },
];

export default function About() {
  useDocumentMeta({
    title: 'Story',
    description:
      'Chef Mongi Fana — from Tamale to a Michelin-starred London kitchen to a private practice cooking in people’s homes.',
    path: '/about',
  });

  return (
    <>
      <PageHero
        eyebrow="The story"
        title="Tamale to the pass"
        lede="A chef who learned to cook on a wood fire, learned to cook in a brigade, and eventually learned that the two were never meant to be separate."
      />

      <section className="section about">
        <div className="shell about__layout">
          <div className="about__portrait-wrap">
            <div className="about__portrait">
              <ChefPortrait />
              <div className="about__portrait-frame" aria-hidden="true" />
            </div>
            <p className="about__caption">
              <span className="about__caption-mark">✦</span>
              Chef Mongi Fana, photographed at the studio, London E8
            </p>
          </div>

          <div className="about__body">
            <p className="eyebrow">In my own words</p>
            <SplitReveal className="about__title" as="h2">
              I cook the food I grew up eating — properly
            </SplitReveal>

            <RevealGroup className="about__prose">
              <p>
                My grandmother cooked over an open fire in Tamale, and she never
                measured anything. She knew jollof by the sound of the pot and
                knew exactly how long suya needed before the coals turned grey.
                I inherited her palate and my own curiosity about the rest of
                the world — and I have spent fifteen years learning how to marry
                the two.
              </p>
              <p>
                I trained in Provence, which is where I learned the rigour: the
                stocks, the timings, the discipline of a brigade kitchen at
                2am. I took that discipline to London and put jollof on a tasting
                menu, and watched the room work out what it was looking at.
              </p>
              <p>
                When I left the restaurant floor in 2021, I was not running from
                anything. I had simply realised that the part of cooking I love
                most happens at a table of six, with nowhere else to be. So now
                that is exactly where I work.
              </p>
            </RevealGroup>

            <div className="about__actions">
              <Magnetic strength={0.28}>
                <Link to="/booking" className="btn btn--solid" data-cursor="Book">
                  <span>Cook for me</span>
                  <span className="btn__arrow">→</span>
                </Link>
              </Magnetic>
              <Magnetic strength={0.24}>
                <Link to="/menu" className="btn btn--ghost">
                  <span>See the menu</span>
                </Link>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      <KenteBand className="about__band" />

      <section className="section credentials">
        <div className="shell">
          <div className="credentials__head">
            <p className="eyebrow">Kitchen record</p>
            <SplitReveal className="credentials__title" as="h2">
              Where the years went
            </SplitReveal>
          </div>

          <div className="credentials__list">
            {CREDENTIALS.map((c, i) => (
              <Reveal className="credential" key={c.title} delay={i * 0.06}>
                <span className="credential__year">{c.year}</span>
                <span className="credential__title">{c.title}</span>
                <span className="credential__detail">{c.detail}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Philosophy />
      <Stats />
      <Process />
      <CtaBand />
    </>
  );
}
