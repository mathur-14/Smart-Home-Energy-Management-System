import express from 'express';
import * as Events from '../controllers/events'

export default (router: express.Router) => {
  router.post(`/v1/customer/:c_id/service-location/:loc_id/device/:d_id/event`, Events.addEvent);
  router.get(`/v1/customer/:c_id/service-location/:loc_id/events/energy-used`, Events.getLocationEnergyUsed);
  router.get(`/v1/customer/:c_id/location-events/energy-used`, Events.getCustomerAllLocationsEnergyUsed);
  router.get(`/v1/customer/:c_id/device-events/energy-used`, Events.getCustomerAllDevicesEnergyUsed);
  router.get(`/v1/device-events/energy-used/avg`, Events.getDeviceTypeAverageMonthlyEnergyUsed);
};
