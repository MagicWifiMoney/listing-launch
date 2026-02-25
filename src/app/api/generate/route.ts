import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateAllContent } from "@/lib/claude";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Check subscription or credits
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    const hasActiveSubscription =
      subscription?.status === "active" &&
      subscription.currentPeriodEnd &&
      subscription.currentPeriodEnd > new Date();

    if (!hasActiveSubscription) {
      const credits = await prisma.usageCredit.aggregate({
        where: { userId },
        _sum: { credits: true },
      });
      const totalCredits = credits._sum.credits || 0;

      const usedListings = await prisma.listing.count({ where: { userId } });
      if (totalCredits <= usedListings) {
        return NextResponse.json(
          { error: "No credits remaining. Purchase credits or subscribe." },
          { status: 403 }
        );
      }
    }

    const body = await req.json();
    const { address, price, beds, baths, sqft, description, features } = body;

    // Get agent profile
    const profile = await prisma.agentProfile.findUnique({
      where: { userId },
    });

    const listing = await prisma.listing.create({
      data: {
        userId,
        address,
        price,
        beds: parseInt(beds),
        baths: parseFloat(baths),
        sqft: parseInt(sqft),
        description,
        features,
      },
    });

    const results = await generateAllContent({
      address,
      price,
      beds: parseInt(beds),
      baths: parseFloat(baths),
      sqft: parseInt(sqft),
      description,
      features,
      agentName: profile?.agentName || body.agentName || "Agent",
      brokerage: profile?.brokerage || body.brokerage || "",
      tone: profile?.tone || "luxury",
    });

    // Save generations
    await prisma.generation.createMany({
      data: results.map((r) => ({
        listingId: listing.id,
        contentType: r.type,
        content: r.content,
      })),
    });

    return NextResponse.json({
      listingId: listing.id,
      generations: results,
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Generation failed. Check your ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }
}
