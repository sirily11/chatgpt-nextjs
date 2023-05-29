import admin from 'firebase-admin';

export const getAdmin = () => {
  // cache the admin instance
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(
        JSON.parse(process.env.FIREBASE_ADMIN_CONFIG!)
      )
    });
  }
  return admin;
};
