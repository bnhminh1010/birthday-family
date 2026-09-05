import { motion } from "framer-motion";

interface CloudGuideBubbleProps {
  text: string;
  icon?: string;
  pointerEmoji?: string;
  onClick?: () => void;
}

export default function CloudGuideBubble({
  text,
  icon = "✨",
  pointerEmoji = "👇",
  onClick
}: CloudGuideBubbleProps) {
  return (
    <motion.div
      className="cloud-guide-wrapper"
      initial={{ opacity: 0, y: 10, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: 0.4, type: "spring", stiffness: 240, damping: 18 }}
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="cloud-guide-bubble">
        <span className="cloud-puff cloud-puff-1" />
        <span className="cloud-puff cloud-puff-2" />
        <span className="cloud-puff cloud-puff-3" />
        <span className="cloud-guide-icon">{icon}</span>
        <span className="cloud-guide-text">{text}</span>
      </div>
      <div className="cloud-guide-arrow-container">
        <svg className="cloud-guide-tail" width="22" height="11" viewBox="0 0 22 11" fill="none">
          <path d="M11 11L1 0C1 0 6 0 11 0C16 0 21 0 21 0L11 11Z" fill="#FFFFFF" />
          <path d="M1 0L11 11L21 0" stroke="rgba(212, 151, 59, 0.45)" strokeWidth="1.6" />
        </svg>
        <motion.span
          className="cloud-bouncing-pointer"
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
        >
          {pointerEmoji}
        </motion.span>
      </div>
    </motion.div>
  );
}
