import express from 'express';
import * as energyPrices from '../controllers/energy-prices';

const baseurl = '/v1/zipcode/:zipcode'
export default (router: express.Router) => {
  router.post(`${baseurl}/price`, energyPrices.addPrice);
  router.get(`${baseurl}/prices`, energyPrices.getPricesLastXhours);
};
