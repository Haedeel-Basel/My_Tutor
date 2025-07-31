import tutorSarah from '@/assets/tutor-sarah.jpg';
import tutorMike from '@/assets/tutor-mike.jpg';
import tutorEmma from '@/assets/tutor-emma.jpg';

export interface Tutor {
  id: string;
  name: string;
  subject: string;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  image: string;
  specialties: string[];
  availability: string;
  bio: string;
  experience: number;
  education: string;
  languages: string[];
  timezone: string;
}

export const tutors: Tutor[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    subject: 'Mathematics',
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 45,
    image: tutorSarah,
    specialties: ['Algebra', 'Calculus', 'Statistics', 'SAT Prep'],
    availability: 'Available today',
    bio: 'I am a passionate mathematics educator with over 8 years of experience helping students excel in math. I specialize in making complex concepts easy to understand through practical examples and personalized teaching methods.',
    experience: 8,
    education: 'PhD in Mathematics, Stanford University',
    languages: ['English', 'Spanish'],
    timezone: 'PST'
  },
  {
    id: '2',
    name: 'Mike Chen',
    subject: 'Programming',
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 65,
    image: tutorMike,
    specialties: ['JavaScript', 'Python', 'React', 'Web Development'],
    availability: 'Available tomorrow',
    bio: 'Full-stack developer and coding instructor with 6 years of industry experience. I love teaching programming through hands-on projects and real-world applications.',
    experience: 6,
    education: 'BS Computer Science, UC Berkeley',
    languages: ['English', 'Mandarin'],
    timezone: 'PST'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    subject: 'English',
    rating: 4.9,
    reviewCount: 156,
    hourlyRate: 40,
    image: tutorEmma,
    specialties: ['Essay Writing', 'Literature', 'Grammar', 'IELTS Prep'],
    availability: 'Available now',
    bio: 'English literature graduate and experienced tutor specializing in writing skills, reading comprehension, and test preparation. I help students develop confidence in their English abilities.',
    experience: 5,
    education: 'MA English Literature, Harvard University',
    languages: ['English', 'French'],
    timezone: 'EST'
  }
];

export const subjects = [
  'Mathematics',
  'Programming',
  'English',
  'Science',
  'History',
  'Languages',
  'Test Prep',
  'Music'
];

export const getTutorById = (id: string): Tutor | undefined => {
  return tutors.find(tutor => tutor.id === id);
};

export const getTutorsBySubject = (subject: string): Tutor[] => {
  if (subject === 'All') return tutors;
  return tutors.filter(tutor => tutor.subject === subject);
};