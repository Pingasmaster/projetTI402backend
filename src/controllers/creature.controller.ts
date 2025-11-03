/*
 * Tour de contrôle : ici on orchestre l'arrivée des requêtes, on appelle
 * les soigneurs de créatures et on renvoie les réponses sans perdre un tentacule.
 */
import { NextFunction, Request, Response } from 'express';
import { CreateSeaCreatureDTO } from '../models/creature.model';
import { seaCreatureService } from '../services/creature.service';

class SeaCreatureController {
  /*
   * Prise en charge des nouveaux pensionnaires : on transmet le dossier au service,
   * on salue la créature et on confirme son admission auprès des visiteurs.
   */
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const payload = req.body as CreateSeaCreatureDTO;
      const creature = await seaCreatureService.create(payload);
      res.status(201).json(creature);
    } catch (error) {
      next(error);
    }
  }

  /*
   * Retrouve un spécimen à partir de son identifiant mystique et le présente
   * poliment au public, sauf s'il a pris la poudre d'escampette.
   */
  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const creature = await seaCreatureService.findById(id);

      if (!creature) {
        res.status(404).json({ message: 'Créature abyssale introuvable.' });
        return;
      }

      res.json(creature);
    } catch (error) {
      next(error);
    }
  }

  /*
   * Dresse une liste raisonnable des pensionnaires, avec pagination pour éviter
   * que l'écran d'accueil ne se transforme en tentacule infini.
   */
  public async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number.parseInt(req.query.page as string, 10) || 1;
      const limit = Number.parseInt(req.query.limit as string, 10) || 10;
      const region = (req.query.region as string | undefined)?.toLowerCase();
      const dangerLevel = (req.query.dangerLevel as string | undefined)?.toLowerCase();

      const data = await seaCreatureService.list({ page, limit, region, dangerLevel });
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  /*
   * Lance une expédition de recherche : traque par mot-clé, applique des filtres
   * de dangerosité et surveille la profondeur maximale tolérée par le sous-marin.
   */
  public async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const keyword = req.query.keyword as string | undefined;

      if (!keyword) {
        res.status(400).json({ message: 'Le paramètre keyword est requis.' });
        return;
      }

      const dangerLevel = (req.query.dangerLevel as string | undefined)?.toLowerCase();
      const maxDepthRaw = req.query.maxDepth as string | undefined;
      const maxDepth = maxDepthRaw ? Number.parseInt(maxDepthRaw, 10) : undefined;

      const results = await seaCreatureService.search({ keyword, dangerLevel, maxDepth });
      res.json({ results, count: results.length });
    } catch (error) {
      next(error);
    }
  }
}

export const seaCreatureController = new SeaCreatureController();
