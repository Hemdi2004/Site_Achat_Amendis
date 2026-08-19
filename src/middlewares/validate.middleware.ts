import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export function validate(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({//safeParse is a method provided by Zod that allows you to validate data against a schema. It returns an object with a success property indicating whether the validation was successful, and an error property containing details about any validation errors that occurred.
      body: req.body,// req.body is the body of the HTTP request, which contains the data sent by the client. It is typically used to send data in POST or PUT requests.
      params: req.params,// req.params is an object containing route parameters, which are values extracted from the URL path. For example, in a route defined as /users/:id, the id parameter can be accessed via req.params.id.
      query: req.query,// req.query is an object containing query parameters, which are key-value pairs appended to the URL after a question mark (?). For example, in a URL like /search?term=example, the term parameter can be accessed via req.query.term.
    });// so the result = shcema.safeParse({ body: req.body, params: req.params, query: req.query }) will validate the request data against the provided schema and return an object indicating whether the validation was successful and any errors that occurred. basically it checks whether the request data (body, params, and query) conforms to the defined schema and provides feedback on any validation issues.

    if (!result.success) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: result.error.issues,
      });
    }
    next();
  };
}

// validate middlware is a function that takes a Zod schema as an argument and returns an Express middleware function. This middleware function validates the incoming request data (body, params, and query) against the provided schema. If the validation fails, it responds with a 400 status code and a JSON object containing the validation errors. If the validation is successful, it calls the next middleware in the stack.

// this line const result = schema.safeParse({body: req.body, params: req.params, query: req.query}); provides the body and params and query to the schema.safeParse method, which validates the request data against the provided Zod schema. It checks whether the request body, route parameters, and query parameters conform to the defined schema and returns an object indicating whether the validation was successful and any errors that occurred.