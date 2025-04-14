import { Form } from "react-router";
import { Button } from "~/common/components/ui/button";
import type { Route } from "./+types/upload";
import ImageUpload from "~/common/components/image-upload";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  console.log(Object.fromEntries(formData));
  // const messages = [
  //   {
  //     role: "user",
  //     content: [
  //       {
  //         type: "text",
  //         text: "위 이미지에서 보이는 음식들과 각 음식 별 칼로리 분석해줘",
  //       },
  //       {
  //         type: "image_url",
  //         image_url:
  //           "https://i.namu.wiki/i/-JTKclv3WgiKcUjS1j8PyLgNyAUmx8FcdO7MepWbpCj5q1mmhX9izG1ah3DyCYs2naXK3bq_belKZqOrfnN_TiwOig2YRXSGAfcqgg0h5M7UCw9KKH1FWI6uyiQSkvTUJENuMobxxVkRJwlHSABgOQ.webp",
  //       },
  //     ],
  //   },
  // ];
  // try {
  //   const res = await (
  //     await fetch(
  //       "https://kmsproject.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-08-06",
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           "api-key":
  //             "6v77E9pLDMR66xQdCKqh5UUZD5QpYLM7S6LjjIJRGEnOMEJGfFgGJQQJ99AKACYeBjFXJ3w3AAABACOGYiAC",
  //         },
  //         body: JSON.stringify({ messages }),
  //       }
  //     )
  //   ).json();
  //   console.log(res);
  // } catch (error) {}
};

export default function UploadPage() {
  return (
    <div className="py-10 flex flex-col items-center gap-10">
      <Form className="space-y-3" method="POST">
        <div className="flex gap-5">
          <div className="space-y-1">
            <h3 className="font-bold">식사 전</h3>
            <ImageUpload name="before_meal" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold">식사 후</h3>
            <ImageUpload name="after_meal" />
          </div>
        </div>
        <Button className="w-full">분석</Button>
      </Form>
      <div className="w-[788px]">
        <h3 className="font-bold">분석 결과</h3>
        <div>
          <div></div>
          <div>식사 전</div>
          <div>식사 후</div>
        </div>
      </div>
    </div>
  );
}
