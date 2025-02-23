export function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send("Hello World").end();
  }