import app, { prisma } from './app';
import { config } from './config/environment';

// サーバーのポート番号を指定
// 環境変数から取得 またはデフォルト値を使用
const PORT = config.PORT || 8001;

// サーバーの起動
const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

// グレースフルシャットダウンの設定
process.on('SIGHT', async () => {
  // Prismaクライアントとの接続を切断
  await prisma.$disconnect();

  // サーバーを正常に終了
  server.close(() => {
    console.log('Server closed');
    process.exit(0); //プロセス終了
  });
});