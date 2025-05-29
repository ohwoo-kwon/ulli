import { Button } from "~/common/components/ui/button";
import ImageUpload from "~/common/components/image-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { useEffect, useState } from "react";
import { useFetcher } from "react-router";

export default function UploadPage() {
  const fetcher = useFetcher();
  const [itemPreview, setItemPreview] = useState<string | null>(null);
  const [myImgPreview, setMyImgPreview] = useState<string | null>(null);
  const [resultImgUrl, setResultImgUrl] = useState("");

  useEffect(() => {
    if (fetcher.data?.imageUrl) {
      setResultImgUrl(fetcher.data.imageUrl);
    }
  }, [fetcher.data]);

  return (
    <div className="py-4 min-w-screen min-h-[calc(100vh-44px)] flex flex-col lg:flex-row items-center lg:items-start lg:justify-center gap-10">
      <fetcher.Form
        method="post"
        encType="multipart/form-data"
        action="/api/image/generate"
        className="flex flex-col items-center justify-center gap-10"
      >
        <div className="flex flex-col gap-5 items-center lg:flex-row lg:justify-center">
          <Card className="w-110">
            <CardHeader>
              <CardTitle>상품</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ImageUpload
                name="itemImg"
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
                name="myImg"
                preview={myImgPreview}
                setPreview={setMyImgPreview}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col items-center">
          <Button
            className="w-110 lg:w-225"
            type="submit"
            disabled={!Boolean(itemPreview && myImgPreview)}
          >
            생성
          </Button>
        </div>
      </fetcher.Form>
      {resultImgUrl && (
        <Card className="w-110">
          <CardHeader>
            <CardTitle>결과</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <img className="size-96" src={resultImgUrl} alt="결과 이미지" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
