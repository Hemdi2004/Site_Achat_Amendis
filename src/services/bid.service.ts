import { prisma } from '../config/prisma.js';
import { BadRequestError, NotFoundError } from '../utils/error.js';

interface CreateBidInput {
  tenderId: string;
  companyId: string;
  amount: number;
  technicalDocUrl: string;
  financialDocUrl: string;
}

export class BidService {
  static async createBid(input: CreateBidInput) {
    const tender = await prisma.tender.findUnique({
      where: {
        id: input.tenderId,
      },
    });

    if (!tender) {
      throw new NotFoundError('Tender not found');
    }

    if (tender.status !== 'PUBLISHED') {
      throw new BadRequestError(
        'Tender is not published'
      );
    }

    if (tender.deadline < new Date()) {
      throw new BadRequestError(
        'Tender deadline has passed'
      );
    }

    const existingBid = await prisma.bid.findUnique({
      where: {
        tenderId_companyId: {
          tenderId: input.tenderId,
          companyId: input.companyId,
        },
      },
    });

    if (existingBid) {
      throw new BadRequestError(
        'Company has already submitted a bid'
      );
    }

    return prisma.bid.create({
      data: {
        tenderId: input.tenderId,
        companyId: input.companyId,
        amount: input.amount,
        technicalDocUrl: input.technicalDocUrl,
        financialDocUrl: input.financialDocUrl,
      },
    });
  }

  static async getCompanyBids(companyId: string) {
    return prisma.bid.findMany({
      where: {
        companyId,
      },
      include: {
        tender: true,
      },// this line is including the related tender information in the result. It uses the "include" option of the Prisma client to specify that we want to fetch the associated tender data for each bid. By setting "tender: true", we are telling Prisma to include the entire tender object related to each bid in the result set. This allows us to access the details of the tender (such as title, description, deadline, etc.) along with the bid information when we retrieve the company's bids from the database.
    });
  }
}