import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '../../../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2023-10-16'
});

export async function POST(req) {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature');

    let event;
    try {
        // Attempt webhook verification if secret is provided
        if (process.env.STRIPE_WEBHOOK_SECRET) {
            event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } else {
            event = JSON.parse(payload); // fall back for local dev testing
        }
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    // Handle successful checkout
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        if (session.metadata && session.metadata.businessId) {
            await prisma.business.update({
                where: { id: session.metadata.businessId },
                data: { has_unlocked_report: true },
            });
            console.log(`Purchased! Unlocked report for business ${session.metadata.businessId}`);
        }
    }

    return NextResponse.json({ received: true });
}
