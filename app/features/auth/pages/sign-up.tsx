import type { Route } from "./+types/sign-up";
import { CardContent, CardFooter } from "~/common/components/ui/card";
import { Form, Link, redirect } from "react-router";
import { Input } from "~/common/components/ui/input";
import { Button } from "~/common/components/ui/button";
import { z } from "zod";
import { checkExistingUser, createUser } from "../queries";
import AuthCard from "../components/auth-card";

const formSchema = z
  .object({
    id: z
      .string()
      .min(1, "최소 1자 이상 작성하여야 합니다.")
      .max(10, "최대 10자 까지 작성 가능합니다."),
    name: z
      .string()
      .min(1, "최소 1자 이상 작성하여야 합니다.")
      .max(10, "최대 10자 까지 작성 가능합니다."),
    password: z
      .string()
      .min(8, "최소 8자 이상 작성하여야 합니다.")
      .max(15, "최대 15자 까지 작성 가능합니다."),
    passwordConfirm: z
      .string()
      .min(8, "최소 8자 이상 작성하여야 합니다.")
      .max(15, "최대 15자 까지 작성 가능합니다."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { data, success, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) return { fieldErrors: error.flatten().fieldErrors };
  const { id, name, password } = data;
  const res = await checkExistingUser(data.id);
  if (res) return { fieldErrors: { id: ["이미 존재하는 아이디입니다"] } };
  await createUser({ id, name, password });
  return redirect("/auth/login");
};

export default function signUpPage({ actionData }: Route.ComponentProps) {
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
            <Input name="name" placeholder="이름" />
            {actionData?.fieldErrors.name && (
              <p className="text-xs text-red-500">
                {actionData.fieldErrors.name.join(", ")}
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
          <div>
            <Input
              name="passwordConfirm"
              placeholder="패스워드 확인"
              type="password"
            />
            {actionData?.fieldErrors.passwordConfirm && (
              <p className="text-xs text-red-500">
                {actionData.fieldErrors.passwordConfirm.join(", ")}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full">
            회원가입
          </Button>
          <Button variant="secondary" className="w-full" asChild>
            <Link to="/auth/login">뒤로</Link>
          </Button>
        </CardFooter>
      </Form>
    </AuthCard>
  );
}
