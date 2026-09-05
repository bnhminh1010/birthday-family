import { motion } from "framer-motion";
import { X, Projector, Film, Play, Pause } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { soundEngine } from "@/lib/soundEngine";
import { useIsMobile } from "@/hooks/useMobile";

interface FilmstripModalProps {
  chapter: any;
  fromBottom?: boolean;
  reducedMotion?: boolean;
  isLastChapter?: boolean;
  onClose: () => void;
  onAdvanceChapter?: () => void;
}

export default function FilmstripModal({ chapter, fromBottom = false, reducedMotion = false, isLastChapter = false, onClose, onAdvanceChapter }: FilmstripModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    soundEngine.playProjector();
    return () => soundEngine.stopProjector();
  }, []);

  // Cinematic Auto-scroll photo reel loop with frame-rate independent speed
  useEffect(() => {
    const ref = containerRef.current;
    if (!ref || reducedMotion) return;

    ref.scrollTop = fromBottom ? ref.scrollHeight : 0;

    let rafId: number;
    let isUserPaused = false;
    let isRewinding = false;
    let userResumeTimer: NodeJS.Timeout;
    let rewindTimer: NodeJS.Timeout;
    let lastTime = performance.now();

    let touchStartX = 0;
    let touchStartY = 0;

    const handleUserInteraction = () => {
      isUserPaused = true;
      clearTimeout(userResumeTimer);
      userResumeTimer = setTimeout(() => {
        isUserPaused = false;
        lastTime = performance.now();
      }, 3500);
    };

    const handleTouchStart = (e: TouchEvent) => {
      handleUserInteraction();
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      // Fluid native swipe right to dismiss album back to cake
      if (deltaX > 70 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
        onClose();
      }
    };

    ref.addEventListener('wheel', handleUserInteraction, { passive: true });
    ref.addEventListener('touchstart', handleTouchStart, { passive: true });
    ref.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Speed in pixels per second: ~48px/s mobile, ~56px/s desktop
    const pxPerSecond = mobile ? 48 : 56;

    // Start auto-rolling film after modal opening transition
    const startDelay = setTimeout(() => {
      lastTime = performance.now();
      const step = (now: number) => {
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        if (ref && isPlaying && !isUserPaused && !isRewinding) {
          const maxScroll = ref.scrollHeight - ref.clientHeight;
          if (ref.scrollTop < maxScroll - 4) {
            ref.scrollTop += pxPerSecond * dt;
          } else {
            // Reached bottom: pause 2.5s, then smooth rewind to top and resume
            isRewinding = true;
            rewindTimer = setTimeout(() => {
              if (ref) {
                ref.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(() => {
                  isRewinding = false;
                  lastTime = performance.now();
                }, 1200);
              } else {
                isRewinding = false;
              }
            }, 2500);
          }
        }
        rafId = requestAnimationFrame(step);
      };
      rafId = requestAnimationFrame(step);
    }, 600);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(userResumeTimer);
      clearTimeout(rewindTimer);
      cancelAnimationFrame(rafId);
      ref.removeEventListener('wheel', handleUserInteraction);
      ref.removeEventListener('touchstart', handleTouchStart);
      ref.removeEventListener('touchend', handleTouchEnd);
    };
  }, [fromBottom, reducedMotion, mobile, isPlaying, onClose]);

  return (
    <>
      <motion.div
        className="filmstrip-sidebar-backdrop" data-lenis-prevent="true"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />


      {/* Vintage Projector Machine Dropping from top-left */}
      <motion.div
        className="vintage-projector-machine"
        initial={{ y: -150, rotate: -25, opacity: 0 }}
        animate={{ y: 0, rotate: -5, opacity: 1 }}
        exit={{ y: -150, rotate: -25, opacity: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        style={{
          position: 'fixed',
          top: 10,
          left: 20,
          zIndex: 65,
          color: '#777',
          filter: 'drop-shadow(0 8px 12px rgba(0,0,0,0.75))',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4
        }}
      >
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="190" height="190">
          <g fill="#4A3D32">
            {/* Stand */}
            <polygon points="35,80 65,80 75,95 25,95" />
            <rect x="45" y="70" width="10" height="10" />

            {/* Main Body */}
            <rect x="25" y="35" width="50" height="35" rx="5" />
            <rect x="35" y="42" width="30" height="20" fill="#4A3D32" />

            {/* Lens */}
            <polygon points="75,45 95,40 95,65 75,60" />
            <rect x="95" y="38" width="5" height="29" rx="2" />

            {/* Film Reels */}
            <circle cx="35" cy="20" r="18" fill="#4A3D32" />
            <circle cx="35" cy="20" r="4" fill="#4A3D32" />

            <circle cx="70" cy="15" r="14" fill="#4A3D32" />
            <circle cx="70" cy="15" r="3" fill="#4A3D32" />

            {/* Connecting film strip */}
            <path d="M35 38 Q 50 25 70 29" fill="none" stroke="#4A3D32" strokeWidth="3" />
          </g>
        </svg>
      </motion.div>

      {/* Cinematic Projector Beam emanating from the lens */}
      <motion.div
        className="projector-beam"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="projector-dust"></div>
      </motion.div>


      <motion.aside
        className="fs-master-container"
        role="dialog"
        aria-modal="true"
        aria-label={`Album ký ức: ${chapter.title}`}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        <div className="fs-edge left">
          <div className="fs-edge-markings">KODAK PORTRA 400</div>
        </div>

        <div className="fs-content-col" ref={containerRef} data-lenis-prevent="true">
          <div style={{ position: 'absolute', top: 20, right: 24, zIndex: 70, display: 'flex', gap: 10, alignItems: 'center' }}>
            <button
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: '1.5px solid rgba(0,0,0,0.08)',
                color: '#111',
                height: 40,
                padding: '0 15px',
                borderRadius: 22,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(0,0,0,0.12)'
              }}
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? "Tạm dừng chạy ảnh" : "Tự động chạy ảnh"}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? "Tạm dừng" : "Tự chạy"}</span>
            </button>

            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <button
                className="fs-close-btn"
                style={{
                  position: 'static',
                  width: 42,
                  height: 42,
                  background: 'rgba(255,255,255,0.95)',
                  color: '#111',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
                  cursor: 'pointer'
                }}
                aria-label="Đóng album ký ức"
                onClick={onClose}
              >
                <X size={22} strokeWidth={2.5} />
              </button>

              {/* Cloud guide pointing up to the X button */}
              <motion.div
                className="cloud-guide-wrapper fs-close-guide-bubble"
                initial={{ opacity: 0, y: -8, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 240, damping: 18 }}
                onClick={onClose}
                style={{ cursor: "pointer" }}
              >
                <div className="cloud-guide-arrow-container" style={{ order: -1, marginBottom: -2, marginRight: 11 }}>
                  <motion.span
                    className="cloud-bouncing-pointer"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
                    style={{ fontSize: 20 }}
                  >
                    👆
                  </motion.span>
                  <svg className="cloud-guide-tail" width="20" height="10" viewBox="0 0 20 10" fill="none" style={{ transform: 'rotate(180deg)' }}>
                    <path d="M10 10L1 0C1 0 5 0 10 0C15 0 19 0 19 0L10 10Z" fill="#FFFFFF" />
                    <path d="M1 0L10 10L19 0" stroke="rgba(212, 151, 59, 0.45)" strokeWidth="1.6" />
                  </svg>
                </div>
                <div className="cloud-guide-bubble" style={{ border: '1.5px solid rgba(212, 151, 59, 0.45)', padding: '8px 16px', boxShadow: '0 10px 28px -4px rgba(0, 0, 0, 0.25)' }}>
                  <span className="cloud-puff cloud-puff-1" />
                  <span className="cloud-puff cloud-puff-2" />
                  <span className="cloud-puff cloud-puff-3" />
                  <span className="cloud-guide-icon">🍰</span>
                  <span className="cloud-guide-text" style={{ fontSize: 13.5, fontWeight: 800, color: '#1F1A16' }}>
                    Bấm nút ✕ để quay lại bánh nhé!
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 40, marginTop: 40 }}>
            <span style={{ color: chapter.accentColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Lát {chapter.sliceNumber}
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: '#fff', fontSize: 28, margin: '8px 0 0 0' }}>{chapter.title}</h3>
          </div>

          {chapter.photos.map((photo: any, i: number) => (
            <motion.div
              key={photo.id}
              className="fs-photo-card dark-theme"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.1 }}
            >
              <img src={photo.image} alt={photo.alt} crossOrigin="anonymous" loading="lazy" />
              <div className="fs-photo-meta">
                <h4>{photo.title}</h4>
                <p>{photo.caption}</p>
                <span className="fs-frame-code">{photo.frameCode}</span>
              </div>
            </motion.div>
          ))}

          <div style={{ padding: '40px 20px 60px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: chapter.accentColor }}>
              {isLastChapter ? 'Hoàn thành chuyến hành trình ký ức ✨' : `Hết ảnh lát: ${chapter.title}`}
            </span>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  color: '#FFF',
                  padding: '12px 22px',
                  borderRadius: 30,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }}
              >
                <span>🍰 Quay lại ngắm bánh</span>
              </button>

              {onAdvanceChapter && (
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playCakeSliceClink();
                    onAdvanceChapter();
                  }}
                  style={{
                    background: chapter.accentColor,
                    border: 'none',
                    color: '#FFF',
                    padding: '12px 24px',
                    borderRadius: 30,
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    boxShadow: `0 6px 20px ${chapter.accentColor}66`
                  }}
                >
                  <span>{isLastChapter ? 'Xem lời chúc mừng 💌' : 'Sang lát tiếp theo ›'}</span>
                </button>
              )}
            </div>

            <span style={{ fontSize: 11.5, color: '#888', marginTop: 4 }}>
              Hoặc bấm nút [ ✕ ] ở trên góc phải để quay lại
            </span>
          </div>
        </div>

        <div className="fs-edge right">
          <div className="fs-edge-markings" style={{ top: '60%' }}>12A</div>
        </div>
      </motion.aside>
    </>
  );
}
