import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/error.js';
import { verifyToken } from '../utils/JWT.js';
import { Role } from '../generated/prisma/enums.js';


export interface AuthenticatedUser {
  userId: string;
  companyId?: string | undefined;
  role: Role;
} // the authenticated user interface 

declare global {// declare global is used to extend the global namespace in TypeScript. In this case, we are extending the Express namespace to include a user property on the Request interface.
  namespace Express {// A namespace is a way to group related code together. In this case, we are grouping the extension of the Express namespace. and an extension is a way to add new properties or methods to an existing class or interface. In this case, we are adding a user property to the Request interface.
    interface Request {// and an interface is a way to define the shape of an object. In this case, we are defining the shape of the Request object to include a user property. An interface and an object are similar in that they both define the shape of an object, but an interface is more flexible and can be extended or implemented by other interfaces or classes. An object is a concrete instance of a type, while an interface is a blueprint for a type.
      user: AuthenticatedUser;// this tells typescript that the user property is optional and can be of type AuthenticatedUser
    }
  }
}

export function authenticate(// function authenticate is a middleware function that is used to authenticate a user based on the JWT token provided in the Authorization header of the request. It verifies the token and attaches the decoded payload to the request object for further use in subsequent middleware or route handlers.
  req: Request,// req is the request object that is passed to the middleware function. It contains information about the HTTP request, such as headers, query parameters, and the request body.
  _res: Response,// res is the response object that is passed to the middleware function. It is used to send a response back to the client. The underscore prefix indicates that this parameter is not used in the function body, which is a common convention in TypeScript to avoid compiler warnings about unused parameters.
  next: NextFunction// next is the next function that is passed to the middleware function. It is used to pass control to the next middleware function in the stack. If an error occurs during authentication, the next function is called with an instance of UnauthorizedError to indicate that the request is unauthorized.
) {
  try {
    const header = req.headers.authorization;// the authorization header is extracted from the request headers. It is expected to be in the format "Bearer <token>", where <token> is the JWT token that needs to be verified.

    if (!header) {
      throw new UnauthorizedError('Authorization header is required');
    }

    const [type, token] = header.split(' ');// this one to split the authorization header into two parts: the type (which should be "Bearer") and the token (the actual JWT token). The split method is used to separate the string based on the space character.

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedError('Invalid authorization format');
    }

    const payload = verifyToken(token);

    req.user = payload;

    next();
  } catch(error) {
    next(new UnauthorizedError('Invalid or expired token'));// this the UnauthorizedError class that is imported from the error.ts file. It is used to create a new instance of the UnauthorizedError class with a custom error message. The next function is called with this error instance to pass control to the error-handling middleware, which will send an appropriate response back to the client.
  }
} // when you export for example in this page function authenticate, you can import it in other files using the import statement. For example, you can import it in a route file and use it as a middleware for specific routes that require authentication. and you can access the authenticated user information in the route handler by accessing req.user, which will contain the decoded payload from the JWT token.