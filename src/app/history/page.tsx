"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";

interface Generation {
  id: string;
  contentType: string;
  content: string;
  createdAt: string;
}

interface Listing {
  id: string;
  address: string;
  price: string;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  features: string;
  createdAt: string;
  generations: Generation[];
}

const TAB_LABELS: Record<string, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  email: "Email",
  openhouse: "Open House",
  sms: "SMS",
  video: "Video",
};

export default function HistoryPage() {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/listings")
        .then((r) => r.json())
        .then(setListings)
        .catch(() =>
          toast({
            title: "Error",
            description: "Failed to load history",
            variant: "destructive",
          })
        )
        .finally(() => setLoading(false));
    }
  }, [status, router, toast]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Content copied to clipboard." });
  };

  const downloadPDF = (listing: Listing, type: string, content: string) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 95);
    doc.text(TAB_LABELS[type] || type, 20, 25);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${listing.address} | ${listing.price}`, 20, 35);
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    const lines = doc.splitTextToSize(content, 170);
    doc.text(lines, 20, 50);
    doc.save(`${listing.address.replace(/\s+/g, "-")}-${type}.pdf`);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1E3A5F] mb-2">
          Listing History
        </h1>
        <p className="text-gray-600 mb-8">
          View and access all your previously generated content packs.
        </p>

        {listings.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-gray-500 mb-4">
                No listings yet. Generate your first content pack!
              </p>
              <Button
                onClick={() => router.push("/generate")}
                className="bg-[#D4AF37] text-[#1E3A5F] hover:bg-[#c9a432]"
              >
                Generate Content
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden">
                <CardHeader
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpanded(
                      expanded === listing.id ? null : listing.id
                    )
                  }
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-[#1E3A5F] text-lg">
                        {listing.address}
                      </CardTitle>
                      <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                        <span className="font-semibold text-[#D4AF37]">
                          {listing.price}
                        </span>
                        <span>
                          {listing.beds} bed / {listing.baths} bath /{" "}
                          {listing.sqft.toLocaleString()} sqft
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {listing.generations.length} pieces
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                {expanded === listing.id && listing.generations.length > 0 && (
                  <CardContent className="border-t">
                    <Tabs
                      defaultValue={listing.generations[0]?.contentType}
                      className="mt-4"
                    >
                      <TabsList className="flex flex-wrap h-auto gap-1 bg-gray-100 p-1">
                        {listing.generations.map((gen) => (
                          <TabsTrigger
                            key={gen.id}
                            value={gen.contentType}
                            className="text-xs data-[state=active]:bg-[#1E3A5F] data-[state=active]:text-white"
                          >
                            {TAB_LABELS[gen.contentType] || gen.contentType}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      {listing.generations.map((gen) => (
                        <TabsContent key={gen.id} value={gen.contentType}>
                          <div className="flex gap-2 mb-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(gen.content)}
                            >
                              Copy
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                downloadPDF(
                                  listing,
                                  gen.contentType,
                                  gen.content
                                )
                              }
                              className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1E3A5F]"
                            >
                              PDF
                            </Button>
                          </div>
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 font-sans">
                            {gen.content}
                          </pre>
                        </TabsContent>
                      ))}
                    </Tabs>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
