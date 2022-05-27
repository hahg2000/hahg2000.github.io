import { defineUserConfig } from "vuepress";
import theme from "./theme";

export default defineUserConfig({
  lang: "zh-CN",
  title: "HAHG的博客",
  description: "HAHG的博客",

  base: "/",

  theme,
});
