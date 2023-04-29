export interface SingleStudent {
    studentId: string;
    firstName: string;
    lastName: string;
    githubUsername: string;
    phoneNumber: string | null;
    email: string;
    bio: string | | null;
    courseCompletion: number;
    courseEngagment: number;
    projectDegree: number;
    teamProjectDegree: number;
    expectedTypeWork: number;
    targetWorkCity: string;
    expectedContractType: number;
    expectedSalary: number;
    canTakeApprenticeship: boolean;
    monthsOfCommercialExp: number;
    education: string | null;
    courses: string | null;
    workExperience: string | null;
    portfolioUrls: string[] | null;
    projectUrls: string[];
    bonusProjectUrls: string[] | null;
}