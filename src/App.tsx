import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ScrollTrigger } from './lib/gsap';
import { SmoothScroll } from './components/SmoothScroll';
import { Preloader } from './components/Preloader';
import { Cursor } from './components/anim/Cursor';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { ScrollProgress } from './components/ScrollProgress';
import { scrollTo, useLenis } from './lib/scroll-context';

import Home from './pages/Home';
import Menu from './pages/Menu';
import Experience from './pages/Experience';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Legal from './pages/Legal';

/** Resets scroll and ScrollTrigger positions on every route change. */
function RouteEffects() {
  const location = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    // Let the new page paint before resetting trigger measurements
    const id = window.setTimeout(() => {
      scrollTo(lenis, 0, { immediate: true });
      window.scrollTo(0, 0);
      ScrollTrigger.refresh();
    }, 60);
    return () => window.clearTimeout(id);
  }, [location.pathname, lenis]);

  return null;
}

export default function App() {
  return (
    <SmoothScroll>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Nav />
      <RouteEffects />

      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Legal />} />
          <Route path="/terms" element={<Legal />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
