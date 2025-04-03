import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import "./index.css";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";

const PaginatedList = ({
  totalItems = 0,
  itemsPerPage = 3,
  onPageChange = () => {},
  selectedFilter = 1,
}) => {
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: Math.ceil(totalItems / itemsPerPage),
  });

  // Responsive screen-based page numbers
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ maxWidth: 900 });
  const isLarge = useMediaQuery({ maxWidth: 1200 });
  const isDesktop = useMediaQuery({ maxWidth: 1400 });
  const maxVisiblePages = isMobile
    ? 1
    : isTablet
    ? 3
    : isLarge
    ? 5
    : isDesktop
    ? 7
    : 11;

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      totalPages: Math.ceil(totalItems / itemsPerPage),
    }));
  }, [totalItems, itemsPerPage]);

  const handlePageChange = (page) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
    onPageChange(selectedFilter, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    let startPage = Math.max(
      1,
      pagination.currentPage - Math.floor(maxVisiblePages / 2)
    );
    let endPage = Math.min(
      pagination.totalPages,
      startPage + maxVisiblePages - 1
    );

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
      if (startPage > 2) {
        pageNumbers.push(<Pagination.Ellipsis key="startEllipsis" />);
      }
    }

    // Page Range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Pagination.Item
          key={i}
          active={i === pagination.currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    // Last Page and Ellipsis
    if (endPage < pagination.totalPages) {
      if (endPage < pagination.totalPages - 1) {
        pageNumbers.push(<Pagination.Ellipsis key="endEllipsis" />);
      }
      pageNumbers.push(
        <Pagination.Item
          key={pagination.totalPages}
          onClick={() => handlePageChange(pagination.totalPages)}
        >
          {pagination.totalPages}
        </Pagination.Item>
      );
    }

    return pageNumbers;
  };

  return (
    <>
      {pagination.totalPages > 1 && (
        <div className="pagination-bullets-event pading150">
          <Pagination className="pagination-event justify-content-center">
            {pagination.currentPage > 1 && (
              <Pagination.Prev
                className="pagination-prev"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
              >
                <LeftOutlined style={{ fontSize: "16px" }} />
              </Pagination.Prev>
            )}

            {renderPageNumbers()}

            {pagination.currentPage < pagination.totalPages && (
              <Pagination.Next
                className="pagination-next"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
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

export default PaginatedList;
