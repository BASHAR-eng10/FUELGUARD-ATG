import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';

interface ExternalApiResponse {
  status_code: number;
  data: {
    refresh_token: string;
    access_token: string;
    user_record: {
      id: number;
      creation_date: string;
      email: string;
      roles: {
        id: number;
        name: string;
      };
      associated_station: number | null;
    };
  };
  message: string;
}

// Store user token in database for session persistence
async function storeUserToken(userId: string, accessToken: string, refreshToken: string) {
  try {
    const expiresAt = new Date(Date.now() + (8 * 60 * 60 * 1000)); // 8 hours
    
    await prisma.systemCache.upsert({
      where: { key: `user_session_${userId}` },
      update: {
        value: JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
          created_at: new Date().toISOString()
        }),
        expires_at: expiresAt,
        updated_at: new Date()
      },
      create: {
        key: `user_session_${userId}`,
        value: JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
          created_at: new Date().toISOString()
        }),
        expires_at: expiresAt
      }
    });
    
    console.log(`🗄️ User session stored for user ${userId}`);
  } catch (error) {
    console.warn('Failed to store user session:', error);
    // Non-fatal error, continue without DB storage
  }
}

// POST /api/auth/login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

	const response = await fetch('http://78.189.54.28:3800/auth/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		},
		body: JSON.stringify({ email, password }),
		cache: 'no-store' // Don't cache login requests
	});

	if (!response.ok) {
		const errorData = await response.json();
		console.error('Login failed:', errorData);
		return NextResponse.json({
			success: false,
			error: 'Invalid credentials'
		}, { status: 401 });
	}

	const res: ExternalApiResponse = await response.json();
	const data = res.data;
	
	// Store user session in database for persistence
	await storeUserToken(
		data.user_record.id.toString(), 
		data.access_token, 
		data.refresh_token
	);
	
	// Create our own JWT for client-side authentication
	const clientToken = jwt.sign(
		{
			userId: data.user_record.id,
			email: data.user_record.email,
			role: data.user_record.roles.name === "SuperAdmin" ? "System Administrator" : data.user_record.roles.name,
			canAccessAll: data.user_record.roles.name === "SuperAdmin",
			stationId: data.user_record.associated_station,
			externalUserId: data.user_record.id
		},
		process.env.JWT_SECRET || 'your-secret-key',
		{ expiresIn: '8h' }
	);
	
	console.log(`✅ User authenticated: ${email} (${data.user_record.roles.name})`);

    return NextResponse.json({
      success: true,
      data: {
        token: clientToken, // Our JWT token for client
        externalToken: data.access_token, // External API token (optional to return)
        user: {
          id: data.user_record.id,
          email: data.user_record.email,
          role: data.user_record.roles.name === "SuperAdmin" ? "System Administrator" : data.user_record.roles.name,
          canAccessAll: data.user_record.roles.name === "SuperAdmin",
          stationId: data.user_record.associated_station
        }
      },
      message: `Welcome ${data.user_record.roles.name}!`
    });

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({
      success: false,
      error: 'Authentication failed'
    }, { status: 500 });
  }
}

// POST /api/auth/logout
export async function DELETE(request: NextRequest) {
  try {
    // Extract user info from JWT token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      const userId = decoded.userId;
      
      if (userId) {
        // Clear user session from database
        try {
          await prisma.systemCache.deleteMany({
            where: { key: `user_session_${userId}` }
          });
          console.log(`🗑️ User session cleared for user ${userId}`);
        } catch (error) {
          console.warn('Failed to clear user session:', error);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  }
}
