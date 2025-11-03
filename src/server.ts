/*
 * Salle des propulseurs : on lance la plateforme Express, on branche l'oxygène
 * environnemental (.env) et on vérifie que Mongo nous fait toujours des clins d'œil.
 */
import dotenv from 'dotenv';
import app from './app';
import { connectToDatabase } from './config/database';

dotenv.config();

/*
 * Calcul du port d'accostage; par défaut on ouvre la porte 3000,
 * décorée de coquillages luminescents.
 */
const PORT = Number.parseInt(process.env.PORT || '3000', 10);

const startServer = async (): Promise<void> => {
  try {
    /*
     * On branche la station au réseau MongoDB avant de lever l'ancre.
     */
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
};

/*
 * On lance la séquence de démarrage sans attendre : le capitaine n'aime pas poireauter.
 */
void startServer();
