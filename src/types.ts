export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: 'super_admin' | 'admin' | 'worker'; // ✅ worker eklendi
  };
}
