import { AnimatePresence, motion, useScroll, useSpring, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { AudioLines, ChevronLeft, ChevronRight, Flame, Mail, RotateCcw, Sparkles, Volume2, VolumeX, X, Image as ImageIcon } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import Lenis from "lenis";
import FilmstripModal from "@/components/FilmstripModal";
import CloudGuideBubble from "@/components/CloudGuideBubble";
import { familyMemories } from "@/data/familyMemories";
import { useBlowDetector } from "@/hooks/useBlowDetector";
import { useIsMobile } from "@/hooks/useMobile";
import { soundEngine } from "@/lib/soundEngine";

const CakeScene = lazy(() => import("@/components/CakeScene"));

function TextMask({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <span className="line-mask"><motion.span initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay }}>{children}</motion.span></span>
  );
}

export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [candleLit, setCandleLit] = useState(false);
  const [extinguished, setExtinguished] = useState(false);

  const [noteContent, setNoteContent] = useState(() => typeof window !== "undefined" ? localStorage.getItem("birthday-wish") || "" : "");
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [toast, setToast] = useState("");
  const [isAudio, setIsAudio] = useState(false);

  // Filmstrip state
  const [filmstripState, setFilmstripState] = useState<{index: number, fromBottom: boolean} | null>(null);
  const [lastOpenedSlice, setLastOpenedSlice] = useState<number>(-1);
  const isRewinding = useRef(false);

  // Lenis instance and Scroll Settling logic for Auto-Open
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    lenisRef.current = lenis;

    let scrollTimeout: NodeJS.Timeout;
    lenis.on('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        window.dispatchEvent(new Event('scroll-settled'));
      }, 300);
    });

    let id = 0;
    const loop = (t: number) => { lenis.raf(t); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => {
      clearTimeout(scrollTimeout);
      cancelAnimationFrame(id);
      lenis.destroy();
      soundEngine.stopBirthdayMusic();
      lenisRef.current = null;
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 24, restDelta: 0.0001 });

  const [activeSlice, setActiveSlice] = useState(0);
  const [stage, setStage] = useState<"hero"|"centering"|"slices"|"finale">("hero");
  const prefersReducedMotion = useReducedMotion() ?? false;
  const mobile = useIsMobile();

  const navigateSlices = useCallback((direction: "next" | "prev") => {
    const p = smoothProgress.get();
    const targets = [0, 0.34, 0.50, 0.65, 0.81, 1.0];
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const target = direction === "next"
      ? targets.find((value) => value > p + 0.05) ?? 1
      : [...targets].reverse().find((value) => value < p - 0.05) ?? 0;
    lenisRef.current?.scrollTo(target * maxScroll, { duration: 1.0 });
  }, [smoothProgress]);

  const triggerCelebration = useCallback(() => {
    if (extinguished) return;
    setExtinguished(true);
    soundEngine.playFlameSnuff();
    soundEngine.playConfettiPop();
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.4 },
      colors: ["#D4973B", "#3B5B72", "#C86A58", "#D66236"]
    });

    // Seamless glide to the first slice after blowing out candle
    setTimeout(() => {
      navigateSlices("next");
    }, 1300);
  }, [extinguished, navigateSlices]);

  const advanceFromFilmstrip = useCallback((chapterIndex: number) => {
    if (chapterIndex >= familyMemories.length - 1) {
      setFilmstripState(null);
      navigateSlices("next");
      return;
    }

    const nextIndex = chapterIndex + 1;
    setFilmstripState({ index: nextIndex, fromBottom: false });
    setLastOpenedSlice(nextIndex);
    navigateSlices("next");
  }, [navigateSlices]);

  // Automatically pop open the filmstrip modal when navigating slices
  useEffect(() => {
    if (stage === "slices" && activeSlice !== lastOpenedSlice && !isRewinding.current) {
      const timer = setTimeout(() => {
        soundEngine.playPaperUnfold();
        setFilmstripState({ index: activeSlice, fromBottom: false });
        setLastOpenedSlice(activeSlice);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [stage, activeSlice, lastOpenedSlice]);

  // Mobile horizontal swipe gesture to smoothly navigate between cake slices
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (filmstripState !== null || showNoteModal) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (filmstripState !== null || showNoteModal) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Deliberate horizontal swipe (at least 45px distance and dominantly horizontal)
      if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
        if (deltaX < 0) {
          soundEngine.playCakeSliceClink();
          navigateSlices("next");
        } else {
          soundEngine.playCakeSliceClink();
          navigateSlices("prev");
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [filmstripState, showNoteModal, navigateSlices]);


  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow default if user is typing in an input (not applicable here, but good practice)
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;

      // Space to blow candle
      if (e.code === 'Space') {
        e.preventDefault();
        if (!candleLit) {
          setCandleLit(true);
          soundEngine.playMatchStrike();
        } else if (stage === "finale" && !extinguished) {
          triggerCelebration();
        } else if (stage === "hero" || stage === "slices") {
          // If they hit space during slices, we could also blow it out?
          // Let's just map it to triggerCelebration if they really want to blow it early, or maybe not.
          // They explicitly asked "bổ sung thêm nút space là thổi nến" which is the finale action.
          triggerCelebration();
        }
      }

      // Up/Down Arrows to navigate slices
      if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!lenisRef.current) return;

        // If filmstrip is open, close it first before jumping slices
        if (filmstripState !== null) {
          setFilmstripState(null);
          // Small delay to let modal close before scrolling
          setTimeout(() => {
            navigateSlices(e.code === 'ArrowDown' ? 'next' : 'prev');
          }, 100);
          return;
        }

        navigateSlices(e.code === 'ArrowDown' ? 'next' : 'prev');
      }
  };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [candleLit, stage, extinguished, filmstripState, triggerCelebration, navigateSlices]);


  useMotionValueEvent(smoothProgress, "change", (p) => {
    let newStage: typeof stage = "hero";
    if (p >= 0.88) newStage = "finale";
    else if (p >= 0.26) newStage = "slices";
    else if (p >= 0.16) newStage = "centering";
    if (newStage !== stage) setStage(newStage);

    if (newStage === "slices") {
      const idx = Math.min(3, Math.max(0, Math.floor(((p - 0.26) / 0.62) * 4)));
      if (idx !== activeSlice) {
        soundEngine.playCakeSliceClink();
        setActiveSlice(idx);
      }
    }
  });

  const { intensity, status: blowStatus } = useBlowDetector({ enabled: !extinguished, armed: candleLit && !extinguished, onBlowOut: triggerCelebration, threshold: 0.2 });


  const handleReplay = () => {
    isRewinding.current = true;
    lenisRef.current?.scrollTo(0, { duration: 2.5 });

    // Reset states
    setCandleLit(false);
    setExtinguished(false);
    setFilmstripState(null);
    setLastOpenedSlice(-1);

    // Allow auto-open again after rewinding is done
    setTimeout(() => {
      isRewinding.current = false;
    }, 2600);
  };

  const currentChapter = familyMemories[activeSlice];
  const chapterProgress = stage === "hero" ? 0 : stage === "centering" ? 20 : stage === "finale" ? 100 : 26 + activeSlice * 16;

  return (
    <main className="birthday-app-root">

      <div className="chapter-progress" aria-label="Tiến trình album ký ức">
        <span className="chapter-progress-label">{stage === "finale" ? "Lời chúc" : stage === "slices" ? `Lát ${currentChapter.sliceNumber} / ${familyMemories.length}` : "Album ký ức"}</span>
        <div className="chapter-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={chapterProgress}>
          <span style={{ width: `${chapterProgress}%`, background: stage === "slices" ? currentChapter.accentColor : 'var(--accent-gold)' }} />
        </div>
      </div>

      <button
        className="floating-sound-pill"
        onClick={() => setIsAudio(soundEngine.toggleBirthdayMusic())}
        aria-label={isAudio ? "Tắt âm thanh" : "Bật âm thanh"}
      >
        {isAudio ? <Volume2 size={15} /> : <VolumeX size={15} />}
        <span>{isAudio ? "Nhạc: Bật" : "Nhạc: Tắt"}</span>
      </button>

      {/* Reverted to 600vh for normal scroll depth */}
      <div ref={scrollRef} className="unified-scrolly-container" style={{ height: '600vh' }}>
        <div className="unified-sticky-viewport">

          <div className="unified-canvas-stage">
          <Suspense fallback={<div className="cake-scene-fallback" aria-label="Đang tải khung cảnh chiếc bánh" />}>
            <CakeScene
              lit={candleLit}
              extinguished={extinguished}
              intensity={intensity}
              scrollProgress={smoothProgress}
              activeSlice={activeSlice}
              stage={stage}
              onFlameClick={triggerCelebration}
              holdFinalSlice={filmstripState?.index === familyMemories.length - 1}
          />
          </Suspense>
          </div>
          <div className="ambient-paper-grid" aria-hidden="true" />
          <div className="ambient-paper-wrinkles" aria-hidden="true" />
          <div className="ambient-paper-texture" aria-hidden="true" />
          <div className="ambient-candle-halo" aria-hidden="true" />
          <div className="ambient-film-grain" aria-hidden="true" />

          {/* Sora Lattice Style Floating Organic Vector Accents */}
          <div className="lattice-sway-element" style={{ top: '14%', left: '3.5%', opacity: 0.7 }} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.8" strokeLinecap="round">
              <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14" />
            </svg>
          </div>
          <div className="lattice-sway-element" style={{ top: '78%', left: '4%', animationDelay: '2.5s', opacity: 0.65 }} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.8" strokeLinecap="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6"/>
            </svg>
          </div>
          <div className="lattice-sway-element" style={{ top: '18%', right: '4%', animationDelay: '1.2s', opacity: 0.75 }} aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--accent-gold)">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>
            </svg>
          </div>
          <div className="lattice-sway-element" style={{ top: '82%', right: '4.5%', animationDelay: '3.8s', opacity: 0.7 }} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" strokeWidth="1.8">
              <circle cx="12" cy="12" r="3" fill="var(--accent-gold)" fillOpacity="0.4" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1l2.1-2.1M17 7l2.1-2.1" strokeLinecap="round" />
            </svg>
          </div>

          <nav className="mobile-slice-nav" aria-label="Điều hướng lát ký ức">
            <button type="button" aria-label="Lát trước" onClick={() => navigateSlices("prev")} disabled={stage === "hero"}>
              <ChevronLeft size={20} />
            </button>
            <div className="mobile-slice-nav-info">
              <span className="mobile-slice-nav-name">
                {stage === "finale" ? "Lời chúc" : stage === "hero" ? "Bắt đầu" : familyMemories[activeSlice].title}
              </span>
              <span className="mobile-slice-nav-dots">
                {familyMemories.map((_, i) => (
                  <span
                    key={i}
                    className={`mobile-nav-dot ${stage === "slices" && activeSlice === i ? "active" : ""}`}
                  />
                ))}
              </span>
            </div>
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <button type="button" aria-label="Lát tiếp theo" onClick={() => navigateSlices("next")} disabled={stage === "finale"}>
                <ChevronRight size={22} />
              </button>

              {stage === "slices" && (
                <motion.div
                  className="cloud-guide-wrapper nav-next-cloud-guide"
                  initial={{ opacity: 0, y: 8, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: 0.6, type: "spring", stiffness: 240, damping: 18 }}
                  onClick={() => navigateSlices("next")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="cloud-guide-bubble" style={{ border: '1.5px solid rgba(212, 151, 59, 0.45)', padding: '8px 16px' }}>
                    <span className="cloud-puff cloud-puff-1" />
                    <span className="cloud-puff cloud-puff-2" />
                    <span className="cloud-puff cloud-puff-3" />
                    <span className="cloud-guide-icon">🍰</span>
                    <span className="cloud-guide-text" style={{ fontSize: 13.5, fontWeight: 800, color: '#1F1A16' }}>
                      {activeSlice === familyMemories.length - 1 ? "Bấm xem lời chúc nè! 💌" : "Bấm nút này để xoay bánh nè! 🍰"}
                    </span>
                  </div>
                  <div className="cloud-guide-arrow-container">
                    <svg className="cloud-guide-tail" width="20" height="10" viewBox="0 0 20 10" fill="none">
                      <path d="M10 10L1 0C1 0 5 0 10 0C15 0 19 0 19 0L10 10Z" fill="#FFFFFF" />
                      <path d="M1 0L10 10L19 0" stroke="rgba(212, 151, 59, 0.45)" strokeWidth="1.6" />
                    </svg>
                    <motion.span
                      className="cloud-bouncing-pointer"
                      animate={{ y: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                      style={{ fontSize: 20 }}
                    >
                      👇
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </div>
          </nav>

          <AnimatePresence mode="wait">
            {stage === "hero" && (
              <motion.div key="hero-stage" className="hero-stage-overlay" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
                <div className="hero-content" style={{ color: 'var(--text-primary)' }}>
                  <motion.div className="hero-tag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><span className="section-kicker" style={{color:'var(--accent-gold)'}}><Sparkles size={12} style={{marginRight: 4}}/> A Poetic Birthday Celebration</span></motion.div>
                  <h1 className="hero-heading" style={{ color: 'var(--text-primary)' }}>
                    <TextMask>Một Lát Ngọt Ngào,</TextMask>
                    <TextMask delay={0.1}><em>Một Đời Ký Ức.</em></TextMask>
                  </h1>
                  <motion.p className="hero-description" style={{ color: 'var(--text-secondary)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
                    Thắp lên ngọn nến sinh nhật, thực hiện một điều ước nhỏ, và cùng mở lại từng thước phim quý giá về hành trình của gia đình.
                  </motion.p>
                  {!candleLit && (
                    <div className="btn-with-cloud-guide">
                      <CloudGuideBubble
                        text="Bấm vào đây để thắp nến nhé! ✨"
                        icon="🕯️"
                        onClick={() => { soundEngine.playMatchStrike(); setCandleLit(true); soundEngine.startBirthdayMusic(); setIsAudio(true); }}
                      />
                      <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="btn-light-candle" onClick={() => { soundEngine.playMatchStrike(); setCandleLit(true); soundEngine.startBirthdayMusic(); setIsAudio(true); }}>
                        <Flame size={18} style={{display:'inline', marginRight:8}}/> Thắp Ngọn Nến
                      </motion.button>
                    </div>
                  )}
                  {candleLit && !extinguished && (
                    <motion.div
                      className="mic-blow-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={triggerCelebration}
                      role="button"
                      tabIndex={0}
                      aria-label="Thổi nến hoặc chạm để tắt nến"
                    >
                      <div className="mic-audio-bars">{[0,1,2,3].map(i => <span key={i} style={{ height: 10 + intensity * (12 + i * 4) }} />)}</div>
                      <div className="mic-copy">
                        <strong><AudioLines size={16} style={{display:'inline', marginRight:6}} /> Thổi vào Micro hoặc Chạm ngọn nến</strong>
                        <small>Chạm trực tiếp ngọn lửa hoặc bấm vào đây để thổi nến nhé! 🎂</small>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {stage === "slices" && (
              <motion.div
                key={`slices-stage-${activeSlice}`}
                className="slice-narrative-overlay"
                style={{
                  '--chapter-accent': currentChapter.accentColor,
                  color: 'var(--text-primary)'
                } as React.CSSProperties}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ type: "spring", damping: 32, stiffness: 280 }}
              >
                <div className="chapter-meta">
                  <span className="chapter-pill">
                    <span>{currentChapter.icon}</span> Lát {currentChapter.sliceNumber} • {currentChapter.colorTag}
                  </span>
                </div>
                <h3 className="chapter-title">{currentChapter.title}</h3>
                <p className="chapter-subtitle">{currentChapter.subtitle}</p>

                {/* Poetic Stanza (Hữu Thịnh Inspiration) */}
                <div className="poetic-stanza">
                  <span className="poetic-line">“{currentChapter.poemVerse[0]}</span>
                  <span className="poetic-line">{currentChapter.poemVerse[1]}”</span>
                </div>

                <p className="chapter-desc">{currentChapter.description}</p>

                <div style={{ marginTop: 22 }}>
                  <button
                    className="btn-view-memories"
                    onClick={() => {
                      soundEngine.playPaperUnfold();
                      setFilmstripState({ index: activeSlice, fromBottom: false });
                    }}
                  >
                    <ImageIcon size={16} style={{display:'inline', marginRight:8, verticalAlign:'-2px'}} />
                    Xem Lại Album Ảnh
                  </button>
                </div>
              </motion.div>
            )}

            {stage === "finale" && (
              <motion.div key="finale-stage" className="finale-stage-overlay" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }} onAnimationComplete={() => soundEngine.playPaperUnfold()}>
                <article className="heartfelt-letter-card">
                  <div className="masking-tape" />
                  <div className="letter-header"><span className="section-kicker">Family & Friends</span><h2>Chúc Mừng Sinh Nhật,<br/><em>Người Thương Yêu!</em></h2></div>
                  <p className="letter-body">4 lát bánh ngọt ngào đã được sẻ chia. Mong tuổi mới của gia đình ta luôn tràn ngập tiếng cười, bình an và luôn có nhau trên mọi chặng đường.</p>
                  <span className="letter-signature">Với tất cả tình yêu thương ❤️</span>
                  {noteContent && <div style={{ marginTop: 32, padding: "24px", background: "rgba(0,0,0,0.02)", border: "1px dashed rgba(0,0,0,0.1)", textAlign: "center" }}><strong style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", display: "block", margin: "0 0 8px 0" }}>Lời nhắn của bạn</strong><p className="handwritten" style={{margin: 0}}>"{noteContent}"</p></div>}
                  <div className="letter-actions">
                    <button className="action-text-btn" onClick={handleReplay}><RotateCcw size={12} style={{display:'inline', marginRight:6}}/> Chơi Lại</button>
                    <button className="action-text-btn" onClick={() => setShowNoteModal(true)}><Mail size={12} style={{display:'inline', marginRight:6}}/> Lời Chúc</button>
                  </div>
                </article>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showNoteModal && (
          <motion.div className="note-modal-backdrop" style={{position:'fixed', inset:0, zIndex:100, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center'}} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNoteModal(false)}>
            <motion.form className="note-modal-card" style={{background:'#FFF', padding:40, borderRadius:16, width:400, position:'relative'}} initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={e => e.stopPropagation()} onSubmit={(e) => { e.preventDefault(); soundEngine.playPaperUnfold(); localStorage.setItem("birthday-wish", noteContent); setShowNoteModal(false); setToast("Đã lưu lời chúc của bạn!"); }}>
              <button type="button" style={{position:'absolute', top:16, right:16, background:'none', border:'none', cursor:'pointer'}} onClick={() => setShowNoteModal(false)}><X size={20} /></button>
              <h2 style={{fontFamily:'var(--font-serif)', fontSize:24, marginTop:0}}>Gửi Gắm Yêu Thương</h2>
              <textarea style={{width:'100%', padding:12, boxSizing:'border-box', border:'1px solid #ccc', borderRadius:8, fontFamily:'var(--font-sans)', fontSize:14}} value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Viết một lời chúc nhỏ..." rows={4} autoFocus />
              <button type="submit" style={{width:'100%', padding:12, background:'var(--text-primary)', color:'#fff', border:'none', borderRadius:8, marginTop:16, fontWeight:600, cursor:'pointer'}}>Lưu Lời Chúc</button>
            </motion.form>
          </motion.div>
        )}

        {filmstripState !== null && (
          <FilmstripModal
            key={filmstripState.index}
            chapter={familyMemories[filmstripState.index]} fromBottom={filmstripState.fromBottom}
            reducedMotion={prefersReducedMotion}
            isLastChapter={filmstripState.index === familyMemories.length - 1}
            onAdvanceChapter={() => advanceFromFilmstrip(filmstripState.index)}
            onClose={() => setFilmstripState(null)}
          />
        )}

        {toast && <motion.div style={{position:'fixed', bottom:32, right:32, zIndex:100, background:'#111', color:'#fff', padding:'12px 24px', borderRadius:30, fontSize:13, fontWeight:600}} initial={{ opacity: 0, y: 20, x: 20 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: 20, x: 20 }} onAnimationComplete={() => setTimeout(() => setToast(""), 2500)}>{toast}</motion.div>}
      </AnimatePresence>
    </main>
  );
}
