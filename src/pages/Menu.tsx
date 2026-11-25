import { useMemo, useState } from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { PageHero, CtaBand } from '../components/sections/CtaBand';
import { Marquee } from '../components/sections/Marquee';
import { Faq } from '../components/sections/Faq';
import { SplitReveal } from '../components/anim/SplitReveal';
import { Reveal } from '../components/anim/Reveal';
import { DishArt } from '../components/art/DishArt';
import { ChevronRule } from '../components/art/Patterns';
import { Dish, DISHES, MENUS } from '../data/dishes';

const COURSES = ['All', 'Amuse', 'Starter', 'Main', 'Dessert', 'Pairing'] as const;

const VARIANT_BY_ID: Record<string, 'risotto' | 'beef' | 'okra' | 'quail' | 'tart' | 'chocolate' | 'wine' | 'amuse'> = {
  'jollof-risotto': 'risotto',
  'suya-tataki': 'beef',
  'okra-tenderloin': 'okra',
  'peri-peri-quail': 'quail',
  'dawadawa-tart': 'tart',
  'kunu-chocolate': 'chocolate',
  'palm-wine-pairing': 'wine',
  'jollof-souffle': 'amuse',
};

function DishCard({ dish, index }: { dish: Dish; index: number }) {
  return (
    <article className="dish-card card" data-cursor="Dish">
      <div className="dish-card__art">
        <DishArt variant={VARIANT_BY_ID[dish.id]} label={dish.name} />
        <span className="dish-card__num">{String(index + 1).padStart(2, '0')}</span>
      </div>

      <div className="dish-card__body">
        <div className="dish-card__head">
          <h3 className="dish-card__name">{dish.name}</h3>
          <span className="dish-card__price">£{dish.price}</span>
        </div>

        <p className="dish-card__origin">{dish.origin}</p>
        <p className="dish-card__desc">{dish.description}</p>

        <div className="dish-card__foot">
          <div className="dish-card__tags">
            {dish.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
          {dish.pairing && <span className="dish-card__pairing">Pairs · {dish.pairing}</span>}
        </div>
      </div>
    </article>
  );
}

export default function Menu() {
  useDocumentMeta({
    title: 'Menu',
    description:
      'Tasting menus and an à la carte repertoire of Afro-global dishes — jollof risotto, suya tataki, okra and aged tenderloin, dawadawa lemon tart.',
    path: '/menu',
  });

  const [filter, setFilter] = useState<(typeof COURSES)[number]>('All');

  const visible = useMemo(
    () => (filter === 'All' ? DISHES : DISHES.filter((d) => d.course === filter)),
    [filter],
  );

  return (
    <>
      <PageHero
        eyebrow="The menu"
        title="Dishes that carry a name"
        lede="Every plate is written around a specific place and a specific memory. Nothing here is a side dish pretending to be a main."
      >
        {COURSES.map((c) => (
          <button
            key={c}
            type="button"
            className={`filter-chip ${filter === c ? 'is-active' : ''}`}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </PageHero>

      <section className="section menu-menus">
        <div className="shell">
          <Reveal className="menu-menus__head">
            <p className="eyebrow">Tasting menus</p>
            <SplitReveal className="menu-menus__title" as="h2">
              Choose your arc
            </SplitReveal>
          </Reveal>

          <ChevronRule className="menu-menus__rule" />

          <div className="menu-menus__grid">
            {MENUS.map((m) => (
              <article
                className={`menu-option card ${m.featured ? 'is-featured' : ''}`}
                key={m.id}
              >
                {m.featured && <span className="menu-option__flag">Most chosen</span>}

                <h3 className="menu-option__name">{m.name}</h3>
                <p className="menu-option__note">{m.note}</p>

                <dl className="menu-option__specs">
                  <div>
                    <dt>Courses</dt>
                    <dd>{m.courses}</dd>
                  </div>
                  <div>
                    <dt>Duration</dt>
                    <dd>{m.duration}</dd>
                  </div>
                </dl>

                <div className="menu-option__foot">
                  <span className="menu-option__price">
                    £{m.price}
                    <em>per guest</em>
                  </span>
                  <a href="/booking" className="btn btn--ghost menu-option__btn">
                    <span>Reserve</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Marquee
        items={['Smoked over open flame', 'Sourced at dawn', 'No shortcuts', 'Cooked in your home']}
        speed={42}
        reverse
      />

      <section className="section menu-dishes">
        <div className="shell">
          <div className="menu-dishes__head">
            <div>
              <p className="eyebrow">À la carte</p>
              <SplitReveal className="menu-dishes__title" as="h2">
                {filter === 'All' ? 'The full repertoire' : filter}
              </SplitReveal>
            </div>
            <p className="menu-dishes__count">
              {String(visible.length).padStart(2, '0')} dishes
            </p>
          </div>

          <div className="menu-dishes__grid" key={filter}>
            {visible.map((d, i) => (
              <DishCard dish={d} index={i} key={d.id} />
            ))}
          </div>

          <p className="menu-dishes__foot lead">
            Menus are rewritten for every booking. What you see here is the
            vocabulary, not the script.
          </p>
        </div>
      </section>

      <Faq limit={4} />
      <CtaBand />
    </>
  );
}
