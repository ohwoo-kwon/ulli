import { Button } from "~/common/components/ui/button";
import ImageUpload from "~/common/components/image-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { useState } from "react";
import OpenAI, { toFile } from "openai";

const client = new OpenAI({ apiKey: "", dangerouslyAllowBrowser: true });

export default function UploadPage() {
  const [itemPreview, setItemPreview] = useState<string | null>(null);
  const [myImgPreview, setMyImgPreview] = useState<string | null>(null);

  const handleImgCreate = async () => {
    if (!(itemPreview && myImgPreview)) return;
    const itemBlob = await (await fetch(itemPreview)).blob();
    const myImgBlob = await (await fetch(myImgPreview)).blob();

    const images = await Promise.all([
      await toFile(itemBlob, "item", {
        type: "image/png",
      }),
      await toFile(myImgBlob, "myImg", {
        type: "image/png",
      }),
    ]);

    // const rsp = await client.images.edit({
    //   model: "gpt-image-1",
    //   image: images,
    //   prompt: "Create a image that person in myImg wears an cloth in item",
    // });

    // if (!rsp || !rsp.data) return;

    // const image_base64 = rsp.data[0].b64_json;
    // if (!image_base64) return;
    // const image_bytes = Buffer.from(image_base64, "base64");
    // fs.writeFileSync("basket.png", image_bytes);
  };

  return (
    <div className="py-4 flex flex-col items-center justify-center gap-10 min-w-screen min-h-[calc(100vh-44px)]">
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
      <Button
        className="w-110 lg:w-225"
        disabled={!Boolean(itemPreview && myImgPreview)}
        onClick={handleImgCreate}>
        생성
      </Button>
    </div>
  );
}
