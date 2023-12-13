import express from 'express';
import customers from './customers';
import deviceModels from './device-models';
import serviceLocations from './service-locations';
import enrollDevices from './enroll-devices';
import energyPrices from './energy-prices';
import events from './events';

const router = express.Router();

export default (): express.Router => {
  customers(router);
  deviceModels(router);
  serviceLocations(router);
  enrollDevices(router);
  energyPrices(router);
  events(router);
  return router;
};
