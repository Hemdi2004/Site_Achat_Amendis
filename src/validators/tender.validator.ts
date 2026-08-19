import { z } from 'zod';

export const createTenderSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    description: z.string().min(5),
    deadline: z.coerce.date(),
  }),
});

export const tenderIdSchema = z.object({// this is the tenderIdSchema object that is exported from the tender.validator.ts file. It is used to validate the request parameters for routes that require a tenderId. The schema defines the expected structure and validation rules for the request parameters, which includes a single field: tenderId, which must be a valid UUID.
  params: z.object({// instead of body we use params because the tenderId is expected to be passed as a route parameter in the URL, rather than in the request body. For example, in a route defined as /tenders/:tenderId, the tenderId parameter can be accessed via req.params.tenderId.
    tenderId: z.uuid(),
  }),
});