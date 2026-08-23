export interface EnumeratorProfile {
  id: string;
  name: string;
  role: string;
  assignedZone: string;
  isOnline: boolean;
  unreadNotificationsCount: number;
}

export interface TodayProgress {
  totalAssigned: number;
  completed: number;
  remaining: number;
  coveragePercentage: number;
}

export interface PriorityTaskMetric {
  id: string;
  title: string;
  count: number;
  unit: string;
  iconName: string;
  color: string;
  badgeBg: string;
}

export interface AssignedZoneInfo {
  zoneName: string;
  subArea: string;
  totalHouseholds: number;
  completedHouseholds: number;
  coveragePercentage: number;
}

export interface QuickActionItem {
  id: string;
  label: string;
  iconName: string;
  color: string;
  route?: string;
}

export interface SyncStatusInfo {
  pendingCount: number;
  lastSynced: string;
  isSyncing: boolean;
}

export interface EnumeratorActivity {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  type: 'registered' | 'verified' | 'missing' | 'sync';
}

// ==========================================
// REGISTER HOUSEHOLD DATA MODELS
// ==========================================

export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

export type IdentityType = 'Aadhaar' | 'Voter ID' | 'Other' | 'Not Available';

export type VerificationStatus = 'Not Verified' | 'Verified' | 'Requires Review';

export type HouseType = 'Permanent' | 'Semi-Permanent' | 'Temporary';

export type Ownership = 'Owned' | 'Rented' | 'Other';

export type RelationshipRole =
  | 'Head'
  | 'Spouse'
  | 'Son'
  | 'Daughter'
  | 'Father'
  | 'Mother'
  | 'Brother'
  | 'Sister'
  | 'Other';

export type Occupation =
  | 'Student'
  | 'Employed'
  | 'Self-employed'
  | 'Unemployed'
  | 'Homemaker'
  | 'Retired'
  | 'Other';

export type EducationLevel =
  | 'No formal education'
  | 'Primary'
  | 'Secondary'
  | 'Higher Secondary'
  | 'Graduate'
  | 'Postgraduate'
  | 'Other';

export type DisabilityStatus = 'No' | 'Yes' | 'Prefer not to say';

export type HouseholdNeed =
  | 'Health Assistance'
  | 'Education Assistance'
  | 'Financial Assistance'
  | 'Housing'
  | 'Employment'
  | 'Food / Ration'
  | 'Disability Support'
  | 'Other'
  | 'No Current Requirement';

export type SchemeCategory =
  | 'Food / Ration'
  | 'Housing'
  | 'Health'
  | 'Education'
  | 'Employment'
  | 'Financial Assistance';

export type SchemeChoice = 'Receiving' | 'Not Receiving' | 'Unknown';

export interface SchemeItem {
  category: SchemeCategory;
  choice: SchemeChoice;
  schemeName?: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  age: string;
  gender: Gender;
  relationship: RelationshipRole;
  occupation: Occupation;
  education: EducationLevel;
  disability: DisabilityStatus;
}

export interface HeadOfHousehold {
  name: string;
  age: string;
  gender: Gender;
  mobile: string;
  role: string;
}

export interface IdentityVerification {
  idType: IdentityType;
  last4Digits: string;
  status: VerificationStatus;
}

export interface HouseholdProfile {
  familyMemberCount: number;
  houseType: HouseType;
  ownership: Ownership;
  locality: string;
  ward: string;
  pinCode: string;
  state: string;
  district: string;
  fullAddress: string;
}

export interface GpsLocationData {
  latitude: string;
  longitude: string;
  accuracy: string;
  capturedAt?: string;
}

export interface HouseholdFormData {
  householdId: string;
  status: 'Draft' | 'Submitted';
  headOfHousehold: HeadOfHousehold;
  identityVerification: IdentityVerification;
  householdProfile: HouseholdProfile;
  familyMembers: FamilyMember[];
  location: GpsLocationData | null;
  needs: HouseholdNeed[];
  schemeStatus: SchemeItem[];
  remarks: string;
}

// ==========================================
// START SURVEY DATA MODELS
// ==========================================

export type SurveyStatus = 'Pending' | 'In Progress' | 'Completed';

export type SurveyPriority = 'High' | 'Normal';

export interface AssignedHouseholdSummary {
  householdId: string;
  headName: string;
  address: string;
  memberCount: number;
  status: SurveyStatus;
  priority: SurveyPriority;
  mobile: string;
  state: string;
  district: string;
  ward: string;
  pinCode: string;
  houseType: HouseType;
  ownership: Ownership;
}

export interface BasicFacilitiesData {
  electricity: 'Yes' | 'No';
  drinkingWater: 'Tap Water' | 'Hand Pump' | 'Well' | 'Other';
  toilet: 'Household Toilet' | 'Shared Toilet' | 'No Toilet';
  cookingFuel: 'LPG' | 'Electricity' | 'Firewood' | 'Other';
  internetAccess: 'Yes' | 'No';
}

export interface EmploymentEducationData {
  primaryEmployment:
    | 'Employed'
    | 'Self-employed'
    | 'Unemployed'
    | 'Daily wage'
    | 'Retired'
    | 'Student'
    | 'Other';
  childrenAttendingSchool: 'Yes' | 'No' | 'Not Applicable';
  highestEducationLevel: EducationLevel;
}

export interface SurveyFormData {
  surveyId: string;
  householdId: string;
  status: SurveyStatus;
  startedAt: string;
  updatedAt: string;
  householdInformation: HouseholdProfile & HeadOfHousehold;
  familyMembers: FamilyMember[];
  facilities: BasicFacilitiesData;
  employmentEducation: EmploymentEducationData;
  needs: HouseholdNeed[];
  schemeStatus: SchemeItem[];
  remarks: string;
}

// ==========================================
// ASSIGNED ZONE DATA MODELS
// ==========================================

export type ZoneHouseholdStatus =
  | 'Completed'
  | 'In Progress'
  | 'Pending'
  | 'Needs Verification'
  | 'Missing';

export type ZoneHouseholdPriority = 'High' | 'Normal';

export interface ZoneAreaItem {
  id: string;
  name: string;
  totalHouseholds: number;
  completedHouseholds: number;
}

export interface ZoneHouseholdItem {
  id: string;
  householdId: string;
  headName: string;
  locality: string;
  members: number;
  status: ZoneHouseholdStatus;
  priority: ZoneHouseholdPriority;
  areaId: string;
  lastVisit?: string;
  address?: string;
  ward?: string;
  district?: string;
  pinCode?: string;
  mobile?: string;
  houseType?: 'Permanent' | 'Semi-Permanent' | 'Temporary';
  ownership?: 'Owned' | 'Rented' | 'Other';
  needs?: HouseholdNeed[];
  verificationStatus?: 'Verified' | 'Pending' | 'Needs Verification' | 'Not Verified';
}

export interface ZoneActivityItem {
  id: string;
  type: 'survey' | 'priority' | 'registration' | 'verification';
  message: string;
  timestamp: string;
  householdId: string;
}

export interface AssignedZoneFullData {
  zoneId: string;
  zoneName: string;
  ward: string;
  subArea: string;
  district: string;
  pinCode: string;
  enumeratorId: string;
  dailyTarget: {
    target: number;
    completed: number;
  };
  areas: ZoneAreaItem[];
  households: ZoneHouseholdItem[];
  activities: ZoneActivityItem[];
}



