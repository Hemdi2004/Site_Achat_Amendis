import { Request, Response, NextFunction } from 'express';
import { TenderService } from '../services/tender.service.js';

export class TenderController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tender = await TenderService.createTender({
        title: req.body.title,
        description: req.body.description,
        deadline: req.body.deadline,
        companyId: req.user!.companyId!,// this line is accessing the companyId property of the user object attached to the request (req.user). The exclamation mark (!) is a TypeScript non-null assertion operator, which tells the compiler that we are confident that req.user and req.user.companyId are not null or undefined at this point in the code. This is important because it allows us to safely access the companyId without TypeScript raising an error about potential null or undefined values.
      });

      return res.status(201).json(tender);
    } catch (error) {
      next(error);
    }
  }

  static async publish(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { tenderId } = req.params;
      const   companyId = req.user?.companyId;
      if(!tenderId || typeof tenderId !== 'string'){
         return res.status(400).json({ error: 'Invalid tenderId parameter' })
      }
      if(!companyId || typeof companyId !== 'string'){
         return res.status(400).json({ error: 'Invalid compnayId ' })
      }
      const tender = await TenderService.publishTender(
        tenderId,
        companyId,
      );

      return res.status(200).json(tender);
    } catch (error) {
      next(error);
    }
  }

  static async getPublished(
    _req: Request,// the underscore (_) before the req parameter indicates that this parameter is intentionally unused in the function. It is a common convention in programming to prefix unused parameters with an underscore to signal to other developers (and to linters) that the parameter is not needed for the function's logic. In this case, it means that the getPublished method does not require any information from the incoming request to perform its operation.
    res: Response,
    next: NextFunction
  ) {
    try {
      const tenders = await TenderService.getPublishedTenders();

      return res.status(200).json(tenders);
    } catch (error) {
      next(error);
    }
  }
}