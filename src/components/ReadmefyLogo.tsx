import type { SVGProps } from "react";

/** The Readmefy document-and-R mark, shared by the app and generated images. */
export default function ReadmefyLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect width="32" height="32" rx="8" fill="#155da4" />
      <g stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 5.5h-8a2 2 0 0 0-2 2v17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-13L18 5.5Z" />
        <path d="M18 5.5v6h6" />
        <path d="M11.5 22.5v-8h4a2.5 2.5 0 0 1 0 5h-4M15 19.5l4 3" />
      </g>
    </svg>
  );
}
