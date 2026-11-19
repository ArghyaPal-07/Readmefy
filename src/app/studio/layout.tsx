import type { Metadata, ResolvingMetadata } from "next";
import type { ReactNode } from "react";

export async function generateMetadata(
  _props: { params: Promise<Record<string, never>> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { twitter } = await parent;

  return {
    twitter: {
      ...twitter,
      card: "summary_large_image",
      images: [{
        url: "/studio/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Readmefy — Build in the Studio",
      }],
    },
  };
}

export default function StudioLayout({ children }: { children: ReactNode }) {
  return children;
}
