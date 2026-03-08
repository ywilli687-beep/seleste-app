import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
    try {
        const user = await prisma.user.findUnique({ where: { email: 'demo@seleste.com' } });
        if (!user) {
            return NextResponse.json({ data: [] });
        }

        const businesses = await prisma.business.findMany({
            where: { user_id: user.id },
            include: {
                audits: { orderBy: { created_at: 'desc' }, take: 1 },
                marketing_plans: { orderBy: { created_at: 'desc' }, take: 3 }
            },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json({ success: true, data: businesses });
    } catch (error) {
        console.error('Fetch Businesses Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
