import { z } from "zod";
import type { Route } from "./+types/image-generate";
import { data } from "react-router";
import Replicate from "replicate";
import { fileToBase64, streamToBase64 } from "~/lib/utils";

const formSchema = z.object({
  clothImgUrl: z.string().optional(),
  itemImg: z.instanceof(File).optional(),
  myImg: z.instanceof(File),
});

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") return data({ status: 404 });
  const formData = await request.formData();

  const prompt = `Replace the person's current clothes entirely with the given clothes. Remove all original clothing, including jackets, coats, or layers, so that only the provided clothes remain. Keep the exact style, type, color, texture, and material of the new clothes. Make the new clothes fit naturally and look realistic. Keep the face, skin, and body unchanged. Ensure the new clothes are clearly visible. 

If a bottom is provided but the person photo shows only the upper body, generate a full-body image of the person in the same background. Never generate a topless or partially nude upper body. Do not alter the color, pattern, or shape of the given clothes in any way, for example, do not change a checkered shirt’s pattern or color.`;

  const {
    data: validFormData,
    success,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) return data({ error: "잘못된 요청입니다." }, { status: 401 });

  const replicate = new Replicate();

  const myImgBuffer = await fileToBase64(validFormData.myImg);
  let imageUrl = "";
  let input = {
    prompt,
    image_input: [`data:${validFormData.myImg.type};base64,${myImgBuffer}`],
    // aspect_ratio: "3:4",
    // reference_tags: ["person", "cloth"],
    //  reference_images: [
    //   `data:${validFormData.myImg.type};base64,${myImgBuffer}`,
    //   `data:${validFormData.itemImg.type};base64,${itemImgBuffer}`,
    // ],
  };

  try {
    if (validFormData.itemImg) {
      const itemImgBuffer = await fileToBase64(validFormData.itemImg);

      // replicate 를 통해서 결과 이미지 생성
      input.image_input.push(
        `data:${validFormData.itemImg.type};base64,${itemImgBuffer}`
      );
    }

    if (validFormData.clothImgUrl) {
      // replicate 를 통해서 결과 이미지 생성
      input.image_input.push(validFormData.clothImgUrl);
    }
  } catch (e) {
    console.log(e);
    // @ts-ignore
    return data({ error: e.message }, { status: 400 });
  }

  const output = await replicate.run("google/nano-banana", {
    input,
  });

  imageUrl = await streamToBase64(output as ReadableStream);

  return { imageUrl: `data:img/png;base64,${imageUrl}` };
};
