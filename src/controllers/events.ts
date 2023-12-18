import express from 'express';
import { pool } from '../db';

const eventsTable = "events";

export const addEvent = async (req: express.Request, res: express.Response) => {
  try {
    const { d_id } = req.params;
    const { e_label, val, eventDate } = req.body;
    // const eventDate = new Date();

    if (!e_label) {
      return res.status(400).json({ error: 'Please provide the event label.' });
    }

    const insertQuery = `
      INSERT INTO ${eventsTable} (d_id, e_label, timestamp, val)
      VALUES ($1, $2, $3, $4)
      RETURNING e_id, d_id, e_label, timestamp, val;
    `;
    const values = [d_id, e_label, eventDate, val];
    const addedEvent = await pool.query(insertQuery, values);

    res.status(200).json({ message: 'Event notified successfully', event: addedEvent.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while notifying the device event.' });
  }
};

// total energy used and total price
export const getLocationEnergyUsed = async (req: express.Request, res: express.Response) => {
  try {
    const { loc_id } = req.params;
    const { startTime, endTime } = req.body;

    if (!loc_id || !startTime || !endTime) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const getQuery = `
    SELECT ED.d_id AS DeviceId,
      M.m_num,
      M.m_name,
      SUM(COALESCE(E.val * ZEP.cost_per_kwh, 0)) AS TotalEnergyCost,
      SUM(E.val) AS TotalEnergyUsage
    FROM ServiceLocations SL
    JOIN EnrolledDevices ED ON SL.loc_id = ED.loc_id
    JOIN Events E ON ED.d_id = E.d_id
    JOIN ZipCodeEnergyPrices ZEP ON SL.zipcode = ZEP.zipcode
    JOIN Models M ON M.m_num = ED.m_num
      AND E.timestamp >= ZEP.timestamp
      AND E.timestamp < ZEP.timestamp + INTERVAL '1 hours'
    WHERE E.timestamp >= $1
      AND E.timestamp < $2 AND E.e_label = 'energy use' AND SL.loc_id = $3
    GROUP BY ED.d_id, M.m_num, M.m_name;
    `;
    const values = [startTime, endTime, loc_id];

    pool.query(getQuery, values, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation ${eventsTable} does not exist`)) {
          return res.status(400).json({ error: 'Table not found' });
        }
        throw err;
      }

      let totalEnergyUsage = 0;
      let totalEnergyCost = 0;

      result.rows.forEach((row: any) => {
        totalEnergyUsage += row.totalenergyusage;
        totalEnergyCost += row.totalenergycost;
      });
      res.status(200).json({ loc_id, totalEnergyUsage, totalEnergyCost, devices: result.rows });
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const getCustomerAllLocationsEnergyUsed = async (req: express.Request, res: express.Response) => {
  try {
    const { c_id } = req.params;
    const { startTime, endTime } = req.body;

    if (!c_id || !startTime || !endTime) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const getQuery = `
    SELECT SL.loc_id AS LocationId,
      SUM(COALESCE(E.val * ZEP.cost_per_kwh, 0)) AS TotalEnergyCost,
      SUM(E.val) AS TotalEnergyUsage
    FROM ServiceLocations SL
    JOIN EnrolledDevices ED ON SL.loc_id = ED.loc_id
    JOIN Events E ON ED.d_id = E.d_id
    JOIN ZipCodeEnergyPrices ZEP ON SL.zipcode = ZEP.zipcode
      AND E.timestamp >= ZEP.timestamp
      AND E.timestamp < ZEP.timestamp + INTERVAL '1 hours'
    WHERE E.timestamp >= $1 AND E.timestamp < $2
    AND E.e_label = 'energy use' AND SL.cid = $3
    GROUP BY SL.loc_id;
    `;
    const values = [startTime, endTime, c_id];

    pool.query(getQuery, values, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation ${eventsTable} does not exist`)) {
          return res.status(400).json({ error: 'Table not found' });
        }
        throw err;
      }

      let totalEnergyUsage = 0;
      let totalEnergyCost = 0;

      result.rows.forEach((row: any) => {
        totalEnergyUsage += row.totalenergyusage;
        totalEnergyCost += row.totalenergycost;
      });
      res.status(200).json({ c_id, totalEnergyUsage, totalEnergyCost, locations: result.rows });
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const getCustomerAllDevicesEnergyUsed = async (req: express.Request, res: express.Response) => {
  try {
    const { c_id } = req.params;
    const { startTime, endTime } = req.body;

    if (!c_id || !startTime || !endTime) {
      return res.status(400).json({ error: 'Please provide all required fields.' });
    }

    const getQuery = `
    WITH 
    timeFrameEvents AS (
      SELECT d.d_id, m.m_num, m.m_name, m.d_type, d.loc_id
      FROM EnrolledDevices d
      JOIN Models m ON m.m_num = d.m_num
      JOIN ServiceLocations s ON d.loc_id = s.loc_id
      WHERE s.cid = $1
    )
    SELECT ed.d_id, ed.m_num, ed.m_name, ed.d_type, SUM(de.val) AS TotalEnergyUsage, AVG(de.val) AS AverageEnergyUsage
    FROM timeFrameEvents ed
    JOIN Events de ON ed.d_id = de.d_id
    WHERE de.timestamp >= $2 AND de.timestamp < $3
    AND de.e_label = 'energy use'
    GROUP BY ed.d_id, ed.d_type, ed.m_num, ed.m_name;
    `;
    const values = [c_id, startTime, endTime];

    pool.query(getQuery, values, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation ${eventsTable} does not exist`)) {
          return res.status(400).json({ error: 'Table not found' });
        }
        throw err;
      }

      let totalEnergyUsage = 0;

      result.rows.forEach((row: any) => {
        totalEnergyUsage += row.totalenergyusage;
      });
      res.status(200).json({ c_id, totalEnergyUsage, devices: result.rows });
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const getDeviceTypeAverageMonthlyEnergyUsed = async (req: express.Request, res: express.Response) => {
  try {
    const endTime = new Date();
    const startTime = new Date(endTime.getTime() - 720 * 60 * 60 * 1000);

    const getQuery = `
    SELECT M.d_type AS DeviceType,
    AVG(E.val) AS AvgMonthlyEnergyConsumption
    FROM Models M
    JOIN EnrolledDevices ED ON M.m_num = ED.m_num
    JOIN Events E ON ED.d_id = E.d_id
    WHERE E.timestamp >= $1 AND E.timestamp < $2
    AND E.e_label = 'energy use'
    GROUP BY M.d_type;
    `;
    const values = [startTime, endTime];

    pool.query(getQuery, values, (err: Error, result: any) => {
      if (err) {
        if (err.message.includes(`relation ${eventsTable} does not exist`)) {
          return res.status(400).json({ error: 'Table not found' });
        }
        throw err;
      }
      res.status(200).json({ deviceTypes: result.rows });
    });
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
