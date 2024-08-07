// 必要なモジュールのインポート
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// 最初に環境変数を読み込む
dotenv.config();

//定数の定義
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8001;
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  console.error('SECRET_KEY is not defined in the environment variables');
  process.exit(1);
}

// Expressアプリケーションのインスタンスを作成
const app = express();

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

// ミドルウェアの設定
// express.json() ミドルウェアを使用して、受信したHTTPリクエストのボディを解析
// この設定により、クライアントから送信されたJSONデータを自動的にJavaScriptオブジェクトに変換
// 例: クライアントが {"username": "john"} を送信すると、req.body.username で "john" にアクセス可能
app.use(express.json());

//リクエストボディの型定義
interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

//レスポンスで返すユーザー情報の型定義
interface UserResponse {
  id: number;
  username: string;
  email: string;
}

// ユーザー登録API
app.post(
  '/api/auth/register',
  async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    try {
      // リクエストボディからユーザー情報を取得
      const { username, email, password } = req.body;
      // パスワードをハッシュ化
      const hashedPassword = await bcrypt.hash(password, 10);

      // 新しいユーザーをDBに作成
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      // クライアントに返すユーザー情報を作成
      const userResponse: UserResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      // ステータスコード201(created)と共にユーザー情報を返す
      return res.status(201).json({ user: userResponse });
    } catch (error) {
      // エラーハンドリング
      console.error('Registration error: ', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// ログインAPI
app.post(
  '/api/auth/login',
  async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    try {
      // リクエストボディからユーザー情報を取得
      const { email, password } = req.body;

      // Emailからユーザー情報を探す
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Eメールまたはパスワードが違います' });
      }

      // パスワードが正しいか検証
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Eメールまたはパスワードが違います' });
      }

      // jsonWebTokenでトークンを発行する
      const token = jwt.sign({ id: user.id }, SECRET_KEY, {
        expiresIn: '1d',
      });

      return res.json({ token });
    } catch (error) {
      //エラーハンドリング
      console.error('Login error: ', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// サーバーの起動
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
