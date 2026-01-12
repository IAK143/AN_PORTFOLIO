import { Project, Skill, Availability } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'airable',
    name: 'AirAble',
    description: 'AI-powered air quality guide providing real-time hyperlocal insights.',
    status: 'Live',
    techStack: ['React', 'D3.js', 'OpenAI API', 'Node.js'],
    features: ['Real-time AQI Maps', 'AI Health Recommendations', 'Historical Trends'],
    url: '#',
  },
  {
    id: 'i12',
    name: 'I12 Innovation',
    description: 'A future-forward innovation lab platform for tracking internal R&D.',
    status: 'Active',
    techStack: ['Next.js', 'Supabase', 'WebGL', 'Tailwind'],
    features: ['Collaborative Workspace', '3D Asset Preview', 'Real-time Sync'],
    url: '#',
  },
  {
    id: 'qs',
    name: 'QS Physics',
    description: 'Experimental fluid motion and particle physics demonstration engine.',
    status: 'Demo',
    techStack: ['Three.js', 'GLSL', 'React Three Fiber'],
    features: ['1M+ Particles', 'Fluid Dynamics', 'Interactive Gravity'],
    url: '#',
  },
];

export const SKILLS: Skill[] = [
  { name: 'React', level: 95 },
  { name: 'TypeScript', level: 90 },
  { name: 'Framer Motion', level: 88 },
  { name: 'Python', level: 87 },
  { name: 'TensorFlow.js', level: 85 },
  { name: 'Node.js', level: 82 },
  { name: 'Supabase', level: 80 },
  { name: 'WebGL', level: 75 },
];

export const AVAILABILITY: Availability[] = [
  { type: 'Freelance', active: true },
  { type: 'Collaborations', active: true },
  { type: 'Hackathons', active: false },
  { type: 'Product Ideation', active: true },
];
