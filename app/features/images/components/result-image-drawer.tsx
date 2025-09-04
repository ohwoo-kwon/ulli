import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
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
        <Button className="w-full" variant="secondary" disabled={!resultImgUrl}>
          결과 확인
        </Button>
      </DrawerTrigger>
      <DrawerContent className="overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>AI 피팅 결과</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 space-y-4">
          <Dialog>
            <DialogTrigger asChild>
              {isLoading ? (
                <div className="flex items-center justify-center font-bold text-2xl w-full aspect-square rounded text-muted-foreground bg-gray-200 animate-pulse">
                  👗 피팅 진행 중
                </div>
              ) : (
                <img
                  className="aspect-square border rounded object-contain"
                  src={resultImgUrl}
                  alt="결과 이미지"
                />
              )}
            </DialogTrigger>
            <DialogContent className="w-screen h-screen p-0 bg-transparent border-0 shadow-none">
              <img
                className="w-full h-full rounded object-cover"
                src={resultImgUrl}
                alt="결과 이미지"
              />
            </DialogContent>
          </Dialog>
        </div>
        <DrawerFooter>
          <Button className="w-full" variant="secondary" asChild>
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
