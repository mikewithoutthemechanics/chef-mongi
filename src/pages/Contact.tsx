import { useState } from 'react';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { PageHero, CtaBand } from '../components/sections/CtaBand';
import { SplitReveal } from '../components/anim/SplitReveal';
import { RevealGroup } from '../components/anim/Reveal';
import { Magnetic } from '../components/anim/Magnetic';
import { Faq } from '../components/sections/Faq';
import { KenteBand } from '../components/art/Patterns';

const CHANNELS = [
  {
    label: 'Bookings',
    value: 'book@mongifana.com',
    href: 'mailto:book@mongifana.com',
    note: 'Replies within a few hours',
  },
  {
    label: 'Press & partnerships',
    value: 'press@mongifana.com',
    href: 'mailto:press@mongifana.com',
    note: 'Debuts, interviews, collabs',
  },
  {
    label: 'Studio line',
    value: '+44 20 7123 4567',
    href: 'tel:+442071234567',
    note: 'Tue – Sat, 10am – 7pm GMT',
  },
];

const AREAS = [
  { city: 'London', detail: 'Home studio · E8 · UK' },
  { city: 'Paris', detail: 'Seasonal residency · France' },
  { city: 'Lisbon', detail: 'Winter residency · Portugal' },
  { city: 'Dubai', detail: 'Winter season · UAE' },
  { city: 'Lagos', detail: 'By arrangement · Nigeria' },
  { city: 'Amalfi Coast', detail: 'Charter weeks · Italy' },
];

export default function Contact() {
  useDocumentMeta({
    title: 'Contact',
    description:
      'Get in touch with chef Mongi Fana for bookings, press and partnerships. Direct lines for London, Paris, Lisbon, Dubai, Lagos and the Amalfi Coast.',
    path: '/contact',
  });

  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Say hello"
        lede="Tell me what you have in mind — a date, a room, a number of people, or simply a feeling you want to create. I will take it from there."
      />

      <section className="section contact">
        <div className="shell contact__layout">
          <div className="contact__channels">
            <p className="eyebrow">Direct lines</p>

            <RevealGroup className="contact__list">
              {CHANNELS.map((c) => (
                <a className="contact__channel" href={c.href} key={c.label} data-cursor="Write">
                  <span className="contact__channel-label">{c.label}</span>
                  <span className="contact__channel-value">{c.value}</span>
                  <span className="contact__channel-note">{c.note}</span>
                  <span className="contact__channel-arrow">→</span>
                </a>
              ))}
            </RevealGroup>

            <div className="contact__areas">
              <p className="eyebrow">Where I cook</p>
              <ul className="contact__areas-list">
                {AREAS.map((a) => (
                  <li key={a.city}>
                    <span>{a.city}</span>
                    <em>{a.detail}</em>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="contact__form-wrap">
            <SplitReveal className="contact__form-title" as="h2">
              Send a note
            </SplitReveal>

            {sent ? (
              <div className="contact__sent">
                <span className="contact__sent-mark">✦</span>
                <h3>Message ready to send</h3>
                <p>
                  Your browser is configured without a mail service, so copy
                  this into your own email client — or write directly to{' '}
                  <a href="mailto:book@mongifana.com">book@mongifana.com</a>.
                </p>
                <pre className="contact__draft">{message}</pre>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => {
                    setSent(false);
                    setMessage('');
                  }}
                >
                  <span>Write another</span>
                </button>
              </div>
            ) : (
              <form
                className="contact__form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="contact__row">
                  <div className="field">
                    <label className="field__label" htmlFor="c-name">Name</label>
                    <input id="c-name" className="field__input" type="text" required />
                  </div>
                  <div className="field">
                    <label className="field__label" htmlFor="c-email">Email</label>
                    <input id="c-email" className="field__input" type="email" required />
                  </div>
                </div>

                <div className="field mt-md">
                  <label className="field__label" htmlFor="c-subject">Subject</label>
                  <input
                    id="c-subject"
                    className="field__input"
                    type="text"
                    placeholder="Dinner for eight, 14 June"
                  />
                </div>

                <div className="field mt-md">
                  <label className="field__label" htmlFor="c-message">Message</label>
                  <textarea
                    id="c-message"
                    className="field__textarea"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="The more you tell me, the better."
                  />
                </div>

                <Magnetic strength={0.2}>
                  <button type="submit" className="btn btn--solid contact__submit" data-cursor="Send">
                    <span>Send message</span>
                    <span className="btn__arrow">→</span>
                  </button>
                </Magnetic>
              </form>
            )}
          </div>
        </div>
      </section>

      <KenteBand className="contact__band" />

      <Faq limit={4} />
      <CtaBand />
    </>
  );
}
