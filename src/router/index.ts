import express from 'express';
import customers from './customers';
import deviceModels from './device-models';

const router = express.Router();

export default (): express.Router => {
  customers(router);
  deviceModels(router);
  return router;
};