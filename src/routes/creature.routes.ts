/*
 * Poste de navigation : cette carte indique à Express quelles escales
 * mener les explorateurs pour rencontrer nos créatures fragiles mais griffues.
 */
import { Router } from 'express';
import { seaCreatureController } from '../controllers/creature.controller';

const router = Router();

/*
 * Tunnel d'admission : on accueille une nouvelle créature via POST /items.
 */
router.post('/items', (req, res, next) => seaCreatureController.create(req, res, next));

/*
 * Accès individuel : chaque spécimen peut être admiré à travers GET /items/:id.
 */
router.get('/items/:id', (req, res, next) => seaCreatureController.getById(req, res, next));

/*
 * Vitrine cataloguée : GET /items dévoile une galerie paginée pour les curieux.
 */
router.get('/items', (req, res, next) => seaCreatureController.list(req, res, next));

/*
 * Sonar de recherche : GET /search parcourt les légendes avec filtres d'usage.
 */
router.get('/search', (req, res, next) => seaCreatureController.search(req, res, next));

export default router;
