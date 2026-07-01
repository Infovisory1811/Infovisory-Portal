import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "micro-shuttle-8fbwx",
  appId: "1:834775250046:web:dc267517e7162cebeed42f",
  apiKey: "AIzaSyAkmC4j6ist5jn1mQatmgHLDL8x9sXcKwA",
  authDomain: "micro-shuttle-8fbwx.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-a031baed-6396-4854-9d77-fe142bbd69b9",
  storageBucket: "micro-shuttle-8fbwx.firebasestorage.app",
  messagingSenderId: "834775250046",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
