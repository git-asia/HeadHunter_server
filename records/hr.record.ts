import {HrEntity} from "../types";
import {ValidationError} from "../utils/errors";

export class HrRecord implements HrEntity {
    hrId: string;
    fullName: string;
    company: string;
    maxReservedStudents: number;

    constructor(obj: HrEntity) {
        if (!obj.fullName) {
            throw new ValidationError("HR musi posiadać imię i nazwisko");
        }
        if (!obj.company) {
            throw new ValidationError("Firma HR musi być podana");
        }
        if (obj.maxReservedStudents < 1 || obj.maxReservedStudents > 999) {
            throw new ValidationError("HR musi mieć ustalony limit w zakresie 1-999");
        }

        this.fullName = obj.fullName;
        this.company = obj.company;
        this.maxReservedStudents = obj.maxReservedStudents;
    }
}