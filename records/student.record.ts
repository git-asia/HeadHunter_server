import { FieldPacket } from "mysql2";
import { ValidationError } from "../utils/errors";
import { StudentEntity } from "../types";
import { pool } from "../config/db-sample";

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


  static pagination(page:number, perPage:number) {
    const quantity = (page - 1) * perPage
    return ` LIMIT ${perPage} OFFSET ${quantity}`
}

static filterBySearch(search:string) {
  let searchQuery = ' '

  if (search !==  undefined){
    searchQuery += ` AND targetWorkCity LIKE '%${search}%'`
  }
  return searchQuery
}

static filterByPayment(min:string, max:string) {
  let paymentFilter = ' '
  if (min && max !== undefined) {
    paymentFilter += ` AND expectedSalary BETWEEN ${min} AND ${max}`
  }
  else if (min !==  undefined){
    paymentFilter += ` AND expectedSalary > ${min}`
  }
  else if (max !==  undefined){
    paymentFilter += ` AND expectedSalary < ${max}`
  }
  return paymentFilter
}

static filterBy(canTakeApprenticeship:String, monthsOfCommercialExp:string) {
  let filterQuery = ' '
  if (canTakeApprenticeship !== undefined ) {
    filterQuery += ` AND canTakeApprenticeship = '${canTakeApprenticeship}'`
  }

  if (monthsOfCommercialExp !== undefined ) {
    filterQuery += ` AND monthsOfCommercialExp = '${monthsOfCommercialExp}'`
  }

  return filterQuery
}  

static filterStarRating(courseCompletion:String, courseEngagement:string, projectDegree:string, teamProjectDegree:string) {
  let starRating = ' '
  
  if (courseCompletion !== undefined ) {
    starRating += ` AND courseCompletion = '${courseCompletion}'`
  }

  if (courseEngagement !== undefined ) {
    starRating += ` AND courseEngagement = '${courseEngagement}'`
  }

  if (projectDegree !== undefined ) {
    starRating += ` AND projectDegree = '${projectDegree}'`
  }

  if (teamProjectDegree !== undefined ) {
    starRating += ` AND teamProjectDegree = '${teamProjectDegree}'`
  }


  return starRating

}




  static async studentShortInfo(data:any ): Promise<StudentRecord[]> {
    let query = "SELECT `firstName`,`lastName`, `courseCompletion`, `courseEngagement`, `projectDegree`,`teamProjectDegree`,`expectedTypeWork`,`targetWorkCity`,`expectedContractType`,`expectedSalary`,`canTakeApprenticeship`,`monthsOfCommercialExp` FROM `students` WHERE 1=1"
    query += this.filterBySearch(data.search)
    query += this.filterBy(data.canTakeApprenticeship, data.monthsOfCommercialExp)
    query += this.filterByPayment(data.min, data.max)
    // query += this.filterStarRating(data.courseCompletion, data.courseEngagement, data.projectDegree, data.teamProjectDegree)
    query += this.pagination(data.page, data.perPage)

    console.log(query)
    const [results] = await pool.execute(query) as StudentRecordResult;
    return results;
}
}