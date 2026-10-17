import { useEffect } from 'react';
import type { CSSProperties } from 'react';
import { portfolio } from './content';
import { About, Contact, Header, Hero, SelectedWork, Skills } from './sections';
import { OceanBackground } from './components/ui/ocean-background';

function usePortfolioMotion() {
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('#work, #skills, #about, #contact');
    const navLinks = document.querySelectorAll<Element>('.nav a[href^="#"], .mobile-nav-dock a[href^="#"]');
    if (!('IntersectionObserver' in window) || sections.length === 0) return undefined;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        if (link.getAttribute('href') === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }), { rootMargin: '-18% 0px -70% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const revealItems = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!reducedMotion && 'IntersectionObserver' in window) {
      document.documentElement.classList.add('has-reveal');
      const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); currentObserver.unobserve(entry.target); }
      }), { threshold: 0.08, rootMargin: '0px 0px -10% 0px' });
      revealItems.forEach((item) => observer.observe(item));
      return () => { observer.disconnect(); document.documentElement.classList.remove('has-reveal'); };
    }
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return undefined;
  }, []);

  useEffect(() => {
    const cursor = document.querySelector<HTMLElement>('.cursor-follower');
    if (!cursor || !window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let targetX = 0;
    let targetY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let frame = 0;
    let positioned = false;
    const followCursor = () => {
      cursorX += (targetX - cursorX) * 0.22;
      cursorY += (targetY - cursorY) * 0.22;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      if (Math.abs(targetX - cursorX) > 0.5 || Math.abs(targetY - cursorY) > 0.5) frame = window.requestAnimationFrame(followCursor);
      else frame = 0;
    };
    const moveCursor = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      targetX = event.clientX;
      targetY = event.clientY;
      if (!positioned) {
        cursorX = targetX;
        cursorY = targetY;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
        positioned = true;
      } else if (!frame) frame = window.requestAnimationFrame(followCursor);
      cursor.classList.add('cursor-visible');
    };
    const updateHover = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('a, button')) cursor.classList.add('cursor-link');
      else cursor.classList.remove('cursor-link');
    };
    const hideCursor = () => cursor.classList.remove('cursor-visible');
    window.addEventListener('pointermove', moveCursor);
    window.addEventListener('pointerover', updateHover);
    document.documentElement.addEventListener('pointerleave', hideCursor);
    return () => { window.removeEventListener('pointermove', moveCursor); window.removeEventListener('pointerover', updateHover); document.documentElement.removeEventListener('pointerleave', hideCursor); if (frame) window.cancelAnimationFrame(frame); };
  }, []);
}

export default function App() {
  usePortfolioMotion();
  const palette = {
    '--background': portfolio.colors.background,
    '--surface': portfolio.colors.surface,
    '--card': portfolio.colors.card,
    '--accent': portfolio.colors.accent,
    '--foreground': portfolio.colors.text,
    '--muted-foreground': portfolio.colors.muted,
    '--border': portfolio.colors.border,
  } as CSSProperties;
  return <div className="site-shell" style={palette}><OceanBackground /><div className="cursor-follower" aria-hidden="true"><span /></div><Header /><main id="top"><Hero /><SelectedWork /><Skills /><About /><Contact /></main></div>;
}
