import { ValidationError } from '../utils/errors';
import { Octokit } from '@octokit/core';
import { pool } from '../config/db';
import { StudentEntity, UpdateAction } from '../types';
import { sendMail } from '../utils/sendMail';
import { open } from 'fs/promises';
import { unlink } from 'node:fs';
import { UserRecord } from './user.record';
import { v4 as uuid } from 'uuid';

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

const checkGithubUsername = async (githubUsername: string): Promise<string | null> => {
    const results = await pool('students')
        .select('studentId')
        .where({ githubUsername })
        .first() as { studentId : string };

    return results === null ? null : results.studentId;
}

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

          if ((checkGithubUsername(this.githubUsername) !== null)&&(this.githubUsername!=='')) {
            
              throw new ValidationError('Taki użytkownik GitHuba już istnieje');
          }
      }

      if (!obj.firstName) {
          throw new ValidationError('Musisz podać imię');
      }

      if (!obj.lastName) {
          throw new ValidationError('Musisz podać nazwisko');
      }

      if (checkGitHub(obj.githubUsername) === null) {
          throw new ValidationError('Nie ma takiego konta GitHub');
      }

      const phoneRegex = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
      if (!phoneRegex.test(obj.phoneNumber) && !obj.phoneNumber) {
          throw new ValidationError('Podaj poprawny numer telefonu lub nie podawaj żadnego');
      }

      if (obj.monthsOfCommercialExp < 0) {
          throw new ValidationError('Długość doświadczenia musi być liczbą nieujemną')
      }
      if (isNaN(obj.expectedSalary)) {
          throw new ValidationError('Oczekiwana wysokość pensji musi być liczbą')
      }

      if (obj.courseCompletion < 0 || obj.courseCompletion > 5){
          throw new ValidationError('Ocena musi być w zakresie 0-5')
      }

      if (obj.courseEngagement < 0 || obj.courseEngagement > 5){
          throw new ValidationError('Ocena musi być w zakresie 0-5')
      }

      if (obj.projectDegree < 0 || obj.projectDegree > 5){
          throw new ValidationError('Ocena musi być w zakresie 0-5')
      }

      if (obj.teamProjectDegree < 0 || obj.teamProjectDegree > 5){
          throw new ValidationError('Ocena musi być w zakresie 0-5')
      }

      if (obj.expectedTypeWork < 1 || obj.expectedTypeWork > 5){
          throw new ValidationError('Typ pracy musi być w zakresie 1-5')
      }

      if (obj.expectedContractType < 1 || obj.expectedContractType > 4){
          throw new ValidationError('Typ kontraktu musi być w zakresie 1-4')
      }
    
      obj.portfolioUrls.split(' ').forEach(el => {
          if ((!/^(ftp|http|https):\/\/[^ "]+$/.test(el)&&(el!==''))) {
              throw new ValidationError('To nie jest link do portfolio')
          }
      })

      obj.projectUrls.split(' ').forEach(el => {
          if (!/^(http(s?):\/\/)?(www\.)?github/.test(el)) {
              throw new ValidationError('To nie jest link do projektu w GitHub')
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

  static async getCvOneStudentEdit(studentId:string): Promise<StudentEntity> {

      const results = await pool('students')
          .select(
              'firstName',
              'lastName',
              'githubUsername',
              'phoneNumber',
              'expectedTypeWork',
              'targetWorkCity',
              'expectedContractType',
              'expectedSalary',
              'canTakeApprenticeship',
              'monthsOfCommercialExp',
              'bio',
              'education',
              'courses',
              'workExperience',
              'portfolioUrls',
              'bonusProjectUrls',
              'projectUrls'
          )
          .where({ studentId })
          .first();

      return results;
  }

  static async statusChange(action:UpdateAction, studentId:string, hrId:string):Promise<string> {

      //active - 1
      // reserved - 2
      // hired - 3

      let userStatus=0;
      let reservationExpiresOn:null|Date;
      let message='';

      if (action === UpdateAction.reserve) {
          const results = await pool('students')
              .select('studentId')
              .where('studentId', studentId)
              .where('userStatus', 2)
              .first() as string;

          // const [results] = await pool.execute('SELECT `studentId` FROM `students` WHERE `studentId`=:studentId AND `userStatus`= 2',{ studentId } ) as unknown as StatusResult;
          if(results === null) throw new ValidationError('Student został już zarezerwowany');
          const now = new Date();
          reservationExpiresOn = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
          userStatus = UpdateAction.reserve;
          message= 'Kursant został zarezerwowany';
      } else if (action === UpdateAction.employ) {
          reservationExpiresOn = null;
          userStatus = UpdateAction.employ;
          message= 'Kursant został zatrudniony';
          await sendMail('headhunter@testHeadHunter.oi','student o id:'+studentId+' został zatrudniony','student o id:'+studentId+' został zatrudniony') //@TODO to consider what text should be sent
      } else if (action === UpdateAction.disinterest){
          reservationExpiresOn = null;
          userStatus = UpdateAction.disinterest;
          hrId=null;
          message= 'Zgłoszono brak zainteresowania kursantem'
      }
      else{
          throw new ValidationError('Nie udało się wykonać zmiany statusu');
      }

      const results = await pool('students')
          .where({ studentId })
          .update({
              reservedBy: hrId,
              userStatus,
              reservationExpiresOn,
          });

      if (results) {
          return message;
      } else {
          throw new ValidationError('Nie udało się wykonać zmiany statusu');
      }
  }

  static async getCvOneStudent(studentId:string): Promise<StudentEntity> {

      const results = await pool('students')
          .select(
              'firstName',
              'lastName',
              'githubUsername',
              'phoneNumber',
              'expectedTypeWork',
              'targetWorkCity',
              'expectedContractType',
              'expectedSalary',
              'canTakeApprenticeship',
              'monthsOfCommercialExp',
              'bio',
              'education',
              'courses',
              'workExperience',
              'portfolioUrls',
              'bonusProjectUrls',
              'projectUrls',
              'userStatus',
              'courseCompletion',
              'courseEngagement',
              'projectDegree',
              'teamProjectDegree'
          )
          .where({ studentId })
          .first() as StudentEntity;
      console.log(results);
      return results;
  }

  async update(): Promise<string> {
      await pool('students')
          .where('studentId', this.studentId)
          .update({
              firstName: this.firstName,
              lastName: this.lastName,
              phoneNumber: this.phoneNumber,
              githubUsername: this.githubUsername,
              portfolioUrls: this.portfolioUrls,
              projectUrls: this.projectUrls,
              bio: this.bio,
              expectedTypeWork: this.expectedTypeWork,
              targetWorkCity: this.targetWorkCity,
              expectedContractType: this.expectedContractType,
              expectedSalary: this.expectedSalary,
              canTakeApprenticeship: this.canTakeApprenticeship,
              monthsOfCommercialExp: this.monthsOfCommercialExp,
              education: this.education,
              workExperience: this.workExperience,
              courses: this.courses,
              bonusProjectUrls: this.bonusProjectUrls,
          });
      
      return this.studentId;
  }

  static async addNewStudent(fileName: string): Promise<void> {
      const FILE_NAME = `./utils/download/${fileName}`;
      let file;
      try {
          file = await open(FILE_NAME);
          for await (const line of file.readLines()) {
              const lineValue = line.split(',');
              const email = lineValue[0];
              const bonusProjectUrls = parseInt(lineValue[1]);
              const courseCompletion = parseInt(lineValue[2]);
              const courseEngagement = parseInt(lineValue[3]);
              const projectDegree = parseInt(lineValue[4]);
              const validation = (email.includes('@'))&&(bonusProjectUrls>0)&&(bonusProjectUrls<6)&&(courseCompletion>0)&&(courseCompletion<6)&&(courseEngagement>0)&&(courseEngagement<6)&&(projectDegree>0)&&(projectDegree<6);
              if ((await UserRecord.checkEmail(email)===null)&&validation){
                  const userId = uuid();
                  await pool('users')
                      .insert({
                          email,
                          userId
                      });

                  const newToken: string = await UserRecord.addToken(userId);

                  await pool('students')
                      .insert({
                          studentId: userId,
                          bonusProjectUrls,
                          courseCompletion,
                          courseEngagement,
                          projectDegree,
                          teamProjectDegree: lineValue[4], //@TODO dlaczego do teamProjekt jest przypisana wartość projectDegree przed parseInt
                          githubUsername: null,
                      });

                  await sendMail('headhunter@testHeadHunter.oi','Informacja o dodaniu do bazy kursantów MegaK','Informujemy o dodaniu Cię do listy kursantów. W ciągu 48 godzin należy zalogować się do systemu, zmienić hasło i uzupełnić dane.', `
        <p>Link do logowania: <a href="http://localhost:5173/log/${newToken}">http://localhost:5173/log/${newToken}</a></p>`) //@TODO change of website address
              }
          }
      } catch (e) {
          console.log(e);
          throw new ValidationError('Nie udało się dodać kursantów');
      } finally {
          await file?.close();
          unlink(FILE_NAME, (err) => {
              if (err) throw err;
          });
      }
  }
}