import { z } from "zod";
import type { Route } from "./+types/image-generate";
import { data } from "react-router";
import Replicate from "replicate";
import { cropToFourFive, fileToBase64, streamToBase64 } from "~/lib/utils";

const formSchema = z.object({
  clothImgUrl: z.string().optional(),
  itemImg: z.instanceof(File).optional(),
  myImg: z.instanceof(File),
});

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") return data({ status: 404 });
  const formData = await request.formData();

  const prompt = `the @person wearing the @cloth. keep @person 's pose and background. Do not generate any sexual or suggestive content. No underwear-only or shirtless images allowed.`;

  const {
    data: validFormData,
    success,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) return data({ error: "잘못된 요청입니다." }, { status: 401 });

  const replicate = new Replicate();

  const arrayBuffer = await validFormData.myImg.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // sharp으로 4:5 크롭
  const croppedBuffer = await cropToFourFive(buffer);

  // base64로 변환 (Replicate에 필요하다면)
  const myImgBase64 = croppedBuffer.toString("base64");
  console.log(myImgBase64);
  let imageUrl = "";

  // try {
  //   if (validFormData.itemImg) {
  //     const itemImgBuffer = await fileToBase64(validFormData.itemImg);

  //     // replicate 를 통해서 결과 이미지 생성
  //     const input = {
  //       prompt,
  //       aspect_ratio: "3:4",
  //       reference_tags: ["person", "cloth"],
  //       reference_images: [
  //         `data:${validFormData.myImg.type};base64,${myImgBase64}`,
  //         `data:${validFormData.itemImg.type};base64,${itemImgBuffer}`,
  //       ],
  //     };

  //     const output = await replicate.run("runwayml/gen4-image", {
  //       input,
  //     });

  //     imageUrl = await streamToBase64(output as ReadableStream);
  //   }

  //   if (validFormData.clothImgUrl) {
  //     // replicate 를 통해서 결과 이미지 생성
  //     const input = {
  //       prompt,
  //       aspect_ratio: "3:4",
  //       reference_tags: ["person", "cloth"],
  //       reference_images: [
  //         `data:${validFormData.myImg.type};base64,${myImgBase64}`,
  //         validFormData.clothImgUrl,
  //       ],
  //     };

  //     const output = await replicate.run("runwayml/gen4-image", {
  //       input,
  //     });

  //     imageUrl = await streamToBase64(output as ReadableStream);
  //   }
  // } catch (e) {
  //   console.log(e);
  //   // @ts-ignore
  //   return data({ error: e.message }, { status: 400 });
  // }

  // return { imageUrl: `data:img/png;base64,${imageUrl}` };
};
