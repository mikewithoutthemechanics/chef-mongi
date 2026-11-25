import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { PageHero } from '../components/sections/CtaBand';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { SplitReveal } from '../components/anim/SplitReveal';
import { Reveal } from '../components/anim/Reveal';

const CONTENT = {
  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy',
    lede: 'What I collect, why I collect it, and how little of it there is.',
    sections: [
      {
        h: 'What I collect',
        p: 'When you submit a booking enquiry I receive the name, email address, optional phone number, occasion, guest count, preferred date and any dietary notes you choose to share. That is all.',
      },
      {
        h: 'What I do not do',
        p: 'I do not sell, share or rent your details. There is no advertising network, no tracking pixel and no third-party analytics on this site. Enquiries are read by me and stored in my own email.',
      },
      {
        h: 'How long I keep it',
        p: 'Enquiry records are kept for twelve months so I can honour a booking or answer a repeat request. After that they are deleted. Payment details are never stored by me at all — deposits are handled by my payment provider.',
      },
      {
        h: 'Your rights',
        p: 'You can ask me at any time what I hold about you, correct it, or have it deleted. Email book@mongifana.com and I will action it within seven days.',
      },
    ],
  },
  terms: {
    eyebrow: 'Legal',
    title: 'Terms',
    lede: 'The practical terms of booking a private chef.',
    sections: [
      {
        h: 'Booking and deposit',
        p: 'A 25% deposit confirms your date. The balance is due on the day of the service. Dates are held on a first-come, first-served basis once the deposit clears.',
      },
      {
        h: 'Cancellations',
        p: 'Cancel more than 30 days before and the deposit is refunded in full. Between 30 and 14 days, 50% is refunded. Inside 14 days the deposit is retained, because the market, staff and ingredients are already committed.',
      },
      {
        h: 'Rescheduling',
        p: 'One date change is free with 14 days’ notice, subject to availability. Further changes are treated as a cancellation and a new booking.',
      },
      {
        h: 'Allergies',
        p: 'Please tell me about every allergy and intolerance at enquiry stage. I cook in domestic kitchens that are not allergen-free environments, and I will always be candid about what that means for your safety.',
      },
      {
        h: 'Pricing',
        p: 'All quoted prices are per guest unless stated otherwise and exclude travel, accommodation and any third-party hire. Final figures are confirmed in writing before any deposit is taken.',
      },
    ],
  },
} as const;

type DocKey = keyof typeof CONTENT;

export default function Legal() {
  const [params] = useSearchParams();
  const { pathname } = useLocation();

  // Derive the document from the route, not a query param, so /terms can
  // never render the privacy copy. An explicit ?doc= still wins.
  const requested = params.get('doc') ?? pathname.replace(/^\//, '');
  const key: DocKey = requested === 'terms' ? 'terms' : 'privacy';
  const doc = CONTENT[key];

  useDocumentMeta({
    title: doc.title,
    description: doc.lede,
    path: `/${key}`,
  });

  return (
    <>
      <PageHero eyebrow={doc.eyebrow} title={doc.title} lede={doc.lede}>
        <Link
          to={key === 'privacy' ? '/terms' : '/privacy'}
          className="filter-chip"
        >
          Read the {key === 'privacy' ? 'terms' : 'privacy policy'}
        </Link>
      </PageHero>

      <section className="section legal">
        <div className="shell legal__inner">
          {doc.sections.map((s, i) => (
            <Reveal className="legal__block" key={s.h} delay={i * 0.05}>
              <SplitReveal className="legal__heading" as="h2">
                {s.h}
              </SplitReveal>
              <p className="legal__text">{s.p}</p>
            </Reveal>
          ))}

          <Reveal className="legal__foot" delay={0.1}>
            <p>
              Last updated 1 March 2026. Questions about either document go to{' '}
              <a href="mailto:book@mongifana.com">book@mongifana.com</a>.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
