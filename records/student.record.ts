import { FieldPacket } from 'mysql2';
import { ValidationError } from '../utils/errors';
import { StudentEntity, filterData, filterEntity } from '../types';
import { pool } from '../config/db-sample';

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
  canTakeApprenticeship: number;
  monthsOfCommercialExp: number;
  education: string | null;
  workExperience: string | null;
  courses: string | null;
  userStatus: string;
  courseCompletion: number;
  courseEngagement: number;
  projectDegree: number;
  teamProjectDegree: number;
  bonusProjectUrls: string | null;
  reservedBy: string | null;
  reservationExpiresOn: Date;

  constructor(obj: StudentEntity) {
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

  static pagination(page: number, perPage: number): string {
    const quantity = (page - 1) * perPage;
    return ` LIMIT ${perPage} OFFSET ${quantity}`;
  }

  static filterBySearch(search: string): string {
    let searchQuery = ' ';

    if (search !== undefined) {
      searchQuery += ` AND targetWorkCity LIKE '%${search}%'`;
    }
    return searchQuery;
  }

  static filterByPayment(min: string, max: string): string {
    let paymentFilter = ' ';
    if (min && max !== undefined) {
      paymentFilter += ` AND expectedSalary BETWEEN ${min} AND ${max}`;
    } else if (min !== undefined) {
      paymentFilter += ` AND expectedSalary >= ${min}`;
    } else if (max !== undefined) {
      paymentFilter += ` AND expectedSalary <= ${max}`;
    }

    return paymentFilter;
  }

  static filterBy(
    canTakeApprenticeship: string,
    monthsOfCommercialExp: string,
    expectedTypeWork: string,
    expectedContractType: string,
  ): string {
    let filterQuery = ' ';
    const tab: filterData[] = [
      {
        expectedTypeWork: expectedTypeWork,
      },
      {
        expectedContractType: expectedContractType,
      },
    ];
    tab.forEach((obj) => {
      for (let key in obj) {
        const value = obj[key];
        if (value !== undefined) {
          filterQuery += ` AND`;
          filterQuery += ` ${key} IN (${value.split('')})`;
        }
      }
    });
    if (canTakeApprenticeship !== undefined) {
      filterQuery += ` AND canTakeApprenticeship = '${canTakeApprenticeship}'`;
    }

    if (monthsOfCommercialExp !== undefined) {
      filterQuery += ` AND monthsOfCommercialExp >= '${monthsOfCommercialExp}'`;
    }

    return filterQuery;
  }

  static filterStarRating(
    courseCompletion: string,
    courseEngagement: string,
    projectDegree: string,
    teamProjectDegree: string,
  ): string {
    let starRating = ' ';
    const tab: filterData[] = [
      {
        courseCompletion: courseCompletion,
      },
      {
        courseEngagement: courseEngagement,
      },
      {
        projectDegree: projectDegree,
      },
      {
        teamProjectDegree: teamProjectDegree,
      },
    ];

    tab.forEach((obj) => {
      for (let key in obj) {
        const value = obj[key];
        if (value !== undefined) {
          starRating += ` AND`;
          starRating += ` ${key} IN (${value.split('')})`;
        }
      }
    });

    return starRating;
  }

  static async getFilteredAll(data: any): Promise<StudentRecord[]> {
    let query =
      'SELECT `firstName`,`lastName`, `courseCompletion`, `courseEngagement`, `projectDegree`,`teamProjectDegree`,`expectedTypeWork`,`targetWorkCity`,`expectedContractType`,`expectedSalary`,`canTakeApprenticeship`,`monthsOfCommercialExp` FROM `students` WHERE 1=1';
    query += this.filterBySearch(data.search);
    query += this.filterBy(
      data.canTakeApprenticeship,
      data.monthsOfCommercialExp,
      data.expectedTypeWork,
      data.expectedContractType,
    );
    query += this.filterByPayment(data.min, data.max);
    query += this.filterStarRating(
      data.courseCompletion,
      data.courseEngagement,
      data.projectDegree,
      data.teamProjectDegree,
    );
    query += this.pagination(data.page, data.perPage);
    const [results] = (await pool.execute(query)) as StudentRecordResult;
    return results;
  }
}
