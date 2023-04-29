export interface ReservedStudent {
    studentId: string;
    firstName: string;
    lastName: string;
    avatar: string;
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
    reservationExpiresOn: Date;
}