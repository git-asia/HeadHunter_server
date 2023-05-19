import {FieldPacket} from "mysql2";
import {ValidationError} from "../utils/errors";
import {Octokit} from "@octokit/core";
import {pool} from "../config/db";
import { StudentEntity } from "../types";
import { sendMail } from "../utils/sendMail";

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

const checkGithubUsername = async (ghUserName: string): Promise<string | null> => {
  const [results] = (await pool.execute("SELECT `studentId` FROM `students` WHERE `githubUsername` = :ghUsername", {
    ghUserName,
  })) as StudentRecordResult;
  return results.length === 0 ? null : results[0].studentId;
}

type StudentRecordResult = [StudentEntity[], FieldPacket[]];

export class StudentRecord implements StudentEntity {

  studentId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  githubUsername: string;
  portfolioUrls: string | null;
  projectUrls: string;
  bio: string | null;
  expectedTypeWork: number;
  targetWorkCity: string;
  expectedContractType: number;
  expectedSalary: number;
  canTakeApprenticeship: boolean|number;
  monthsOfCommercialExp: number;
  education: string | null;
  workExperience: string | null;
  courses: string | null;
  userStatus: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls:string | null;
  reservedBy:string | null;
  reservationExpiresOn: Date;

  constructor(obj:StudentEntity) {

    if(!obj.studentId){

      if (checkGithubUsername(this.githubUsername) !== null) {
        throw new ValidationError("Taki użytkownik GitHuba już istnieje");
      }
    }

    if (!obj.firstName) {
      throw new ValidationError("Musisz podać imię");
    }

    if (!obj.lastName) {
      throw new ValidationError("Musisz podać nazwisko");
    }

    if (checkGitHub(obj.githubUsername) === null) {
      throw new ValidationError("Nie ma takiego konta GitHub");
    }

    const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
    if (!phoneRegex.test(obj.phoneNumber) && !obj.phoneNumber) {
      throw new ValidationError('Podaj poprawny numer telefonu lub nie podawaj żadnego');
    }

    if (obj.monthsOfCommercialExp < 0) {
      throw new ValidationError("Długość doświadczenia musi być liczbą nieujemną")
    }
    if (isNaN(obj.expectedSalary)) {
      throw new ValidationError("Oczekiwana wysokość pensji musi być liczbą")
    }

    if (obj.courseCompletion < 0 || obj.courseCompletion > 5){
      throw new ValidationError("Ocena musi być w zakresie 0-5")
    }

    if (obj.courseEngagement < 0 || obj.courseEngagement > 5){
      throw new ValidationError("Ocena musi być w zakresie 0-5")
    }

    if (obj.projectDegree < 0 || obj.projectDegree > 5){
      throw new ValidationError("Ocena musi być w zakresie 0-5")
    }

    if (obj.teamProjectDegree < 0 || obj.teamProjectDegree > 5){
      throw new ValidationError("Ocena musi być w zakresie 0-5")
    }

    if (obj.expectedTypeWork < 1 || obj.expectedTypeWork > 5){
      throw new ValidationError("Typ pracy musi być w zakresie 1-5")
    }

    if (obj.expectedContractType < 1 || obj.expectedContractType > 4){
      throw new ValidationError("Typ kontraktu musi być w zakresie 1-4")
    }

    obj.portfolioUrls.split(' ').forEach(el => {
      if (!/^(ftp|http|https):\/\/[^ "]+$/.test(el)) {
        throw new ValidationError("To nie jest link do portfolio")
      }
    })

    obj.projectUrls.split(' ').forEach(el => {
      if (!/^(http(s?):\/\/)?(www\.)?github/.test(el)) {
        throw new ValidationError("To nie jest link do projektu w GitHub")
      }
    })

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


  static async getCvOneStudentEdit(id:string): Promise<StudentEntity[]> {
    const [results] = await pool.execute("SELECT `firstName`, `lastName`, `githubUsername`, `phoneNumber`, `expectedTypeWork`, `targetWorkCity`, `expectedContractType`, `expectedSalary`, `canTakeApprenticeship`, `monthsOfCommercialExp`, `bio`, `education`, `courses`, `workExperience`, `portfolioUrls`, `bonusProjectUrls`, `projectUrls` FROM `students` WHERE `studentId` = :id",{
      id
    }) as StudentRecordResult;
    return results;
  }

    static async statusChange(action:'reserve'| 'employ' | 'disinterest',studentId:string, hrId:string|null):Promise<string> {

    //active - 1
     // reserved - 2
     // hired - 3
    let userStatus=0;
    let reservationExpiresOn:null|Date;
    let message='';
    if (action === 'reserve') {
      const [results] = await pool.execute("SELECT * FROM `students` WHERE `studentId`=:studentId AND `userStatus`=2",{studentId} );
      if(results) throw new ValidationError('Student został już zarezerwowany');
      console.log(results);
      const now = new Date();
      reservationExpiresOn = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
      userStatus = 2;
      message= 'Kursant został zarezerwowany';
    } else if (action === 'employ') {
      reservationExpiresOn = null;
      userStatus = 3;
      message= 'Kursant został zatrudniony';
      await sendMail('headhunter@testHeadHunter.oi','student o id:'+studentId+' został zatrudniony','student o id:'+studentId+' został zatrudniony') //@TODO do zastanowienia się jaki tekst ma być wysyłany
    } else if (action === 'disinterest'){
      reservationExpiresOn = null;
      userStatus = 1;
      hrId=null;
      message= 'Zgłoszono brak zainteresowania kursantem'
    }
    else{
      throw new ValidationError('Nie udało się wykonać zmiany statusu');
    }

    const [results] = await pool.execute("UPDATE `students` SET `reservedBy` = :hrId, `userStatus` = :userStatus, `reservationExpiresOn` = :reservationExpiresOn  WHERE `studentId` = :studentId",{hrId, userStatus, reservationExpiresOn, studentId})
     if (results) {
       return message;
     } else {
       throw new ValidationError('Nie udało się wykonać zmiany statusu');
     }
  }


  static async getCvOneStudent(id:string): Promise<StudentEntity[]> {
    const [results] = await pool.execute("SELECT `firstName`, `lastName`, `githubUsername`, `phoneNumber`, `expectedTypeWork`, `targetWorkCity`, `expectedContractType`, `expectedSalary`, `canTakeApprenticeship`, `monthsOfCommercialExp`, `bio`, `education`, `courses`, `workExperience`, `portfolioUrls`, `bonusProjectUrls`, `projectUrls`, `userStatus`, `courseCompletion`, `courseEngagement`, `projectDegree`, `teamProjectDegree` FROM `students` WHERE `studentId` = :id",{
      id
    }) as StudentRecordResult;
    return results;
  }


  async update(): Promise<string> {
    await pool.execute("UPDATE `students` SET `firstName` = :firstName, `lastName` = :lastName, `phoneNumber` = :phoneNumber, `githubUsername` = :githubUsername, `portfolioUrls` = :portfolioUrls, `projectUrls` = :projectUrls, `bio` = :bio, `expectedTypeWork` = :expectedTypeWork, `targetWorkCity` = :targetWorkCity, `expectedContractType` = :expectedContractType, `expectedSalary` = :expectedSalary, `canTakeApprenticeship` = :canTakeApprenticeship, `monthsOfCommercialExp` = :monthsOfCommercialExp, `education` = :education, `workExperience` = :workExperience, `courses` = :courses, `bonusProjectUrls` = :bonusProjectUrls WHERE `studentId` = :studentId", this);
    return this.studentId;
  }
}