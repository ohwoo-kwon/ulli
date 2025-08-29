import { useEffect, useState } from "react";
import ImageUpload from "~/common/components/image-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Form, useFetcher } from "react-router";
import { Button } from "~/common/components/ui/button";
import type { Route } from "./+types/coordi";
import Replicate from "replicate";
import { fileToBase64, streamToBase64 } from "~/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { RotateCwIcon } from "lucide-react";
import MulitImageUpload from "../components/multi-image-upload";

const person_prompt = `Extract only the clothing items that actually appear in the input photo. 
Do not create or add any items that are not present in the image. 
Exclude the person’s face, body, and background. 
Arrange the extracted clothes neatly on a plain white background, organized like a fashion styling board (e.g., tops, bottoms, outerwear, shoes, accessories). 
The result should look like a clean clothing catalog or outfit suggestion image, but must include only the garments and accessories that are visible in the input photo.`;

const multi_image_prompt = `From the provided input images (which may include people wearing clothes or individual fashion items), extract all visible fashion items such as tops, bottoms, outerwear, dresses, shoes, bags, hats, and accessories.
Do not include any human faces, bodies, or backgrounds.
Arrange the extracted items together into a single image to create a natural outfit, as if styling a person for today’s look. Make the outfit appear realistic and cohesive, combining the items in a way that could be worn together.
Place the items on a clean white background, but show them in context as a coordinated look (e.g., top above bottom, shoes below, accessories around).
The final image should look like a professional fashion catalog, a “today’s outfit” suggestion, or a fashion styling board.
Use only the items from the input images without inventing new ones.`;

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const snapImgFiles = formData.getAll("snapImg") as File[];

  const image_input = [];

  try {
    if (snapImgFiles.length === 1) {
      const snapImgFile = snapImgFiles[0];
      const snapImgBuffer = await fileToBase64(snapImgFile);
      image_input.push(`data:${snapImgFile.type};base64,${snapImgBuffer}`);
    } else {
      const snapImgBufferPromises: Promise<string>[] = [];
      snapImgFiles.forEach((snapImgFile) => {
        snapImgBufferPromises.push(fileToBase64(snapImgFile));
      });
      const snapImgBuffers = await Promise.all(snapImgBufferPromises);
      snapImgBuffers.forEach((snapImgBuffer, idx) =>
        image_input.push(
          `data:${snapImgFiles[idx].type};base64,${snapImgBuffer}`
        )
      );
    }

    const input = {
      prompt: snapImgFiles.length === 1 ? person_prompt : multi_image_prompt,
      image_input,
    };

    const replicate = new Replicate();

    const output = await replicate.run("google/nano-banana", {
      input,
    });

    const imageUrl = await streamToBase64(output as ReadableStream);
    return { imageUrl: `data:img/png;base64,${imageUrl}` };
  } catch (e) {
    console.log(e);
    // @ts-ignore
    return data({ error: e.message }, { status: 400 });
  }
};

export default function Coordi() {
  const fetcher = useFetcher();
  const [snapImgPreview, setSnapImgPreview] = useState<string | null>(null);
  const [resultImgUrl, setResultImgUrl] = useState("");

  const isLoading = fetcher.state === "submitting";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setResultImgUrl("");
    const formData = new FormData(event.currentTarget);

    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  };

  useEffect(() => {
    if (fetcher.data?.imageUrl) {
      setResultImgUrl(fetcher.data.imageUrl);
    }
  }, [fetcher.data]);

  return (
    <div className="mx-4 my-8 md:flex md:gap-16">
      <Form
        className="flex flex-col gap-8 w-fit mx-auto"
        onSubmit={handleSubmit}
      >
        <Card className="w-80">
          <CardHeader>
            <CardTitle>참고 이미지</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <MulitImageUpload name="snapImg" />
          </CardContent>
        </Card>
        <Button disabled={isLoading}>
          {isLoading ? <RotateCwIcon className="animate-spin" /> : "코디 제작"}
        </Button>
        {fetcher.data && "error" in fetcher.data && (
          <span className="text-red-500 text-xs text-center w-80">
            {fetcher.data.error === "fetch failed"
              ? "이미지 생성에 실패했습니다. 가이드에 맞추어 다시 시도해주세요."
              : fetcher.data.error}
          </span>
        )}
      </Form>
      {isLoading && !resultImgUrl ? (
        <div className="flex items-center justify-center font-bold text-2xl text-muted-foreground w-80 aspect-square rounded bg-gray-200 animate-pulse mx-auto mt-16 md:mt-0 md:w-full md:max-w-[600px] md:max-h-[600px]">
          ✨ 코디 제작 중
        </div>
      ) : null}
      {resultImgUrl ? (
        <Dialog>
          <DialogTrigger asChild>
            <img
              className="w-80 aspect-square border rounded object-contain mx-auto mt-16 md:mt-0 md:w-full md:max-w-[600px] md:max-h-[600px]"
              src={resultImgUrl}
              alt="결과 이미지"
            />
          </DialogTrigger>
          <DialogContent className="w-screen h-screen p-0 bg-transparent border-0 shadow-none">
            <img
              className="w-full h-full rounded object-contain"
              src={resultImgUrl}
              alt="결과 이미지"
            />
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
