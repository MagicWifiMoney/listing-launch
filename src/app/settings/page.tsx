"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    agentName: "",
    brokerage: "",
    phone: "",
    tone: "luxury",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((data) => {
          if (data) {
            setProfile({
              agentName: data.agentName || "",
              brokerage: data.brokerage || "",
              phone: data.phone || "",
              tone: data.tone || "luxury",
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [status, router]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        toast({
          title: "Saved!",
          description: "Your agent profile has been updated.",
        });
      } else {
        throw new Error();
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to save profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCheckout = async (priceType: string) => {
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceType }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to start checkout. Configure Stripe keys.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Failed to start checkout.",
        variant: "destructive",
      });
    }
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
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[#1E3A5F]">Settings</h1>

        {/* Agent Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Profile</CardTitle>
            <CardDescription>
              This info is used in your generated content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="agentName">Agent Name</Label>
              <Input
                id="agentName"
                value={profile.agentName}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, agentName: e.target.value }))
                }
                placeholder="Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brokerage">Brokerage</Label>
              <Input
                id="brokerage"
                value={profile.brokerage}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, brokerage: e.target.value }))
                }
                placeholder="Luxury Realty Group"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={profile.phone}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, phone: e.target.value }))
                }
                placeholder="(555) 123-4567"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="tone">Content Tone</Label>
              <Select
                value={profile.tone}
                onValueChange={(v) =>
                  setProfile((p) => ({ ...p, tone: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="luxury">
                    Luxury — Sophisticated & elegant
                  </SelectItem>
                  <SelectItem value="family">
                    Family — Warm & welcoming
                  </SelectItem>
                  <SelectItem value="investor">
                    Investor — Data-driven & analytical
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleSave}
              className="bg-[#1E3A5F] hover:bg-[#162d4a]"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle>Billing</CardTitle>
            <CardDescription>
              Manage your subscription and credits.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleCheckout("subscription")}
                className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#1E3A5F]"
              >
                Subscribe — $29/mo
              </Button>
              <Button
                variant="outline"
                onClick={() => handleCheckout("per_listing")}
              >
                Buy 1 Credit — $9
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Requires Stripe configuration. Set your API keys in .env to enable
              payments.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
