// components/Breadcrumbs.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface Breadcrumb {
  label: string;
  href: string;
}

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  const breadcrumbs: Breadcrumb[] = [{ label: "Home", href: "/" }];

  let currentPath = "";
  pathSegments.forEach((segment) => {
    currentPath += `/${segment}`;
    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1), // Viết hoa chữ cái đầu
      href: currentPath,
    });
  });

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href}>
            <Link
              href={breadcrumb.href}
              className="text-gray-500 hover:text-gray-700"
            >
              {breadcrumb.label}
            </Link>
            {index < breadcrumbs.length - 1 && (
              <span className="mx-2 text-gray-400">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
