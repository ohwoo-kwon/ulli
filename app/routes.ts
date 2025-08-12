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
  ...prefix("/images", [
    route("/", "features/images/pages/images-page.tsx"),
    route("/upload", "features/images/pages/image-upload-page.tsx"),
  ]),
  ...prefix("/products", [
    route("/", "features/products/pages/products-page.tsx"),
  ]),
  ...prefix("/advertisements", [
    route("/", "features/advertisements/pages/advertisements-page.tsx"),
  ]),
  ...prefix("/api", [
    route("/image/generate", "apis/image/image-generate.tsx"),
    route("/image/manipulation", "apis/image/manipulation.tsx"),
  ]),
] satisfies RouteConfig;
