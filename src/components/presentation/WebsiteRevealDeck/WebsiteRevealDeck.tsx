import React, { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import logoWhite from '../../shared/SiteBrand/logo-white.png';
import './WebsiteRevealDeck.scss';

// ── Slide definitions ─────────────────────────────────────────────────────────

type SlideTheme = 'obsidian' | 'porcelain';

type SlideMeta = {
  id: string;
  chapter: string;
  theme: SlideTheme;
};

const slides: SlideMeta[] = [
  { id: 'logo', chapter: '', theme: 'obsidian' },
  { id: 'votecompass', chapter: 'Vote Compass', theme: 'porcelain' },
  { id: 'clessn', chapter: 'CLESSN', theme: 'porcelain' },
  { id: 'product1', chapter: 'Parcours', theme: 'obsidian' },
  { id: 'product2', chapter: 'Parcours', theme: 'obsidian' },
  { id: 'product3', chapter: 'Parcours', theme: 'obsidian' },
  { id: 'product4', chapter: 'Parcours', theme: 'obsidian' },
  { id: 'vitrine', chapter: 'Parcours', theme: 'obsidian' },
  { id: 'circles', chapter: 'Sections', theme: 'porcelain' },
  { id: 'closing', chapter: '', theme: 'obsidian' },
];

// ── Venn diagram geometry (mirrors site VennDiagram) ──────────────────────────

const R = 95;
const MEDIAS = { cx: 150, cy: 115 };
const CITOYENS = { cx: 77, cy: 228 };
const DECIDEURS = { cx: 223, cy: 228 };

// ── Framer Motion transition ──────────────────────────────────────────────────

const slideTransition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1],
};

// ── Component ─────────────────────────────────────────────────────────────────

const WebsiteRevealDeck = (): ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const slideRef = useRef<HTMLElement | null>(null);
  const wheelTimeoutRef = useRef<number | null>(null);

  const activeSlide = slides[activeIndex];
  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === slides.length - 1;

  const goToPrevious = useCallback((): void => {
    setActiveIndex((i) => Math.max(0, i - 1));
  }, []);

  const goToNext = useCallback((): void => {
    setActiveIndex((i) => Math.min(slides.length - 1, i + 1));
  }, []);

  // Lock body scroll and set title
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevTitle = document.title;
    document.body.style.overflow = 'hidden';
    document.title = 'La Vitrine — Presentation';
    return () => {
      document.body.style.overflow = prevOverflow;
      document.title = prevTitle;
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'Backspace') {
        e.preventDefault();
        goToPrevious();
      }
      if (e.key === 'Home') {
        e.preventDefault();
        setActiveIndex(0);
      }
      if (e.key === 'End') {
        e.preventDefault();
        setActiveIndex(slides.length - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [goToNext, goToPrevious]);

  // ── GSAP: logo breathing + shine (slide 1) ─────────────────────────────────
  useEffect(() => {
    if (!deckRef.current) return undefined;

    const ctx = gsap.context(() => {
      // Very subtle breathing — "un tout petit peu"
      gsap.to('.Deck-logoImg', {
        duration: 4,
        ease: 'sine.inOut',
        repeat: -1,
        scale: 1.025,
        yoyo: true,
      });

      // Shine sweep — occasional, like real glass catching light
      gsap.to('.Deck-shine', {
        duration: 2.8,
        ease: 'power2.inOut',
        repeat: -1,
        repeatDelay: 2.5,
        xPercent: 220,
      });
    }, deckRef);

    return () => {
      ctx.revert();
    };
  }, []);

  // ── GSAP: per-slide element reveals ─────────────────────────────────────────
  useEffect(() => {
    if (!slideRef.current) return undefined;

    const ctx = gsap.context(() => {
      // Standard staggered reveal for all [data-reveal] nodes
      const nodes = slideRef.current!.querySelectorAll<HTMLElement>('[data-reveal]');
      if (nodes.length) {
        gsap.fromTo(
          nodes,
          { opacity: 0, y: 30 },
          { duration: 0.4, ease: 'power3.out', opacity: 1, stagger: 0.08, y: 0 },
        );
      }

      // ── Logo slide: staged cinematic entrance ──────────────────────────────
      if (activeSlide.id === 'logo') {
        const vitrine = slideRef.current!.querySelector<HTMLElement>('.Deck-vitrine');
        const tagline = slideRef.current!.querySelector<HTMLElement>('.Deck-tagline');

        // Vitrine emerges from black — delayed slightly after Framer Motion fade-in
        if (vitrine) {
          gsap.fromTo(
            vitrine,
            { opacity: 0, scale: 0.93 },
            { delay: 0.25, duration: 1, ease: 'power3.out', opacity: 1, scale: 1 },
          );
        }

        // Tagline fades in after vitrine is settled
        if (tagline) {
          gsap.fromTo(tagline, { opacity: 0 }, { delay: 1.5, duration: 0.8, ease: 'power2.out', opacity: 1 });
        }

        // Sparkles twinkle independently, each with its own rhythm
        const sparkles = slideRef.current!.querySelectorAll<HTMLElement>('.Deck-sparkle');
        sparkles.forEach((el, i) => {
          gsap.set(el, { opacity: 0, scale: 0 });
          const tl = gsap.timeline({
            delay: 1.4 + i * 0.45,
            repeat: -1,
            repeatDelay: 1.6 + (i % 4) * 0.55,
          });
          tl.to(el, { duration: 0.28, ease: 'power2.out', opacity: 1, scale: 1 }).to(
            el,
            { duration: 0.28, ease: 'power2.in', opacity: 0, scale: 0 },
            '+=0.55',
          );
        });
      }
    }, slideRef);

    return () => {
      ctx.revert();
    };
  }, [activeIndex, activeSlide.id]);

  // Wheel debounce cleanup
  useEffect(
    () => () => {
      if (wheelTimeoutRef.current) window.clearTimeout(wheelTimeoutRef.current);
    },
    [],
  );

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>): void => {
    if (Math.abs(e.deltaY) < 28 || wheelTimeoutRef.current) return;
    if (e.deltaY > 0) goToNext();
    else goToPrevious();
    wheelTimeoutRef.current = window.setTimeout(() => {
      wheelTimeoutRef.current = null;
    }, 900);
  };

  // ── Slide renderers ─────────────────────────────────────────────────────────

  const renderSlide = (): ReactElement => {
    switch (activeSlide.id) {
      // ── Slide 1: Cinematic vitrine reveal ───────────────────────────────────
      case 'logo':
        return (
          <div className="Deck-layout Deck-layout--centered Deck-layout--column">
            <div className="Deck-vitrine">
              <span className="Deck-vitrineHalo" aria-hidden="true" />
              <div className="Deck-vitrinePanel">
                <div className="Deck-logoWrap">
                  <img alt="La Vitrine Démocratique" className="Deck-logoImg" src={logoWhite} />
                  <span className="Deck-shine" aria-hidden="true" />
                </div>
              </div>
              {/* Sparkles on the glass edges */}
              <span className="Deck-sparkle Deck-sparkle--1" aria-hidden="true" />
              <span className="Deck-sparkle Deck-sparkle--2" aria-hidden="true" />
              <span className="Deck-sparkle Deck-sparkle--3" aria-hidden="true" />
              <span className="Deck-sparkle Deck-sparkle--4" aria-hidden="true" />
              <span className="Deck-sparkle Deck-sparkle--5" aria-hidden="true" />
              <span className="Deck-sparkle Deck-sparkle--6" aria-hidden="true" />
              <span className="Deck-sparkle Deck-sparkle--7" aria-hidden="true" />
              <span className="Deck-sparkle Deck-sparkle--8" aria-hidden="true" />
            </div>
            <p className="Deck-tagline">Prendre le pouls de ce qui compte.</p>
          </div>
        );

      // ── Slide 2: Vote Compass ───────────────────────────────────────────────
      case 'votecompass':
        return (
          <div className="Deck-layout Deck-layout--split">
            <div className="Deck-imgFrame" data-reveal>
              <img
                alt="Vote Compass logo"
                className="Deck-fitImg"
                src={`${process.env.PUBLIC_URL}/presentation/img/vote_compass.png`}
              />
            </div>
            <div className="Deck-imgFrame" data-reveal>
              <img
                alt="Portrait"
                className="Deck-fitImg"
                src={`${process.env.PUBLIC_URL}/presentation/img/portrait_vote_compass.png`}
              />
            </div>
          </div>
        );

      // ── Slide 3: CLESSN team ────────────────────────────────────────────────
      case 'clessn':
        return (
          <div className="Deck-layout Deck-layout--stacked">
            <h1 className="Deck-heroTitle Deck-heroTitle--dark" data-reveal>
              CLESSN!
            </h1>
            <div className="Deck-portraitGrid" data-reveal>
              <img
                alt="Member 1"
                className="Deck-portrait"
                src={`${process.env.PUBLIC_URL}/presentation/img/clessn_member_1.png`}
              />
              <img
                alt="Member 2"
                className="Deck-portrait"
                src={`${process.env.PUBLIC_URL}/presentation/img/clessn_member_2.png`}
              />
              <img
                alt="Member 3"
                className="Deck-portrait"
                src={`${process.env.PUBLIC_URL}/presentation/img/clessn_member_3.png`}
              />
              <img
                alt="Member 4"
                className="Deck-portrait"
                src={`${process.env.PUBLIC_URL}/presentation/img/clessn_member_4.png`}
              />
              <img
                alt="Member 5"
                className="Deck-portrait"
                src={`${process.env.PUBLIC_URL}/presentation/img/clessn_member_5.png`}
              />
              <img
                alt="Member 6"
                className="Deck-portrait"
                src={`${process.env.PUBLIC_URL}/presentation/img/clessn_member_6.png`}
              />
            </div>
          </div>
        );

      // ── Slides 4-7: One product per slide ────────────────────────────────
      case 'product1':
        return (
          <div className="Deck-layout Deck-layout--centered">
            <img
              alt="Polimètre"
              className="Deck-productImg"
              data-reveal
              src={`${process.env.PUBLIC_URL}/presentation/img/project_stack_1.png`}
            />
          </div>
        );

      case 'product2':
        return (
          <div className="Deck-layout Deck-layout--centered">
            <img
              alt="Radar+"
              className="Deck-productImg"
              data-reveal
              src={`${process.env.PUBLIC_URL}/presentation/img/project_stack_2.svg`}
            />
          </div>
        );

      case 'product3':
        return (
          <div className="Deck-layout Deck-layout--centered">
            <img
              alt="Datagotchi"
              className="Deck-productImg"
              data-reveal
              src={`${process.env.PUBLIC_URL}/presentation/img/project_stack_3.png`}
            />
          </div>
        );

      case 'product4':
        return (
          <div className="Deck-layout Deck-layout--centered">
            <img
              alt="Agora+"
              className="Deck-productImg"
              data-reveal
              src={`${process.env.PUBLIC_URL}/presentation/img/project_stack_4.png`}
            />
          </div>
        );

      // ── Slide 8: Vitrine reveal ─────────────────────────────────────────────
      case 'vitrine':
        return (
          <div className="Deck-layout Deck-layout--centered">
            <div className="Deck-logoWrap" data-reveal>
              <img alt="La Vitrine Démocratique" className="Deck-logoImg Deck-logoImg--final" src={logoWhite} />
            </div>
          </div>
        );

      // ── Slide 9: Venn diagram circles ───────────────────────────────────────
      case 'circles':
        return (
          <div className="Deck-layout Deck-layout--centered">
            <div className="Deck-venn" data-reveal>
              <svg viewBox="-25 0 350 355" xmlns="http://www.w3.org/2000/svg">
                <g className="Deck-vennItem Deck-vennItem--medias">
                  <circle cx={MEDIAS.cx} cy={MEDIAS.cy} r={R} className="Deck-vennCircle" />
                  <text x={MEDIAS.cx} y={MEDIAS.cy + 4} textAnchor="middle" className="Deck-vennLabel">
                    Medias
                  </text>
                </g>
                <g className="Deck-vennItem Deck-vennItem--citoyens">
                  <circle cx={CITOYENS.cx} cy={CITOYENS.cy} r={R} className="Deck-vennCircle" />
                  <text x={CITOYENS.cx} y={CITOYENS.cy + 4} textAnchor="middle" className="Deck-vennLabel">
                    Citoyens
                  </text>
                </g>
                <g className="Deck-vennItem Deck-vennItem--decideurs">
                  <circle cx={DECIDEURS.cx} cy={DECIDEURS.cy} r={R} className="Deck-vennCircle" />
                  <text x={DECIDEURS.cx} y={DECIDEURS.cy + 4} textAnchor="middle" className="Deck-vennLabel">
                    Decideurs
                  </text>
                </g>
              </svg>
            </div>
          </div>
        );

      // ── Slide 6: Closing ────────────────────────────────────────────────────
      case 'closing':
      default:
        return (
          <div className="Deck-layout Deck-layout--centered Deck-layout--column">
            <p className="Deck-eyebrow" data-reveal>
              Visit
            </p>
            <h1 className="Deck-heroTitle" data-reveal>
              vitrine-showcase.github.io
            </h1>
          </div>
        );
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={`WebsiteRevealDeck theme-${activeSlide.theme}`} onWheel={handleWheel} ref={deckRef}>
      <div className={`Deck-shell${isFirstSlide ? ' Deck-shell--immersive' : ''}`}>
        {/* Header + progress — hidden on the cinematic first slide */}
        {!isFirstSlide && (
          <>
            <header className="Deck-header">
              <span className="Deck-brand">La Vitrine</span>
              <span className="Deck-chapter">{activeSlide.chapter}</span>
              <span className="Deck-counter">
                {`${String(activeIndex + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`}
              </span>
            </header>

            <div className="Deck-progressTrack" aria-hidden="true">
              <motion.span
                animate={{ scaleX: (activeIndex + 1) / slides.length }}
                className="Deck-progressFill"
                initial={false}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          </>
        )}

        {/* Slide */}
        <AnimatePresence exitBeforeEnter initial={false}>
          <motion.section
            animate={{ opacity: 1, y: 0 }}
            className={`Deck-slide Deck-slide--${activeSlide.id}`}
            exit={{ opacity: 0, y: -20 }}
            initial={{ opacity: 0, y: 20 }}
            key={activeSlide.id}
            ref={slideRef}
            transition={slideTransition}
          >
            {renderSlide()}
          </motion.section>
        </AnimatePresence>

        {/* Footer — hidden on the cinematic first slide */}
        {!isFirstSlide && (
          <footer className="Deck-footer">
            <div />
            <div />
            <div className="Deck-controls">
              <button disabled={isFirstSlide} onClick={goToPrevious} type="button">
                Prev
              </button>
              <button disabled={isLastSlide} onClick={goToNext} type="button">
                Next
              </button>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
};

export default WebsiteRevealDeck;
