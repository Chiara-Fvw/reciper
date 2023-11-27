function calculatePaginationData(totalCount, page, limit) {
  const totalPages = Math.ceil(totalCount / limit);
  const nextPage = page < totalPages ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;
  const allPages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return {
    currentPage: page,
    totalPages,
    nextPage,
    prevPage,
    allPages,
  };
};

function paginationMiddleware(req, res, next) {
  const LIMIT = 2;
  const PAGE = parseInt(req.query.page) || 1;

  const recipesCount = res.locals.store.recipesCount();

  if (!recipesCount) {
    return next (new Error("Recipes count not available."));
  }
  const pagination = calculatePaginationData(recipesCount, PAGE, LIMIT);
  res.locals.pagination = pagination;
  next();
}

module.exports = paginationMiddleware;