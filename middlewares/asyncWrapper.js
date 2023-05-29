const asyncWrapper = (routeHandler) => {
  return async (req, res, next) => {
    try {
      await routeHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

module.exports = asyncWrapper;
