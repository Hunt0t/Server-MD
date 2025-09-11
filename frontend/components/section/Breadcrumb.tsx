"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string; // if no href => current page
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="text-gray-600 text-[16px] font-sans">
      <ol className="flex items-center space-x-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {!isLast && item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-blue-500 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-gray-900">{item.label}</span>
              )}

              {!isLast && (
                <ChevronRight size={16} className="mx-1 text-gray-400" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
