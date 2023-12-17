import express from 'express';
import * as energyPrices from '../controllers/energy-prices';
import { isAuthenticated, isOwner } from '../middlewares/authentication';

const baseurl = '/v1/zipcode/:zipcode'
export default (router: express.Router) => {
  router.post(`${baseurl}/price`, isAuthenticated, isOwner, energyPrices.addPrice);
  router.get(`${baseurl}/prices/:xHours`, isAuthenticated, energyPrices.getPricesLastXhours);
};
