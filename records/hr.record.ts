import {HrEntity} from "../types";
import {ValidationError} from "../utils/errors";
import {UserRecord} from "./user.record";

export class HrRecord implements HrEntity {
    hrId: string;
    email: string;
    fullName: string;
    company: string;
    maxReservedStudents: number;

    constructor(obj: HrEntity) {
        if (!obj.email) {
            throw new ValidationError("Adres e-mail jest konieczny");
        }
        if (!obj.email.includes('@')) {
            throw new ValidationError("To nie jest prawidłowy adres e-mail");
        }
        if (this.checkMail !== null) {
            throw new ValidationError("Taki adres e-mail już istnieje w bazie");
        }
        if (!obj.fullName) {
            throw new ValidationError("HR musi posiadać imię i nazwisko");
        }
        if (!obj.company) {
            throw new ValidationError("Firma HR musi być podana");
        }
        if (obj.maxReservedStudents < 1 || obj.maxReservedStudents > 999) {
            throw new ValidationError("HR musi mieć ustalony limit w zakresie 1-999");
        }


        this.email = obj.email;
        this.fullName = obj.fullName;
        this.company = obj.company;
        this.maxReservedStudents = obj.maxReservedStudents;
    }

    async checkMail(email: string) {
        return await UserRecord.checkEmail(email);
    }
}