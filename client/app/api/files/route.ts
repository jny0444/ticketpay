import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload file to IPFS via Pinata
    const { cid } = await pinata.upload.public.file(file);

    // Get the URL from the CID
    const url = await pinata.gateways.public.convert(cid);

    return NextResponse.json(url, { status: 200 });
  } catch (e) {
    console.error("Error uploading to IPFS:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
