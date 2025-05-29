import { z } from "zod";
import type { Route } from "./+types/image-generate";
import { data } from "react-router";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

// const openai = new OpenAI({
//   apiKey: process.env.OPEN_AI_API_KEY || "",
//   baseURL: "https://api.openai.com/v1",
// });

const formSchema = z.object({
  itemImg: z.instanceof(File),
  myImg: z.instanceof(File),
});

async function fileToBase64(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return buffer.toString("base64");
}

// async function createOpenAIFile(file: File) {
//   const buffer = Buffer.from(await file.arrayBuffer());
//   const stream = Readable.from(buffer);
//   const result = await openai.files.create({
//     file: stream,
//     purpose: "vision",
//   });
//   return result.id;
// }

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") return data({ status: 404 });
  const formData = await request.formData();

  const {
    data: validFormData,
    success,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success)
    return data({ status: 401 }, { statusText: "잘못된 요청입니다." });

  const { itemImg, myImg } = validFormData!;

  const base64ItemImg = await fileToBase64(itemImg);
  const base64MyImg = await fileToBase64(myImg);

  const prompt = `Generate a photorealistic image of a gift basket on a white background
  labeled 'Relax & Unwind' with a ribbon and handwriting-like font,
  containing all the items in the reference pictures.`;

  return {
    imageUrl: `data:image/jpeg;base64,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`,
  };

  // const response = await openai.responses.create({
  //   model: "gpt-4.1",
  //   input: [
  //     {
  //       role: "user",
  //       content: [
  //         { type: "input_text", text: prompt },
  //         {
  //           type: "input_image",
  //           image_url: `data:image/jpeg;base64,${base64ItemImg}`,
  //           detail: "low",
  //         },
  //         {
  //           type: "input_image",
  //           image_url: `data:image/jpeg;base64,${base64MyImg}`,
  //           detail: "low",
  //         },
  //       ],
  //     },
  //   ],
  //   tools: [
  //     {
  //       type: "image_generation",
  //       quality: "low",
  //       model: "gpt-image-1",
  //       size: "1024x1024",
  //       output_format: "png",
  //     },
  //   ],
  // });

  // const imageData = response.output
  //   .filter((output) => output.type === "image_generation_call")
  //   .map((output) => output.result);
  // console.log(imageData);

  // if (imageData.length > 0) {
  //   const imageBase64 = imageData[0];
  //   const buffer = Buffer.from(imageBase64!, "base64");
  //   const imgName = `${myImg.name}_${new Date()}`;

  //   const outPath = path.resolve(`public/generated/${imgName}.png`);
  //   fs.writeFileSync(outPath, buffer);

  //   return data({ imageUrl: `/generated/${imgName}.png` });
  // } else {
  //   return data(
  //     { error: "No image generated", output: response.output },
  //     { status: 500 }
  //   );
  // }
};
