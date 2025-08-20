import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export async function cropImageFileToFourFive(file: File): Promise<File> {
  const dataUrl = await fileToBase64Client(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const targetRatio = 4 / 5; // 가로:세로
      const width = img.width;
      const height = img.height;
      const currentRatio = width / height;

      let cropWidth: number,
        cropHeight: number,
        offsetX: number,
        offsetY: number;

      if (currentRatio > targetRatio) {
        // 가로가 더 긴 경우 → 중앙 기준 크롭
        cropHeight = height;
        cropWidth = height * targetRatio;
        offsetX = (width - cropWidth) / 2;
        offsetY = 0; // 위쪽 기준
      } else {
        // 세로가 더 긴 경우 → 위쪽 기준 크롭
        cropWidth = width;
        cropHeight = width / targetRatio;
        offsetX = 0;
        offsetY = 0;
      }

      const canvas = document.createElement("canvas");
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }

      ctx.drawImage(
        img,
        offsetX,
        offsetY,
        cropWidth,
        cropHeight,
        0,
        0,
        cropWidth,
        cropHeight
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const croppedFile = new File([blob], file.name, {
              type: "image/jpeg",
            });
            resolve(croppedFile);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        "image/jpeg",
        0.95
      );
    };

    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function fileToBase64Client(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
