// src/lib/auth/tokenManager.ts - User token management utilities (No Prisma)
"use server"
import { auth } from './auth'

interface StoredSession {
  access_token: string;
  refresh_token: string;
  created_at: string;
}

// In-memory session storage (alternative to database)
// Note: This will reset on server restart, but NextAuth JWT persists
const sessionStore = new Map<string, { data: StoredSession; expires: number }>();

// Get user's external API tokens from NextAuth session
export async function getUserTokens(userId?: string): Promise<StoredSession | null> {
  try {
    const session = await auth();
    
    if (!session?.accessToken || !session?.refreshToken) {
      console.log(`No valid session found for user ${userId || 'current'}`);
      return null;
    }

    return {
      access_token: session.accessToken,
      refresh_token: session.refreshToken,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.warn('Failed to get user tokens:', error);
    return null;
  }
}

// Get current user ID from NextAuth session
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await auth();
    return session?.user?.id || null;
  } catch (error) {
    console.warn('Failed to get current user ID:', error);
    return null;
  }
}

// Extract user ID from JWT token (deprecated - NextAuth handles this)
export function getUserIdFromToken(authHeader: string | null): string | null {
  // This function is kept for backward compatibility but is no longer needed
  // NextAuth handles token management automatically
  console.warn('getUserIdFromToken is deprecated. Use getCurrentUserId() instead.');
  return null;
}

// Make authenticated request to external API using current user's tokens
export async function makeAuthenticatedExternalRequest(
  endpoint: string,
  options: RequestInit = {}
) {
  const tokens = await getUserTokens();
  
  if (!tokens) {
    throw new Error('No valid session found. Please login again.');
  }

  const url = `${process.env.EXTERNAL_API_URL || 'http://server.oktin.ak4tek.com:3950'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${tokens.access_token}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Make authenticated request with specific user tokens (for API routes)
export async function makeAuthenticatedExternalRequestWithTokens(
  tokens: StoredSession,
  endpoint: string,
  options: RequestInit = {}
) {
  const url = `${process.env.EXTERNAL_API_URL || 'http://server.oktin.ak4tek.com:3950'}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${tokens.access_token}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired. Please login again.');
    }
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Check if current user session is valid
export async function isSessionValid(): Promise<boolean> {
  const tokens = await getUserTokens();
  return tokens !== null;
}

// Get session info for API routes (using NextAuth v5)
export async function getSessionForApiRoute() {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.warn('Failed to get API session:', error);
    return null;
  }
}

// Helper function to get tokens from NextAuth session for API routes
export async function getTokensFromSession(): Promise<StoredSession | null> {
  try {
    const session = await auth();
    
    if (!session?.accessToken || !session?.refreshToken) {
      return null;
    }

    return {
      access_token: session.accessToken as string,
      refresh_token: session.refreshToken as string,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.warn('Failed to get tokens from session:', error);
    return null;
  }
}