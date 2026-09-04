import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Mini Tender Management API',
      version: '1.0.0',
      description:
        'REST API for managing companies, tenders, and bid submissions.',
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['companyName', 'email', 'password'],
          properties: {
            companyName: {
              type: 'string',
              example: 'Amendis',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'contact@amendis.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },

        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'contact@amendis.com',
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password123',
            },
          },
        },

        CreateTenderRequest: {
          type: 'object',
          required: ['title', 'description', 'deadline'],
          properties: {
            title: {
              type: 'string',
              example: 'Construction of Administrative Building',
            },
            description: {
              type: 'string',
              example: 'Construction and completion of an administrative building.',
            },
            deadline: {
              type: 'string',
              format: 'date-time',
              example: '2026-09-30T23:59:59.000Z',
            },
          },
        },

        SubmitBidRequest: {
          type: 'object',
          required: [
            'amount',
            'technicalDocUrl',
            'financialDocUrl',
          ],
          properties: {
            amount: {
              type: 'number',
              format: 'float',
              example: 50000,
            },
            technicalDocUrl: {
              type: 'string',
              example: '/documents/technical.pdf',
            },
            financialDocUrl: {
              type: 'string',
              example: '/documents/financial.pdf',
            },
          },
        },
      },
    },

    paths: {
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a company and its first user',

          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RegisterRequest',
                },
              },
            },
          },

          responses: {
            '201': {
              description: 'Company successfully registered',
            },
            '400': {
              description: 'Invalid request data',
            },
          },
        },
      },

      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Authenticate a user',

          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest',
                },
              },
            },
          },

          responses: {
            '200': {
              description: 'Login successful',
            },
            '401': {
              description: 'Invalid email or password',
            },
          },
        },
      },

      '/tenders': {
        get: {
          tags: ['Tenders'],
          summary: 'Get published tenders',

          responses: {
            '200': {
              description: 'List of published tenders',
            },
          },
        },

        post: {
          tags: ['Tenders'],
          summary: 'Create a tender',

          security: [
            {
              bearerAuth: [],
            },
          ],

          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateTenderRequest',
                },
              },
            },
          },

          responses: {
            '201': {
              description: 'Tender created successfully',
            },
            '401': {
              description: 'Authentication required',
            },
            '400': {
              description: 'Invalid request data',
            },
          },
        },
      },

      '/tenders/{tenderId}/publish': {
        patch: {
          tags: ['Tenders'],
          summary: 'Publish a tender',

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              name: 'tenderId',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
            },
          ],

          responses: {
            '200': {
              description: 'Tender published successfully',
            },
            '401': {
              description: 'Authentication required',
            },
            '404': {
              description: 'Tender not found',
            },
          },
        },
      },

      '/api/tenders/{tenderId}/bids': {
        post: {
          tags: ['Bids'],
          summary: 'Submit a bid',

          security: [
            {
              bearerAuth: [],
            },
          ],

          parameters: [
            {
              name: 'tenderId',
              in: 'path',
              required: true,
              schema: {
                type: 'string',
                format: 'uuid',
              },
            },
          ],

          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/SubmitBidRequest',
                },
              },
            },
          },

          responses: {
            '201': {
              description: 'Bid submitted successfully',
            },
            '400': {
              description: 'Invalid bid or business rule violation',
            },
            '401': {
              description: 'Authentication required',
            },
            '404': {
              description: 'Tender not found',
            },
          },
        },
      },

      '/api/bids/mine': {
        get: {
          tags: ['Bids'],
          summary: 'Get bids submitted by the authenticated company',

          security: [
            {
              bearerAuth: [],
            },
          ],

          responses: {
            '200': {
              description: 'List of company bids',
            },
            '401': {
              description: 'Authentication required',
            },
          },
        },
      },
    },
  },

  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);