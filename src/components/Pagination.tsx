import React from 'react';

interface Props {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<Props> = ({ page, total, limit, onChange }) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ margin: '20px 0' }}>
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>

      <span style={{ margin: '0 10px' }}>
        {page} / {totalPages}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
