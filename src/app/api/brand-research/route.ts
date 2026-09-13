import { NextRequest, NextResponse } from "next/server";
import { researchBrand } from "@/lib/brandResearch";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.clientCompany !== "string" || !body.clientCompany.trim()) {
    return NextResponse.json({ error: "clientCompany is required" }, { status: 400 });
  }

  const clientWebsite: string | undefined =
    typeof body.clientWebsite === "string" && body.clientWebsite.trim() ? body.clientWebsite : undefined;

  const [infosysBrand, clientBrand] = await Promise.all([
    researchBrand("Infosys"),
    researchBrand(body.clientCompany.trim(), clientWebsite),
  ]);

  return NextResponse.json({ infosysBrand, clientBrand });
}
