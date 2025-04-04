import {
  type RouteConfig,
  index,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  index("common/home.tsx"),
  ...prefix("/auth", [
    route("/login", "features/auth/pages/login.tsx"),
    route("/sign-up", "features/auth/pages/sign-up.tsx"),
  ]),
  ...prefix("/diet", [index("features/diet/pages/diet.tsx")]),
] satisfies RouteConfig;
