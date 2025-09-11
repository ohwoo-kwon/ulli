import { useEffect, useState } from "react";
import ImageUpload from "~/common/components/image-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import MulitImageUpload from "../components/multi-image-upload";
import { Form, useFetcher } from "react-router";
import { Button } from "~/common/components/ui/button";
import type { Route } from "./+types/fitting";
import Replicate from "replicate";
import { fileToBase64, streamToBase64 } from "~/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import { RotateCwIcon } from "lucide-react";

const prompt = `Replace the person's current clothes in the first image entirely with the provided clothes and fashion items from the second to last images. Remove all original clothing, including jackets, coats, or layers, so that only the provided clothes and accessories remain.
Keep the exact style, type, color, texture, and material of the new clothes and accessories. Make the new clothes fit naturally and look realistic.
Do not alter the person’s face, skin, body, pose, or proportions in any way. Maintain the original body, posture, and facial features exactly as in the first image.
If a bottom is provided but the original image shows only the upper body, extend the person to a full-body image in the same background while keeping body proportions unchanged. Never generate a topless or partially nude upper body.
Ensure all new clothes and accessories are clearly visible and layered correctly, without changing their patterns, colors, or shapes.
When using multiple input images, strictly apply only the clothes and accessories without modifying the person.`;

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const myImgFile = formData.get("myImg") as File;
  const itemImgFiles = formData.getAll("itemImg") as File[];

  try {
    const myImgBuffer = await fileToBase64(myImgFile);
    const itemImgBufferPromises: Promise<string>[] = [];
    itemImgFiles.forEach((itemImgFile) => {
      itemImgBufferPromises.push(fileToBase64(itemImgFile));
    });
    const itemImgBuffers = await Promise.all(itemImgBufferPromises);

    const image_input = [`data:${myImgFile.type};base64,${myImgBuffer}`];

    itemImgBuffers.forEach((itemImgBuffer, idx) =>
      image_input.push(`data:${itemImgFiles[idx].type};base64,${itemImgBuffer}`)
    );

    const input = {
      prompt,
      image_input,
    };

    const replicate = new Replicate();

    const output = await replicate.run("google/nano-banana", {
      input,
    });

    const imageUrl = await streamToBase64(output as ReadableStream);
    return { imageUrl: `data:img/jpeg;base64,${imageUrl}` };
  } catch (e) {
    console.log(e);
    // @ts-ignore
    return data({ error: e.message }, { status: 400 });
  }
};

export default function Fitting() {
  const fetcher = useFetcher();
  const [myImgPreview, setMyImgPreview] = useState<string | null>(null);
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
  const [resultImgUrl, setResultImgUrl] = useState("");

  const isLoading = fetcher.state === "submitting";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    setResultImgUrl("");
    const formData = new FormData(event.currentTarget);
    if (croppedFile) {
      formData.set("myImg", croppedFile);
    }

    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  };

  const handleReFit = () => {
    const isOk = confirm(
      "아직 베타 서비스 입니다. 결과물이 정확하지 않을 수 있습니다. 그래도 시도해보시겠습니까?"
    );

    if (!isOk) return;
    setResultImgUrl("");
    const formData = new FormData();
    formData.set("myImgUrl", resultImgUrl);

    fetcher.submit(formData, {
      method: "POST",
      action: "/api/image/regenerate",
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
            <CardTitle>① 내 사진</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ImageUpload
              name="myImg"
              preview={myImgPreview}
              setPreview={setMyImgPreview}
              setCroppedFile={setCroppedFile}
            />
          </CardContent>
        </Card>
        <Card className="w-80">
          <CardHeader>
            <CardTitle>② 상품</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <MulitImageUpload name="itemImg" />
          </CardContent>
        </Card>
        <Button disabled={isLoading}>
          {isLoading ? <RotateCwIcon className="animate-spin" /> : "피팅"}
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
          👗 피팅 진행 중
        </div>
      ) : null}
      {resultImgUrl ? (
        <Dialog>
          <DialogTrigger asChild>
            <div className="w-80 mt-16 md:mt-0 md:w-full md:max-w-[600px] md:max-h-[600px]">
              <img
                className="w-full aspect-square border rounded object-contain mx-auto"
                src={resultImgUrl}
                alt="결과 이미지"
              />
              <Button className="w-full mt-2" onClick={handleReFit}>
                치수 키워서 입어보기
              </Button>
            </div>
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
