import { Form } from "react-router";
import { Button } from "~/common/components/ui/button";
import { Input } from "~/common/components/ui/input";
import type { Route } from "./+types/upload";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  console.log(Object.fromEntries(formData));
  const messages = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "위 이미지에서 보이는 음식들과 각 음식 별 칼로리 분석해줘",
        },
        {
          type: "image_url",
          image_url:
            "https://blog.kakaocdn.net/dn/biExBb/btsgkZr1Wiz/mbdYaSULoF3F636K1PeWa1/img.jpg",
        },
      ],
    },
  ];
  try {
    const res = await (
      await fetch(
        "https://kmsproject.openai.azure.com/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-15-preview",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-key":
              "6v77E9pLDMR66xQdCKqh5UUZD5QpYLM7S6LjjIJRGEnOMEJGfFgGJQQJ99AKACYeBjFXJ3w3AAABACOGYiAC",
          },
          body: JSON.stringify({ messages }),
        }
      )
    ).json();
    console.log(res);
  } catch (error) {}
};

export default function UploadPage() {
  return (
    <div className="py-10 flex flex-col items-center justify-center gap-10">
      <Form className="space-y-3" method="POST">
        <div className="border border-dashed border-gray-300 rounded flex items-center justify-center w-96 h-54 cursor-pointer bg-gray-200 hover:bg-gray-300">
          <Input name="file" type="file" accept="image/*" className="hidden" />
          <div className="flex flex-col items-center text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16V8a2 2 0 012-2h14a2 2 0 012 2v8m-4-3l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            <p className="mt-2 text-sm">이미지를 업로드하세요</p>
          </div>
        </div>
        <Button className="w-96">분석</Button>
      </Form>
    </div>
  );
}
