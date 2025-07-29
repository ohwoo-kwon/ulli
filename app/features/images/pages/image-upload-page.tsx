import { Button } from "~/common/components/ui/button";
import ImageUpload from "~/common/components/image-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { useEffect, useState } from "react";
import { data, useFetcher } from "react-router";
import { RotateCwIcon } from "lucide-react";
import type { Route } from "./+types/image-upload-page";
import { z } from "zod";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/common/components/ui/carousel";

const searchParamsSchema = z.object({
  imgUrl: z.string().optional(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const imgUrls = formData.getAll("imgUrls") as string[];
  return { imgUrls };
};

export const loader = ({ request }: Route.LoaderArgs) => {
  const searchParams = new URL(request.url).searchParams;

  const {
    data: searchParamsData,
    success,
    error,
  } = searchParamsSchema.safeParse(Object.fromEntries(searchParams));

  if (!success)
    throw data({ error: error.flatten().fieldErrors.imgUrl }, { status: 400 });

  return { imgUrl: searchParamsData.imgUrl || null };
};

export default function UploadPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const fetcher = useFetcher();
  const [itemPreview, setItemPreview] = useState<string | null>(null);
  const [myImgPreview, setMyImgPreview] = useState<string | null>(null);
  const [resultImgUrl, setResultImgUrl] = useState("");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const isLoading = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.imageUrl) {
      setResultImgUrl(fetcher.data.imageUrl);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!actionData || !actionData.imgUrls) return;
    setItemPreview(actionData.imgUrls[current]);
  }, [current]);

  const handleReset = () => {
    setItemPreview(null);
    setMyImgPreview(null);
    setResultImgUrl("");
  };

  console.log(itemPreview);

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
                {actionData?.imgUrls ? (
                  <Carousel setApi={setApi} className="w-full max-w-xs">
                    <CarouselContent>
                      <input
                        className="hidden"
                        name="clothImgUrl"
                        defaultValue={itemPreview || ""}
                      />
                      {actionData.imgUrls.map((imgUrl, index) => (
                        <CarouselItem key={index}>
                          <img src={imgUrl} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                ) : (
                  <ImageUpload
                    name="itemImg"
                    preview={itemPreview}
                    setPreview={setItemPreview}
                    imgUrl={loaderData.imgUrl || undefined}
                  />
                )}
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
          <div className="flex flex-col items-center">
            <Button
              className="w-80"
              type="submit"
              disabled={!Boolean(itemPreview && myImgPreview) || isLoading}
            >
              {isLoading ? <RotateCwIcon className="animate-spin" /> : "생성"}
            </Button>
          </div>
        </fetcher.Form>
      </div>
      {/* {resultImgUrl && (
        <Button className="w-80" onClick={handleReset}>
          되돌리기
        </Button>
      )} */}
    </div>
  );
}
