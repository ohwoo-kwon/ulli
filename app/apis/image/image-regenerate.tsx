import { z } from "zod";
import type { Route } from "./+types/image-regenerate";
import { data } from "react-router";
import Replicate from "replicate";
import { streamToBase64 } from "~/lib/utils";

const formSchema = z.object({
  myImgUrl: z.string(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  if (request.method !== "POST") return data({ status: 404 });
  const formData = await request.formData();

  const prompt = `주어진 사진에서 사람이 입고 있는 옷들을 박스핏으로 만들어주세요.`;

  const {
    data: validFormData,
    success,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) return data({ error: "잘못된 요청입니다." }, { status: 401 });

  const replicate = new Replicate();

  const output = await replicate.run("google/nano-banana", {
    input: {
      prompt,
      image_input: [validFormData.myImgUrl],
    },
  });

  const imageUrl = await streamToBase64(output as ReadableStream);

  return { imageUrl: `data:img/jpeg;base64,${imageUrl}` };
};
