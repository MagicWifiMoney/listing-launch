import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = headers();
  const signature = headersList.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const priceType = session.metadata?.priceType;

      if (userId && priceType === "subscription") {
        await prisma.subscription.update({
          where: { userId },
          data: {
            stripeSubId: session.subscription as string,
            status: "active",
            plan: "monthly",
          },
        });
      } else if (userId && priceType === "per_listing") {
        await prisma.usageCredit.create({
          data: {
            userId,
            credits: 1,
            stripePaymentId: session.payment_intent as string,
          },
        });
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const customerId = sub.customer as string;

      const subscription = await prisma.subscription.findFirst({
        where: { stripeCustomerId: customerId },
      });

      if (subscription) {
        // Extract period end from the subscription object
        const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: {
            status: sub.status === "active" ? "active" : "inactive",
            ...(periodEnd ? { currentPeriodEnd: new Date(periodEnd * 1000) } : {}),
          },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
