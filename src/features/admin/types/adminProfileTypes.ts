export interface DetailedAdminProfile {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
  email: string;
  phone: string;
  district: string;
  zone: string;
  authorityLevel: string;
  joinedDate: string;
}
