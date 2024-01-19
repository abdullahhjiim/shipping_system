import Pagination from "react-bootstrap/Pagination";

function MyPagination({ count, currentPage, pageChange }) {
  return (
    <div>
      <Pagination size="sm">
        <Pagination.First
          disabled={currentPage - 1 <= 0}
          onClick={(e) => pageChange(1)}
        />

        <Pagination.Prev
          disabled={currentPage - 1 <= 0}
          onClick={(e) => pageChange(currentPage - 1)}
        />

        <Pagination.Item
          hidden={currentPage < 10}
          onClick={(e) => pageChange(1)}
        >
          {1}
        </Pagination.Item>

        <Pagination.Item
          hidden={currentPage < 10}
          onClick={(e) => pageChange(2)}
        >
          {2}
        </Pagination.Item>

        <Pagination.Ellipsis hidden={currentPage < 10} />

        <Pagination.Item
          hidden={currentPage <= 2}
          onClick={(e) => pageChange(currentPage - 2)}
        >
          {currentPage - 2}
        </Pagination.Item>

        <Pagination.Item
          hidden={currentPage <= 1}
          onClick={(e) => pageChange(currentPage - 1)}
        >
          {currentPage - 1}
        </Pagination.Item>

        <Pagination.Item active onClick={(e) => pageChange(currentPage)}>
          {currentPage}
        </Pagination.Item>

        <Pagination.Item
          hidden={currentPage + 1 >= count}
          onClick={(e) => pageChange(currentPage + 1)}
        >
          {currentPage + 1}
        </Pagination.Item>

        <Pagination.Item
          hidden={currentPage + 2 >= count}
          onClick={(e) => pageChange(currentPage + 2)}
        >
          {currentPage + 2}
        </Pagination.Item>

        <Pagination.Ellipsis
          hidden={!(currentPage < count && count - currentPage > 9)}
        />

        <Pagination.Item
          hidden={!(currentPage < count && count - currentPage > 9)}
          onClick={(e) => pageChange(count - 2)}
        >
          {count - 2}
        </Pagination.Item>

        <Pagination.Item
          hidden={!(currentPage < count && count - currentPage > 9)}
          onClick={(e) => pageChange(count - 1)}
        >
          {count - 1}
        </Pagination.Item>

        <Pagination.Next
          disabled={currentPage + 1 > count}
          onClick={(e) => pageChange(currentPage + 1)}
        />

        <Pagination.Last
          disabled={currentPage === count}
          onClick={(e) => pageChange(count)}
        />
      </Pagination>
    </div>
  );
}

export default MyPagination;
