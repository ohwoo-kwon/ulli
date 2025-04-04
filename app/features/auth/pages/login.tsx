import { Form, Link, redirect } from "react-router";
import { Button } from "~/common/components/ui/button";
import { CardContent, CardFooter } from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import type { Route } from "./+types/login";
import { z } from "zod";
import { loginUser } from "../queries";
import AuthCard from "../components/auth-card";

const formSchema = z.object({
  id: z
    .string()
    .min(1, "최소 1자 이상 작성하여야 합니다.")
    .max(10, "최대 10자 까지 작성 가능합니다."),

  password: z
    .string()
    .min(8, "최소 8자 이상 작성하여야 합니다.")
    .max(15, "최대 15자 까지 작성 가능합니다."),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { data, success, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) return { fieldErrors: error.flatten().fieldErrors };
  const { id, password } = data;
  const user = await loginUser({ id, password });
  if (user.length > 0) return redirect("/");
  return { fieldErrors: { password: ["아이디와 패스워드를 확인해주세요."] } };
};

export default function loginPage({ actionData }: Route.ComponentProps) {
  return (
    <AuthCard>
      <Form method="POST">
        <CardContent className="space-y-5">
          <div>
            <Input name="id" placeholder="아이디" />
            {actionData?.fieldErrors.id && (
              <p className="text-xs text-red-500">
                {actionData.fieldErrors.id.join(", ")}
              </p>
            )}
          </div>
          <div>
            <Input name="password" placeholder="패스워드" type="password" />
            {actionData?.fieldErrors.password && (
              <p className="text-xs text-red-500">
                {actionData.fieldErrors.password.join(", ")}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full">
            로그인
          </Button>
          <Button variant="secondary" className="w-full" asChild>
            <Link to="/auth/sign-up">회원가입</Link>
          </Button>
        </CardFooter>
      </Form>
    </AuthCard>
  );
}
