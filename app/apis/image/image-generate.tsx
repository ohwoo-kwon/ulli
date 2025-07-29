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

  const {
    data: validFormData,
    success,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success)
    return data({ status: 401 }, { statusText: "잘못된 요청입니다." });

  const replicate = new Replicate();

  const myImgBuffer = await fileToBase64(validFormData.myImg);
  let imageUrl = "";

  if (validFormData.itemImg) {
    const itemImgBuffer = await fileToBase64(validFormData.itemImg);

    // replicate 를 통해서 결과 이미지 생성
    const input = {
      prompt: `the @person wearing the @cloth. keep @person 's pose and background.`,
      aspect_ratio: "3:4",
      reference_tags: ["person", "cloth"],
      reference_images: [
        `data:${validFormData.myImg.type};base64,${myImgBuffer}`,
        `data:${validFormData.itemImg.type};base64,${itemImgBuffer}`,
      ],
    };

    const output = await replicate.run("runwayml/gen4-image", {
      input,
    });

    imageUrl = await streamToBase64(output as ReadableStream);
  }

  if (validFormData.clothImgUrl) {
    // replicate 를 통해서 결과 이미지 생성
    const input = {
      prompt: `the @person wearing the @cloth. keep @person 's pose and background.`,
      aspect_ratio: "3:4",
      reference_tags: ["person", "cloth"],
      reference_images: [
        `data:${validFormData.myImg.type};base64,${myImgBuffer}`,
        validFormData.clothImgUrl,
      ],
    };

    const output = await replicate.run("runwayml/gen4-image", {
      input,
    });

    imageUrl = await streamToBase64(output as ReadableStream);
  }

  return { imageUrl: `data:img/png;base64,${imageUrl}` };
};
