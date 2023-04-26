import {HrEntity} from "../types";
import {ValidationError} from "../utils/errors";

export class HrRecord implements HrEntity {
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
        // @TODO sprawdzić, czy email unikalny
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
}