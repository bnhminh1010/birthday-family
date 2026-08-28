import { AnimatePresence, motion, useScroll, useSpring, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { AudioLines, CakeSlice as CakeSliceIcon, ChevronLeft, ChevronRight, Flame, Mail, RotateCcw, Sparkles, Volume2, VolumeX, X, Image as ImageIcon } from "lucide-react";
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import Lenis from "lenis";
import FilmstripModal from "@/components/FilmstripModal";
import { familyMemories } from "@/data/familyMemories";
import { useBlowDetector } from "@/hooks/useBlowDetector";
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

  const triggerCelebration = useCallback(() => {
    if (extinguished) return;
    setExtinguished(true); soundEngine.playFlameSnuff(); soundEngine.playConfettiPop();
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 }, colors: ["#C6952B", "#B53B3B", "#3D8B7A"] });
  }, [extinguished]);

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
    const lenis = new Lenis({ lerp: 0.05, smoothWheel: true });
    lenisRef.current = lenis;
    
    let scrollTimeout: NodeJS.Timeout;
    lenis.on('scroll', () => {
      clearTimeout(scrollTimeout);
      // When scroll stops for 300ms, trigger custom event
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

  // Removed lenis.stop() to allow smooth scrolling to finish after modal opens


  const { scrollYProgress } = useScroll({ target: scrollRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 25, restDelta: 0.001 });

  const [activeSlice, setActiveSlice] = useState(0);
  const [stage, setStage] = useState<"hero"|"centering"|"slices"|"finale">("hero");
  const prefersReducedMotion = useReducedMotion() ?? false;

  const navigateSlices = useCallback((direction: "next" | "prev") => {
    const p = smoothProgress.get();
    const targets = [0, 0.34, 0.50, 0.65, 0.81, 1.0];
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const target = direction === "next"
      ? targets.find((value) => value > p + 0.05) ?? 1
      : [...targets].reverse().find((value) => value < p - 0.05) ?? 0;
    lenisRef.current?.scrollTo(target * maxScroll, { duration: 1.1 });
  }, [smoothProgress]);

  // Auto-open filmstrip instantly when reaching a slice
  const prevSliceRef = useRef(-1);
  useEffect(() => {
    prevSliceRef.current = activeSlice;
  }, [activeSlice]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const isFinalSlice = activeSlice === familyMemories.length - 1;
    const canOpenFromStage = stage === "slices" || (stage === "finale" && isFinalSlice);

    if (canOpenFromStage && activeSlice !== lastOpenedSlice && !isRewinding.current) {
      // Open the final slice immediately so a fast scroll cannot skip its filmstrip
      // while the page transitions into the finale stage.
      timer = setTimeout(() => {
        const isScrollingUp = activeSlice < prevSliceRef.current;
        setFilmstripState({ index: activeSlice, fromBottom: isScrollingUp });
        setLastOpenedSlice(activeSlice);
      }, isFinalSlice ? 0 : 400);
    } else if (stage !== "slices" && !isFinalSlice) {
      setLastOpenedSlice(-1);
    }
    return () => clearTimeout(timer);
  }, [activeSlice, stage, lastOpenedSlice]);

  
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
      <header className="site-navbar">
        <div className="brand-logo" style={{cursor: "pointer"}} onClick={handleReplay}><span className="brand-icon"><CakeSliceIcon size={15} strokeWidth={2.2} /></span><div className="brand-text" style={{color: 'var(--text-primary)'}}>The Sweetest<em style={{color: 'var(--accent-berry)'}}>Slices</em></div></div>
        <button className="sound-toggle-btn" style={{color: 'var(--text-primary)'}} onClick={() => setIsAudio(soundEngine.toggleBirthdayMusic())}>
          {isAudio ? <Volume2 size={16} /> : <VolumeX size={16} />} <span>{isAudio ? "Music ON" : "Music OFF"}</span>
        </button>
      </header>

      <div className="chapter-progress" aria-label="Tiến trình album ký ức">
        <span className="chapter-progress-label">{stage === "finale" ? "Lời chúc" : stage === "slices" ? `Lát ${currentChapter.sliceNumber} / ${familyMemories.length}` : "Album ký ức"}</span>
        <div className="chapter-progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={chapterProgress}>
          <span style={{ width: `${chapterProgress}%` }} />
        </div>
      </div>

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

          <nav className="mobile-slice-nav" aria-label="Điều hướng lát ký ức">
            <button type="button" aria-label="Lát trước" onClick={() => navigateSlices("prev")} disabled={stage === "hero"}>
              <ChevronLeft size={20} />
            </button>
            <span>{stage === "finale" ? "Kết thúc" : `Lát ${activeSlice + 1} / ${familyMemories.length}`}</span>
            <button type="button" aria-label="Lát tiếp theo" onClick={() => navigateSlices("next")} disabled={stage === "finale"}>
              <ChevronRight size={20} />
            </button>
          </nav>

          <AnimatePresence mode="wait">
            {stage === "hero" && (
              <motion.div key="hero-stage" className="hero-stage-overlay" exit={{ opacity: 0, transition: { duration: 0.5 } }}>
                <div className="hero-content" style={{ color: 'var(--text-primary)' }}>
                  <motion.div className="hero-tag" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><span className="section-kicker" style={{color:'var(--accent-berry)'}}><Sparkles size={12} style={{marginRight: 4}}/> A Cinematic Memory Ritual</span></motion.div>
                  <h1 className="hero-heading" style={{ color: 'var(--text-primary)' }}>
                    <TextMask>Một Lát Ngọt Ngào,</TextMask>
                    <TextMask delay={0.1}><em>Một Đời Ký Ức.</em></TextMask>
                  </h1>
                  <motion.p className="hero-description" style={{ color: 'rgba(44,44,44,0.72)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
                    Thắp lên ngọn nến sinh nhật, thực hiện một điều ước nhỏ, và cùng mở lại từng thước phim quý giá về hành trình của gia đình.
                  </motion.p>
                  {!candleLit && (
                    <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="btn-light-candle" onClick={() => { soundEngine.playMatchStrike(); setCandleLit(true); soundEngine.startBirthdayMusic(); setIsAudio(true); }}>
                      <Flame size={16} style={{display:'inline', marginRight:6}}/> Thắp Ngọn Nến
                    </motion.button>
                  )}
                  {candleLit && !extinguished && (
                    <motion.div className="mic-blow-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="mic-audio-bars">{[0,1,2,3].map(i => <span key={i} style={{ height: 8 + intensity * (10 + i * 4) }} />)}</div>
                      <div className="mic-copy"><strong><AudioLines size={14} style={{display:'inline', marginRight:4}} /> Thổi mạnh vào Micro</strong><small>{blowStatus === "listening" ? "Micro đang hoạt động • Hoặc chạm vào ngọn lửa" : "Chưa cấp quyền micro • Hoặc chạm vào ngọn lửa"}</small></div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          
            {stage === "slices" && (
              <motion.div key={`slices-stage-${activeSlice}`} className="slice-narrative-overlay" style={{ color: 'var(--text-primary)' }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}>
                <div className="chapter-meta"><span className="chapter-pill" style={{ color: currentChapter.accentColor }}>Lát {currentChapter.sliceNumber} • {currentChapter.colorTag}</span></div>
                <h3 className="chapter-title" style={{ color: 'var(--text-primary)' }}>{currentChapter.title}</h3>
                <p className="chapter-subtitle" style={{ color: 'var(--accent-berry)' }}>{currentChapter.subtitle}</p>
                <p className="chapter-desc" style={{ color: 'rgba(44,44,44,0.72)' }}>{currentChapter.description}</p>
                
                <button 
                  className="btn-view-memories"
                  onClick={() => {
                  soundEngine.playPaperUnfold();
                  setFilmstripState({ index: activeSlice, fromBottom: false });
                }}
                >
                  <ImageIcon size={14} style={{display:'inline', marginRight:6, verticalAlign:'-2px'}} />
                  Xem Ký Ức
                </button>
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
            chapter={familyMemories[filmstripState.index]} fromBottom={filmstripState.fromBottom} 
            reducedMotion={prefersReducedMotion}
            onClose={() => setFilmstripState(null)} 
          />
        )}
      
        {toast && <motion.div style={{position:'fixed', bottom:32, right:32, zIndex:100, background:'#111', color:'#fff', padding:'12px 24px', borderRadius:30, fontSize:13, fontWeight:600}} initial={{ opacity: 0, y: 20, x: 20 }} animate={{ opacity: 1, y: 0, x: 0 }} exit={{ opacity: 0, y: 20, x: 20 }} onAnimationComplete={() => setTimeout(() => setToast(""), 2500)}>{toast}</motion.div>}
      </AnimatePresence>
    </main>
  );
}
