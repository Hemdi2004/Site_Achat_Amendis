import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Site Achat Amendis API",
      version: "1.0.0",
      description: "API documentation for the Amendis Purchasing Site project",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
  },
  // Paths to files containing OpenAPI definitions (we look for any files ending in .routes.ts or .ts inside routes)
  apis: ["./src/routes/*.routes.ts", "./src/routes/*.ts"],
};

// This file sets up the metadata for your API and tells Swagger where to look for documented endpoint files.

export const swaggerSpec = swaggerJSDoc(options);