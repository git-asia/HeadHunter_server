import { pool } from '../config/db';
import { AvailableStudent, FilterQuery } from '../types';

export class StudentFilter implements FilterQuery{
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
        //@TODO data validation can be added
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
        const results = await pool('students')
            .select(
                'studentId',
                'firstName',
                'lastName',
                'courseCompletion',
                'courseEngagement',
                'projectDegree',
                'teamProjectDegree',
                'expectedTypeWork',
                'targetWorkCity',
                'expectedContractType',
                'expectedSalary',
                'canTakeApprenticeship',
                'monthsOfCommercialExp'
            )
            .whereRaw(query)
            .where('expectedSalary', '>=', this.min)
            .where('expectedSalary', '<=', this.max)
            .where('monthsOfCommercialExp', '>=', this.monthsOfCommercialExp)
            .where('courseCompletion', '>=', this.courseCompletion)
            .where('courseEngagement', '>=', this.courseEngagement)
            .where('projectDegree', '>=', this.projectDegree)
            .where('teamProjectDegree', '>=', this.teamProjectDegree)
            .where('userStatus', '1')
            .limit(Number(this.rowsPerPage))
            .offset(Number(this.page)) as AvailableStudent[];
        
        return results.length === 0 ? null : results;
    }

    async allRecordsStudent():Promise<any>{
        const query = this.change();
        const results = await pool('students')
            .count('* as totalCount')
            .whereRaw(query)
            .where('expectedSalary', '>=', this.min)
            .where('expectedSalary', '<=', this.max)
            .where('monthsOfCommercialExp', '>=', this.monthsOfCommercialExp)
            .where('courseCompletion', '>=', this.courseCompletion)
            .where('courseEngagement', '>=', this.courseEngagement)
            .where('projectDegree', '>=', this.projectDegree)
            .where('teamProjectDegree', '>=', this.teamProjectDegree)
            .where('userStatus', '1')
            .first() as { totalCount:number };

        return results.totalCount;
    }

    async getReserved():Promise<AvailableStudent[] | null>{
        const query = this.change();
        const results = await pool('students')
            .select(
                'studentId',
                'firstName',
                'lastName',
                'courseCompletion',
                'courseEngagement',
                'projectDegree',
                'teamProjectDegree',
                'expectedTypeWork',
                'targetWorkCity',
                'expectedContractType',
                'expectedSalary',
                'canTakeApprenticeship',
                'monthsOfCommercialExp',
                'githubUsername',
                'reservationExpiresOn'
            )
            .whereRaw(query)
            .where('expectedSalary', '>=', this.min)
            .where('expectedSalary', '<=', this.max)
            .where('monthsOfCommercialExp', '>=', this.monthsOfCommercialExp)
            .where('courseCompletion', '>=', this.courseCompletion)
            .where('courseEngagement', '>=', this.courseEngagement)
            .where('projectDegree', '>=', this.projectDegree)
            .where('teamProjectDegree', '>=', this.teamProjectDegree)
            .where('reservedBy', this.hrId)
            .where('userStatus', '2')
            .limit(Number(this.rowsPerPage))
            .offset(Number(this.page)) as AvailableStudent[];

        return results.length === 0 ? null : results;
    }
    async allRecordsReservedStudent():Promise<any>{
        const query = this.change();
        const results = await pool('students')
            .count('* as totalCount')
            .whereRaw(query)
            .where('expectedSalary', '>=', this.min)
            .where('expectedSalary', '<=', this.max)
            .where('monthsOfCommercialExp', '>=', this.monthsOfCommercialExp)
            .where('courseCompletion', '>=', this.courseCompletion)
            .where('courseEngagement', '>=', this.courseEngagement)
            .where('projectDegree', '>=', this.projectDegree)
            .where('teamProjectDegree', '>=', this.teamProjectDegree)
            .where('reservedBy', this.hrId)
            .where('userStatus', '2')
            .first() as { totalCount:number };

        return Number(results.totalCount);
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