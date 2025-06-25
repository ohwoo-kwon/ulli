import { z } from "zod";
import type { Route } from "./+types/image-generate";
import { data } from "react-router";
import OpenAI from "openai";
import Replicate from "replicate";
import { fileToBase64, streamToBase64 } from "~/lib/utils";

const formSchema = z.object({
  itemImg: z.instanceof(File),
  myImg: z.instanceof(File),
});

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

  const replicate = new Replicate();
  const openai = new OpenAI({ apiKey: process.env.OPEN_AI_API_KEY });

  const itemImgBuffer = await fileToBase64(validFormData.itemImg);
  const myImgBuffer = await fileToBase64(validFormData.myImg);

  // openai 를 통해 상품 이미지와 인물 이미지 해석
  const [itemImgRes, myImgRes] = await Promise.all([
    openai.responses.create({
      model: "gpt-4.1-nano",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Describe about the cloth. Output must be start with 'The cloth is' and just decribe about the cloth.",
            },
            {
              type: "input_image",
              image_url: `data:${validFormData.itemImg.type};base64,${itemImgBuffer}`,
              detail: "high",
            },
          ],
        },
      ],
    }),
    openai.responses.create({
      model: "gpt-4.1-nano",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Describe about the person. Output must be start with 'The person is' and just decribe about the person and background.",
            },
            {
              type: "input_image",
              image_url: `data:${validFormData.myImg.type};base64,${myImgBuffer}`,
              detail: "high",
            },
          ],
        },
      ],
    }),
  ]);

  if (itemImgRes.error || myImgRes.error)
    return data(
      { error: itemImgRes.error?.message || myImgRes.error?.message },
      { status: 400 }
    );

  // replicate 를 통해서 결과 이미지 생성
  const input = {
    prompt: `Me: ${myImgRes.output_text}
      Fitting cloth: ${itemImgRes.output_text}
      Make me wears the Fitting cloth. I want to take off my cloth and change the cloth to the garment. Keep everything same in my image except my cloth. Change my cloth only.`,
    aspect_ratio: "3:4",
    input_images: [
      `data:${validFormData.itemImg.type};base64,${itemImgBuffer}`,
      `data:${validFormData.myImg.type};base64,${myImgBuffer}`,
    ],
  };

  const output = await replicate.run("flux-kontext-apps/multi-image-list", {
    input,
  });

  const imageUrl = await streamToBase64(output as ReadableStream);

  return { imageUrl: `data:img/png;base64,${imageUrl}` };
};
