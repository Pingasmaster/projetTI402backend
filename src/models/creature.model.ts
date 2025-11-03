/*
 * Laboratoire taxonomique : c'est ici que l'on décrit chaque créature abyssale
 * avec suffisamment de détails pour que les biologistes marins puissent frimer.
 */
import { Document, Model, Schema, model } from 'mongoose';

export interface ISeaCreature extends Document {
  /*
   * Nom officiel livré par le service marketing des abysses.
   */
  name: string;
  /*
   * Espèce, pour différencier le léviathan mondain du léviathan un peu trop mondain.
   */
  species: string;
  /*
   * Région de villégiature, souvent un coin avec peu de wifi.
   */
  region: string;
  /*
   * Profondeur préférée. Plus le nombre est élevé, plus il faut un scaphandre fancy.
   */
  depth: number;
  /*
   * Niveau de danger, parce que certains stagiaires aiment tenter des choses.
   */
  dangerLevel: string;
  /*
   * Description narrative pour les guides touristiques ésotériques.
   */
  description: string;
  /*
   * Inventaire des tours de magie disponibles lors des heures de visite.
   */
  abilities: string[];
  /*
   * Horodatage automatique pour nos archives pleines de poussière cosmique.
   */
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSeaCreatureDTO {
  name: string;
  species: string;
  region: string;
  depth: number;
  dangerLevel: string;
  description: string;
  abilities: string[];
}

const SeaCreatureSchema = new Schema<ISeaCreature>(
  {
    /*
     * Nom accrocheur obligatoire : évite aux explorateurs de renommer tout "Nessie".
     */
    name: {
      type: String,
      required: true,
      trim: true,
    },
    /*
     * Le genre exact de bébête que l'on a pêchée au bout du monde.
     */
    species: {
      type: String,
      required: true,
      trim: true,
    },
    /*
     * Région d'habitat, rangée en minuscules pour calmer les débats cartographiques.
     */
    region: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    /*
     * Profondeur maximale repérée par nos sonars légèrement stressés.
     */
    depth: {
      type: Number,
      required: true,
      min: 0,
    },
    /*
     * Feu tricolore de la dangerosité : faible, modéré ou "rangez les harpons".
     */
    dangerLevel: {
      type: String,
      required: true,
      enum: ['faible', 'modere', 'critique'],
      lowercase: true,
      trim: true,
    },
    /*
     * Description littéraire, car même les monstres aiment leur page Wikipédia.
     */
    description: {
      type: String,
      required: true,
      trim: true,
    },
    /*
     * Liste des compétences débloquées dans l'arbre des talents abyssaux.
     */
    abilities: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
  },
  {
    /*
     * Oui, on time-stampe tout : même les créatures aiment fêter un anniversaire.
     */
    timestamps: true,
  }
);

export const SeaCreatureModel: Model<ISeaCreature> = model<ISeaCreature>('SeaCreature', SeaCreatureSchema);
