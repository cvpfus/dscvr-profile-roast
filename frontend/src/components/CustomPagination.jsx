import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination.jsx";

export const CustomPagination = ({ page, maxPage, visiblePages, setPage }) => {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem
          onClick={() => {
            if (page > 1) setPage(page - 1);
          }}
          className={
            page === 1
              ? "pointer-events-none opacity-50"
              : "hover:cursor-pointer"
          }
        >
          <PaginationPrevious />
        </PaginationItem>

        {page > 2 && (
          <>
            <PaginationItem
              onClick={() => setPage(1)}
              className="hover:cursor-pointer"
            >
              <PaginationLink>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          </>
        )}

        {visiblePages.map((p) => {
          return (
            <PaginationItem
              onClick={() => setPage(p)}
              className="hover:cursor-pointer"
              key={p}
            >
              <PaginationLink isActive={page === p}>{p}</PaginationLink>
            </PaginationItem>
          );
        })}

        {maxPage > 3 && page < maxPage - 1 && (
          <>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem
              onClick={() => setPage(maxPage)}
              className="hover:cursor-pointer"
              key={maxPage}
            >
              <PaginationLink>{maxPage}</PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem
          onClick={() => {
            if (page < maxPage) setPage(page + 1);
          }}
          className={
            page === maxPage
              ? "pointer-events-none opacity-50"
              : "hover:cursor-pointer"
          }
        >
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
