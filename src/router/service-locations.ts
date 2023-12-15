import express from 'express';
import * as Locations from '../controllers/service-locations'
import { isAuthenticated } from '../middlewares/authentication';

const baseurl = '/v1/customer/:c_id';
export default (router: express.Router) => {
  router.post(`${baseurl}/service-location`, isAuthenticated, Locations.registerLocation);
  router.get(`${baseurl}/service-locations`, isAuthenticated, Locations.getLocations);
  router.put(`${baseurl}/service-location/:loc_id`, isAuthenticated, Locations.updateLocation);
  router.delete(`${baseurl}/service-location/:loc_id`, isAuthenticated, Locations.deleteLocation);
};
