export interface FilterQuery {
  remoteWork: boolean|string,
  inOffice: boolean|string,
  employmentContract: boolean|string,
  b2b: boolean|string,
  mandateContract: boolean|string,
  workContract: boolean|string,
  min: string|number,
  max: string|number,
  canTakeApprenticeship: boolean|null|string,
  monthsOfCommercialExp: string|null,
  courseCompletion: string|number,
  courseEngagement: string|number,
  projectDegree: string|number,
  teamProjectDegree: string|number,
  page: string|number,
  rowsPerPage : string|number,
  hrId?:string|null,
}

export interface FilterCon {
  expectedTypeWork: {
    remoteWork: boolean,
    inOffice: boolean
  },
  expectedContractType: {
    employmentContract: boolean,
    b2b: boolean,
    mandateContract: boolean,
    workContract: boolean
  },
  expectedSalary: {
    min: string|number,
    max: string|number,
  },
  canTakeApprenticeship: boolean|null|string,
  monthsOfCommercialExp: string|null,
  courseCompletion: string|number,
  courseEngagement: string|number,
  projectDegree: string|number,
  teamProjectDegree: string|number
}

export interface Pagination{
  page: number,
  rowsPerPage:number,
  allRecords:number
}