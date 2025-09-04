import { Button } from "~/common/components/ui/button";
import ImageUpload from "~/common/components/image-upload";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { useEffect, useState } from "react";
import { data, Link, useFetcher } from "react-router";
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
import ItemDrawer from "../components/item-drawer";
import MyImgDrawer from "../components/my-image-drawer";
import ResultImageDrawer from "../components/result-image-drawer";

const searchParamsSchema = z.object({
  imgUrl: z.string().optional(),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const formImgUrls = formData.getAll("imgUrls") as string[];
  const imgUrls = formImgUrls.map((v) => v + "&AR=0");
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
  const [croppedFile, setCroppedFile] = useState<File | null>(null);
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResultImgUrl("");

    const formData = new FormData(event.currentTarget);

    // 원본 대신 크롭된 파일로 교체
    if (croppedFile) {
      formData.set("myImg", croppedFile); // name="myImg" 인 input을 덮어씀
    }

    fetcher.submit(formData, {
      method: "post",
      encType: "multipart/form-data",
      action: "/api/image/generate",
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="py-4 flex flex-col items-center lg:flex-row lg:justify-center lg:items-start gap-5">
        <fetcher.Form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-5"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:justify-center">
            <Card className="w-80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>① 상품 사진</span>
                  <ItemDrawer />
                </CardTitle>
                <CardDescription className="flex gap-1 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>{" "}
                  를 눌러 가이드를 확인해주세요.
                </CardDescription>
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
                <CardTitle className="flex items-center gap-2">
                  <span>② 내 사진</span>
                  <MyImgDrawer />
                </CardTitle>
                <CardDescription className="flex gap-1 items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-question-mark-icon lucide-circle-question-mark"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <path d="M12 17h.01" />
                  </svg>{" "}
                  를 눌러 가이드를 확인해주세요.
                </CardDescription>
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
          </div>
          <div className="flex flex-col gap-1 items-center">
            <Button
              className="w-80"
              type="submit"
              disabled={!Boolean(itemPreview && myImgPreview) || isLoading}
            >
              {isLoading ? <RotateCwIcon className="animate-spin" /> : "생성"}
            </Button>
            {fetcher.data && "error" in fetcher.data && (
              <span className="text-red-500 text-xs text-center w-80">
                {fetcher.data.error === "fetch failed"
                  ? "이미지 생성에 실패했습니다. 가이드에 맞추어 다시 시도해주세요."
                  : fetcher.data.error}
              </span>
            )}
            <Card className="w-80 bg-yellow-100">
              <CardHeader className="text-sm *:mb-2">
                <p>
                  ⚠️ 결과 이미지는 AI를 활용해 생성된 이미지로, 실제 인물이 해당
                  의상을 착용한 모습과는 차이가 있을 수 있습니다. 착용 이미지는
                  참고용으로만 사용해 주세요.
                </p>
                <p className="mb-0">⏰ 이미지 생성에 약 10초가 소요됩니다.</p>
              </CardHeader>
            </Card>
            <ResultImageDrawer
              resultImgUrl={resultImgUrl}
              isLoading={isLoading}
            />
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
