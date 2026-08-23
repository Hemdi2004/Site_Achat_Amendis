import { Router } from 'express';// Router is a function provided by the Express framework that allows you to create modular route handlers. It helps in organizing routes for different parts of an application, making it easier to manage and maintain the codebase. In this case, it is used to define routes related to authentication (register and login). A modular route handler is a way to group related routes together, allowing for better organization and separation of concerns within an application. By using Router, you can create a set of routes that are specific to a particular feature or functionality, such as authentication, and then mount them onto the main application. This approach promotes code reusability and maintainability, as each module can be developed and tested independently before being integrated into the larger application.
import { AuthController } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  registerSchema,
  loginSchema,
} from '../validators/auth.validator.js';
import { authRateLimiter } from '../middlewares/rate-limit.middleware.js';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  AuthController.register
);

router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  AuthController.login
);

export default router;// export default router; is a statement in JavaScript that allows you to export a single value, function, or class from a module so that it can be imported and used in other files. In this case, the router object, which contains the defined authentication routes (register and login), is being exported as the default export of the module. This means that when another file imports this module, it can directly access the router object without needing to use named imports.