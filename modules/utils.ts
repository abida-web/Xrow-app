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
export const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return { class: "bg-green-100 text-green-700", label: "Active" };
    case "draft":
      return { class: "bg-yellow-100 text-yellow-700", label: "Draft" };
    case "archived":
      return { class: "bg-gray-100 text-gray-700", label: "Archived" };
    case "out_of_stock":
      return { class: "bg-red-100 text-red-700", label: "Out of Stock" };
    default:
      return { class: "bg-gray-100 text-gray-700", label: status || "Unknown" };
  }
};
