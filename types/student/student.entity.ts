export interface FilterStudent{
  courseCompletion: number;
  courseEngagement: number;
  teamProjectDegree: number;
  projectDegree: number;
  expectedTypeWork: number;
  expectedContractType: number;
  canTakeApprenticeship:number;
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

export interface StudentEntity extends AvailableStudent{

  phoneNumber: string | null;
  githubUsername:string;
  portfolioUrls: string | null;
  projectUrls:string;
  bio:string | null;
  education:string | null;
  workExperience:string | null;
  courses:	string | null;
  userStatus: string;
  teamProjectDegree: number;
  bonusProjectUrls:string | null;
  reservedBy:string | null;
  reservationExpiresOn: Date | null;
}

export interface FilterData {
  [key: string]: string | undefined;
}
