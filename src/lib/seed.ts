import { Service, User } from './types';
import { getServices, setServices, getUsers, setUsers, generateId, hashPassword } from './storage';

const DEMO_SERVICES: Omit<Service, 'id' | 'createdAt'>[] = [
  {
    providerId: 'demo-user-1',
    title: 'Help Moving Into Jester Dorm',
    description: 'Need help carrying boxes and furniture up to my room in Jester West. I have about 10 boxes and a small desk. Should take about 2 hours.',
    category: 'Moving Help',
    price: 40,
    location: 'Jester West, UT Austin',
    dateTime: '2026-03-01T10:00:00',
    status: 'active',
  },
  {
    providerId: 'demo-user-2',
    title: 'Airport Ride to ABIA',
    description: 'Need a ride from campus to Austin-Bergstrom International Airport. I have two suitcases. Flexible on exact time.',
    category: 'Airport Rides',
    price: 25,
    location: 'UT Austin Campus → ABIA Airport',
    dateTime: '2026-03-05T14:00:00',
    status: 'active',
  },
  {
    providerId: 'demo-user-1',
    title: 'Calculus II Tutoring',
    description: 'Offering tutoring for M 408D (Calculus II). I got an A in the class and can help with integration techniques, series, and more.',
    category: 'Tutoring',
    price: 30,
    location: 'PCL (Perry-Castañeda Library)',
    dateTime: '2026-02-28T16:00:00',
    status: 'active',
  },
  {
    providerId: 'demo-user-2',
    title: 'Apartment Deep Clean',
    description: 'Professional-quality deep cleaning for apartments near campus. Includes kitchen, bathroom, floors, and surfaces. Supplies included.',
    category: 'Cleaning',
    price: 75,
    location: 'West Campus Area',
    dateTime: '2026-03-10T09:00:00',
    status: 'active',
  },
  {
    providerId: 'demo-user-1',
    title: 'Grocery Run from H-E-B',
    description: 'I\'ll pick up your groceries from the H-E-B on Hancock. Send me your list and I\'ll deliver to your dorm or apartment.',
    category: 'Errands',
    price: 15,
    location: 'H-E-B Hancock Center → Campus',
    dateTime: '2026-02-25T11:00:00',
    status: 'active',
  },
  {
    providerId: 'demo-user-2',
    title: 'CS 314 Data Structures Help',
    description: 'Tutoring for CS 314. Can help with linked lists, trees, graphs, sorting algorithms, and Big-O analysis. Bring your assignments!',
    category: 'Tutoring',
    price: 35,
    location: 'GDC (Gates Dell Complex)',
    dateTime: '2026-03-02T13:00:00',
    status: 'active',
  },
];

const DEMO_USERS: (Omit<User, 'id' | 'createdAt'> & { id: string })[] = [
  {
    id: 'demo-user-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@utexas.edu',
    password: hashPassword('password123'),
    avatarUrl: '',
    eduVerified: true,
    idVerified: true,
    bio: 'Junior studying Computer Science. Always happy to help fellow Longhorns!',
  },
  {
    id: 'demo-user-2',
    name: 'Marcus Johnson',
    email: 'marcus.j@utexas.edu',
    password: hashPassword('password123'),
    avatarUrl: '',
    eduVerified: true,
    idVerified: false,
    bio: 'Sophomore in Business. Offering rides and cleaning services on weekends.',
  },
];

export function seedDataIfEmpty() {
  if (typeof window === 'undefined') return;

  const users = getUsers();
  if (users.length === 0) {
    const seededUsers: User[] = DEMO_USERS.map(u => ({
      ...u,
      createdAt: new Date().toISOString(),
    }));
    setUsers(seededUsers);
  }

  const services = getServices();
  if (services.length === 0) {
    const seededServices: Service[] = DEMO_SERVICES.map(s => ({
      ...s,
      id: generateId(),
      createdAt: new Date().toISOString(),
    }));
    setServices(seededServices);
  }
}
