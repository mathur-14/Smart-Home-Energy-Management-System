import { pool } from '../db';
import * as shortid from 'shortid';

const locationTable = "servicelocations";

export const registerLocation = async (req: any, res: any) => {
  try {
    const { c_id } = req.params;
    const { loc_address, area_by_foot, beds, occupants, zipcode } = req.body;
    const startDate = new Date();
    const loc_id = shortid.generate();

    if (!c_id || !loc_address || !area_by_foot || !beds || !occupants || !zipcode) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const insertQuery = `
      INSERT INTO ${locationTable} (cid, loc_id, loc_address, start_date, area_by_foot, beds, occupants, zipcode)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING cid, loc_id, loc_address, zipcode;
    `;
    const values = [c_id, loc_id, loc_address, startDate, area_by_foot, beds, occupants, zipcode];
    const registeredLocation = await pool.query(insertQuery, values);

    res.status(200).json({ message: 'Location registered successfully', location: registeredLocation.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while registering the location.' });
  }
};

export const getLocations = async (req: any, res: any) => {
  try {
    const { c_id } = req.params;
    const getQuery = `SELECT * FROM ${locationTable} WHERE cid = $1`;
    const values = [c_id];

    pool.query(getQuery, values, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation ${locationTable} does not exist`)) {
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

export const updateLocation = async (req: any, res: any) => {
  try {
    const { loc_id } = req.params;
    const { column, newValue } = req.body;

    const updateQuery = `UPDATE ${locationTable} SET ${column} = $1 WHERE loc_id = $2`;
    const values = [newValue, loc_id];

    pool.query(updateQuery, values, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation "${locationTable}" does not exist`)) {
          return res.status(400).json({ error: 'Table not found' });
        }
        throw err;
      }
      if(!result.rowCount)
        res.status(400).json({ message: `Location Id ${loc_id} does not exist` });
      else
        res.status(200).json({ message: 'Location updated successfully' });
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const deleteLocation = async (req:any, res:any) => {
  try {
    const { c_id, loc_id } = req.params;

    const deleteQuery = `
      DELETE FROM ${locationTable}
      WHERE cid = $1 AND loc_id = $2
      RETURNING cid;
    `;
    const values = [c_id, loc_id];

    const deletedLocation = await pool.query(deleteQuery, values);

    res.status(200).json({
      message: `Location with ID ${loc_id} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the location' });
  }
};
