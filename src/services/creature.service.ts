/*
 * Office des opérations abyssales : les scientifiques y peaufinent les rituels
 * CRUD et concoctent des recherches à base de champ lexical inquiétant.
 */
import { FilterQuery } from 'mongoose';
import { CreateSeaCreatureDTO, ISeaCreature, SeaCreatureModel } from '../models/creature.model';

export interface ListOptions {
  /*
   * Page demandée par le stagiaire pagination. Un, c'est rassurant.
   */
  page?: number;
  /*
   * Nombre maximum de créatures par page, histoire que le guide ne s'évanouisse pas.
   */
  limit?: number;
  /*
   * Filtre géographique, pour éviter d'envoyer les touristes dans la mauvaise faille.
   */
  region?: string;
  /*
   * Filtre sur la dangerosité afin d'épargner les visiteurs allergiques au chaos.
   */
  dangerLevel?: string;
}

export interface SearchOptions {
  /*
   * Mot-clé de recherche, généralement prononcé avec un ton dramatique.
   */
  keyword?: string;
  /*
   * On peut demander explicitement un niveau de menace, juste pour le frisson.
   */
  dangerLevel?: string;
  /*
   * Profondeur maximale tolérée par le sous-marin du moment.
   */
  maxDepth?: number;
}

export class SeaCreatureService {
  /*
   * Invoque une nouvelle créature et l'inscrit dans le registre officiel
   * avant que quelqu'un ne l'enferme dans un bocal.
   */
  public async create(payload: CreateSeaCreatureDTO): Promise<ISeaCreature> {
    return SeaCreatureModel.create(payload);
  }

  /*
   * Retrouve un spécimen par identifiant, même s'il se cache derrière un rocher.
   */
  public async findById(id: string): Promise<ISeaCreature | null> {
    return SeaCreatureModel.findById(id).exec();
  }

  /*
   * Catalogue paginé des créatures, avec options de tri sélectif sur la région
   * ou le niveau de dangerosité pour préserver les visiteurs prudents.
   */
  public async list(options: ListOptions = {}): Promise<{
    items: ISeaCreature[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, region, dangerLevel } = options;
    const filter: FilterQuery<ISeaCreature> = {};

    if (region) {
      filter.region = region.toLowerCase();
    }

    if (dangerLevel) {
      filter.dangerLevel = dangerLevel.toLowerCase();
    }

    const [total, items] = await Promise.all([
      SeaCreatureModel.countDocuments(filter).exec(),
      SeaCreatureModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
    ]);

    return { items, total, page, limit };
  }

  /*
   * Recherche multi-critères : scrute les noms, descriptions et talents cachés
   * avant d'appliquer quelques filtres pour éviter les mauvaises rencontres.
   */
  public async search(options: SearchOptions): Promise<ISeaCreature[]> {
    const { keyword, dangerLevel, maxDepth } = options;
    const filter: FilterQuery<ISeaCreature> = {};

    if (keyword) {
      filter.$or = [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { abilities: { $regex: keyword, $options: 'i' } },
      ];
    }

    if (dangerLevel) {
      filter.dangerLevel = dangerLevel.toLowerCase();
    }

    if (maxDepth !== undefined) {
      const existingDepthFilter = (filter.depth as Record<string, number> | undefined) ?? {};
      filter.depth = { ...existingDepthFilter, $lte: maxDepth };
    }

    return SeaCreatureModel.find(filter).sort({ dangerLevel: 1, depth: 1 }).exec();
  }
}

export const seaCreatureService = new SeaCreatureService();
