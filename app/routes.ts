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
  route("/upload", "features/upload/pages/upload.tsx"),
  ...prefix("/api", [
    route("/image/description", "apis/image/description.tsx"),
    route("/image/manipulation", "apis/image/manipulation.tsx"),
  ]),
] satisfies RouteConfig;
