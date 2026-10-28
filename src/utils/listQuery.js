function getListOptions(query, allowedSortFields, defaultSortField = 'created_at') {
  const page = Number(query.page) || 1;
  const limit = Math.min(Number(query.limit) || 20, 100);
  const sortBy = allowedSortFields.includes(query.sortBy) ? query.sortBy : defaultSortField;
  const sortDirection = query.order === 'asc' ? 1 : -1;

  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sort: { [sortBy]: sortDirection },
  };
}

function getPaginationMeta(page, limit, totalItems) {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    totalItems,
    currentPage: page,
    pageSize: limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1 && totalPages > 0,
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

module.exports = { getListOptions, getPaginationMeta, escapeRegex };
