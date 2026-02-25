import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CONTENT_TYPES = [
  {
    title: "Instagram Carousel",
    desc: "5-slide copy with captions and hashtags",
    icon: "📸",
  },
  {
    title: "Facebook Post",
    desc: "Long-form engagement with emojis",
    icon: "📘",
  },
  {
    title: "Email Campaign",
    desc: "Just Listed announcement to past clients",
    icon: "📧",
  },
  {
    title: "Open House",
    desc: "Announcement flyer ready to share",
    icon: "🏠",
  },
  {
    title: "SMS Sequence",
    desc: "3 follow-up texts over 7 days",
    icon: "💬",
  },
  {
    title: "Video Script",
    desc: "30s walkthrough with shot directions",
    icon: "🎬",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-[#1E3A5F] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/30 mb-6 text-sm">
            AI-Powered Real Estate Marketing
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            One listing.
            <br />
            <span className="text-[#D4AF37]">A full marketing launch kit.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Enter your listing details once. Get Instagram, Facebook, email,
            SMS, open house, and video content — all written by AI, tailored to
            your brand.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-[#D4AF37] text-[#1E3A5F] hover:bg-[#c9a432] font-bold text-lg px-8 py-6"
              >
                Start Generating
              </Button>
            </Link>
            <Link href="#pricing">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Content Types */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#1E3A5F]">
            6 Content Types, One Click
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Every piece of marketing content you need to launch a listing,
            generated in seconds.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {CONTENT_TYPES.map((type) => (
              <Card
                key={type.title}
                className="hover:shadow-lg transition-shadow border-0 shadow-sm"
              >
                <CardHeader>
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <CardTitle className="text-[#1E3A5F]">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{type.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-[#1E3A5F]">
            Simple, Flexible Pricing
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Choose the plan that fits your business.
          </p>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Subscription */}
            <Card className="border-2 border-[#D4AF37] relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#D4AF37] text-[#1E3A5F] text-xs font-bold px-3 py-1 rounded-bl">
                BEST VALUE
              </div>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-[#1E3A5F]">Pro Monthly</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-[#1E3A5F]">
                    $29
                  </span>
                  <span className="text-gray-500">/month</span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-3 text-gray-600 mb-8">
                  <li>Unlimited listings</li>
                  <li>All 6 content types</li>
                  <li>PDF export</li>
                  <li>Listing history</li>
                  <li>Custom agent profile & tone</li>
                </ul>
                <Link href="/register">
                  <Button className="w-full bg-[#D4AF37] text-[#1E3A5F] hover:bg-[#c9a432] font-semibold">
                    Subscribe Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pay-per-use */}
            <Card className="border-2">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-[#1E3A5F]">Pay Per Listing</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-[#1E3A5F]">$9</span>
                  <span className="text-gray-500">/listing</span>
                </div>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-3 text-gray-600 mb-8">
                  <li>1 listing per credit</li>
                  <li>All 6 content types</li>
                  <li>PDF export</li>
                  <li>Listing history</li>
                  <li>Custom agent profile & tone</li>
                </ul>
                <Link href="/register">
                  <Button
                    variant="outline"
                    className="w-full border-[#1E3A5F] text-[#1E3A5F] hover:bg-[#1E3A5F] hover:text-white font-semibold"
                  >
                    Buy Credits
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A5F] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} ListingLaunch. AI-powered real
            estate marketing.
          </p>
        </div>
      </footer>
    </div>
  );
}
