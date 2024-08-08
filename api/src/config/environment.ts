import dotenv from 'dotenv';

// .envから環境変数を読み込む
dotenv.config();

// 環境変数を一元管理するオブジェクト
export const config = {
  PORT: process.env.PORT,
  SECRET_KEY: process.env.SECRET_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
};

// 重要な環境変数のチェック
if (!config.SECRET_KEY) {
  throw new Error('SECRET_KEY is not defined in the environment variables');
}
