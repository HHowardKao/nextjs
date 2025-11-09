"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";

const Pagination = ({
  currentPage,
  hasMore,
}: {
  currentPage: number;
  hasMore: boolean;
}) => {
  const params = useSearchParams();
  const currentQuery = queryString.parse(params.toString());
  const searchParams = queryString.stringifyUrl({
    url: "",
    query: currentQuery,
  });
  return (
    <div className="flex justify-between mt-4">
      {currentPage > 1 && (
        <Link href={`/blog/feed/${currentPage - 1}${searchParams}`}>
          <span>Previous</span>
        </Link>
      )}
      {hasMore && (
        <Link href={`/blog/feed/${currentPage + 1}${searchParams}`}>
          <span>Next</span>
        </Link>
      )}
    </div>
  );
};

export default Pagination;
