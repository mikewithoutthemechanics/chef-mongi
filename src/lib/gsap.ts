import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

let registered = false;

/** Register GSAP plugins once. Safe to call repeatedly. */
export function registerGsap() {
  if (registered) return gsap;
  gsap.registerPlugin(ScrollTrigger, SplitText);
  gsap.defaults({ ease: 'power3.out', duration: 0.9 });
  registered = true;
  return gsap;
}

export const EASE = {
  outExpo: 'expo.out',
  inOutQuart: 'power4.inOut',
  soft: 'power2.out',
  back: 'back.out(1.7)',
} as const;

registerGsap();

export { gsap, ScrollTrigger, SplitText };
export default gsap;
