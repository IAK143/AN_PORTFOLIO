import React from 'react';
import { motion } from 'framer-motion';
import { Skill } from '../types';

export const SkillBar: React.FC<{ skill: Skill; index: number }> = ({ skill, index }) => {
  return (
    <div className="mb-8 group">
      <div className="flex justify-between items-end mb-3">
        <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors">{skill.name}</span>
        <span className="text-xs font-mono text-neutral-600 group-hover:text-blue-400 transition-colors">
            {skill.level < 100 ? `0${skill.level}` : skill.level}%
        </span>
      </div>
      <div className="w-full h-[2px] bg-neutral-900 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ 
              type: "spring", 
              stiffness: 50, 
              damping: 20, 
              delay: index * 0.1 
          }}
          className="h-full bg-neutral-200 relative"
        >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-blue-500 blur-[8px] opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      </div>
    </div>
  );
};