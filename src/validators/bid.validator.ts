import { z } from 'zod';

export const submitBidSchema = z.object({
  params: z.object({
    tenderId: z.uuid(),
  }),

  body: z.object({
    amount: z.number().positive(),

    technicalDocUrl: z
      .string()
      .min(1),

    financialDocUrl: z// the synthax of the body properties must align with the ones in schema, so if you have a property called technicalDocUrl in the schema, you should have a corresponding property with the same name in the body object. This ensures that the validation is applied correctly to the expected data structure. otherwise, if the property names do not match, the validation will not be applied to the intended data, and you may encounter unexpected behavior or validation errors.
      .string()
      .min(1),
  }),
});