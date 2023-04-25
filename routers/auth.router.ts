import { Router } from "express";

export const authRouter = Router();

// logowanie i autoryzacja
authRouter

.post("/refresh", async(req, res) => {
    // refresh jwt
})

.post("/login",async (req, res) => {
    const { username, password } = req.body;

    // weryfikacja loginu i hasła
    // generowanie tokenu
    res.json({
        // zwraca token, refreshtoken i id
      });
})

.delete("/logout",async (req, res) => {
    // czyszczenie tokenów i wylogowanie
})

