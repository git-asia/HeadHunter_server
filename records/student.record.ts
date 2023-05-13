import { FieldPacket } from "mysql2";
import { ValidationError } from "../utils/errors";
import {Octokit} from "octokit";
import { StudentEntity } from "../types";
import { pool } from "../config/db-sample";


const checkGitHub = async (userName: string): Promise<string | null> => {
  try {
    const resUserName = await new Octokit({}).request('GET /users/{username}', {
      username: userName,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
    return resUserName.data.login;
  } catch (e) {
    return null;
  }
}

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


  static async getCvOneStudent(id:string): Promise<StudentRecord[]> {
    const [results] = await pool.execute("SELECT `firstName`, `lastName`, `githubUsername`, `phoneNumber`, `expectedTypeWork`, `targetWorkCity`, `expectedContractType`, `expectedSalary`, `canTakeApprenticeship`, `monthsOfCommercialExp`, `bio`, `education`, `courses`, `workExperience`, `portfolioUrls`, `bonusProjectUrls`, `projectUrls` FROM `students` WHERE `studentId` = :id",{
      id
    }) as StudentRecordResult;
    return results;
  }

  static async updateData(studentId: string, firstName: string, lastName: string, phoneNumber: string, githubUsername: string, portfolioUrls: string, projectUrls: string, bio: string, expectedTypeWork: number, targetWorkCity: string, expectedContractType: number, expectedSalary: number, canTakeApprenticeship: number, monthsOfCommercialExp: number, education: string, workExperience: string, courses: string, bonusProjectUrls: string): Promise<string> {

    if (!firstName) {
      throw new ValidationError("Musisz podać imię");
    }
    if (!lastName) {
      throw new ValidationError("Musisz podać nazwisko");
    }
    if (checkGitHub(githubUsername) === null) {
      throw new ValidationError("Nie ma takiego konta GitHub");
    }
    const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
    if (!phoneRegex.test(phoneNumber) && phoneNumber !== '') {
      throw new ValidationError('Podaj poprawny numer telefonu lub nie podawaj żadnego');
    }
    if (monthsOfCommercialExp < 0) {
      throw new ValidationError("Długość doświadczenia musi być liczbą nieujemną")
    }
    if (isNaN(expectedSalary)) {
      throw new ValidationError("Oczekiwana wysokość pensji musi być liczbą")
    }
      if (expectedTypeWork < 1 || expectedTypeWork > 5){
        throw new ValidationError("Typ pracy musi być w zakresie 1-5")
      }
      if (expectedContractType < 1 || expectedContractType > 4){
        throw new ValidationError("Typ kontraktu musi być w zakresie 1-4")
      }

    await pool.execute("UPDATE `students` SET `firstName` = :firstName, `lastName` = :lastName, `phoneNumber` = :phoneNumber, `githubUsername` = :githubUsername, `portfolioUrls` = :portfolioUrls, `projectUrls` = :projectUrls, `bio` = :bio, `expectedTypeWork` = :expectedTypeWork, `targetWorkCity` = :targetWorkCity, `expectedContractType` = :expectedContractType, `expectedSalary` = :expectedSalary, `canTakeApprenticeship` = :canTakeApprenticeship, `monthsOfCommercialExp` = :monthsOfCommercialExp, `education` = :education, `workExperience` = :workExperience, `courses` = :courses, `bonusProjectUrls` = :bonusProjectUrls WHERE `studentId` = :studentId", {
      firstName, lastName, phoneNumber, githubUsername, portfolioUrls, projectUrls, bio, expectedTypeWork, targetWorkCity, expectedContractType, expectedSalary, canTakeApprenticeship, monthsOfCommercialExp, education, workExperience, courses, bonusProjectUrls, studentId
    });
      return studentId;
  }
}