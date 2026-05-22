import React from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  ShieldCheck, 
  Users, 
  Percent, 
  Activity, 
  ShoppingBag, 
  Building, 
  Briefcase, 
  Rocket, 
  User, 
  Monitor, 
  HeartPulse, 
  Store, 
  Coins,
  Clock, 
  CheckCircle, 
  ExternalLink, 
  ArrowRight, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  Check,
  Sliders,
  Sparkles,
  Award
} from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function Icon({ name, className = '', size = 20 }: IconProps) {
  const icons: { [key: string]: React.ComponentType<{ className?: string; size?: number }> } = {
    TrendingUp,
    BookOpen,
    ShieldCheck,
    Users,
    Percent,
    Activity,
    ShoppingBag,
    Building,
    Briefcase,
    Rocket,
    User,
    Monitor,
    HeartPulse,
    Store,
    Coins,
    Clock,
    CheckCircle,
    ExternalLink,
    ArrowRight,
    Star,
    ChevronDown,
    ChevronUp,
    MapPin,
    Mail,
    Phone,
    Calendar,
    Check,
    Sliders,
    Sparkles,
    Award
  };

  const IconComponent = icons[name] || HelpCircleComponent;
  return <IconComponent className={className} size={size} />;
}

function HelpCircleComponent({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
