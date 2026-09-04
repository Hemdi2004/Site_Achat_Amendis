import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await AuthService.register({
        companyName: req.body.companyName,
        email: req.body.email,
        password: req.body.password,
      });

      return res.status(201).json(result);// here the json() method is used to send a JSON response back to the client. It takes an object as an argument and converts it into a JSON string before sending it as the response body. In this case, the result object returned from the AuthService.register method is sent back to the client with a status code of 201 (Created), indicating that a new resource (company) has been successfully created.
    } catch (error) {
      next(error);// here the next() function is used to pass control to the next middleware function in the stack. If an error occurs during the registration process, it is caught in the catch block and passed to the next() function, which will invoke the error-handling middleware. This allows for centralized error handling and ensures that appropriate error responses are sent back to the client.
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = await AuthService.login({
        email: req.body.email,
        password: req.body.password,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}// status(200) and status(201) are HTTP status codes that indicate the outcome of an HTTP request. Status code 200 (OK) is used to indicate that the request was successful and the server has returned the requested data. In this case, it is used in the login method to indicate that the user has successfully logged in and the server is returning the authentication token. Status code 201 (Created) is used to indicate that a new resource has been successfully created on the server. In this case, it is used in the register method to indicate that a new company has been successfully registered and the server is returning the newly created company details along with the authentication token.