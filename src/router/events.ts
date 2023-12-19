import express from 'express';
import * as Events from '../controllers/events'
import { isAuthenticated } from '../middlewares/authentication';

export default (router: express.Router) => {
  router.post(`/v1/customer/:c_id/service-location/:loc_id/device/:d_id/event`, Events.addEvent);
  router.post(`/v1/customer/:c_id/service-location/:loc_id/events/energy-used`, isAuthenticated, Events.getLocationEnergyUsed);
  router.post(`/v1/customer/:c_id/location-events/energy-used`, isAuthenticated, Events.getCustomerAllLocationsEnergyUsed);
  router.post(`/v1/customer/:c_id/device-events/energy-used`, isAuthenticated, Events.getCustomerAllDevicesEnergyUsed);
  router.post(`/v1/device-events/energy-used/avg`, Events.getDeviceTypeAverageMonthlyEnergyUsed);
};
