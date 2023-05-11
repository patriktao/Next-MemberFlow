const admin = require("firebase-admin");

function getExpDate(snap, timeleft = false){

    const data = snap.data()
    const period = parseInt(data.period)
    const expDateSeconds = admin.firestore.Timestamp.now()._seconds + period*2629746
    let residTime = 0
    if(timeleft){
        residTime = data.exp_date._seconds - admin.firestore.Timestamp.now()._seconds
    }
    const expDateTimestamp = admin.firestore.Timestamp(getExpDate(snap) + residTime, 0)
    return expDateTimestamp
}

module.exports = {
    getExpDate : getExpDate
}