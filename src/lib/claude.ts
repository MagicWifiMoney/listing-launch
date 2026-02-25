import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export type ContentType =
  | "instagram"
  | "facebook"
  | "email"
  | "openhouse"
  | "sms"
  | "video";

interface ListingInput {
  address: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  features: string;
  agentName: string;
  brokerage: string;
  tone: string;
}

const CONTENT_PROMPTS: Record<ContentType, string> = {
  instagram: `Create an Instagram Carousel post for this real estate listing.
Provide exactly 5 slides of copy (Slide 1 through Slide 5), each 2-3 sentences.
Then provide a caption with emojis (2-3 sentences).
Then provide 20 relevant hashtags.
Format:
SLIDE 1: ...
SLIDE 2: ...
SLIDE 3: ...
SLIDE 4: ...
SLIDE 5: ...
CAPTION: ...
HASHTAGS: ...`,

  facebook: `Create a long-form Facebook post for this real estate listing.
Use emojis throughout. Include property highlights, neighborhood details, and a call to action.
Should be 4-6 paragraphs. Make it engaging and shareable.`,

  email: `Create a "Just Listed" email to past clients announcing this new listing.
Include a compelling subject line, greeting, property highlights, and call to action.
Format:
SUBJECT: ...
BODY:
...`,

  openhouse: `Create an Open House announcement for this listing.
Include the property highlights, what makes it special, and a compelling invitation.
Format it ready to post on social media or send as a flyer.
Include placeholder for date/time: [DATE] and [TIME].`,

  sms: `Create a 3-text SMS follow-up sequence for leads interested in this listing, spaced over 7 days.
Each text should be under 160 characters.
Format:
TEXT 1 (Day 1): ...
TEXT 2 (Day 3): ...
TEXT 3 (Day 7): ...`,

  video: `Create a 30-second video walkthrough script for this listing.
Include shot directions in brackets and voiceover text.
Format:
[SHOT: ...] Voiceover: "..."
Include 5-6 shots covering exterior, main living areas, kitchen, primary bedroom, and a closing shot.`,
};

export async function generateContent(
  contentType: ContentType,
  listing: ListingInput
): Promise<string> {
  const toneDescriptions: Record<string, string> = {
    luxury: "sophisticated, elegant, and premium",
    family: "warm, welcoming, and family-oriented",
    investor: "data-driven, ROI-focused, and analytical",
  };

  const toneDesc = toneDescriptions[listing.tone] || toneDescriptions.luxury;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    messages: [
      {
        role: "user",
        content: `You are an expert real estate marketing copywriter. Write in a ${toneDesc} tone.

Property Details:
- Address: ${listing.address}
- Price: ${listing.price}
- Bedrooms: ${listing.beds} | Bathrooms: ${listing.baths} | Sq Ft: ${listing.sqft.toLocaleString()}
- Description: ${listing.description}
- Key Features: ${listing.features}
- Agent: ${listing.agentName}, ${listing.brokerage}

${CONTENT_PROMPTS[contentType]}`,
      },
    ],
  });

  const block = message.content[0];
  if (block.type === "text") return block.text;
  return "Content generation failed.";
}

export async function generateAllContent(listing: ListingInput) {
  const types: ContentType[] = [
    "instagram",
    "facebook",
    "email",
    "openhouse",
    "sms",
    "video",
  ];

  const results = await Promise.all(
    types.map(async (type) => ({
      type,
      content: await generateContent(type, listing),
    }))
  );

  return results;
}
