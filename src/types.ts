export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  isFeatured?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatarSeed: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface Industry {
  id: string;
  name: string;
  icon: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  company: string;
  service: string;
  date: string;
  time: string;
  notes?: string;
  status: 'pending' | 'confirmed';
  createdAt: string;
}
