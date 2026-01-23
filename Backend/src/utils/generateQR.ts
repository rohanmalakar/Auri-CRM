import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import QRCode from "qrcode";

/**
 * Creates a QR PNG for a given URL, saves it under an internal folder,
 * and returns the relative path to access the PNG (e.g. "qrcodes/abc.png").
 */
export async function createQrPngFromUrl(params: {
  url: string;
  publicBaseUrl: string; // e.g. "https://api.yourapp.com"
  folderName?: string;   // default: "qrcodes"
  fileName?: string;     // optional custom file name (without .png)
}): Promise<string> {
  const { url } = params;
  const folderName = params.folderName ?? "qrcodes";

  // 1) Where to save on disk
  const outDir = path.join(process.cwd(), "uploads", folderName);
  await fs.mkdir(outDir, { recursive: true });

  // 2) File name
  const safeBase =
    params.fileName ??
    `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
  const fileName = `${safeBase}.png`;
  const filePath = path.join(outDir, fileName);

  // 3) Generate PNG file
  await QRCode.toFile(filePath, url, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    scale: 6,
  });

  // 4) Return relative path (e.g. "qrcodes/filename.png")
  return `${folderName}/${fileName}`;
}
