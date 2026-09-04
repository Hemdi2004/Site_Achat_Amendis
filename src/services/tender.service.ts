import { prisma } from '../config/prisma.js';
import { ForbiddenError, NotFoundError } from '../utils/error.js';

interface CreateTenderInput {
  title: string;
  description: string;
  deadline: Date;
  companyId: string;
}

export class TenderService {
  static async createTender(input: CreateTenderInput) {
    return prisma.tender.create({ // here we didnt use await because we are returning the promise directly. The caller of this method can choose to await the result or handle the promise in another way. This allows for more flexibility in how the method is used, as it can be integrated into different parts of the application without forcing an immediate wait for the result.
      data: {
        title: input.title,
        description: input.description,
        deadline: input.deadline,
        companyId: input.companyId,
      },
    });
  }

  static async publishTender(
    tenderId: string,
    role: string
  ) {
    const tender = await prisma.tender.findUnique({
      where: {
        id: tenderId,
      },
    });

    if (role !== 'ADMIN') {
      throw new ForbiddenError('Only an admin can publish a tender!');
    }

    return prisma.tender.update({
      where: {
        id: tenderId,
      },
      data: {
        status: 'PUBLISHED',
      },
    });
  }

  static async getPublishedTenders() {
    return prisma.tender.findMany({
      where: {
        status: 'PUBLISHED',
      },
    });
  }// this line is for retrieving all tenders that have been published. It uses the Prisma client to query the "tender" table and find all records where the "status" field is equal to 'PUBLISHED'. The result of this query is returned as an array of tender objects, which can be used to display the list of published tenders to users or for further processing in the application.
   static async getDraftTenders() {
      return prisma.tender.findMany({
        where: {
          status: 'DRAFT',
        }
      });
    }
}
