const admin = require("firebase-admin");
const db = admin.firestore();
const { Timestamp } = require('firebase-admin/firestore');

function getExpDate(period, expTime = 0){

    const intperiod = parseInt(period)
    // The time now in milliseconds added with the paid period in milliseconds. 
    const currentTimeMillis = new Date().getTime()
    const expDateMS = currentTimeMillis + intperiod*2629746*1000
    let residTime = 0
    // Checks if there is any time left in the old membership. 
    if(expTime > currentTimeMillis){
        residTime = expTime - currentTimeMillis
    }
    const expDateTimestamp = Timestamp.fromMillis(expDateMS + residTime)
    return expDateTimestamp
}

async function documentExists(path){
    return db.doc(path).get().then((snap) => {
        return snap.exists
    })
}

module.exports = {
    getExpDate : getExpDate,
    documentExists : documentExists
}