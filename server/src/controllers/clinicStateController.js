import mongoose from 'mongoose';

import { replaceCollection, sanitizeClinicState } from '../repositories/clinicStateRepository.js';
import { resetClinicState } from '../seed/defaultClinicState.js';
import { editableCollections, getClinicStateSnapshot } from '../repositories/clinicStateRepository.js';

export const getHealth = (_request, response) => {
  const readyStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  response.json({
    ok: true,
    database: readyStateMap[mongoose.connection.readyState] || 'unknown'
  });
};

export const getClinicState = async (_request, response) => {
  const state = await getClinicStateSnapshot();

  response.json({
    ok: true,
    data: state
  });
};

export const replaceClinicCollection = async (request, response) => {
  const { collection } = request.params;
  const items = Array.isArray(request.body) ? request.body : request.body.items;

  if (!editableCollections.has(collection)) {
    return response.status(400).json({
      ok: false,
      message: `Unknown collection: ${collection}`
    });
  }

  if (!Array.isArray(items)) {
    return response.status(400).json({
      ok: false,
      message: 'Request body must contain an array payload.'
    });
  }

  const updatedItems = await replaceCollection(collection, items);

  return response.json({
    ok: true,
    data: {
      collection,
      items: updatedItems
    }
  });
};

export const resetClinicCollections = async (_request, response) => {
  const state = await resetClinicState();

  response.json({
    ok: true,
    data: sanitizeClinicState(state)
  });
};
