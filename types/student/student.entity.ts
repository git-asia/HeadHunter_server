export interface FilterStudent{
  courseCompletion: number;
  courseEngagement: number;
  teamProjectDegree: number;
  projectDegree: number;
  expectedTypeWork: number;
  expectedContractType: number;
  canTakeApprenticeship:boolean;
  expectedSalaryMin: number;
  expectedSalaryMax: number;
  monthsOfCommercialExp: number;
}

export interface AvailableStudent extends Omit<FilterStudent, 'expectedSalaryMin' | 'expectedSalaryMax'>{
  studentId: string;
  firstName: string;
  lastName: string;
  targetWorkCity: string;
  expectedSalary: number;
}

export interface ReservedStudent extends AvailableStudent {
  githubUsername:string;
  reservationExpiresOn: Date | null;
}

export interface StudentEntity extends ReservedStudent{
  phoneNumber: string | null;
  portfolioUrls: string[] | null;
  projectUrls:string[];
  bio:string | null;
  education:string | null;
  workExperience:string | null;
  courses:	string | null;
  userStatus: string;
  bonusProjectUrls:string | null;
  reservedBy:string | null;
}


export interface FilterData {
  [key: string]: string | undefined;

export interface SingleStudent extends Omit<StudentEntity, 'reservationExpiresOn' | 'reservedBy' | 'userStatus'>{
  email: string;

