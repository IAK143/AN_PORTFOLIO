import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Project } from '../types';
import { ExternalLink, ArrowRight, Layers, Box, X } from 'lucide-react';
import { Magnetic } from './Magnetic';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Spotlight Interaction Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
        onClick={() => setIsOpen(true)}
        onMouseMove={handleMouseMove}
        className="group relative w-full h-[400px] cursor-pointer rounded-2xl bg-[#0a0a0a] border border-white/5 overflow-hidden flex flex-col"
      >
        {/* Spotlight Overlay */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                650px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.03),
                transparent 80%
              )
            `,
          }}
        />
        {/* Spotlight Border */}
        <motion.div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
              radial-gradient(
                600px circle at ${mouseX}px ${mouseY}px,
                rgba(255, 255, 255, 0.1),
                transparent 40%
              )
            `,
          }}
        />

        <div className="relative h-full p-8 flex flex-col justify-between z-10">
            {/* Header */}
            <div className="flex justify-between items-start">
               <div className="flex flex-col gap-4">
                  <span className={`w-fit px-2 py-1 text-[9px] uppercase tracking-widest font-medium rounded border ${
                    project.status === 'Live' ? 'border-green-500/20 text-green-400 bg-green-500/5' :
                    project.status === 'Active' ? 'border-blue-500/20 text-blue-400 bg-blue-500/5' :
                    'border-amber-500/20 text-amber-400 bg-amber-500/5'
                  }`}>
                    {project.status}
                  </span>
                  <h3 className="text-3xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">{project.name}</h3>
               </div>
               <Magnetic strength={0.2}>
                   <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-neutral-500 group-hover:bg-white group-hover:text-black transition-all duration-300">
                      <ArrowRight size={18} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                   </div>
               </Magnetic>
            </div>

            {/* Description & Tech */}
            <div>
               <p className="text-neutral-500 text-sm leading-relaxed mb-8 line-clamp-3 group-hover:text-neutral-400 transition-colors">
                 {project.description}
               </p>
               <div className="flex flex-wrap gap-2">
                 {project.techStack.slice(0, 3).map((tech, i) => (
                   <span key={i} className="text-[10px] font-mono text-neutral-600 border border-white/5 bg-white/5 px-2 py-1 rounded">
                      {tech}
                   </span>
                 ))}
              </div>
            </div>
        </div>
      </motion.div>

      {/* Modal / Expanded View */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-lg"
            />
            <motion.div
              layoutId={`card-${project.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl bg-[#090909] border border-white/10 rounded-3xl p-8 md:p-16 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto hide-scrollbar"
            >
              {/* Modal Background Glow */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                   <div>
                      <span className="text-blue-500 text-xs font-mono mb-4 block uppercase tracking-widest">Selected Work 0{index + 1}</span>
                      <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">{project.name}</h2>
                   </div>
                   <button 
                     onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                     className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                   >
                     <X size={24} />
                   </button>
                </div>
                
                <div className="grid md:grid-cols-[2fr_1fr] gap-16">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Overview</h4>
                    <p className="text-neutral-300 text-lg leading-relaxed mb-12 font-light">
                      {project.description}
                    </p>
                    
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Key Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {project.features.map((feat, i) => (
                        <div key={i} className="flex items-start p-4 rounded-xl bg-white/5 border border-white/5">
                          <Layers size={16} className="mt-1 mr-4 text-blue-500" />
                          <span className="text-sm text-neutral-300">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-12">
                     <div>
                       <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Tech Stack</h4>
                       <div className="flex flex-wrap gap-2">
                         {project.techStack.map((tech) => (
                           <span key={tech} className="px-3 py-2 bg-black border border-neutral-800 rounded-lg text-xs text-neutral-300 font-mono">
                             {tech}
                           </span>
                         ))}
                       </div>
                     </div>

                     <a 
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex w-full items-center justify-between p-6 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all"
                     >
                       <span>Launch Project</span>
                       <ExternalLink size={20} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                     </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};