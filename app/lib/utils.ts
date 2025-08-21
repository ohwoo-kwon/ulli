import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import sharp from "sharp";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function fileToBase64(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString("base64");
}

export async function streamToBase64(stream: ReadableStream) {
  const response = new Response(stream);
  const blob = await response.blob();

  const arrayBuffer = await blob.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  const base64 = buffer.toString("base64");

  return base64;
}

export async function cropToFourFive(buffer: Buffer): Promise<Buffer> {
  const metadata = await sharp(buffer).metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("이미지 크기를 가져올 수 없습니다.");
  }

  const targetRatio = 4 / 5;
  const { width, height } = metadata;
  const currentRatio = width / height;

  let cropWidth: number, cropHeight: number, left: number, top: number;

  if (currentRatio > targetRatio) {
    // 가로가 더 긴 경우 → 좌우 잘라냄 (중앙 기준)
    cropHeight = height;
    cropWidth = Math.floor(height * targetRatio);
    left = Math.floor((width - cropWidth) / 2);
    top = 0;
  } else {
    // 세로가 더 긴 경우 → 아래 잘라냄 (위쪽 기준)
    cropWidth = width;
    cropHeight = Math.floor(width / targetRatio);
    left = 0;
    top = 0;
  }

  return sharp(buffer)
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .toFormat("jpeg")
    .toBuffer();
}
