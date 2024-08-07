import { PrismaClient } from '@prisma/client';
import express from 'express';

// Expressアプリケーションのインスタンスを作成
const app = express();

// PrismaClientのインスタンスを作成
// これによりDB操作が可能になる
export const prisma = new PrismaClient();

// ミドルウェアの設定
// JSON形式のリクエストボディを解析します
app.use(express.json());

// ルートの設定
// 各ルートモジュールを特定のパスにマウントする
app.use('/api/auth', authRoutes); //認証関連のルート
app.use('/api/users', userRoutes); //ユーザー関連のルート

// エラーハンドリングミドルウェア
// すべてのルートの後に配置し、エラーをキャッチして適切に処理
app.use(errorHandler);

// アプリケーションのエクスポート
// これにより、server.tsでアプリケーションを使用できる
export default app;
