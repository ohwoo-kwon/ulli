import type { Route } from "./+types/description";

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();

  const beforeMeal = formData.get("before_meal") as File;
  const afterMeal = formData.get("after_meal");

  console.log("식사 전:", beforeMeal);
  console.log("식사 후:", afterMeal);

  return new Response("true");
};
