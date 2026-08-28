import { motion } from "framer-motion";
import { X, Projector, Film } from "lucide-react";
import { useRef, useEffect } from "react";
import { soundEngine } from "@/lib/soundEngine";
import { useIsMobile } from "@/hooks/useMobile";

interface FilmstripModalProps {
  chapter: any;
  fromBottom?: boolean;
  reducedMotion?: boolean;
  onClose: () => void;
}

export default function FilmstripModal({ chapter, fromBottom = false, reducedMotion = false, onClose }: FilmstripModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mobile = useIsMobile();

  useEffect(() => {
    soundEngine.playProjector();
    return () => soundEngine.stopProjector();
  }, []);

  useEffect(() => {
    const ref = containerRef.current;
    if (!ref) return;

    // Each chapter owns an independent filmstrip position. Without this
    // reset, advancing from the last frame reuses the previous chapter's
    // scrollTop and makes the new chapter appear to start at its last photo.
    const resetPosition = () => {
      ref.scrollTop = fromBottom ? ref.scrollHeight : 0;
    };
    resetPosition();

    // On touch screens the filmstrip is a self-contained viewer. Closing it
    // at the scroll boundary lets the gesture leak into the page and jump to
    // the next cake slice before the user can read the last frame.
    if (reducedMotion || mobile) return;

    if (fromBottom) setTimeout(resetPosition, 50);

    let isClosing = false; 
    let canClose = false;
    let isAutoScrolling = true;
    let autoScrollRaf: number;
    
    const graceTimer = setTimeout(() => { canClose = true; }, 700);

    // Cinematic Auto-scroll loop
    const loop = () => {
      if (!isAutoScrolling || !ref) return;
      
      // Auto-scroll speed
      ref.scrollTop += fromBottom ? -1 : 1;
      
      const { scrollTop, scrollHeight, clientHeight } = ref;
      
      // Check if reached bounds
      if (!fromBottom && scrollTop + clientHeight >= scrollHeight - 2) {
        if (!isClosing && canClose) {
          isClosing = true;
          onClose();
        }
        return;
      }
      
      if (fromBottom && scrollTop <= 2) {
        if (!isClosing && canClose) {
          isClosing = true;
          onClose();
        }
        return;
      }
      
      autoScrollRaf = requestAnimationFrame(loop);
    };

    // Wait 1.5s before starting auto-scroll so user can orient themselves
    const startScrollTimer = setTimeout(() => {
      autoScrollRaf = requestAnimationFrame(loop);
    }, 1500);

    const stopAutoScroll = () => {
      isAutoScrolling = false;
      cancelAnimationFrame(autoScrollRaf);
    };

    const handleWheel = (e: WheelEvent) => {
      stopAutoScroll();
      if (isClosing || !canClose) return;
      const { scrollTop, scrollHeight, clientHeight } = ref;
      
      if (e.deltaY > 0 && scrollTop + clientHeight >= scrollHeight - 5) {
        isClosing = true; onClose();
      } else if (e.deltaY < 0 && scrollTop <= 5) {
        isClosing = true; onClose();
      }
    };

    ref.addEventListener('wheel', handleWheel, { passive: true });
    
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { 
      stopAutoScroll();
      touchStartY = e.touches[0].clientY; 
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (isClosing || !canClose) return;
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const { scrollTop, scrollHeight, clientHeight } = ref;
      
      if (deltaY > 0 && scrollTop + clientHeight >= scrollHeight - 5) {
        isClosing = true; onClose();
      } else if (deltaY < 0 && scrollTop <= 5) {
        isClosing = true; onClose();
      }
    };

    ref.addEventListener('touchstart', handleTouchStart, { passive: true });
    ref.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => { 
      clearTimeout(graceTimer);
      clearTimeout(startScrollTimer);
      stopAutoScroll();
      ref.removeEventListener('wheel', handleWheel); 
      ref.removeEventListener('touchstart', handleTouchStart);
      ref.removeEventListener('touchmove', handleTouchMove);
    };
  }, [onClose, fromBottom, reducedMotion, mobile]);

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
          <g fill="#777">
            {/* Stand */}
            <polygon points="35,80 65,80 75,95 25,95" />
            <rect x="45" y="70" width="10" height="10" />
            
            {/* Main Body */}
            <rect x="25" y="35" width="50" height="35" rx="5" />
            <rect x="35" y="42" width="30" height="20" fill="#777" />
            
            {/* Lens */}
            <polygon points="75,45 95,40 95,65 75,60" />
            <rect x="95" y="38" width="5" height="29" rx="2" />
            
            {/* Film Reels */}
            <circle cx="35" cy="20" r="18" fill="#777" />
            <circle cx="35" cy="20" r="4" fill="#777" />

            <circle cx="70" cy="15" r="14" fill="#777" />
            <circle cx="70" cy="15" r="3" fill="#777" />
            
            {/* Connecting film strip */}
            <path d="M35 38 Q 50 25 70 29" fill="none" stroke="#777" strokeWidth="3" />
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
          <button className="fs-close-btn" aria-label="Đóng album ký ức" onClick={onClose}><X size={20} /></button>
          
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
          
          <div style={{ height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', padding: '0 20px' }}>
            {fromBottom ? 'Trượt xuống để đóng' : 'Trượt tiếp để đóng'}
          </div>
        </div>

        <div className="fs-edge right">
          <div className="fs-edge-markings" style={{ top: '60%' }}>12A</div>
        </div>
      </motion.aside>
    </>
  );
}
