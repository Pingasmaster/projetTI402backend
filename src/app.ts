/*
 * Centre de commandement abyssal : ce module assemble les leviers Express,
 * active les sas de sécurité JSON et connecte le tunnel touristique vers nos créatures.
 * Si vous entendez des bruits étranges, c'est juste le routeur qui s'échauffe.
 */
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import creatureRouter from './routes/creature.routes';

const app = express();

/*
 * On équipe les visiteurs d'un scaphandre JSON pour éviter qu'ils ne propagent
 * des paquets malformés dans l'observatoire.
 */
app.use(express.json());

/*
 * Galerie publique : sert surtout à afficher un index d'accueil pendant que
 * les créatures font semblant d'être civilisées.
 */
app.use(express.static(path.resolve(__dirname, '..', 'public')));

/*
 * Balise de santé : si cet endpoint répond, c'est que l'équipe de maintenance
 * n'a pas encore été mangée par un calamar géant.
 */
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

/*
 * Le tunnel principal qui mène des visiteurs curieux jusqu'au bestiaire abyssal.
 * Prière de ne pas nourrir les entités en chemin.
 */
app.use('/', creatureRouter);

/*
 * Dernière barrière anti-chaos : capture les exceptions, les empaquette
 * poliment et les renvoie en surface pour analyse sans hurler trop fort.
 */
app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  const message = error instanceof Error ? error.message : 'Erreur interne du serveur';
  res.status(500).json({ message });
});

export default app;
