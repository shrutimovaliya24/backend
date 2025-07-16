const db = require('../config/db');

const Events = {
    create: (eventType , instanceId, eventData,callback)=>{
        db.query(
            'INSERT INTO events (event_type,instance_id,event_data) VALUES (?,?,?)',
            [eventType,instanceId,JSON.stringify(eventData)],
            callback
        );
    }
};

module.exports = Events;