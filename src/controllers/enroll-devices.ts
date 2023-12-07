import { pool } from '../db';
import * as shortid from 'shortid';

const deviceTable = "enrolleddevices";

export const enrollDevice = async (req: any, res: any) => {
  try {
    const { loc_id } = req.params;
    const { m_num } = req.body;
    const d_id = shortid.generate();

    if (!m_num) {
      return res.status(400).json({ error: 'Please provide the model number.' });
    }

    const insertQuery = `
      INSERT INTO ${deviceTable} (d_id, loc_id, m_num)
      VALUES ($1, $2, $3)
      RETURNING d_id, loc_id, m_num;
    `;
    const values = [d_id, loc_id, m_num];
    const enrolledDevice = await pool.query(insertQuery, values);

    res.status(201).json({ message: 'Device enrolled successfully', device: enrolledDevice.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while enrolling the device.' });
  }
};

export const getLocationDevices = async (req: any, res: any) => {
  try {
    const { loc_id } = req.params;
    const getQuery = `SELECT * FROM ${deviceTable} WHERE loc_id = $1`;
    const values = [loc_id];

    pool.query(getQuery, values, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation ${deviceTable} does not exist`)) {
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

export const deleteDevice = async (req:any, res:any) => {
  try {
    const { d_id } = req.params;

    const deleteQuery = `
      DELETE FROM ${deviceTable}
      WHERE d_id = $1
      RETURNING d_id;
    `;
    const values = [d_id];

    const deletedDevice = await pool.query(deleteQuery, values);

    res.status(200).json({
      message: `Device with ID ${deletedDevice.rows[0].d_id} deleted successfully`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while deleting the device' });
  }
};
