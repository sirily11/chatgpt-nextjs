import { getAdmin } from '@/api/firebase';
import { getKey } from '@/service/firebase/webauthn/kv.utils';
import { server } from '@passwordless-id/webauthn';
import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const registration = await request.json();
  const key = getKey('registration', registration.username);
  if (!kv.exists(key)) {
    return NextResponse.json(
      { error: 'No registration session found' },
      { status: 400 }
    );
  }

  const session = (await kv.get(key)) as any;
  await server.verifyRegistration(registration, {
    challenge: session.challenge,
    origin: () => true
  });
  // store the credential in the firebase
  const admin = getAdmin();
  // check if the user already exists
  const user = await admin
    .firestore()
    .collection('users')
    .doc(registration.username)
    .get();

  if (user.exists) {
    return NextResponse.json(
      { message: 'User already exists' },
      { status: 400 }
    );
  }

  await admin.firestore().collection('users').doc(registration.username).set({
    credential: registration.credential
  });
  // create a user in the firebase auth
  await admin.auth().createUser({
    uid: registration.credential.id,
    displayName: registration.username
  });
  return NextResponse.json({ id: registration.username });
}
