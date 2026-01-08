export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'GUEST';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string; // ISO date
}
