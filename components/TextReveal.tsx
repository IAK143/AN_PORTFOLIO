import React from 'react';
import { motion } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({ children, className = "", delay = 0 }) => {
  const words = children.split(" ");

  // Variants for individual characters
  const charVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: delay + i * 0.03,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9], // Custom cubic-bezier for "Awwwards" feel
      },
    }),
  };

  return (
    <h1 className={`overflow-hidden flex flex-wrap gap-x-[0.25em] gap-y-2 ${className}`} aria-label={children}>
      {words.map((word, i) => {
        // Calculate a base index for characters in this word to maintain global stagger order
        const previousCharsCount = words.slice(0, i).join(" ").length;
        
        return (
          <span key={i} className="inline-flex overflow-hidden">
            {word.split("").map((char, j) => (
              <motion.span
                key={j}
                custom={previousCharsCount + j}
                variants={charVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
        );
      })}
    </h1>
  );
};