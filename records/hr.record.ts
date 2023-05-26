import { HrEntity } from '../types';
import { ValidationError } from '../utils/errors';
import { pool } from '../config/db';
import { FieldPacket } from 'mysql2';

type HrResult = [HrEntity[], FieldPacket[]];

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
        await pool.execute('INSERT INTO `hrs`(`hrId`, `fullName`, `company`, `maxReservedStudents`) VALUES (:hrId, :fullName, :company, :maxReservedStudents)', this);

    }

    static async getName(id:string): Promise<HrEntity[]> {
        const [results] = await pool.execute('SELECT `fullName` FROM `hrs` WHERE `hrId` = :id',{
            id
        }) as HrResult;
        return results;
    }

}