import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '../../../lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
    apiVersion: '2023-10-16'
});

export async function POST(req) {
    try {
        const { businessId } = await req.json();

        if (!businessId) {
            return NextResponse.json({ error: 'Business ID is required' }, { status: 400 });
        }

        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') || 'http';
        const baseUrl = `${protocol}://${host}`;

        // For local testing without a stripe env, I'll allow mock bypasses if desired, but this builds real checkout.
        if (!process.env.STRIPE_SECRET_KEY) {
            console.warn("No Stripe Key Provided. Bypassing Stripe in local development mode.");

            // Bypass the need for webhooks locally by just unlocking it now:
            await prisma.business.update({
                where: { id: businessId },
                data: { has_unlocked_report: true }
            });

            return NextResponse.json({ url: `${baseUrl}/report/${businessId}?mock_success=true` });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Seleste Core Growth Report',
                            description: 'Unlock complete SEO audit, conversion insights, and the AI-generated 90-day plan.',
                        },
                        unit_amount: 2900, // $29.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/report/${businessId}?success=true`,
            cancel_url: `${baseUrl}/report/${businessId}?canceled=true`,
            metadata: {
                businessId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
