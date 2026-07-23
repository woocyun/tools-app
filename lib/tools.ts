import {
  Binary,
  CaseSensitive,
  Code,
  Globe,
  type LucideIcon,
  Network,
  ShieldCheck,
} from "lucide-react";

export type Tool = {
  name: string;
  slug: string;
  description: string;
  keywords?: string[];
};

export type Category = {
  name: string;
  slug: string;
  icon: LucideIcon;
  tools: Tool[];
};

export const categories: Category[] = [
  {
    name: "Converter",
    slug: "converter",
    icon: Binary,
    tools: [
      {
        name: "Base64 encode/decode",
        slug: "base64",
        description: "Encode and decode Base64 strings.",
        keywords: ["encode", "decode"],
      },
    ],
  },
];

// Flat list of every tool, tagged with its category — handy for search.
export const allTools = categories.flatMap((category) =>
  category.tools.map((tool) => ({
    ...tool,
    category: category.name,
    categorySlug: category.slug,
  })),
);

export type ToolWithCategory = (typeof allTools)[number];

export function toolHref(slug: string): string {
  return `/tools/${slug}`;
}
