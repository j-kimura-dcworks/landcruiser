import express from 'express';
import { login, register } from "../controllers/authController";

const router = express.Router();

// ユーザー登録ルート
router.post('/register', register);

//ユーザーログインルート
router.post('/login', login);

export default router;