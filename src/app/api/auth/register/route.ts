import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/server/db';
import { AuthService } from '@/server/auth/jwt';
import { UserRole } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, role = 'CUSTOMER', companyName } = await req.json();

    if (!name || !email || !password || !phone) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'All fields are required.' } },
        { status: 400 }
      );
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_EXISTS', message: 'An account with this email already exists.' } },
        { status: 409 }
      );
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      phone,
      role: role as UserRole,
      passwordHash: AuthService.hashPassword(password),
      organizationId: companyName ? `biz_${Date.now()}` : undefined,
      isVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.createUser(newUser);

    const token = AuthService.generateToken(newUser);

    db.createAuditLog({
      actorId: newUser.id,
      actorName: newUser.name,
      actorRole: newUser.role,
      action: 'USER_REGISTERED',
      targetType: 'USER',
      targetId: newUser.id,
      details: `Registered account as ${newUser.role}. Organization: ${companyName || 'None'}`,
    });

    const { passwordHash, ...safeUser } = newUser;
    return NextResponse.json(
      {
        success: true,
        data: {
          token,
          user: safeUser,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: error.message } },
      { status: 500 }
    );
  }
}
