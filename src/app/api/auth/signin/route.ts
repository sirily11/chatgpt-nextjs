import { getAdmin } from '@/api/firebase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  // search for admin
  const admin = getAdmin();
  // check if the user exists
  const user = await admin.firestore().collection('users').doc(username!).get();
  if (!user.exists) {
    return NextResponse.json(
      { message: 'User does not exist' },
      { status: 400 }
    );
  }
  const credential = user.data()?.credential;
  return NextResponse.json({
    id: credential.id
  });
}
