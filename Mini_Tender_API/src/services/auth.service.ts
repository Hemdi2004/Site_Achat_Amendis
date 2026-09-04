import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import { BadRequestError, UnauthorizedError } from '../utils/error.js';
import { generateToken } from '../utils/JWT.js';

interface RegisterInput {
  companyName: string;
  email: string;
  password: string;
}// interface is a TypeScript feature that allows you to define the shape of an object. In this case, the RegisterInput interface defines the expected structure for the input data when registering a new company. It specifies that the input object should have three properties: companyName (a string), email (a string), and password (a string). This helps ensure that the data passed to the register method adheres to the expected format, providing type safety and better code clarity.

interface LoginInput {
  email: string;
  password: string;
}

export class AuthService {// export class AuthService is a TypeScript feature that allows you to define a class and make it available for use in other parts of your application. In this case, the AuthService class contains methods related to authentication, such as registering a new company and logging in an existing user. By exporting the class, you can import it in other files and use its methods to handle authentication-related functionality in your application.
  static async register(input: RegisterInput) {// here static means that the register method can be called directly on the AuthService class without needing to create an instance of the class. This is useful for utility or service classes where you don't need to maintain state between method calls. In this case, you can call AuthService.register(input) directly without instantiating the AuthService class. and async means that the register method is asynchronous, allowing it to perform asynchronous operations (like database queries) and return a promise. This enables the use of await within the method to handle asynchronous code more cleanly.
    const existing = await prisma.company.findUnique({
      where: {
        email: input.email,
      },
    }); // this line is checking if a company with the provided email already exists in the database. It uses the Prisma client to query the "company" table and find a unique record based on the email field. If a company with the same email is found, it will be stored in the "existing" variable. If no such company exists, "existing" will be null or undefined.

    if (existing) {
      throw new BadRequestError('Company email already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const company = await prisma.company.create({
      data: {
        name: input.companyName,
        email: input.email,
        password: hashedPassword,

        users: {
          create: {// this line is creating a new user record associated with the newly created company. It uses the "users" relation defined in the Prisma schema to create a related user entry. The "create" property specifies the data for the new user, which includes the user's email and hashed password. This ensures that when a new company is registered, a corresponding user account is also created for that company, allowing the user to log in and access the system.
            email: input.email,
            password: hashedPassword,
          },
        },
      },
    });// this line is creating a new company record in the database using the Prisma client. It specifies the data to be inserted, including the company's name, email, and hashed password. Additionally, it creates a related user record associated with the company by using the "users" relation and providing the user's email and hashed password. The result of this operation is stored in the "company" variable, which contains the newly created company record along with its associated user.

    const user = await prisma.user.findFirst({
      where: {
        companyId: company.id,
      },
    }); // this line is querying the database to find the first user associated with the newly created company. It uses the Prisma client to search the "user" table for a record where the "companyId" field matches the ID of the newly created company. The result of this query is stored in the "user" variable, which will contain the user record if found, or null if no such user exists. This step is important to retrieve the user's information for generating a JWT token in the next step.

    const token = generateToken({// this line is generating a JSON Web Token (JWT) for the newly created user. It calls the "generateToken" function, passing an object that contains the user's ID, the company's ID, and the user's role (in this case, 'COMPANY'). The generated token is a string that can be used for authentication in subsequent requests. The token is stored in the "token" variable for later use, such as returning it to the client after successful registration.
      userId: user!.id,// user! means that we are asserting that the user variable is not null or undefined. This is a TypeScript feature called "non-null assertion operator" that tells the compiler that we are confident that the user variable will have a value at this point in the code. In this context, it is used to access the id property of the user object, which is expected to exist since we just created a company and its associated user.
      companyId: company.id,
      role: 'COMPANY',
    });

    return {
      id: company.id,
      email: company.email,
      token
  
    };// this line is returning an object that contains the newly created company record and the generated JWT token. The "company" property holds the details of the company that was just registered, while the "token" property contains the authentication token that can be used for subsequent requests to authenticate the user. This return value can be sent back to the client as a response to indicate successful registration and provide the necessary information for further interactions with the API.
  }

  static async login(input: LoginInput) {
    const user = await prisma.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(
      input.password,
      user.password
    );

    if (!validPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const companyId = user.companyId;
    if (user.role === 'COMPANY' && !companyId) {
      throw new UnauthorizedError('Invalid company account: no company associated with this user.');
    };

    const token = generateToken({
      userId: user.id,
      companyId: companyId ?? undefined, // this line is using the nullish coalescing operator (??) to check if the user.companyId is null or undefined. If it is, the value will be set to undefined; otherwise, it will use the actual value of user.companyId. This ensures that if the companyId is not present for the user, it will not be included in the token payload, preventing potential issues with token generation and validation.
      role: user.role,
    });// this line is generating a JSON Web Token (JWT) for the authenticated user. It calls the "generateToken" function, passing an object that contains the user's ID, the company's ID (if available), and the user's role. The generated token is a string that can be used for authentication in subsequent requests. The token is stored in the "token" variable for later use, such as returning it to the client after successful login.

    return {
      token,
      message: "Logged in successfully",
      user: {
       id: user.id,
       email: user.email,
       role: user.role,
       companyId: user.companyId,
       createdAt: user.createdAt,
  },
    };
  }
}

// a token is generated by both the register and login methods, which can be used for authentication in subsequent requests. The token is generated using the generateToken function, which takes an object containing the user's ID, the company's ID (if available), and the user's role. The generated token is a string that can be sent back to the client as part of the response, allowing the client to include it in the Authorization header of future requests to access protected routes or resources. it's generated for registration to allow the user to be authenticated immediately after creating an account, and for login to allow the user to access protected resources after successfully verifying their credentials.so the token that generated after the registration process is the one that is used in the login process, and it is also used in subsequent requests to authenticate the user and authorize access to protected routes or resources.