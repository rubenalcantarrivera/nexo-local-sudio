import { NextResponse } from "next/server";
import { validateLead } from "@/lib/ai/leadUtils";

type LeadPayload = {
  businessSlug?: string;
  name?: string;
  phone?: string;
  serviceInterest?: string;
  message?: string;
  transcriptSummary?: string;
  createdAt?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as LeadPayload;
    const validation = validateLead(payload);

    if (!validation.ok) {
      return NextResponse.json({ ok: false, validation }, { status: 400 });
    }

    const lead = {
      businessSlug: payload.businessSlug,
      name: payload.name?.slice(0, 120) ?? "",
      phone: payload.phone?.slice(0, 30) ?? "",
      serviceInterest: payload.serviceInterest?.slice(0, 160) ?? "",
      message: payload.message?.slice(0, 500) ?? "",
      transcriptSummary: payload.transcriptSummary?.slice(0, 800) ?? "",
      createdAt: payload.createdAt ?? new Date().toISOString()
    };

    if (process.env.LEADS_WEBHOOK_URL) {
      const response = await fetch(process.env.LEADS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });

      if (!response.ok) {
        console.error("chat-agent lead webhook failed", response.status);
        return NextResponse.json({ ok: false, mode: "webhook", status: response.status }, { status: 502 });
      }

      return NextResponse.json({ ok: true, mode: "webhook" });
    }

    return NextResponse.json({ ok: true, mode: "mock" });
  } catch (error) {
    console.error("chat-agent lead route error", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
