import { useMemo, useState } from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useSearchParams } from 'react-router-dom';
import { PageHero } from '../components/sections/CtaBand';
import { Faq } from '../components/sections/Faq';
import { Magnetic } from '../components/anim/Magnetic';
import { ChevronRule, KenteBand } from '../components/art/Patterns';
import { MENUS } from '../data/dishes';
import { SERVICES } from '../data/content';

type Errors = Partial<Record<string, string>>;

const OCCASIONS = [
  'Anniversary',
  'Birthday',
  'Wedding',
  'Proposal',
  'Corporate dinner',
  'Family gathering',
  'Something else',
];

const TIMES = ['12:00', '13:30', '18:00', '19:30', '21:00'];
const STEP_TITLES = ['The occasion', 'The menu', 'The details', 'You'];

function formatDate(value: string) {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function Booking() {
  useDocumentMeta({
    title: 'Booking',
    description:
      'Reserve a date with chef Mongi Fana. Four short steps — occasion, menu, date and details. No payment taken until your menu and date are confirmed.',
    path: '/booking',
  });

  const [params] = useSearchParams();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    occasion: '',
    service: params.get('service') ?? 'private-dining',
    menu: 'signature',
    guests: '4',
    date: '',
    time: '19:30',
    location: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const set = (key: keyof typeof form) => (v: string) => {
    setForm((f) => ({ ...f, [key]: v }));
    setErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const menu = useMemo(() => MENUS.find((m) => m.id === form.menu) ?? MENUS[0], [form.menu]);
  const service = useMemo(
    () => SERVICES.find((s) => s.id === form.service) ?? SERVICES[0],
    [form.service],
  );
  const estimate = useMemo(
    () => menu.price * Math.max(1, Number(form.guests) || 0),
    [menu.price, form.guests],
  );

  const validateStep = (s: number): boolean => {
    const e: Errors = {};

    if (s === 0 && !form.occasion) e.occasion = 'Tell me what we are celebrating.';
    if (s === 1 && !form.menu) e.menu = 'Choose a menu.';

    if (s === 2) {
      const guests = Number(form.guests);
      if (!form.guests || Number.isNaN(guests) || guests < 2) {
        e.guests = 'Minimum of 2 guests.';
      } else if (guests > 200) {
        e.guests = 'For 200+ please use the enquiry form.';
      }

      if (!form.date) {
        e.date = 'Pick a preferred date.';
      } else if (new Date(`${form.date}T23:59:59`) < new Date()) {
        e.date = 'Please choose a future date.';
      }

      if (!form.location.trim()) e.location = 'Where should I cook?';
    }

    if (s === 3) {
      if (!form.name.trim()) e.name = 'Your name, please.';
      if (!form.email.trim()) e.email = 'An email address is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
        e.email = 'That email does not look right.';
      }
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(STEP_TITLES.length - 1, s + 1));
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateStep(3)) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <>
        <PageHero eyebrow="Request received" title="Thank you" />
        <section className="section booking-done">
          <div className="shell booking-done__inner">
            <span className="booking-done__mark">✦</span>
            <h2 className="booking-done__title">
              Your date is <em className="display-italic gold-text">held</em>
            </h2>
            <p className="lead booking-done__lede">
              I read every request personally and reply within a few hours. You
              will hear from me at <strong>{form.email}</strong> to confirm the
              menu and take the deposit.
            </p>

            <dl className="booking-done__summary">
              <div><dt>Occasion</dt><dd>{form.occasion}</dd></div>
              <div><dt>Menu</dt><dd>{menu.name}</dd></div>
              <div><dt>Guests</dt><dd>{form.guests}</dd></div>
              <div><dt>Date</dt><dd>{formatDate(form.date)} · {form.time}</dd></div>
              <div><dt>Location</dt><dd>{form.location}</dd></div>
              <div><dt>Estimate</dt><dd className="booking-done__total">£{estimate.toLocaleString()}</dd></div>
            </dl>

            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setSubmitted(false);
                setStep(0);
              }}
            >
              <span>Make another enquiry</span>
            </button>
          </div>
        </section>
        <Faq limit={4} />
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Booking"
        title="Reserve a date"
        lede="Four short steps. Nothing is charged today — we talk through the menu first, and the deposit only comes once you are happy."
      />
      <section className="section booking">
        <div className="shell booking__layout">
          <div className="booking__main">
            <ol className="booking__steps" aria-label="Booking progress">
              {STEP_TITLES.map((t, i) => (
                <li
                  key={t}
                  className={`booking__step ${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => i < step && setStep(i)}
                    disabled={i > step}
                    aria-current={i === step ? 'step' : undefined}
                  >
                    <span className="booking__step-num">
                      {i < step ? '✓' : String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="booking__step-title">{t}</span>
                  </button>
                </li>
              ))}
            </ol>

            <ChevronRule className="booking__rule" />

            <form onSubmit={submit} noValidate>
              {step === 0 && (
                <div className="booking__panel">
                  <h2 className="booking__panel-title">What are we celebrating?</h2>

                  <div className={`field ${errors.occasion ? 'field--invalid' : ''}`}>
                    <span className="field__label">Occasion</span>
                    <div className="choice-grid">
                      {OCCASIONS.map((o) => (
                        <button
                          key={o}
                          type="button"
                          className={`choice ${form.occasion === o ? 'is-active' : ''}`}
                          onClick={() => set('occasion')(o)}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                    {errors.occasion && <span className="field__error">{errors.occasion}</span>}
                  </div>

                  <div className="field mt-md">
                    <span className="field__label">Type of engagement</span>
                    <div className="field__select-wrap">
                      <select
                        className="field__select"
                        value={form.service}
                        onChange={(e) => set('service')(e.target.value)}
                      >
                        {SERVICES.map((s) => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="booking__panel">
                  <h2 className="booking__panel-title">Which menu speaks to you?</h2>

                  <div className={`field ${errors.menu ? 'field--invalid' : ''}`}>
                    <div className="choice-grid choice-grid--stack">
                      {MENUS.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className={`choice choice--card ${form.menu === m.id ? 'is-active' : ''}`}
                          onClick={() => set('menu')(m.id)}
                        >
                          <span className="choice__name">{m.name}</span>
                          <span className="choice__note">
                            {m.courses} courses · {m.duration}
                          </span>
                          <span className="choice__price">£{m.price} pp</span>
                        </button>
                      ))}
                    </div>
                    {errors.menu && <span className="field__error">{errors.menu}</span>}
                  </div>

                  <p className="booking__note">
                    Every menu is adapted to your guests, allergies and room. The
                    £{menu.price} figure is only the starting point.
                  </p>
                </div>
              )}

              {step === 2 && (
                <div className="booking__panel">
                  <h2 className="booking__panel-title">When and where?</h2>

                  <div className="booking__row">
                    <div className={`field ${errors.guests ? 'field--invalid' : ''}`}>
                      <label className="field__label" htmlFor="bk-guests">
                        Number of guests
                      </label>
                      <input
                        id="bk-guests"
                        className="field__input"
                        type="number"
                        min={2}
                        max={200}
                        value={form.guests}
                        onChange={(e) => set('guests')(e.target.value)}
                      />
                      {errors.guests && <span className="field__error">{errors.guests}</span>}
                    </div>

                    <div className={`field ${errors.date ? 'field--invalid' : ''}`}>
                      <label className="field__label" htmlFor="bk-date">
                        Preferred date
                      </label>
                      <input
                        id="bk-date"
                        className="field__input"
                        type="date"
                        value={form.date}
                        onChange={(e) => set('date')(e.target.value)}
                      />
                      {errors.date && <span className="field__error">{errors.date}</span>}
                    </div>

                    <div className="field">
                      <label className="field__label" htmlFor="bk-time">Arrival</label>
                      <div className="field__select-wrap">
                        <select
                          id="bk-time"
                          className="field__select"
                          value={form.time}
                          onChange={(e) => set('time')(e.target.value)}
                        >
                          {TIMES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className={`field mt-md ${errors.location ? 'field--invalid' : ''}`}>
                    <label className="field__label" htmlFor="bk-location">
                      Where should I cook?
                    </label>
                    <input
                      id="bk-location"
                      className="field__input"
                      type="text"
                      placeholder="e.g. 12 Clifton Road, London E8"
                      value={form.location}
                      onChange={(e) => set('location')(e.target.value)}
                    />
                    {errors.location && (
                      <span className="field__error">{errors.location}</span>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="booking__panel">
                  <h2 className="booking__panel-title">And who am I cooking for?</h2>

                  <div className="booking__row">
                    <div className={`field ${errors.name ? 'field--invalid' : ''}`}>
                      <label className="field__label" htmlFor="bk-name">Full name</label>
                      <input
                        id="bk-name"
                        className="field__input"
                        type="text"
                        placeholder="Amara Osei"
                        value={form.name}
                        onChange={(e) => set('name')(e.target.value)}
                      />
                      {errors.name && <span className="field__error">{errors.name}</span>}
                    </div>

                    <div className={`field ${errors.email ? 'field--invalid' : ''}`}>
                      <label className="field__label" htmlFor="bk-email">Email</label>
                      <input
                        id="bk-email"
                        className="field__input"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => set('email')(e.target.value)}
                      />
                      {errors.email && <span className="field__error">{errors.email}</span>}
                    </div>

                    <div className="field">
                      <label className="field__label" htmlFor="bk-phone">
                        Phone <em className="field__opt">optional</em>
                      </label>
                      <input
                        id="bk-phone"
                        className="field__input"
                        type="tel"
                        placeholder="+44"
                        value={form.phone}
                        onChange={(e) => set('phone')(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="field mt-md">
                    <label className="field__label" htmlFor="bk-notes">
                      Allergies, dislikes, the one dish you love — anything at all
                    </label>
                    <textarea
                      id="bk-notes"
                      className="field__textarea"
                      placeholder="Tell me what would make this evening sing."
                      value={form.notes}
                      onChange={(e) => set('notes')(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="booking__actions">
                {step > 0 && (
                  <button
                    type="button"
                    className="btn btn--link"
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                  >
                    <span>← Back</span>
                  </button>
                )}

                {step < STEP_TITLES.length - 1 ? (
                  <Magnetic strength={0.2}>
                    <button type="button" className="btn btn--solid" onClick={next}>
                      <span>Continue</span>
                      <span className="btn__arrow">→</span>
                    </button>
                  </Magnetic>
                ) : (
                  <Magnetic strength={0.2}>
                    <button type="submit" className="btn btn--solid" data-cursor="Send">
                      <span>Send request</span>
                      <span className="btn__arrow">→</span>
                    </button>
                  </Magnetic>
                )}
              </div>

              <p className="booking__disclaimer">
                No payment is taken now. A 25% deposit is only requested once the
                menu and date are confirmed.
              </p>
            </form>
          </div>

          <aside className="booking__aside">
            <div className="booking-summary card">
              <p className="eyebrow">Your enquiry</p>

              <div className="booking-summary__block">
                <span className="booking-summary__label">Service</span>
                <span className="booking-summary__value">{service.title}</span>
              </div>
              <div className="booking-summary__block">
                <span className="booking-summary__label">Menu</span>
                <span className="booking-summary__value">{menu.name}</span>
              </div>
              <div className="booking-summary__block">
                <span className="booking-summary__label">Occasion</span>
                <span className="booking-summary__value">{form.occasion || '—'}</span>
              </div>
              <div className="booking-summary__block">
                <span className="booking-summary__label">Guests</span>
                <span className="booking-summary__value">{form.guests || '—'}</span>
              </div>
              <div className="booking-summary__block">
                <span className="booking-summary__label">Date</span>
                <span className="booking-summary__value">
                  {form.date ? formatDate(form.date) : '—'} · {form.time}
                </span>
              </div>

              <hr className="rule" />

              <div className="booking-summary__total">
                <span>Estimated total</span>
                <strong>£{estimate.toLocaleString()}</strong>
              </div>
              <p className="booking-summary__note">
                Indicative only. Travel, staffing and pairings are confirmed in
                writing before any deposit.
              </p>
            </div>

            <figure className="booking-aside__quote">
              <blockquote>
                “He cooked for six hours in our kitchen and we talked until
                midnight.”
              </blockquote>
              <figcaption>Amara &amp; Tom · Notting Hill</figcaption>
            </figure>
          </aside>
        </div>
      </section>

      <KenteBand className="booking__band" />

      <Faq limit={6} />
    </>
  );
}
