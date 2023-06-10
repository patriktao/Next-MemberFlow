const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const adminAPI = require("./adminAPI");
const auxiliary = require("./auxiliary");
const grantAdminRole = adminAPI.grantAdminRole;
const stripAdminRole = adminAPI.stripAdminRole;
const getExpDate = auxiliary.getExpDate;
const documentExists = auxiliary.documentExists;
const db = admin.firestore();

exports.createNewUser = functions.region("europe-central2").firestore.document("/requests/{uid}").onCreate((snap, context) => {
  // context.params for the wildcards .
  const uid = context.params.uid;
  const data = snap.data()
  return admin.auth().createUser({
    uid: uid,
    email: data.email,
    password: data.ssn
  }).then(() => {
    return{
      message: "Succesfully created new user. "
    }
  }).catch((error) => {
    throw new functions.https.HttpsError("cancelled",`Something went wrong when creating new user: ` + error.message);
  })
})

exports.newMemberStatus = functions.region("europe-central2").firestore.document("/members/{uid}/payments/{pid}").onCreate(async (snap, context) => {
    const uid = context.params.uid;
    const data = snap.data()
    const {created, status, amount } = data
  
    if(status === "succeeded"){
      let period = 0;
      if(amount === 5000){
        period = 6;
      }else if (amount === 7000){
        period = 12;    
      }

      const requestExists= await documentExists("/requests/" + uid)
      const memberExists = await documentExists("/members/" + uid)

      if(requestExists){
        return db.doc("/requests/" + uid).get().then((snap) => {
          const expDateTimestamp = getExpDate(snap.data().period)
          const newDoc= db.doc("/members/" + uid)
          return newDoc.update({
              exp_date : expDateTimestamp,
              status: "active",
              ...snap.data()
            }).then(() => {
              updated = true
              db.doc("/requests/" + uid).delete().catch((error) => {
                throw new functions.https.HttpsError("aborted",`Could not remove request document` + error.message);
              }).then(() => {
                return {
                  message: `Succesfully moved the user ${data.email} from request to members collection`
                }
              })
            }).catch((error) => {
            throw new functions.https.HttpsError("aborted",`Could not remove request document, something went wrong`, error.message);
          })
          
        })
      }else if(memberExists){
        return db.doc("/members/" + uid).get().then((snap) => {
          /**
           * exp_date is of type admin.firestore.Timestamp
           */
          const expTime = snap.data().exp_date.toMillis()
          const expDateTimestamp = getExpDate(snap.data().period, expTime)
          db.doc("/members/" + uid).update({
            period: period,
            status: "active",
            exp_date: expDateTimestamp
          }).then(() => {
            return {
              message: `Succesfully updated members (${data.email}) new`
            }
          })
      })
      }else{
        throw new functions.https.HttpsError("not-found", "Could not find the member/request with the given uid. ");
      }
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