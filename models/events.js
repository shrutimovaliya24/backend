const db = require('../config/db');

const Events = {
  create: (eventType, instanceId, eventData, callback) => {
    const sql = `
      INSERT INTO events (event_type, instance_id, event_data)
      VALUES (?, ?, ?)
    `;

    const values = [
      eventType,
      instanceId,
      JSON.stringify(eventData)
    ];

    db.query(sql, values, (err, results) => {
      if (err) {
        return callback(err);
      }
      callback(null, results);
    });
  }
};

module.exports = Events;
