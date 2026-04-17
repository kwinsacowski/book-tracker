"use client";

import { motion } from "framer-motion";

type BookSpineProps = {
  title: string;
  author?: string;
  color?: string;
  height?: number;
  width?: number;
};

export default function BookSpine({
  title,
  author,
  color = "#6f4e37",
  height = 180,
  width = 56,
}: BookSpineProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -8 }}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: `linear-gradient(to right, ${color}, ${color})`,
        color: "#fffaf3",
        borderRadius: "8px 8px 0 0",
        borderLeft: "1px solid rgba(255,255,255,0.18)",
        borderRight: "1px solid rgba(0,0,0,0.18)",
        boxShadow: "2px 4px 10px rgba(0,0,0,0.18)",
        padding: "10px 6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        writingMode: "vertical-rl",
        transform: "rotate(180deg)",
        flexShrink: 0,
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontSize: "12px",
          fontWeight: 700,
          lineHeight: 1.1,
          textAlign: "center",
        }}
      >
        {title}
      </span>

      {author ? (
        <span
          style={{
            fontSize: "10px",
            opacity: 0.8,
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          {author}
        </span>
      ) : null}
    </motion.div>
  );
}
