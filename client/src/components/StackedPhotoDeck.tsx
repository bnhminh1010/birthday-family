import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";
import { useState } from "react";
import type { SliceChapter } from "@/data/familyMemories";
import { soundEngine } from "@/lib/soundEngine";

export function ShimmerImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="img-shimmer" style={{ width: "100%", height: "100%", borderRadius: "inherit" }}>
      <img src={src} alt={alt} data-loaded={loaded} onLoad={() => setLoaded(true)} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }} />
    </div>
  );
}

export default function StackedPhotoDeck({ chapter, onOpenFilmstrip }: { chapter: SliceChapter; onOpenFilmstrip: () => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { damping: 20, stiffness: 200 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { damping: 20, stiffness: 200 });

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handlePointerLeave = () => { mouseX.set(0); mouseY.set(0); setIsHovered(false); };

  const photos = chapter.photos;
  const card1 = photos[0]?.image || chapter.coverPhoto;
  const card2 = photos[1]?.image || photos[0]?.image || chapter.coverPhoto;
  const card3 = photos[2]?.image || chapter.coverPhoto;

  return (
    <motion.div
      onPointerMove={handlePointerMove} onPointerEnter={() => { setIsHovered(true); soundEngine.playPaperUnfold(); }} onPointerLeave={handlePointerLeave} onClick={() => { soundEngine.playShutterClick(); onOpenFilmstrip(); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", width: "100%", height: "100%" }}
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div className="deck-card" animate={isHovered ? { rotate: -16, x: -32, y: 8, scale: 0.92 } : { rotate: -8, x: -10, y: 0, scale: 0.92 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
        <div style={{ borderRadius: 4, overflow: "hidden", height: "calc(100% - 4px)" }}><ShimmerImage src={card3} alt="" /></div>
        <span className="deck-tape-label">Lát {chapter.sliceNumber} • P.3</span>
      </motion.div>

      <motion.div className="deck-card" animate={isHovered ? { rotate: 14, x: 28, y: -6, scale: 0.96 } : { rotate: 6, x: 8, y: -2, scale: 0.96 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
        <div style={{ borderRadius: 4, overflow: "hidden", height: "calc(100% - 4px)" }}><ShimmerImage src={card2} alt="" /></div>
        <span className="deck-tape-label">Lát {chapter.sliceNumber} • P.2</span>
      </motion.div>

      <motion.div className="deck-card" animate={isHovered ? { rotate: -2, y: -12, scale: 1.02 } : { rotate: -1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }}>
        <div style={{ borderRadius: 4, overflow: "hidden", height: "calc(100% - 40px)" }}><ShimmerImage src={card1} alt="" /></div>
        <div className="card-caption-strip">
          <p className="card-title">{chapter.title}</p>
          <span className="card-tag">{photos.length} Khung Hình</span>
        </div>
        <div className="card-cta-bubble"><Sparkles size={13} /><span>Mở dải phim</span><Camera size={13} /></div>
      </motion.div>
    </motion.div>
  );
}
