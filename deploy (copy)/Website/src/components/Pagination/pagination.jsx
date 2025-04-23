import React from "react";
import { Pagination } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import "./index.css";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";

const Paginated = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
}) => {
  // Responsive screen-based page numbers
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ maxWidth: 900 });
  const isLarge = useMediaQuery({ maxWidth: 1200 });
  const isDesktop = useMediaQuery({ maxWidth: 1400 });
  const maxVisiblePages = isMobile
    ? 1
    : isTablet
    ? 1
    : isLarge
    ? 5
    : isDesktop
    ? 7
    : 11;

  const handlePageChange = (page) => {
    onPageChange(page); // Call the API with the new page number
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = [];

    // First Page and Ellipsis
    if (startPage > 1) {
      pageNumbers.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2 && !isMobile) {
        // Skip ellipsis on mobile
        pageNumbers.push(<Pagination.Ellipsis key="startEllipsis" />);
      }
    }

    // Page Range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Last Page and Ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1 && !isMobile) {
        // Skip ellipsis on mobile
        pageNumbers.push(<Pagination.Ellipsis key="endEllipsis" />);
      }
      pageNumbers.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return pageNumbers;
  };

  return (
    <>
      {totalPages > 1 && (
        <div className="pagination-bullets-event pading150">
          <Pagination className="pagination-event justify-content-center">
            {currentPage > 1 && (
              <Pagination.Prev
                className="pagination-prev"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <LeftOutlined style={{ fontSize: "16px" }} />
              </Pagination.Prev>
            )}

            {renderPageNumbers()}

            {currentPage < totalPages && (
              <Pagination.Next
                className="pagination-next"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <RightOutlined style={{ fontSize: "16px" }} />
              </Pagination.Next>
            )}
          </Pagination>
        </div>
      )}
    </>
  );
};

export default Paginated;
