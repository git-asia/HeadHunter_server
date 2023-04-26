import {Router} from "express";

export const userRouter = Router();

// zalogowany hrowiec
userRouter

    .post("/refresh", async (req, res) => {
        // refresh jwt
    })

    .post("/login", async (req, res) => {

    })
    
    .delete("/logout", async (req, res) => {
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
        const studentId = req.body

        // przyjmuje dane o statusie (zatrudniony lub nie)  i  wprowadza zmiany w bazie
    })
