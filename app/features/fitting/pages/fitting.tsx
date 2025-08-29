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

const prompt = `Replace the person's current clothes entirely with the given clothes. Remove all original clothing, including jackets, coats, or layers, so that only the provided clothes remain. Keep the exact style, type, color, texture, and material of the new clothes. Make the new clothes fit naturally and look realistic. Keep the face, skin, and body unchanged. Ensure the new clothes are clearly visible. 

If a bottom is provided but the person photo shows only the upper body, generate a full-body image of the person in the same background. Never generate a topless or partially nude upper body. Do not alter the color, pattern, or shape of the given clothes in any way, for example, do not change a checkered shirt’s pattern or color.`;

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
    return { imageUrl: `data:img/png;base64,${imageUrl}` };
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    if (croppedFile) {
      formData.set("myImg", croppedFile);
    }

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
    <div className="mx-4 my-8">
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
        <Button>피팅</Button>
        {fetcher.data && "error" in fetcher.data && (
          <span className="text-red-500 text-xs text-center w-80">
            {fetcher.data.error === "fetch failed"
              ? "이미지 생성에 실패했습니다. 가이드에 맞추어 다시 시도해주세요."
              : fetcher.data.error}
          </span>
        )}
        {resultImgUrl ? (
          <Dialog>
            <DialogTrigger asChild>
              <img
                className="w-full aspect-square border rounded object-contain"
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
      </Form>
    </div>
  );
}
