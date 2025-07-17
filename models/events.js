const pool = require('../config/db');

const Events = {
  create: (eventType, instanceId, eventData, callback) => {
    pool.query('INSERT INTO events (event_type, instance_id, event_data) VALUES (?, ?, ?)', [eventType, instanceId, JSON.stringify(eventData)], (err, results) => {
      if (err) {
        // handle error
      }
      // handle success
    });
  }
};

module.exports = Events;
