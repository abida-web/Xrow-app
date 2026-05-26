import slugify from "react-slugify";
export function generateSlug(name: string) {
  return slugify(name);
}
