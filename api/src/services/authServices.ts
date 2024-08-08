import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../app';
import { config } from '../config/environment';

// ユーザー登録サービス
export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
    // DBから返す値を指定（パスワードを除外）
    select: { id: true, username: true, email: true },
  });

  return user;
};

// ユーザーログインサービス
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id }, config.SECRET_KEY!, {
    expiresIn: '1d',
  });

  return {
    token,
    user: { id: user.id, username: user.username, email: user.email },
  };
};
