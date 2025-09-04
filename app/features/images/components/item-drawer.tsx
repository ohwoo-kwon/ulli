import { CircleCheckIcon, XCircleIcon } from "lucide-react";
import { Button } from "~/common/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/common/components/ui/drawer";

export default function ItemDrawer() {
  return (
    <Drawer defaultOpen>
      <DrawerTrigger className="cursor-pointer">
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
        </svg>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>상품 사진 선택 가이드</DrawerTitle>
        </DrawerHeader>
        <div className="space-y-4 px-4">
          <div className="grid grid-cols-2">
            <ul className="text-xs space-y-1">
              <li className="flex gap-2 items-center">
                <CircleCheckIcon
                  fill="green"
                  className="text-white"
                  size={16}
                />
                <span>상품 단독 사진</span>
              </li>
            </ul>
            <ul className="text-xs space-y-1">
              <li className="flex gap-2 items-center">
                <XCircleIcon fill="red" className="text-white" size={16} />
                <span>모델 착용 사진</span>
              </li>
              <li className="flex gap-2 items-center">
                <XCircleIcon fill="red" className="text-white" size={16} />
                <span>여러 개의 상품 사진</span>
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 pb-8 gap-2">
            <div className="col-span-1 flex flex-col gap-1 items-center border p-1 rounded">
              <img
                className="asepect-square w-full max-w-50"
                src="https://image.hmall.com/static/5/6/92/39/2239926540_0.jpg?RS=600x600&AR=0&ao=1&cVer=202509032014&SF=webp"
              />
              <img
                className="asepect-square w-full max-w-50"
                src="https://image.hmall.com/static/8/9/99/39/2239999896_0.jpg?RS=600x600&AR=0&ao=1&cVer=202509041837&SF=webp"
              />
              <CircleCheckIcon fill="green" className="text-white" />
            </div>
            <div className="col-span-1 flex flex-col gap-1 items-center border p-1 rounded">
              <img
                className="asepect-square w-full max-w-50"
                src="https://image.hmall.com/static/7/4/38/31/2231384757_0.jpg?RS=600x600&AR=0&ao=1&cVer=202508271007&SF=webp"
              />
              <img
                className="asepect-square w-full max-w-50"
                src="https://image.hmall.com/static/5/3/50/06/2206503502_0.jpg?RS=600x600&AR=0&ao=1&cVer=202503311313&SF=webp"
              />
              <XCircleIcon fill="red" className="text-white" />
            </div>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose>
            <Button className="w-full">확인</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
