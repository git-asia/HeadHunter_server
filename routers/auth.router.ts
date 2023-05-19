import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { userController } from '../controllers/controllers';

// ROUTER DLA ŚCIEŻEK Z OGRANICZONYM DOSTĘPEM, NP. KIEDY CHCEMY ŻEBY UŻYTKOWNIK
// MUSIAŁ MIEĆ USTAWIONY POPRAWNY I WAŻNY JWT TOKEN ŻEBY DOSTAĆ SIĘ DO DANEGO ZASOBU
// W INNYM WYPADKU WYSYŁAMY INFORMACJĘ, ŻE JEST NIEAUTORYZOWANY
// TOKEN W ZAPYTANIU TRZEBA WYSYŁAĆ W NAGŁÓWKU "Authorization"
export const authRouter = Router();

// representation of path accessible only for logged-in users
authRouter.post('/decode-token', authMiddleware, userController)