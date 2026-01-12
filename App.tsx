import React, { useRef } from 'react';
import { ProjectCard } from './components/ProjectCard';
import { SkillBar } from './components/SkillBar';
import { Magnetic } from './components/Magnetic';
import { TextReveal } from './components/TextReveal';
import { PROJECTS, SKILLS, AVAILABILITY } from './constants';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Github, Mail, ArrowDown } from 'lucide-react';

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY, scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroTextY = useTransform(scrollY, [0, 300], [0, 100]);

  // --- ORB ANIMATION LOGIC ---
  // We map the vertical scroll progress (0 to 1) to X/Y coordinates in the viewport (fixed position).
  // This allows the ball to "travel" to specific empty zones on the screen as sections scroll by.

  // 0.0 (Hero): Right of "Ai4" title
  // 0.2 (Philosophy): Left side empty column
  // 0.5 (Projects): Top right empty space
  // 0.8 (Skills): Bottom left empty space
  // 1.0 (Contact): Center
  
  const rawX = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], ["70%", "15%", "85%", "10%", "50%"]);
  const rawY = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], ["30%", "45%", "25%", "65%", "50%"]);
  const rawScale = useTransform(scrollYProgress, [0, 0.2, 0.5, 0.8, 1], [1, 1.8, 0.8, 1.4, 0.5]);
  const rawRotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  const springConfig = { damping: 25, stiffness: 80, mass: 0.5 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);
  const scale = useSpring(rawScale, springConfig);

  return (
    <div ref={containerRef} className="relative min-h-screen selection:bg-blue-500/30 selection:text-blue-200 overflow-hidden bg-[#050505]">
      
      {/* 2D Background Layer - Electric Ghost Aesthetics */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         {/* The Wandering Orb */}
        <motion.div 
            style={{ 
                left: x, 
                top: y, 
                scale: scale,
                rotate: rawRotate,
                x: "-50%", 
                y: "-50%" 
            }}
            className="fixed z-10 w-[15vw] h-[15vw] rounded-full mix-blend-screen pointer-events-none"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-violet-500 rounded-full blur-[60px] opacity-60 animate-pulse" />
            <div className="absolute inset-0 bg-white/20 rounded-full blur-[20px] opacity-30" />
        </motion.div>

        <motion.div 
            animate={{ 
                x: [0, 100, -100, 0],
                y: [0, -50, 50, 0],
                opacity: [0.15, 0.3, 0.15]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen" 
        />
        <motion.div 
            animate={{ 
                x: [0, -100, 100, 0],
                y: [0, 50, -50, 0],
                opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-violet-600/10 rounded-full blur-[120px] mix-blend-screen" 
        />
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full p-8 md:px-12 flex justify-between items-center z-50 pointer-events-none mix-blend-difference">
          <Magnetic>
             <div className="text-white font-bold text-xl tracking-tighter cursor-pointer pointer-events-auto">Ai4</div>
          </Magnetic>
          <div className="text-[10px] font-mono text-neutral-400 hidden md:flex items-center gap-4 opacity-70">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            SYSTEM.ONLINE
          </div>
      </nav>

      {/* Main Scrollable Content */}
      <main className="relative z-20 w-full max-w-[90rem] mx-auto px-6 md:px-12">
        
        {/* HERO SECTION */}
        <section className="h-screen flex flex-col justify-center relative">
          <motion.div style={{ opacity, y: heroTextY }} className="z-20 mt-[-5vh]">
             {/* Staggered Intro Text */}
             <div className="mb-8 flex items-center gap-3 overflow-hidden">
                <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, ease: "circOut" }}
                    className="h-[1px] w-12 bg-blue-500 origin-left"
                />
                <motion.span 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-xs font-mono text-blue-400 tracking-[0.25em] uppercase"
                >
                    Creative Developer
                </motion.span>
             </div>

             {/* Massive Brutalist Headline */}
             <TextReveal className="text-[5rem] md:text-[10rem] lg:text-[12rem] leading-[0.85] font-bold text-white tracking-tighter mb-8">
               Ai4
             </TextReveal>
             
             <div className="max-w-xl">
                 <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="text-neutral-400 text-lg md:text-xl font-light leading-relaxed"
                 >
                    Crafting <span className="text-white font-medium">invisible tech</span>. 
                    Merging aesthetic precision with engineering performance to build digital experiences that feel inevitable.
                 </motion.p>
             </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-6 md:left-12 flex items-center gap-4 text-neutral-600"
          >
             <ArrowDown size={16} className="animate-bounce" />
             <span className="text-[10px] font-mono uppercase tracking-widest">Scroll to Discover</span>
          </motion.div>
        </section>

        {/* PHILOSOPHY SECTION */}
        <section className="min-h-[60vh] flex items-center py-24 border-t border-white/5">
          <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-4">
                    <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase block mb-2">(01)</span>
                    <h3 className="text-xs font-mono text-white tracking-widest uppercase">The Philosophy</h3>
                </div>
                <div className="lg:col-span-8">
                    <TextReveal className="text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.1] tracking-tight">
                        Software shouldn't just function. It should breathe.
                    </TextReveal>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 text-neutral-400 font-light"
                    >
                        <p>
                            I build interfaces that respond to intent. By removing friction and adding kinetic weight, the barrier between user and application dissolves.
                        </p>
                        <p>
                            Every interaction is a transfer of energy. My work focuses on the subtle micro-interactions that turn a static page into a living environment.
                        </p>
                    </motion.div>
                </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="py-32 border-t border-white/5">
          <div className="flex justify-between items-end mb-24">
             <div>
                <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase block mb-2">(02)</span>
                <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">Selected Works</h2>
             </div>
             <div className="hidden md:block text-right">
                 <p className="text-xs font-mono text-neutral-500 tracking-widest uppercase">2023 — 2025</p>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.map((project, idx) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={idx}
              />
            ))}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section className="py-32 border-t border-white/5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-4">
                    <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase block mb-2">(03)</span>
                    <h3 className="text-xs font-mono text-white tracking-widest uppercase mb-8">Proficiency</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                        My stack is chosen for resilience and scale. I prefer tools that offer type-safety and visual fidelity without compromising speed.
                    </p>
                </div>
                
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
                    {SKILLS.map((skill, idx) => (
                        <SkillBar key={skill.name} skill={skill} index={idx} />
                    ))}
                </div>
            </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center relative py-20 border-t border-white/5">
          <div className="z-10 max-w-4xl w-full">
            <span className="text-xs font-mono text-blue-500 tracking-widest uppercase block mb-8">Start a Project</span>
            <TextReveal className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-16 tracking-tighter justify-center">
                Let's Talk.
            </TextReveal>
            
            <div className="flex justify-center gap-8 mb-20">
              <Magnetic strength={0.5}>
                  <a href="#" className="group relative px-10 py-5 bg-white text-black text-lg font-medium rounded-full overflow-hidden transition-transform">
                    <span className="relative z-10 flex items-center gap-3">
                        <Mail size={20} />
                        <span>Email Me</span>
                    </span>
                    <div className="absolute inset-0 bg-neutral-300 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                  </a>
              </Magnetic>
              
              <Magnetic strength={0.5}>
                  <a href="#" className="group relative px-10 py-5 bg-transparent border border-neutral-700 text-white text-lg font-medium rounded-full overflow-hidden transition-colors hover:border-white">
                    <span className="relative z-10 flex items-center gap-3">
                        <Github size={20} />
                        <span>GitHub</span>
                    </span>
                  </a>
              </Magnetic>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 opacity-60">
              {AVAILABILITY.map((item) => (
                <span 
                  key={item.type} 
                  className={`px-4 py-1.5 text-[11px] tracking-widest uppercase rounded-full border transition-colors ${
                    item.active 
                    ? 'border-neutral-800 text-neutral-400' 
                    : 'border-transparent text-neutral-800 line-through'
                  }`}
                >
                  {item.type}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono text-neutral-600 uppercase tracking-widest">
            <span>© 2025 Ai4 // V.3.0</span>
            <span className="mt-2 md:mt-0 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                All Systems Operational
            </span>
        </footer>

      </main>
    </div>
  );
};

export default App;