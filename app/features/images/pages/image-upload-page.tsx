import { Button } from "~/common/components/ui/button";
import ImageUpload from "~/common/components/image-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { useState } from "react";
import OpenAI from "openai";
import { Form, useNavigation } from "react-router";
import type { Route } from "./+types/image-upload-page";

const client = new OpenAI({ apiKey: "", dangerouslyAllowBrowser: true });

export const action = async ({ request }: Route.ActionArgs) => {
  const formdata = await request.formData();
  const itemImg = formdata.get("item")! as File;
  const myImg = formdata.get("my-img")! as File;

  try {
    const rsp = await client.images.edit({
      model: "gpt-image-1",
      image: [itemImg, myImg],
      prompt: "Create a image that person in myImg wears an cloth in item",
    });

    if (!rsp || !rsp.data) {
      console.log(rsp);
      return { error: "이미지 생성에 실패하였습니다.", img: null };
    }

    const image_base64 = rsp.data[0].b64_json;
    if (!image_base64)
      return { error: "이미지 생성에 실패하였습니다.", img: null };
    const image_bytes = Buffer.from(image_base64, "base64");

    return { img: image_bytes, error: null };
  } catch (e) {
    return { img: null, error: (e as Error).message };
  }
};

export default function UploadPage({ actionData }: Route.ComponentProps) {
  const [itemPreview, setItemPreview] = useState<string | null>(null);
  const [myImgPreview, setMyImgPreview] = useState<string | null>(null);

  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="py-4 min-w-screen min-h-[calc(100vh-44px)] flex flex-col lg:flex-row items-center lg:items-start lg:justify-center gap-10">
      <Form
        method="POST"
        encType="multipart/form-data"
        className="flex flex-col items-center justify-center gap-10"
      >
        <div className="flex flex-col gap-5 items-center lg:flex-row lg:justify-center">
          <Card className="w-110">
            <CardHeader>
              <CardTitle>상품</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ImageUpload
                name="item"
                preview={itemPreview}
                setPreview={setItemPreview}
              />
            </CardContent>
          </Card>
          <Card className="w-110">
            <CardHeader>
              <CardTitle>내 사진</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ImageUpload
                name="my-img"
                preview={myImgPreview}
                setPreview={setMyImgPreview}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col items-center">
          <Button
            className="w-110 lg:w-225"
            disabled={!Boolean(itemPreview && myImgPreview)}
          >
            {isSubmitting ? "생성 중" : "생성"}
          </Button>
          {actionData?.error && (
            <small className="text-red-500">{actionData.error}</small>
          )}
        </div>
      </Form>
      {actionData?.img && (
        <Card className="w-110">
          <CardHeader>
            <CardTitle>결과</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <img
              className="size-96"
              src={`https://avatars.githubusercontent.com/u/77429319?s=400&u=6d0e6d5734e3a87469c5003841a1f85399410de9&v=4`}
              alt="결과 이미지"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
