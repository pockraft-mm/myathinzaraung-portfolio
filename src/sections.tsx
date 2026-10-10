import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { portfolio, type Project } from './content';
import { NeuralNoise } from './components/ui/neural-noise-cursor';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const items = [
    { label: 'Work', href: '#work', start: 180, end: 202.5 },
    { label: 'Skills', href: '#skills', start: 202.5, end: 225 },
    { label: 'About', href: '#about', start: 225, end: 247.5 },
    { label: 'Contact', href: '#contact', start: 247.5, end: 270 },
  ];
  const point = (angle: number, radius: number) => {
    const radians = angle * Math.PI / 180;
    return { x: 160 + radius * Math.cos(radians), y: 160 + radius * Math.sin(radians) };
  };
  const sectorPath = (start: number, end: number) => {
    const outerStart = point(start, 150);
    const outerEnd = point(end, 150);
    const innerEnd = point(end, 76);
    const innerStart = point(start, 76);
    return `M ${outerStart.x} ${outerStart.y} A 150 150 0 0 1 ${outerEnd.x} ${outerEnd.y} L ${innerEnd.x} ${innerEnd.y} A 76 76 0 0 0 ${innerStart.x} ${innerStart.y} Z`;
  };
  return <><header className="site-header"><div className="header-brand"><a className="logo" href="#top" aria-label={`${portfolio.name} home`}>{portfolio.name}</a><span className="nav-role">{portfolio.title}</span></div><nav className="nav" aria-label="Main navigation"><a href="#work">Work</a><a href="#skills">Skills</a><a href="#about">About</a><a href="#contact">Contact</a></nav></header><div className={`mobile-nav${menuOpen ? ' is-open' : ''}`}><nav className="mobile-nav__links" id="mobile-navigation" aria-label="Mobile navigation"><svg className="mobile-nav__wheel" viewBox="0 0 160 160" aria-hidden={!menuOpen}>{items.map((item) => { const start = item.start + 1.2; const end = item.end - 1.2; const labelPoint = point((start + end) / 2, 113); return <a key={item.href} href={item.href} aria-label={item.label} tabIndex={menuOpen ? 0 : -1} onClick={closeMenu}><path d={sectorPath(start, end)} /><text x={labelPoint.x} y={labelPoint.y}>{item.label}</text></a>; })}</svg></nav><button className="mobile-nav__toggle" type="button" aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X size={17} strokeWidth={2.5} /> : <Menu size={23} />}</button></div></>;
}

export function Hero() {
  return <section className="portfolio-hero" data-reveal><div className="container hero-grid"><div className="hero-copy"><h1>{portfolio.name}</h1><p className="hero-role">{portfolio.institution}</p></div><div className="hero-portrait"><div className="profile-wrap"><NeuralNoise className="neural-noise--portrait" opacity={0.2} pointerStrength={0.65} timeScale={0.55} /><img className="profile-image" src={portfolio.portrait} alt={`Portrait of ${portfolio.name}`} /></div></div><div className="hero-intro"><p>{portfolio.intro}</p><div className="hero-actions"><a className="button button-default" href="#work">View My Work <ArrowUpRight size={14} /></a><a className="button button-outline" href="#contact">Contact</a><a className="button button-outline" href={portfolio.cv} download="Mya-Thinzar-Aung-CV.pdf">Download CV</a></div></div></div></section>;
}

export function SelectedWork() {
  return <section className="work" id="work" data-reveal><div className="container"><div className="section-heading"><p className="eyebrow">Selected Work</p><h2>Recent projects</h2></div><div className="projects">{portfolio.projects.map((project: Project) => <article className="project card" key={project.title} data-reveal><div className="project-copy"><div className="project-kicker"><span>{project.category}</span></div><h3>{project.title}</h3><p>{project.description}</p><p className="technologies">{project.technologies}</p>{project.url && <a className="text-link" href={project.url} target="_blank" rel="noreferrer" aria-label={`View ${project.title} repository`}>View repository <ArrowUpRight size={14} /></a>}</div></article>)}</div></div></section>;
}

export function About() {
  return <section className="about section-border" id="about" data-reveal><div className="container about-grid"><div><p className="eyebrow">About</p><h2>A little about me</h2></div><div><p className="about-description">{portfolio.about}</p><div className="education-list"><p className="eyebrow">Education</p>{portfolio.education.map((item) => <article className="education-item" key={item.degree}><h3>{item.degree}</h3><p>{item.institution}</p><span>{item.details}</span></article>)}</div><div className="course-list"><p className="eyebrow">Courses</p>{portfolio.courses.map((course) => <p key={course}>{course}</p>)}</div></div></div></section>;
}

export function Skills() {
  return <section className="services section-border" id="skills" data-reveal><div className="container"><div className="section-heading"><p className="eyebrow">Skills</p><h2>Areas of experience</h2></div><div className="service-list">{portfolio.skills.map((skill, index) => <div className="service" key={skill.label} data-reveal><span className="service-number">{String(index + 1).padStart(2, '0')}</span><h3>{skill.label}</h3><p>{skill.value}</p></div>)}</div></div></section>;
}

export function Contact() {
  return <footer className="contact" id="contact" data-reveal><div className="container"><p className="eyebrow">Contact</p><h2>{portfolio.name}</h2><div className="contact-details"><a className="contact-email-link" href={`mailto:${portfolio.email}`}>Email me <ArrowUpRight size={14} /></a><a className="contact-phone" href={`tel:${portfolio.phone}`}>{portfolio.phoneLabel}</a></div><div className="contact-bottom"><span>Mandalay, Myanmar</span><div className="social-links"><a href={portfolio.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a></div><span>© 2026</span></div></div></footer>;
}
