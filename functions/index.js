const functions = require("firebase-functions");
const auth = require("firebase/auth")
const admin = require("firebase-admin");
admin.initializeApp();
const adminAPI = require("./adminAPI");
const grantAdminRole = adminAPI.grantAdminRole;
const stripAdminRole = adminAPI.stripAdminRole;

//Creates an user without a password. The user get's to choose a password via link sent to email. 
exports.createUser = functions.region("europe-central2").https.onCall((data, context) => {
    if (!context.auth){
        throw new functions.https.HttpsError("permission-denied", "Request not authorized. User not authorized.")
    }

    console.log(data.uid)

    return admin.auth().createUser({
        email: data.email,
        uid: data.uid,
        password: data.password
    }).then((userRecord) => {
        return {
            message: "Successfully created new user: " + userRecord.uid
        }
    })
    .catch((error) => {
        throw new functions.https.HttpsError("Could not create a user: " + error.message);
    })
    
});

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