import ImageUpload from "~/common/components/image-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { useFetcher } from "react-router";
import { useEffect, useState } from "react";
import { Button } from "~/common/components/ui/button";

export default function Hmall() {
  const fetcher = useFetcher();

  const [myImgPreview, setMyImgPreview] = useState<string | null>(null);
  const [resultImgUrl, setResultImgUrl] = useState("");

  useEffect(() => {
    if (fetcher.data?.imageUrl) {
      setResultImgUrl(fetcher.data.imageUrl);
    }
  }, [fetcher.data]);

  const handleReset = () => {
    setMyImgPreview(null);
    setResultImgUrl("");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="py-4 flex flex-col items-center lg:flex-row lg:justify-center lg:items-start gap-5">
        <fetcher.Form
          method="post"
          encType="multipart/form-data"
          action="/api/image/generate"
          className="flex flex-col items-center gap-5"
        >
          <div className="flex flex-col gap-5 items-center lg:flex-row lg:justify-center">
            <Card className="w-80">
              <CardHeader>
                <CardTitle>① 상품</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <img
                  className="w-full aspect-square border rounded object-contain"
                  src="https://image.hmall.com/static/3/8/19/13/2213198369_0.jpg?RS=600x600&AR=0&ao=1&cVer=202502211648&SF=webp"
                  alt="상품 이미지"
                />
              </CardContent>
            </Card>
            <Card className="w-80">
              <CardHeader>
                <CardTitle>② 내 사진</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                <ImageUpload
                  name="myImg"
                  preview={myImgPreview}
                  setPreview={setMyImgPreview}
                />
              </CardContent>
            </Card>
            <Card className="w-80">
              <CardHeader>
                <CardTitle>③ 결과</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center">
                {resultImgUrl ? (
                  <img
                    className="w-full aspect-square border rounded object-contain"
                    src={resultImgUrl}
                    alt="결과 이미지"
                  />
                ) : (
                  <div className="w-full aspect-square border rounded flex items-center justify-center text-muted-foreground">
                    결과 이미지
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          {!resultImgUrl && (
            <div className="flex flex-col items-center">
              <Button
                className="w-80"
                type="submit"
                disabled={!Boolean(myImgPreview)}
              >
                생성
              </Button>
            </div>
          )}
        </fetcher.Form>
      </div>
      {resultImgUrl && (
        <Button className="w-80" onClick={handleReset}>
          되돌리기
        </Button>
      )}
    </div>
  );
}
