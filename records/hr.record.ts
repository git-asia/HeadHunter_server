import { HrEntity } from '../types';
import { ValidationError } from '../utils/errors';
import { pool } from '../config/db';

type HrResult = { fullName:string };

export class HrRecord implements HrEntity {
    hrId: string;
    fullName: string;
    company: string;
    maxReservedStudents: number;

    constructor(obj: HrEntity) {
    
        if (!obj.fullName) {
            throw new ValidationError('HR musi posiadać imię i nazwisko');
        }
        if (!obj.company) {
            throw new ValidationError('Firma HR musi być podana');
        }
        if (obj.maxReservedStudents < 1 || obj.maxReservedStudents > 999) {
            throw new ValidationError('HR musi mieć ustalony limit w zakresie 1-999');
        }

        this.hrId = obj.hrId;
        this.fullName = obj.fullName;
        this.company = obj.company;
        this.maxReservedStudents = obj.maxReservedStudents;
    }

    async insert():Promise<void>{
        await pool('hrs')
            .insert({
                hrId: this.hrId,
                fullName: this.fullName,
                company: this.company,
                maxReservedStudents: this.maxReservedStudents,
            }).then(() => {
                console.log('Użytkownik HR został dodany');
            }).catch(() => {
                throw new ValidationError('Dodanie użytkownika HR zakończone niepowodzeniem.')
            });

    }

    static async getName(hrId:string): Promise<HrResult> {
        const results = await pool('hrs')
            .select('fullName')
            .where({ hrId })
            .first() as HrResult ;

        return results;
    }

}