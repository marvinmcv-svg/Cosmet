import { NextResponse } from "next/server";
import { search, summary } from "@/lib/catalog";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const limit = Math.min(48, Number(url.searchParams.get("limit") ?? 12));
  const items = search({ q }).slice(0, limit).map(summary);
  return NextResponse.json({ items });
}
