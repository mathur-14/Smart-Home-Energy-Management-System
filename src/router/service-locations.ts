import express from 'express';
import * as Locations from '../controllers/service-locations'

const baseurl = '/v1/customer/:c_id';
export default (router: express.Router) => {
  router.post(`${baseurl}/service-location`, Locations.registerLocation);
  router.get(`${baseurl}/service-locations`, Locations.getLocations);
  router.put(`${baseurl}/service-location/:loc_id`, Locations.updateLocation);
  router.delete(`${baseurl}/service-location/:loc_id`, Locations.deleteLocation);
};
