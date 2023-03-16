const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

async function grantAdminRole(email){
    //Fetches the user. 
    const user = await admin.auth().getUserByEmail(email);

    //Checks if the user is already admin.
    if (user.customClaims && user.customClaims.admin === true){
        return {
            status:`The user ${email} is already an admin.`
        };
    }
    
    //Sets the user's custom claim admin property to true.
    admin.auth().setCustomUserClaims(user.uid, {
        admin:true
    })
    addAdminEntry(email);
    return {
        status:`Succesfully addeed ${email} as admin.`
    }
}

//Adds the admin associated with the email to a collection for keeping track of all admins.
async function addAdminEntry(email){
    db.collection("admins").add({
        email:email
    })
}

exports.addAdmin = functions.region("europe-central2").https.onCall((data, context) => {
    //Checks if the authenticated token has admin role.
    if (!context.auth || !context.auth.token.admin){
        functions.logger.log("Request not authorized. ")
        return {
            data:data,
            error: "Request not authorized. User must be admin to fulfill request asdfasdfasdf. "
        }
    }
    
    //Grants the user with the email admin role.
    const email = data.email;
    return grantAdminRole(email).then((result) => {
        return{
            result: result.status
        }
    })

})


/**
 * exports.addAdmin = functions.region("europe-central2").https.onCall((data, context) => {
    //removed token.admin
    if(!context.auth.token){
        return{
            error: "Request not authorized. Good luck next time"
        }
    }

    const email = data.email;
    return admin.auth().getUserByEmail(email).then((user) => {
        return admin.auth().setCustomUserClaims(user.uid, {
            admin: true
        }); 
    }).then(() => {
        return {
            message: `Successfully added ${email} as admin`
        }
    }).catch((error) => {
        return {
            context: context,
            data: data,
            email: email,
            error: error
        }
    })
})


 */
