importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

firebase.initializeApp({
  apiKey: "AIzaSyDwkPfOglLaGzGCo-OBFp7r63nxfX-zkRA",
  authDomain: "chatbot-dialogflow-api.firebaseapp.com",
  projectId: "chatbot-dialogflow-api",
  storageBucket: "chatbot-dialogflow-api.appspot.com",
  messagingSenderId: "57495981958",
  appId: "1:57495981958:web:07c0459739ef7bc8aa6607",
  measurementId: "G-D2HW0WTDVB",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});