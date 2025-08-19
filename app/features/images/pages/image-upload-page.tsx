import { Button } from "~/common/components/ui/button";
import ImageUpload from "~/common/components/image-upload";
import {
  Card,
  CardContent,
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
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className="flex flex-col items-center">
      <div className="py-4 flex flex-col items-center lg:flex-row lg:justify-center lg:items-start gap-5">
        <fetcher.Form
          method="post"
          encType="multipart/form-data"
          action="/api/image/generate"
          className="flex flex-col items-center gap-5"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:justify-center">
            <div className="flex flex-col gap-2">
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
            <Card className="w-80 bg-blue-100">
              <CardHeader className="text-sm">
                <h3 className="font-semibold mb-2">👗 상품 사진 선택 가이드</h3>
                <ul className="ml-4 *:mb-2">
                  <li>1️⃣ 모델 착용 컷보다 → 상품 단독 사진이 더 정확해요.</li>
                  <li>2️⃣ 여러 개보다 하나 → 한 개의 상품만 있는 사진을 골라주세요.</li>
                  <li className="mb-0">3️⃣ 배경은 미니멀하게 → 깔끔한 배경이 인식률을 높여줘요.</li>
                </ul>
              </CardHeader>
            </Card>
            </div>
            <div className="flex flex-col gap-2">
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
            <Card className="w-80 bg-blue-100">
              <CardHeader className="text-sm">
                <h3 className="font-semibold mb-2">🚹 인물 사진 선택 가이드</h3>
                <ul className="ml-4 *:mb-2">
                  <li>1️⃣ 인물 중심으로 → 전신보다 상반신·얼굴 중심이 좋아요.</li>
                  <li>2️⃣ 이목구비 또렷하게 → 안경·선글라스 없이, 얼굴이 잘 보이게!</li>
                  <li>3️⃣ 조명은 밝고 균일하게 → 단순한 배경에서 촬영하면 인식률 UP.</li>
                  <li className="mb-0">4️⃣ 선명함 필수 → 흐린 사진·저화질은 결과가 나빠요.</li>
                </ul>
              </CardHeader>
            </Card>
            </div>
            <div className="flex flex-col gap-2">

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
                    onClick={() => setIsOpen(true)}
                  />
                ) : (
                  <div className="w-full aspect-square border rounded flex items-center justify-center text-muted-foreground">
                    결과 이미지
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="w-80 bg-yellow-100">
              <CardHeader className="text-sm *:mb-2">
                <p>⚠️ 결과 이미지는 AI를 활용해 생성된 이미지로, 실제 인물이 해당 의상을 착용한 모습과는 차이가 있을 수 있습니다. 착용 이미지는 참고용으로만 사용해 주세요.</p>
                <p className="mb-0">⏰ 이미지 생성에 약 30초가 소요됩니다.</p>
              </CardHeader>
            </Card>
            </div>
          </div>
          <div className="flex flex-col gap-1 items-center">
            <Button
              className="w-80"
              type="submit"
              disabled={!Boolean(itemPreview && myImgPreview) || isLoading}
            >
              {isLoading ? <RotateCwIcon className="animate-spin" /> : "생성"}
            </Button>
            {fetcher.data && 'error' in fetcher.data && <span className="text-red-500 text-xs text-center w-80">{fetcher.data.error === 'fetch failed' ? '이미지 생성에 실패했습니다. 가이드에 맞추어 다시 시도해주세요.' : fetcher.data.error}</span>}
          </div>
        </fetcher.Form>
      </div>
      <Button
        className="w-80 mb-4"
        variant='secondary'
        asChild
      >
        <Link to="https://naver.me/FK0xDjfb" target="_blank">
          설문
        </Link>
      </Button>
      {/* {resultImgUrl && (
        <Button className="w-80" onClick={handleReset}>
          되돌리기
        </Button>
      )} */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <img
            src='결과이미지 확대'
            alt={resultImgUrl}
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
