// src/lib/auth/tokenManager.ts - User token management utilities
// "use server"
import { prisma } from '../prisma';
import jwt from 'jsonwebtoken';

interface StoredSession {
  access_token: string;
  refresh_token: string;
  created_at: string;
}

// Get user's external API tokens from database
export async function getUserTokens(userId: string): Promise<StoredSession | null> {
  try {
    const session = await prisma.systemCache.findUnique({
      where: { 
        key: `user_session_${userId}`,
      },
      select: {
        value: true,
        expires_at: true
      }
    });
    
    if (session && session.expires_at && session.expires_at > new Date()) {
      const tokens: StoredSession = JSON.parse(session.value);
      console.log(`🔑 Retrieved tokens for user ${userId}`);
      return tokens;
    }
    
    console.log(`⚠️ No valid session found for user ${userId}`);
    return null;
  } catch (error) {
    console.warn('Failed to get user tokens:', error);
    return null;
  }
}

// Extract user ID from JWT token
export function getUserIdFromToken(authHeader: string | null): string | null {
  try {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    return decoded.userId?.toString() || null;
  } catch (error) {
    console.warn('Failed to decode token:', error);
    return null;
  }
}

// Make authenticated request to external API using user's stored tokens
export async function makeAuthenticatedExternalRequest(
  userId: string, 
  endpoint: string, 
  options: RequestInit = {}
) {
  const tokens = await getUserTokens(userId);
  
  if (!tokens) {
    throw new Error('No valid session found. Please login again.');
  }
  
  const url = `${process.env.EXTERNAL_API_URL || 'http://78.189.54.28:3800'}${endpoint}`;
	console.log(`Making request to ${url} with token: ${tokens.access_token}`);

	options.headers = {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Authorization': `${tokens.access_token}`,
		...options.headers
	};

  const response = await fetch(url, options);

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, could implement refresh logic here
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

// Clear user session
export async function clearUserSession(userId: string): Promise<void> {
  try {
    await prisma.systemCache.deleteMany({
      where: { key: `user_session_${userId}` }
    });
    console.log(`🗑️ Session cleared for user ${userId}`);
  } catch (error) {
    console.warn('Failed to clear user session:', error);
  }
}

// Check if user session is valid
export async function isSessionValid(userId: string): Promise<boolean> {
  const tokens = await getUserTokens(userId);
  return tokens !== null;
}
