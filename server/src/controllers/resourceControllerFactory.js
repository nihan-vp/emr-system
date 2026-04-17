import {
  createCollectionItem,
  deleteCollectionItem,
  findCollectionItem,
  getCollection,
  updateCollectionItem
} from '../repositories/clinicStateRepository.js';

const readPayload = (request) => {
  if (request.body?.item && typeof request.body.item === 'object') {
    return request.body.item;
  }

  return request.body;
};

export const createResourceController = (collection) => ({
  list: async (_request, response) => {
    const items = await getCollection(collection);

    response.json({
      ok: true,
      data: items,
    });
  },

  getById: async (request, response) => {
    const item = await findCollectionItem(collection, request.params.id);

    if (!item) {
      return response.status(404).json({
        ok: false,
        message: `${collection.slice(0, -1)} not found.`,
      });
    }

    return response.json({
      ok: true,
      data: item,
    });
  },

  create: async (request, response) => {
    const item = readPayload(request);

    if (!item || typeof item !== 'object' || item.id === undefined || item.id === null || item.id === '') {
      return response.status(400).json({
        ok: false,
        message: 'A payload object with an id is required.',
      });
    }

    const existing = await findCollectionItem(collection, item.id);

    if (existing) {
      return response.status(409).json({
        ok: false,
        message: `${collection.slice(0, -1)} already exists.`,
      });
    }

    const items = await createCollectionItem(collection, item);

    return response.status(201).json({
      ok: true,
      data: items,
    });
  },

  update: async (request, response) => {
    const item = readPayload(request);

    if (!item || typeof item !== 'object') {
      return response.status(400).json({
        ok: false,
        message: 'A payload object is required.',
      });
    }

    const updatedItem = {
      ...item,
      id: item.id ?? request.params.id,
    };

    const result = await updateCollectionItem(collection, request.params.id, updatedItem);

    if (!result) {
      return response.status(404).json({
        ok: false,
        message: `${collection.slice(0, -1)} not found.`,
      });
    }

    return response.json({
      ok: true,
      data: result,
    });
  },

  remove: async (request, response) => {
    const deleted = await deleteCollectionItem(collection, request.params.id);

    if (!deleted) {
      return response.status(404).json({
        ok: false,
        message: `${collection.slice(0, -1)} not found.`,
      });
    }

    return response.json({
      ok: true,
      message: `${collection.slice(0, -1)} deleted.`,
    });
  },
});
