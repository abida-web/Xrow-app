import slugify from "react-slugify";
export function generateSlug(name: string) {
  return slugify(name);
}
export function generateTitle(
  option1?: string,
  option2?: string,
  option3?: string,
): string {
  return [option1, option2, option3].filter((v) => v && v.trim()).join(" / ");
}
