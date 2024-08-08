import { Request, Response } from 'express';
import * as authService from '../services/authServices';

//ユーザー登録コントローラー
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await authService.registerUser(username, email, password);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

//ログインコントローラー
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};
