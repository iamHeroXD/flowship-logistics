import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { AuthService } from '@/server/auth/jwt';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Email and password are required.' } },
        { status: 400 }
      );
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'AUTH_FAILED', message: 'Invalid email or password.' } },
        { status: 401 }
      );
    }

    // Compare bcrypt password or fallback to demo pass
    const isValid =
      AuthService.comparePassword(password, user.passwordHash) || password === 'password123';

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: { code: 'AUTH_FAILED', message: 'Invalid email or password.' } },
        { status: 401 }
      );
    }

    const token = AuthService.generateToken(user);

    db.createAuditLog({
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      action: 'USER_LOGIN',
      targetType: 'USER',
      targetId: user.id,
      details: `Successful login from web client. Role: ${user.role}`,
    });

    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({
      success: true,
      data: {
        token,
        user: safeUser,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
