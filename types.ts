export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Live' | 'Active' | 'Demo';
  techStack: string[];
  features: string[];
  url: string;
}

export interface Skill {
  name: string;
  level: number; // 0 to 100
}

export interface Availability {
  type: string;
  active: boolean;
}
