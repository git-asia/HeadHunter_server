import { Request, Response, Router } from 'express';
import { UserRecord } from '../records/user.record';
import { ValidationError } from '../utils/errors';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserEntity } from '../types';

export const userRouter = Router();

userRouter

    .post('/login', async (req: Request, res: Response) => {
        const params = { ...req.body } as UserEntity;
        const newParams = new UserRecord(params);
        const response = await newParams.checkPassword();
        const { id, state } = response;
        if (id) {
            console.log('Dane logowania są prawidłowe');
            res.json({ id, state });
            // const token = jwt.sign({ email: newParams.email }, /* @todo SET SECRET KEY process.env.secret_key*/'SEKRET', { expiresIn: '24h' });
            // res.json({ token });
        } else {
            throw new ValidationError('Błędne hasło')
        }

    })
    .post('/refresh', async (req, res) => {
        // refresh jwt
    })

    .delete('/logout', async (req, res) => {
        // czyszczenie tokenów i wylogowanie
    })

    .get('/about-me', async (req, res) => {
        // id użytkownika przekazane w tokenie wymaga id użytkownika i zwraca wszystkie
        // dane wymagane do wyświetlenia danych kursanta do edycji ich pobiera status
        // kursanta i ewentualnych rezerwacjach od hr-u (nie jest wymagane)
    })

    .post('/about-me', async (req, res) => {
        const userId = req.body

        // przyjmuje formularz dodania/edycji danych i na jego podstawie wprowadza
        // zmiany w bazie
    })

    .post('/my-status', async (req, res) => {
        const { studentId, userStatus } = req.body;
        await UserRecord.updateStudentStatus(studentId, userStatus);
        res.json(true);
        // przyjmuje dane o statusie (zatrudniony lub nie)  i  wprowadza zmiany w bazie
    })

    .get('/token/:token', async (req: Request, res: Response) => {
        const userId: string | null = await UserRecord.checkToken(req.params.token);
        res.json(userId);
    })

    .get('/getemail/:id', async (req: Request, res: Response) => {
        const userEmail: string = await UserRecord.getEmail(req.params.id);
        res.json(userEmail);
    })

    .get('/email/:email', async (req: Request, res: Response) => {
        const userId: string | null = await UserRecord.checkEmail(req.params.email);
        if (userId === null) {
            throw new ValidationError('Nie ma takiego adresu e-mail');
        }
        await UserRecord.addToken(userId);
        res.json(req.params.email);
    })

    .patch('/newpass', async (req: Request, res: Response) => {
        const { id, pass, pass2 } = req.body;

        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

        if (!passwordRegex.test(pass)) {
            throw new ValidationError('Hasło musi mieć co najmniej 8 znaków, składać się z dużych i małych liter, cyfr i znaków specjalnych');
        }
        if (pass !== pass2) {
            throw new ValidationError('Hasła są różne');
        }
        const hashPassword = await hash(pass, 10);
        await UserRecord.updatePassword(id, hashPassword);
        res.json(true);
    })

    .patch('/changemail', async (req: Request, res: Response) => {
        const { id, email } = req.body;
        const isEmail = await UserRecord.checkEmail(email);

        if(isEmail!==null){
            throw new ValidationError('Taki e-mail już istnieje w systemie')
        }

        if (!email.includes('@')) {
            throw new ValidationError('To nie jest poprawny adres e-mail');
        }
        await UserRecord.updateEmail(id, email);
        res.json(true);
    });
