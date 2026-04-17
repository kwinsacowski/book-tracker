import Link from "next/link";
import { motion } from "motion/react";

interface BookSpineProps {
  id: string | number;
  title: string;
  author: string;
  color?: string;
  height?: number;
  width?: number;
}

export default function BookSpine({
  id,
  title,
  author,
  color = "#6f4e37",
  height = 180,
  width = 56,
}: BookSpineProps) {
  return (
    <Link
      href={`/library/${id}`}
      style={{
        textDecoration: "none",
        display: "inline-flex",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: color,
          color: "#fffaf3",
          borderRadius: "8px 8px 0 0",
          padding: "10px 6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          cursor: "pointer",
        }}
      >
        <span>{title}</span>
        {author && <span style={{ fontSize: "10px" }}>{author}</span>}
      </motion.div>
    </Link>
  );
}