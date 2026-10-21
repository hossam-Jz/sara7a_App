export const errorRespones =  ({
  message = "Error",
  statusCode = 400,
  extra = undefined,
}) => {
  const error = new Error(
    typeof message === "string" ? message : message?.message,
  );
  error.statusCode = statusCode;
  error.extra = extra;
  return error;
};

export const NotFoundException = ({
  message = " Not Found",
  extra = undefined,
}) => {
  return errorRespones({ message, statusCode: 404, extra });
};
export const BadRequestException = ({
  message = "Bad Request",
  extra = undefined,
}) => {
  return errorRespones({ message, statusCode: 400, extra });
};
export const ConflictException =  ({
  message = "Conflict",
  extra = undefined,
}) => {
  return errorRespones({ message, statusCode: 409, extra });
};

export const UnauthorizedException = ({
  message = "Unauthorized",
  extra = undefined,
}) => {
  return errorRespones({ message, statusCode: 401, extra });
};

export const ForbiddenException =  ({
  message = "Forbidden",
  extra = undefined,
}) => {
  return errorRespones({ message, statusCode: 403, extra });
};
export const TooManyRequestException =  ({
  message = "TooManyRequestException",
  extra = undefined,
}) => {
  return errorRespones({ message, statusCode: 429, extra });
};


export const glopalHandelError =  (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({ message: err.message,stack: err.stack , extra: err.extra });
};
