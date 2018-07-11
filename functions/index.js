'use strict'

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.notifySend = functions.database.ref("/user_notifications/{notifyId}").onCreate( (snapshot, context) => {

    const notifyId = context.params.notifyId;

    const deviceToken = admin.database().ref(`/user_notifications/${notifyId}/device_fcm`).once('value');
    const msgTitle = admin.database().ref(`/user_notifications/${notifyId}/msg_title`).once('value');
    const msgText = admin.database().ref(`/user_notifications/${notifyId}/msg_text`).once('value');
    const badge = admin.database().ref(`/user_notifications/${notifyId}/badge`).once('value');

    return Promise.all([deviceToken]).then(result => {

        const deviceFcm = result[0].val();

        return Promise.all([msgTitle]).then(result => {

            const messageTitle = result[0].val();

            return Promise.all([msgText]).then(result => {

                const messageText = result[0].val();

                return Promise.all([badge]).then(result => {

                    const badgeNumber = result[0].val();
    
                    const payload = {
                        notification: {
                            title : `${messageTitle}`,
                            body: `${messageText}`,
                            sound: "default",
                            badge: `${badgeNumber}`
                        }
                    };
    
                    return admin.messaging().sendToDevice(deviceFcm, payload).then(response => {
                        console.log('This was the notification Feature');
                    });
                });
            });
        });
    });
});
