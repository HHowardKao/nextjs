"use client";

import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";
import { useCallback } from "react";
interface TagProps {
  children: React.ReactNode;
  selected?: boolean;
}
const Tag = ({ children, selected }: TagProps) => {
  const router = useRouter();
  const params = useSearchParams();

  const handleClick = useCallback(() => {
    if (children === "All") {
      router.push("/blog/feed/1");
    } else {
      let currentQuery = {};
      if (params) {
        currentQuery = queryString.parse(params.toString());
      }
      const updatedQuery: any = {
        ...currentQuery,
        tag: children,
      };
      const url = queryString.stringifyUrl(
        {
          url: "/blog/feed/1",
          query: updatedQuery,
        },
        {
          skipNull: true,
          skipEmptyString: true,
        }
      );
      router.push(url);
    }
  }, [children, router, params]);
  return (
    <span
      onClick={handleClick}
      className={cn(
        "bg-secondary px-2 py-1 rounded text-sm cursor-pointer",
        selected && "bg-primary text-secondary"
      )}
    >
      {children}
    </span>
  );
};

export default Tag;
