import { Request, Response, NextFunction } from 'express';
import { TenderService } from '../services/tender.service.js';
import { ForbiddenError } from '../utils/error.js';

export class TenderController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {

          // 1. Récupération sécurisée du companyId sans forcer avec "!"
    const companyId = req.user?.companyId;
    const role = req.user.role;

    // 2. Blocage immédiat si l'utilisateur n'est pas identifié ou lié à une entreprise
    if (!companyId || typeof companyId !== 'string') {
      throw new ForbiddenError('Company ID is missing from user session');
    }
    if (role !== 'COMPANY') {
      throw new ForbiddenError('Company ID is missing from user session');
    }
      const tender = await TenderService.createTender({
        title: req.body.title,
        description: req.body.description,
        deadline: req.body.deadline,
        companyId: companyId,
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
      const role = req.user?.role;
      if(!tenderId || typeof tenderId !== 'string'){
         return res.status(400).json({ error: 'Invalid tenderId parameter' })
      }
      if(!role || typeof role !== 'string'){
         return res.status(400).json({ error: 'Invalid role' })
      }
      const tender = await TenderService.publishTender(
        tenderId,
        role
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
    static async getDraft(
    _req: Request,// the underscore (_) before the req parameter indicates that this parameter is intentionally unused in the function. It is a common convention in programming to prefix unused parameters with an underscore to signal to other developers (and to linters) that the parameter is not needed for the function's logic. In this case, it means that the getPublished method does not require any information from the incoming request to perform its operation.
    res: Response,
    next: NextFunction
  ) {
    try {
      const draftTenders = await TenderService.getDraftTenders();

      return res.status(200).json(draftTenders);
    } catch (error) {
      next(error);
    }
  }
}