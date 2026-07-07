import { auth, db } from "../config/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

// Process core user authentication verification mapping
export const loginUserBackend = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
    return { uid: userCredential.user.uid, email, ...userDoc.data() };
  } catch (error) {
    console.error("Backend Error - loginUserBackend:", error.code);
    throw error;
  }
};

// Execute profile creation and user configuration pipeline
export const registerUserBackend = async (email, password, name, role) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(db, "users"), { uid: userCredential.user.uid, name, role, email });
    return { uid: userCredential.user.uid, email, name, role };
  } catch (error) {
    console.error("Backend Error - registerUserBackend:", error.code);
    throw error;
  }
};

export const logoutUserBackend = async () => {
  return await signOut(auth);
};

export const getDonorsBackend = async () => {
  const querySnapshot = await getDocs(collection(db, "donors"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addDonorBackend = async (donorData) => {
  const docRef = await addDoc(collection(db, "donors"), donorData);
  return { id: docRef.id, ...donorData };
};

export const getRequestsBackend = async () => {
  const querySnapshot = await getDocs(collection(db, "requests"));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addRequestBackend = async (requestData) => {
  const docRef = await addDoc(collection(db, "requests"), requestData);
  return { id: docRef.id, ...requestData };
};

export const updateRequestStatusBackend = async (requestId, newStatus) => {
  const requestRef = doc(db, "requests", requestId);
  await updateDoc(requestRef, { status: newStatus });
  return { id: requestId, status: newStatus };
};

export const deleteDonorBackend = async (donorId) => {
  const donorRef = doc(db, "donors", donorId);
  await deleteDoc(donorRef);
  return donorId;
};