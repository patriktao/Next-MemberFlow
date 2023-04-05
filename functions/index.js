const v4 = require("uuid");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

/**
 * Add a document with the id of "email" to the "admins" collection in firestore.
 * 
 * @param {string} email 
 */
async function addAdminEntry(email){
    const uid = v4.v4();
    return db.doc("/admins/" + uid).create({
        email : email,
        adminID : uid
    })
}

/**
 * Remove the document with the id of the parameter "email" in the "admins" collection. 
 * 
 * @param {string} email 
 */
async function removeAdminEntry(adminID){
    return db.doc("/admins/" + adminID).delete();
}


/**
 * Grant the user with the given email admin role.
 * 
 * @param {string} email 
 * @returns {object} with status message and if operation was succesful or not. 
 */
async function grantAdminRole(email){
    //Fetches the user. 
    let user = null;
    try{
        user = await admin.auth().getUserByEmail(email);
    }catch(e){
        throw new functions.https.HttpsError("unauthenticated", `The user ${email} is not an user.`);
    }
    
    if(!user){
        throw new functions.https.HttpsError("cancelled", `ERROR`);
    }

    //Checks if the user is already admin.
    if (user.customClaims && user.customClaims.admin === true){
        throw new functions.https.HttpsError("already-exists", `The user ${email} is already an admin.`);
    }else{
        //Sets the user's custom claim admin property to true.
        admin.auth().setCustomUserClaims(user.uid, {
            admin:true
        })
        return addAdminEntry(email).then(()  => {
            return {
                message:`Succesfully addeed ${email} as admin.`,
            }
        }).catch(() => {
            throw new functions.https.HttpsError("aborted",`Something went wrong. Could not add ${email} as admin.`);
        })
    }
}


/**
 * Removes the admin role for the user with the given email.
 * 
 * @param {string} adminID 
 * @returns {object} with status message and if operation was succesful or not. 
 */
async function stripAdminRole(email, adminID){
    const user = await admin.auth().getUserByEmail(email);

    //Checks if the user is already admin.
    if (user.customClaims && user.customClaims.admin === true){
        admin.auth().setCustomUserClaims(user.uid, {
            admin:false
        })
        return removeAdminEntry(adminID).then(() => {
            return {
                message:`${email} has been stripped of admin role.`,
            };
        }).catch(() => {
            throw new functions.https.HttpsError("aborted",`Something went wrong. Could not strip ${email} of admin role.`);
        })
        
    }else{
        throw new functions.https.HttpsError("not-found", `The user ${email} is not an admin.`);
    }
}

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