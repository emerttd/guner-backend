export interface AuthenticatedRequest extends Request {
  params: any;
  user?: {
    userId: string;
    role: 'super_admin' | 'admin' | 'worker'; // worker eklendi
    branchId?: string; // Branch ID optional, as not all users may have a branch
  };
}
