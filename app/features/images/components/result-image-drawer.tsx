import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Card, CardHeader } from "~/common/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/common/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/common/components/ui/drawer";

export default function ResultImageDrawer({
  resultImgUrl,
  isLoading,
}: {
  resultImgUrl: string;
  isLoading: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoading) setOpen(true);
  }, [isLoading]);

  return (
    <Drawer open={open}>
      <DrawerTrigger className="w-full">
        <Button className="w-full" disabled={!resultImgUrl}>
          결과 확인
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>AI 피팅 결과</DrawerTitle>
        </DrawerHeader>
        <Dialog>
          <DialogTrigger asChild>
            {isLoading ? (
              <div className="flex items-center justify-center font-bold text-2xl w-full aspect-square rounded text-muted-foreground bg-gray-200 animate-pulse">
                👗 피팅 진행 중
              </div>
            ) : (
              <img
                className="w-full aspect-square border rounded object-contain"
                src={resultImgUrl}
                alt="결과 이미지"
              />
            )}
          </DialogTrigger>
          <DialogContent className="w-screen h-screen p-0 bg-transparent border-0 shadow-none">
            <img
              className="w-full h-full rounded object-contain"
              src={resultImgUrl}
              alt="결과 이미지"
            />
          </DialogContent>
        </Dialog>
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
        <DrawerFooter>
          <Button className="w-80 mb-4" variant="secondary" asChild>
            <Link to="https://naver.me/FK0xDjfb" target="_blank">
              설문
            </Link>
          </Button>
          <DrawerClose>
            <Button className="w-full">확인</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
