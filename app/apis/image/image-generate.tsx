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
    imageUrl: "/result.png",
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
