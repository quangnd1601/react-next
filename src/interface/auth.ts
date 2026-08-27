export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  avatar_url?: string;
  role?: 'ADMIN' | 'CUSTOMER' | string;
  status?: 'ACTIVE' | 'INACTIVE' | 'BANNED' | string;
  total_bookings?: number;
  total_spent_amount?: number;
  created_at?: string | Date;
}

export interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role?: string }>;
  logout: () => void;
  updateUserData: (updatedData: Partial<IUser>) => void;
}
