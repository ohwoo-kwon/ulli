import { Form, Link, data, redirect } from "react-router";
import { Button } from "~/common/components/ui/button";
import { CardContent, CardFooter } from "~/common/components/ui/card";
import { Input } from "~/common/components/ui/input";
import type { Route } from "./+types/login";
import { z } from "zod";
import AuthCard from "../components/auth-card";
import client from "~/supa-client";

const formSchema = z.object({
  email: z.string().email("유효하지 않은 이메일 형식입니다."),
  password: z
    .string()
    .min(8, "최소 8자 이상 작성하여야 합니다.")
    .max(15, "최대 15자 까지 작성 가능합니다."),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const {
    data: validData,
    success,
    error,
  } = formSchema.safeParse(Object.fromEntries(formData));
  if (!success) return { fieldErrors: error.flatten().fieldErrors };
  const { email, password } = validData;
  const { data: signInData, error: signInError } =
    await client.auth.signInWithPassword({ email, password });
  if (signInError)
    return data({ message: signInError.message }, { status: 400 });
  if (signInData.user) return redirect("/");
};

export default function loginPage() {
  return (
    <AuthCard>
      <Form method="POST">
        <CardContent className="space-y-5">
          <div>
            <Input name="email" placeholder="이메일" />
          </div>
          <div>
            <Input name="password" placeholder="패스워드" type="password" />
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
