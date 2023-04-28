import { FieldPacket } from "mysql2";
import { ValidationError } from "../utils/errors";
import { StudentEntity } from "../types";
import { pool } from "../config/db";

type StudentRecordResult = [StudentEntity[], FieldPacket[]];

export class StudentRecord implements StudentEntity {

  studentId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  githubUsername:string;
  portfolioUrls: string | null;
  projectUrls:string;
  bio:string | null;
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
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls:string | null;
  reservedBy:string | null;
  reservationExpiresOn: Date;

  constructor(obj:StudentEntity) {
    this.studentId = obj.studentId;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.phoneNumber = obj.phoneNumber;
    this.githubUsername = obj.githubUsername;
    this.portfolioUrls = obj.portfolioUrls;
    this.projectUrls = obj.projectUrls;
    this.bio = obj.bio;
    this.expectedTypeWork = obj.expectedTypeWork;
    this.targetWorkCity = obj.targetWorkCity;
    this.expectedContractType = obj.expectedContractType;
    this.expectedSalary = obj.expectedSalary;
    this.canTakeApprenticeship = obj.canTakeApprenticeship;
    this.monthsOfCommercialExp = obj.monthsOfCommercialExp;
    this.education = obj.education;
    this.workExperience = obj.workExperience;
    this.courses = obj.courses;
    this.userStatus = obj.userStatus;
    this.courseCompletion = obj.courseCompletion;
    this.courseEngagement = obj.courseEngagement;
    this.projectDegree = obj.projectDegree;
    this.teamProjectDegree = obj.teamProjectDegree;
    this.bonusProjectUrls = obj.bonusProjectUrls;
    this.reservedBy = obj.reservedBy;
    this.reservationExpiresOn = obj.reservationExpiresOn;
  }


  static async studentShortInfo(id:string): Promise<StudentRecord[]> {
    const [results] = await pool.execute("SELECT `email`, `courseCompletion`, `courseEngagement`, `projectDegree`,`teamProjectDegree`,`expectedTypeWork`,`targetWorkCity`,`expectedContractType`,`expectedSalary`,`canTakeApprenticeship`,`monthsOfCommercialExp` FROM `students` WHERE `studentId` = :id",{
        id
    }) as StudentRecordResult;
    return results;
}
}