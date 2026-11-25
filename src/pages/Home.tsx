import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { Hero } from '../components/sections/Hero';
import { Marquee } from '../components/sections/Marquee';
import { Philosophy } from '../components/sections/Philosophy';
import { SignatureDishes } from '../components/sections/SignatureDishes';
import { ServicesGrid } from '../components/sections/ServicesGrid';
import { Stats } from '../components/sections/Stats';
import { Process } from '../components/sections/Process';
import { GalleryRail } from '../components/sections/GalleryRail';
import { Testimonials, TestimonialsHeading } from '../components/sections/Testimonials';
import { Faq } from '../components/sections/Faq';
import { CtaBand } from '../components/sections/CtaBand';

export default function Home() {
  useDocumentMeta({
    title: 'Mongi Fana',
    description:
      'Mongi Fana is a private chef weaving West African soul into global fine dining. Intimate tasting menus, private events and destination experiences.',
    path: '/',
  });

  return (
    <>
      <Hero />

      <Marquee
        className="marquee--band"
        items={[
          'Private dining',
          'Tasting menus',
          'Weddings',
          'Destination weeks',
          'Culinary consulting',
        ]}
        speed={38}
        separator="✦"
      />

      <Philosophy />
      <SignatureDishes />
      <ServicesGrid />
      <Stats />
      <Process />
      <GalleryRail />

      <section className="section testi-section">
        <div className="shell">
          <TestimonialsHeading />
          <Testimonials />
        </div>
      </section>

      <Faq limit={5} />
      <CtaBand />
    </>
  );
}
