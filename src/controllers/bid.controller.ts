import { Request, Response, NextFunction } from 'express';
import { BidService } from '../services/bid.service.js';

export class BidController {
  static async create(// static and async are keywords in TypeScript that define the nature of the create method within the BidController class. The static keyword indicates that the create method belongs to the class itself rather than an instance of the class, allowing it to be called directly on the class without needing to create an object. The async keyword signifies that the create method is asynchronous, meaning it can perform asynchronous operations (like database calls) and will return a Promise. This allows for the use of await within the method to handle asynchronous code in a more readable manner, enabling the controller to wait for the completion of operations like creating a bid before proceeding to send a response back to the client.
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { tenderId } = req.params;
      if (!tenderId || typeof tenderId !== 'string') {
        return res.status(400).json({ error: 'Invalid tenderId parameter' });
      }  
      const bid = await BidService.createBid({
        
        tenderId: tenderId,
        companyId: req.user!.companyId!,
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
      const bids = await BidService.getCompanyBids(
        req.user!.companyId!
      );

      return res.status(200).json(bids);
    } catch (error) {
      next(error);
    }
  }
}