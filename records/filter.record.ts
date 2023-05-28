import { pool } from '../config/db';
import { AvailableStudent, FilterQuery } from '../types';
import { FieldPacket } from 'mysql2';

type AvailableStudentResults = [AvailableStudent[], FieldPacket[]];
type AllRecordsStudentResults = [{ totalCount:number }[],FieldPacket[]];

export class FilterRecord implements FilterQuery{
    remoteWork: boolean|string;
    inOffice: boolean|string;
    employmentContract: boolean|string;
    b2b: boolean|string;
    mandateContract: boolean|string;
    workContract: boolean|string;
    min: string|number;
    max: string|number;
    canTakeApprenticeship: boolean|null|string;
    monthsOfCommercialExp: string|null;
    courseCompletion: string|number;
    courseEngagement: string|number;
    projectDegree: string|number;
    teamProjectDegree: string|number;
    page: string|number;
    rowsPerPage : string|number;
    hrId?: string;

    constructor(obj:FilterQuery) {
        //@TODO można dodać walidacje danych
        this.remoteWork = obj.remoteWork;
        this.inOffice = obj.inOffice;
        this.employmentContract = obj.employmentContract;
        this.b2b = obj.b2b;
        this.mandateContract = obj.mandateContract;
        this.workContract = obj.workContract;
        this.min = obj.min;
        this.max = obj.max;
        this.canTakeApprenticeship = obj.canTakeApprenticeship;
        this.monthsOfCommercialExp = obj.monthsOfCommercialExp;
        this.courseCompletion = obj.courseCompletion;
        this.courseEngagement = obj.courseEngagement;
        this.projectDegree = obj.projectDegree;
        this.teamProjectDegree = obj.teamProjectDegree;
        this.page = obj.page;
        this.rowsPerPage = obj.rowsPerPage;
        this.hrId=obj.hrId;
    }

    change(){
        let query = '';
        if(this.remoteWork === 'true' || this.inOffice === 'true'){
            query +=  '`expectedTypeWork` IN (:remoteWork, :inOffice)';
        }
        if(this.employmentContract === true || this.b2b === true || this.mandateContract === true || this.workContract === true){
            if(query !== ''){
                query += ' AND ';
            }
            query += '`expectedContractType` IN (:employmentContract, :b2b,:mandateContract,:workContract)'
        }
        if(this.canTakeApprenticeship !== 'null'){
            if(query !== ''){
                query += ' AND ';
            }
            query += '`canTakeApprenticeship` = :canTakeApprenticeship'
        }
        if(query !== ''){
            query += ' AND ';
        }
        this.remoteWork = this.remoteWork === 'true' ? '2' : '9';
        this.inOffice = this.inOffice === 'true' ? '1' : '9';
        this.employmentContract = this.employmentContract === 'true' ? '1' : '9';
        this.b2b = this.b2b === 'true' ? '2' : '9';
        this.mandateContract = this.mandateContract === 'true' ? '3' : '9';
        this.workContract = this.workContract === 'true' ? '4' : '9';
        this.page = Number(this.page);
        this.rowsPerPage = Number(this.rowsPerPage);
        this.page = this.page * this.rowsPerPage;
        return query;
    }

    async get():Promise<AvailableStudent[] | null>{
        const query = this.change();
        const [results] = await pool.execute('SELECT `studentId`, `firstName`,`lastName`, `courseCompletion`, `courseEngagement`, `projectDegree`, `teamProjectDegree`, `expectedTypeWork`, `targetWorkCity`, `expectedContractType`, `expectedSalary`, `canTakeApprenticeship` ,`monthsOfCommercialExp`  FROM `students` WHERE ' +
          query +
          '`expectedSalary` BETWEEN :min AND :max AND `monthsOfCommercialExp` >= :monthsOfCommercialExp ' +
          "AND `courseCompletion` >= :courseCompletion AND `courseEngagement` >= :courseEngagement AND `projectDegree` >= :projectDegree AND `teamProjectDegree` >= :teamProjectDegree AND `userStatus`= '1' LIMIT :rowsPerPage OFFSET :page" , this) as AvailableStudentResults;
        return results.length === 0 ? null : results;
    }

    async allRecordsStudent():Promise<number>| null{
        const query = this.change();
        const [results] = await pool.execute('SELECT COUNT(*) AS `totalCount`  FROM `students` WHERE ' +
          query +
          '`expectedSalary` BETWEEN :min AND :max AND `monthsOfCommercialExp` >= :monthsOfCommercialExp ' +
          "AND `courseCompletion` >= :courseCompletion AND `courseEngagement` >= :courseEngagement AND `projectDegree` >= :projectDegree AND `teamProjectDegree` >= :teamProjectDegree AND `userStatus`= '1'"  , this) as AllRecordsStudentResults;
        return results.length === 0 ? null : results[0].totalCount
    }

    async getReserved():Promise<AvailableStudent[] | null>{
        const query = this.change();
        const [results] = await pool.execute('SELECT `studentId`, `firstName`,`lastName`, `courseCompletion`, `courseEngagement`, `projectDegree`, `teamProjectDegree`, `expectedTypeWork`, `targetWorkCity`, `expectedContractType`, `expectedSalary`, `canTakeApprenticeship` ,`monthsOfCommercialExp`, `githubUsername`, `reservationExpiresOn`  FROM `students` WHERE ' +
          query +
          '`expectedSalary` BETWEEN :min AND :max AND `monthsOfCommercialExp` >= :monthsOfCommercialExp ' +
          "AND `courseCompletion` >= :courseCompletion AND `courseEngagement` >= :courseEngagement AND `projectDegree` >= :projectDegree AND `teamProjectDegree` >= :teamProjectDegree  AND `reservedBy` = :hrId AND `userStatus`= '2' LIMIT :rowsPerPage OFFSET :page" , this) as AvailableStudentResults;

        return results.length === 0 ? null : results;
    }
    async allRecordsReservedStudent():Promise<number>| null{
        const query = this.change();
        const [results] = await pool.execute('SELECT COUNT(*) AS `totalCount` FROM `students` WHERE ' +
          query +
          '`expectedSalary` BETWEEN :min AND :max AND `monthsOfCommercialExp` >= :monthsOfCommercialExp ' +
          "AND `courseCompletion` >= :courseCompletion AND `courseEngagement` >= :courseEngagement AND `projectDegree` >= :projectDegree AND `teamProjectDegree` >= :teamProjectDegree  AND `reservedBy` = :hrId AND `userStatus`= '2' LIMIT :rowsPerPage OFFSET :page" , this) as AllRecordsStudentResults;

        return results.length === 0 ? null : results[0].totalCount
    }
}

// console.log(
//   'remoteWork:', this.remoteWork,
//   'inOffice:', this.inOffice,
//   'employmentContract:', this.employmentContract,
//   'b2b:', this.b2b,
//   'mandateContract:', this.mandateContract,
//   'workContract:', this.workContract,
//   'min:', this.min,
//   'max:', this.max,
//   'canTakeApprenticeship:', this.canTakeApprenticeship,
//   'monthsOfCommercialExp:', this.monthsOfCommercialExp,
//   'courseCompletion:', this.courseCompletion,
//   'courseEngagement:', this.courseEngagement,
//   'projectDegree:', this.projectDegree,
//   'teamProjectDegree:', this.teamProjectDegree,
//   'page:', this.page,
//   'rowsPerPage:', this.rowsPerPage
// );