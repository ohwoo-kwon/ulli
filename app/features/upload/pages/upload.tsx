import { Button } from "~/common/components/ui/button";
import ImageUpload from "~/common/components/image-upload";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

export default function UploadPage() {
  const handleClickText = () => {
    console.log("텍스트 변환");
  };

  const handleClickImage = () => {
    console.log("이미지 변환");
  };
  return (
    <div className="px-2 py-4 space-y-10">
      <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-stretch">
        <div className="flex flex-col gap-2">
          <ImageUpload name="cloth_img" />
          <Button onClick={handleClickText}>텍스트 변환</Button>
        </div>
        <Card className="w-96 lg:w-full shadow-none">
          <CardHeader>
            <CardTitle>이미지 텍스트</CardTitle>
          </CardHeader>
          <CardContent>이미지에 있는 의류를 텍스트로 변환</CardContent>
        </Card>
      </div>
      <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-stretch">
        <div className="flex flex-col gap-2">
          <ImageUpload name="target_img" />
          <Button onClick={handleClickImage}>이미지 변환</Button>
        </div>
        <Card className="w-96 lg:w-full shadow-none">
          <CardHeader>
            <CardTitle>결과</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  );
}
