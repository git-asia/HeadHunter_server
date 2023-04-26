export interface StudentEntity{
  studentId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  githubUsername:string;
  portfolioUrls: string | null;
  projectUrls:string;
  bio:string | | null;
  expectedTypeWork: number;
  targetWorkCity: string;
  expectedContractType: number;
  expectedSalary: number;
  canTakeApprenticeship:number;
  monthsOfCommercialExp: number;
  education:string | null;
  workExperience:string | null;
  courses:	string | null;
  userStatus: string;
  courseCompletion: number;
  courseEngagment: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls:string | null;
  reservedBy:string | null;
  reservationExpiresOn: Date;
}

