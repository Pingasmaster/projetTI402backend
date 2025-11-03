/*
 * Salle des machines : on y négocie le pacte avec l'oracle MongoDB
 * pour qu'il nous laisse consulter les grimoires des abysses.
 */
import mongoose from 'mongoose';

export const connectToDatabase = async (uri?: string): Promise<typeof mongoose> => {
  /*
   * On récupère la rune de connexion. Sans elle, la porte vers les profondeurs
   * reste close et l'équipe doit rentrer à la nage.
   */
  const connectionUri = uri || process.env.MONGODB_URI;

  if (!connectionUri) {
    throw new Error('MONGODB_URI n\'est pas défini dans les variables d\'environnement.');
  }

  try {
    /*
     * Mode strict activé : même les poissons lanternes sont tenus de respecter
     * le protocole de requête sans quoi ils sont refoulés.
     */
    mongoose.set('strictQuery', true);
    await mongoose.connect(connectionUri);
    return mongoose;
  } catch (error) {
    throw new Error(`Impossible de se connecter à MongoDB: ${(error as Error).message}`);
  }
};
