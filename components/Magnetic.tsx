import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

interface MagneticProps {
  children: React.ReactElement;
  strength?: number; // How far it moves. Default 1.
}

export const Magnetic: React.FC<MagneticProps> = ({ children, strength = 1 }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth spring physics for the magnetic effect
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    if (ref.current) {
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        
        // Move the element towards the mouse
        x.set(middleX * strength);
        y.set(middleY * strength);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      className="inline-block"
    >
      {React.cloneElement(children, {
        className: `${children.props.className || ''} inline-block`,
      })}
    </motion.div>
  );
};