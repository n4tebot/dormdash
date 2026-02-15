import { User, Service, Bid, Message, Conversation, Transaction } from './types';

function getItems<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setItems<T>(key: string, items: T[]): void {
  localStorage.setItem(key, JSON.stringify(items));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// Simple hash for password (not secure, but sufficient for localStorage mock)
export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Users
export function getUsers(): User[] { return getItems<User>('dormdash_users'); }
export function setUsers(users: User[]): void { setItems('dormdash_users', users); }
export function getUserById(id: string): User | undefined { return getUsers().find(u => u.id === id); }
export function getUserByEmail(email: string): User | undefined { return getUsers().find(u => u.email === email); }
export function createUser(user: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = { ...user, id: generateId(), createdAt: new Date().toISOString() };
  setUsers([...getUsers(), newUser]);
  return newUser;
}
export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const users = getUsers();
  const idx = users.findIndex(u => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...updates };
  setUsers(users);
  return users[idx];
}

// Services
export function getServices(): Service[] { return getItems<Service>('dormdash_services'); }
export function setServices(services: Service[]): void { setItems('dormdash_services', services); }
export function getServiceById(id: string): Service | undefined { return getServices().find(s => s.id === id); }
export function createService(service: Omit<Service, 'id' | 'createdAt'>): Service {
  const newService: Service = { ...service, id: generateId(), createdAt: new Date().toISOString() };
  setServices([...getServices(), newService]);
  return newService;
}
export function updateService(id: string, updates: Partial<Service>): Service | undefined {
  const services = getServices();
  const idx = services.findIndex(s => s.id === id);
  if (idx === -1) return undefined;
  services[idx] = { ...services[idx], ...updates };
  setServices(services);
  return services[idx];
}

// Bids
export function getBids(): Bid[] { return getItems<Bid>('dormdash_bids'); }
export function setBids(bids: Bid[]): void { setItems('dormdash_bids', bids); }
export function getBidsByServiceId(serviceId: string): Bid[] { return getBids().filter(b => b.serviceId === serviceId); }
export function getBidsByBidderId(bidderId: string): Bid[] { return getBids().filter(b => b.bidderId === bidderId); }
export function createBid(bid: Omit<Bid, 'id' | 'createdAt'>): Bid {
  const newBid: Bid = { ...bid, id: generateId(), createdAt: new Date().toISOString() };
  setBids([...getBids(), newBid]);
  return newBid;
}
export function updateBid(id: string, updates: Partial<Bid>): Bid | undefined {
  const bids = getBids();
  const idx = bids.findIndex(b => b.id === id);
  if (idx === -1) return undefined;
  bids[idx] = { ...bids[idx], ...updates };
  setBids(bids);
  return bids[idx];
}

// Messages
export function getMessages(): Message[] { return getItems<Message>('dormdash_messages'); }
export function setMessages(messages: Message[]): void { setItems('dormdash_messages', messages); }
export function getMessagesByConversationId(conversationId: string): Message[] {
  return getMessages().filter(m => m.conversationId === conversationId).sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}
export function createMessage(message: Omit<Message, 'id' | 'createdAt'>): Message {
  const newMessage: Message = { ...message, id: generateId(), createdAt: new Date().toISOString() };
  setMessages([...getMessages(), newMessage]);
  return newMessage;
}

// Conversations
export function getConversations(): Conversation[] { return getItems<Conversation>('dormdash_conversations'); }
export function setConversations(conversations: Conversation[]): void { setItems('dormdash_conversations', conversations); }
export function getConversationById(id: string): Conversation | undefined { return getConversations().find(c => c.id === id); }
export function getConversationsByUserId(userId: string): Conversation[] {
  return getConversations().filter(c => c.participants.includes(userId));
}
export function findConversation(userId1: string, userId2: string, serviceId: string): Conversation | undefined {
  return getConversations().find(c =>
    c.serviceId === serviceId && c.participants.includes(userId1) && c.participants.includes(userId2)
  );
}
export function createConversation(conversation: Omit<Conversation, 'id' | 'createdAt'>): Conversation {
  const newConvo: Conversation = { ...conversation, id: generateId(), createdAt: new Date().toISOString() };
  setConversations([...getConversations(), newConvo]);
  return newConvo;
}

// Transactions
export function getTransactions(): Transaction[] { return getItems<Transaction>('dormdash_transactions'); }
export function setTransactions(transactions: Transaction[]): void { setItems('dormdash_transactions', transactions); }
export function getTransactionsByUserId(userId: string): Transaction[] {
  return getTransactions().filter(t => t.buyerId === userId || t.sellerId === userId);
}
export function createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
  const newTx: Transaction = { ...transaction, id: generateId(), createdAt: new Date().toISOString() };
  setTransactions([...getTransactions(), newTx]);
  return newTx;
}

// Session management
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('dormdash_current_user');
}
export function setCurrentUserId(userId: string): void {
  localStorage.setItem('dormdash_current_user', userId);
}
export function clearCurrentUser(): void {
  localStorage.removeItem('dormdash_current_user');
}

// Verification codes (mock)
export function setVerificationCode(email: string, code: string): void {
  localStorage.setItem(`dormdash_verify_${email}`, code);
}
export function getVerificationCode(email: string): string | null {
  return localStorage.getItem(`dormdash_verify_${email}`);
}
export function clearVerificationCode(email: string): void {
  localStorage.removeItem(`dormdash_verify_${email}`);
}
