import { Request, Response, NextFunction } from 'express';
import { BidService } from '../services/bid.service.js';
import { BadRequestError, ForbiddenError } from '../utils/error.js';
import { prisma } from '../config/prisma.js'

export class BidController {
  static async create(// static and async are keywords in TypeScript that define the nature of the create method within the BidController class. The static keyword indicates that the create method belongs to the class itself rather than an instance of the class, allowing it to be called directly on the class without needing to create an object. The async keyword signifies that the create method is asynchronous, meaning it can perform asynchronous operations (like database calls) and will return a Promise. This allows for the use of await within the method to handle asynchronous code in a more readable manner, enabling the controller to wait for the completion of operations like creating a bid before proceeding to send a response back to the client.
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { tenderId } = req.params;
      const companyId = req.user?.companyId;
      if (!tenderId || typeof tenderId !== 'string') {
        throw new BadRequestError('Invalid tenderId parameter');
      } 
      if (!companyId || typeof companyId !== 'string'){
        throw new ForbiddenError('Only company accounts can submit bids');
      }

      const tender = await prisma.tender.findUnique({ where: {id: tenderId}});

      if (tender?.companyId === companyId) {
        throw new ForbiddenError("Companies cannot submit bids on their own tenders.");
      }
      
      const bid = await BidService.createBid({
        
        tenderId: tenderId,
        companyId: companyId,
        amount: req.body.amount,
        technicalDocUrl: req.body.technicalDocUrl,
        financialDocUrl: req.body.financialDocUrl,
      });

      return res.status(201).json(bid);
    } catch (error) {
      next(error);
    }
  }

  static async getMine(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const companyId = req.user?.companyId;

      if (!companyId) {
        throw new ForbiddenError('Only company accounts can view their bids');
      }
      const bids = await BidService.getCompanyBids(companyId);
      return res.status(200).json(bids);
    } catch (error) {
      next(error);
    }
  }
}