export interface DetailedEnumeratorProfile {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  zoneId: string;
  zoneName: string;
  ward: string;
  district: string;
  pinCode: string;
  mobile: string;
  email: string;
  supervisor: string;
  unit: string;
  joinedDate: string;
  dailyTarget: number;
}
