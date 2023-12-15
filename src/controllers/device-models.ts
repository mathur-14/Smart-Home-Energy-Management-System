import express from 'express';
import { pool } from '../db';
import * as shortid from 'shortid';

const modelsTable = "models";

export const addDeviceModel = async (req: express.Request, res: express.Response) => {
  try {
    const m_num = shortid.generate();
    const { m_name, d_type, props } = req.body;

    if (!m_name || !d_type || !props ) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const checkModelQuery = `SELECT * FROM ${modelsTable} WHERE m_name = $1`;
    const ModelValues = [m_name];
    const existingModel = await pool.query(checkModelQuery, ModelValues);

    if (existingModel.rowCount) {
      return res.status(400).json({ error: "Model already exists"});
    }
    else {
      const insertModelQuery = `
        INSERT INTO ${modelsTable} (m_num, m_name, d_type, m_props)
        VALUES ($1, $2, $3, $4)
        RETURNING m_num, m_name, d_type, m_props;
      `;
      const insertModelValues = [m_num, m_name, d_type, props];
      const newModel = await pool.query(insertModelQuery, insertModelValues);

      res.status(200).json({ message: 'Model created successfully', 'device-model': newModel.rows[0] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
};

export const getAllDeviceModels = async (req: express.Request, res: express.Response) => {
  try {
    const getQuery = `SELECT * FROM ${modelsTable}`;

    pool.query(getQuery, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation ${modelsTable} does not exist`)) {
          return res.status(400).json({ error: 'Table not found' });
        }
        throw err;
      }
      res.status(200).json(result.rows);
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const getAllDeviceTypes = async (req: express.Request, res: express.Response) => {
  try {
    const getQuery = `SELECT DISTINCT d_type FROM ${modelsTable}`;

    pool.query(getQuery, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation ${modelsTable} does not exist`)) {
          return res.status(400).json({ error: 'Table not found' });
        }
        throw err;
      }
      res.status(200).json(result.rows);
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const getDeviceTypeModels = async (req: express.Request, res: express.Response) => {
  try {
    const { device_type } = req.params;
    const getQuery = `SELECT * FROM ${modelsTable} WHERE d_type = $1`;
    const values = [device_type];

    pool.query(getQuery, values, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation ${modelsTable} does not exist`)) {
          return res.status(400).json({ error: 'Table not found' });
        }
        throw err;
      }
      res.status(200).json(result.rows);
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const updateDeviceModel = async (req: express.Request, res: express.Response) => {
  try {
    const { m_num } = req.params;
    const { column, newValue } = req.body;

    const updateQuery = `UPDATE ${modelsTable} SET ${column} = $1 WHERE m_num = $2`;
    const values = [newValue, m_num];

    pool.query(updateQuery, values, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation "${modelsTable}" does not exist`)) {
          return res.status(400).json({ error: 'Table not found' });
        }
        throw err;
      }
      if(!result.rowCount)
        res.status(400).json({ message: 'Model number does not exist' });
      else
        res.status(200).json({ message: 'Model updated successfully' });
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const deleteDeviceModel = async (req: express.Request, res: express.Response) => {
  try {
    const { m_num } = req.params;

    const deleteQuery = `
      DELETE FROM ${modelsTable}
      WHERE m_num = $1
      RETURNING m_num;
    `;
    const deletedModel = await pool.query(deleteQuery, [m_num]);

    res.status(200).json({
      message: `Model with ID ${deletedModel.rows[0].m_num} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the device model' });
  }
};
