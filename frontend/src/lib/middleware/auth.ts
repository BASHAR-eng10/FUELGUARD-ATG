import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export interface AuthenticatedUser {
  userId: number;
  email: string;
  role: string;
  canAccessAll: boolean;
  stationId: number | null;
  externalUserId: number;
}

export function verifyToken(request: NextRequest): AuthenticatedUser {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('Access denied. No token provided.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as AuthenticatedUser;
    return decoded;
  } catch (error) {
    throw new Error('Invalid token.');
  }
}
