const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const adminAPI = require("./adminAPI");
const grantAdminRole = adminAPI.grantAdminRole;
const stripAdminRole = adminAPI.stripAdminRole;


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