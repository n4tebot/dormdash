export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatarUrl: string;
  eduVerified: boolean;
  idVerified: boolean;
  idImageUrl?: string;
  bio?: string;
  createdAt: string;
}

export type ServiceCategory =
  | 'Moving Help'
  | 'Airport Rides'
  | 'Tutoring'
  | 'Cleaning'
  | 'Errands'
  | 'Other';

export type ServiceStatus = 'active' | 'in-progress' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  providerId: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  location: string;
  dateTime: string;
  status: ServiceStatus;
  imageUrl?: string;
  createdAt: string;
}

export type BidStatus = 'pending' | 'accepted' | 'rejected';

export interface Bid {
  id: string;
  serviceId: string;
  bidderId: string;
  amount: number;
  message: string;
  status: BidStatus;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  serviceId: string;
  createdAt: string;
}

export type TransactionStatus = 'pending' | 'completed' | 'refunded';

export interface Transaction {
  id: string;
  serviceId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  status: TransactionStatus;
  createdAt: string;
}
