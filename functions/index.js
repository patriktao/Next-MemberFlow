const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const adminAPI = require("./adminAPI");
const auxiliary = require("./auxiliary");
const grantAdminRole = adminAPI.grantAdminRole;
const stripAdminRole = adminAPI.stripAdminRole;
const getExpDate = auxiliary.getExpDate;
const db = admin.firestore();

 


exports.newMemberStatus = functions.region("europe-central2").firestore.document("/members/{uid}/payments/{pid}").onCreate((snap, context) => {
    const uid = context.params.uid;
    const data = snap.data()
    //created is the time in seconds since Unix epoch
    const {created, status, amount } = data
  
    if(status === "succeeded"){
      let period = 0;
      if(amount === 5000){
        period = 6;
      }else if (amount === 7000){
        period = 12;    
      }

      //Flytta medlemmen från request till members när personen har betalat.
      db.doc("/request/" + uid).get().then((snap) => {
        if(snap.exists){
          const expDateTimestamp = getExpDate(snap)
          const newDoc= db.doc("/members/" + uid)
          newDoc.create(data).then(() => {
            newDoc.update({
              exp_date : expDateTimestamp,
              status: "active"
            }).then(() => {
              return {
                message: `Succesfully moved the user ${data.email} from request to members collection`
              }
            })
            db.doc("/request/" + uid).delete().catch((error) => {
              throw new functions.https.HttpsError("aborted",`Could not remove request document` + error.message);
            })
          })
          throw new functions.https.HttpsError("aborted",`Could not remove request document, something went wrong`);
        }
      })


      //Lägg till kvarvarande tiden om personen redan är medlem. 
      db.doc("/members/" + uid).get().then((snap) => {
        if(snap.exists){
          // Hämta kvarvarande tiden och uppdatera. 
          // returnera om det utfördes. 
          const expDateTimestamp = getExpDate(snap, true)
          db.doc("/members/" + uid).update({
            period: period,
            status: "active",
            exp_date :expDateTimestamp
          }).then(() => {
            return {
              message: `Succesfully updated members (${data.email}) new`
            }
          })
        }
      })

      throw new functions.https.HttpsError("cancelled", "Something went wrong when updating the user membership. ");

    }
  })

exports.addAdmin = functions.region("europe-central2").https.onCall((data, context) => {
    //Checks if the authenticated token has admin role.
    if (!context.auth || !context.auth.token.admin){
        throw new functions.https.HttpsError("permission-denied", "Request not authorized. User must be admin to fulfill request. ");
    }
    
    //Grants the user with the email admin role.
    const email = data.email;
    return grantAdminRole(email).then((status) => {
        return({
            message:status.message
        });
    }).catch((error) => {
        throw error;
        });
    });

exports.removeAdmin = functions.region("europe-central2").https.onCall((data, context) => {
    //Checks if the authenticated token has admin role.
    if (!context.auth || !context.auth.token.admin){
        throw new functions.https.HttpsError("permission-denied", "Request not authorized. User must be admin to fulfill request. ");
    }

    const email = data.email;
    const adminID = data.adminID;
    return stripAdminRole(email, adminID).then((status) => {
        return {
            message: status.message
        }
    }).catch((error) => {
        throw error;
    })
})