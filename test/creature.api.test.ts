/*
 * Laboratoire de tests sous pression : nous faisons subir à l'API quelques scénarios
 * dignes d'un sous-marin hanté pour vérifier qu'elle garde son sang-froid abyssal.
 */
import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app';
import { connectToDatabase } from '../src/config/database';
import { SeaCreatureModel } from '../src/models/creature.model';

describe('Sea Creature API', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    /*
     * On invoque un Mongo de poche façon hologramme pour mener nos expériences sans casser le vrai.
     */
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await connectToDatabase(uri);
  });

  afterAll(async () => {
    /*
     * On ferme les écoutilles et on remercie le serveur mémoire de ne pas avoir coulé.
     */
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  afterEach(async () => {
    /*
     * On efface les créatures créées pendant les expériences pour éviter les débordements
     * à la cafétéria du laboratoire.
     */
    await SeaCreatureModel.deleteMany({});
  });

  it('creates a sea creature via POST /items', async () => {
    const payload = {
      name: 'Dragon des Fleuves',
      species: 'Draconis Fluvialis',
      region: 'amazonie',
      depth: 320,
      dangerLevel: 'modere',
      description: 'Un dragon amphibie au souffle toxique.',
      abilities: ['camouflage', 'souffle toxique'],
    };

    const response = await request(app).post('/items').send(payload).expect(201);

    expect(response.body).toMatchObject({
      name: payload.name,
      species: payload.species,
      region: payload.region,
      dangerLevel: payload.dangerLevel,
    });

    expect(response.body).toHaveProperty('_id');

    const stored = await SeaCreatureModel.findById(response.body._id);
    expect(stored).not.toBeNull();
    expect(stored?.abilities).toEqual(payload.abilities);
  });

  it('retrieves a creature by id via GET /items/:id', async () => {
    const creature = await SeaCreatureModel.create({
      name: 'Méduse solaire',
      species: 'Medusa solarius',
      region: 'pacifique',
      depth: 900,
      dangerLevel: 'faible',
      description: 'Une méduse géante lumineuse et pacifique.',
      abilities: ['bioluminescence'],
    });

    const response = await request(app).get(`/items/${creature._id.toString()}`).expect(200);

    expect(response.body).toMatchObject({
      _id: creature._id.toString(),
      name: creature.name,
      species: creature.species,
    });
  });

  it('searches by keyword with filters via GET /search', async () => {
    await SeaCreatureModel.create([
      {
        name: 'Requin fantôme',
        species: 'Chimaera monstrosa',
        region: 'atlantique',
        depth: 1100,
        dangerLevel: 'modere',
        description: 'Chasseur nocturne phosphorescent.',
        abilities: ['visions nocturnes'],
      },
      {
        name: 'Serpent des abysses',
        species: 'Serpens abyssalis',
        region: 'pacifique',
        depth: 1600,
        dangerLevel: 'critique',
        description: 'Prédateur gigantesque qui détecte les vibrations.',
        abilities: ['perception vibratoire'],
      },
    ]);

    const response = await request(app)
      .get('/search')
      .query({ keyword: 'nocturne', dangerLevel: 'modere', maxDepth: 1200 })
      .expect(200);

    expect(response.body.count).toBe(1);
    expect(response.body.results[0]).toMatchObject({
      name: 'Requin fantôme',
      dangerLevel: 'modere',
    });
  });

  it('returns 400 when keyword is missing in GET /search', async () => {
    const response = await request(app).get('/search').expect(400);
    expect(response.body).toEqual({ message: 'Le paramètre keyword est requis.' });
  });
});
