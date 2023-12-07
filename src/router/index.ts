import express from 'express';
import customers from './customers';

const router = express.Router();

export default (): express.Router => {
  customers(router);
  return router;
};