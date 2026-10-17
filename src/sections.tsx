import { useState } from 'react';
import { ArrowUpRight, BriefcaseBusiness, LayoutGrid, Mail, UserRound } from 'lucide-react';
import { portfolio, type Project } from './content';
import { NeuralNoise } from './components/ui/neural-noise-cursor';

export function Header() {
  const [dockOpen, setDockOpen] = useState(false);
  const [expandForTouch, setExpandForTouch] = useState(false);
  const [pointerActivation, setPointerActivation] = useState(false);
  const items = [
    { label: 'Work', href: '#work', Icon: BriefcaseBusiness },
    { label: 'Skills', href: '#skills', Icon: LayoutGrid },
    { label: 'About', href: '#about', Icon: UserRound },
    { label: 'Contact', href: '#contact', Icon: Mail },
  ];
  return <><header className="site-header"><div className="header-brand"><a className="logo" href="#top" aria-label={`${portfolio.name} home`}>{portfolio.name}</a><span className="nav-role">{portfolio.title}</span></div><nav className="nav" aria-label="Main navigation">{items.map(({ label, href }) => <a key={href} href={href}>{label}</a>)}</nav></header><nav className={`mobile-nav-dock${dockOpen ? ' is-open' : ''}`} aria-label="Mobile navigation" onPointerDown={(event) => { setPointerActivation(true); const touchShouldExpand = event.pointerType === 'touch' && !dockOpen; setExpandForTouch(touchShouldExpand); if (touchShouldExpand) setDockOpen(true); }} onPointerUp={() => window.setTimeout(() => setPointerActivation(false), 0)} onPointerCancel={() => { setPointerActivation(false); setExpandForTouch(false); }} onPointerEnter={(event) => { if (event.pointerType !== 'touch') setDockOpen(true); }} onPointerLeave={(event) => { if (event.pointerType !== 'touch' && !event.currentTarget.contains(document.activeElement)) setDockOpen(false); }} onFocus={() => { if (!pointerActivation) setDockOpen(true); }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDockOpen(false); }} onClick={(event) => { if (expandForTouch) { event.preventDefault(); setExpandForTouch(false); } else { setDockOpen(false); } }}><div className="mobile-nav-links">{items.map(({ label, href, Icon }) => <a className="mobile-nav-item" key={href} href={href} aria-label={label}><Icon aria-hidden="true" /><span>{label}</span></a>)}</div></nav></>;
}

export function Hero() {
  return <section className="portfolio-hero" data-reveal><div className="container hero-grid"><div className="hero-copy"><h1>{portfolio.name}</h1><p className="hero-role" style={{ color: '#004B87' }}>{portfolio.institution}</p></div><div className="hero-portrait"><div className="profile-wrap"><NeuralNoise className="neural-noise--portrait" opacity={0.2} pointerStrength={0.65} timeScale={0.55} /><img className="profile-image" src={portfolio.portrait} alt={`Portrait of ${portfolio.name}`} /></div></div><div className="hero-intro"><p>{portfolio.intro}</p><div className="hero-actions"><a className="button button-default" href="#work"><span>View My Work</span><ArrowUpRight size={14} /></a><a className="button button-outline" href="#contact"><span>Contact</span></a><a className="button button-outline" href={portfolio.cv} download="Mya-Thinzar-Aung-CV.pdf"><span>Download CV</span></a></div></div></div></section>;
}

export function SelectedWork() {
  return <section className="work" id="work" data-reveal><div className="container"><div className="section-heading"><p className="eyebrow">Selected Work</p><h2>Recent projects</h2></div><div className="projects">{portfolio.projects.map((project: Project) => <article className="project card" key={project.title} data-reveal><div className="project-copy"><div className="project-kicker"><span>{project.category}</span></div><h3>{project.title}</h3><p>{project.description}</p><p className="technologies">{project.technologies}</p>{project.url && <a className="text-link" href={project.url} target="_blank" rel="noreferrer" aria-label={`View ${project.title} repository`}>View repository <ArrowUpRight size={14} /></a>}</div></article>)}</div></div></section>;
}

export function About() {
  return <section className="about section-border" id="about" data-reveal><div className="container about-grid"><div><p className="eyebrow">About</p><h2>A little about me</h2></div><div><p className="about-description">{portfolio.about}</p><div className="education-list"><p className="eyebrow">Education</p>{portfolio.education.map((item) => <article className="education-item" key={item.degree}><h3>{item.degree}</h3><p style={{ color: '#004B87' }}>{item.institution}</p><span>{item.details}</span></article>)}</div><div className="course-list"><p className="eyebrow">Courses</p>{portfolio.courses.map((course) => <p key={course} style={{ color: '#004B87' }}>{course}</p>)}</div></div></div></section>;
}

export function Skills() {
  return <section className="services section-border" id="skills" data-reveal><div className="container"><div className="section-heading"><p className="eyebrow">Skills</p><h2>Areas of experience</h2></div><div className="service-list">{portfolio.skills.map((skill, index) => <div className="service" key={skill.label} data-reveal><span className="service-number">{String(index + 1).padStart(2, '0')}</span><h3 style={{ color: '#004B87' }}>{skill.label}</h3><p>{skill.value}</p></div>)}</div></div></section>;
}

export function Contact() {
  return <footer className="contact" id="contact" data-reveal><div className="container"><p className="eyebrow">Contact</p><h2>{portfolio.name}</h2><div className="contact-details"><a className="contact-email-link" href={`mailto:${portfolio.email}`}>Email me <ArrowUpRight size={14} /></a><a className="contact-phone" href={`tel:${portfolio.phone}`}>{portfolio.phoneLabel}</a></div><div className="contact-bottom"><span>Mandalay, Myanmar</span><div className="social-links"><a href={portfolio.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a></div><span>© 2026</span><a className="pockraft-credit" href="https://pockraft.asia" target="_blank" rel="noreferrer"><span>Craft by</span><img src="/pockraft-logo.png" alt="" /><strong>Pockraft</strong></a></div></div></footer>;
}
