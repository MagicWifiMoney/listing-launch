import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { priceType } = await req.json();

    // Get or create Stripe customer
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    let customerId = subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: { userId },
      });
      customerId = customer.id;
      await prisma.subscription.upsert({
        where: { userId },
        update: { stripeCustomerId: customerId },
        create: { userId, stripeCustomerId: customerId },
      });
    }

    const priceId =
      priceType === "subscription"
        ? process.env.STRIPE_PRICE_SUBSCRIPTION
        : process.env.STRIPE_PRICE_PER_LISTING;

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: priceType === "subscription" ? "subscription" : "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXTAUTH_URL}/generate?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/generate?canceled=true`,
      metadata: { userId, priceType },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
