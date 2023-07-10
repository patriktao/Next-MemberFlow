import {
  collection,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db, fbFunctions } from "../firebase";
import { v4 } from "uuid";
import { RequestForm } from "../../../interfaces";
import { callWithTimeout } from "../../../utils";
import { httpsCallable } from "firebase/functions";

const requestCollection = collection(db, "requests");

export async function createUser(uid: string, email: string, password: string) {
  const createUser = httpsCallable(fbFunctions, "createUser");
  console.log("requestAPI uid: ", uid);
  return createUser({ email: email, uid: uid, password: password });
}

export async function createNewRequest(form: RequestForm): Promise<void> {
  try {
    const uid = v4();
    const sliced_uid = uid.slice(0,10)
    const createForm: RequestForm = {
      requestId: sliced_uid,
      regDate: form.regDate,
      name: form.name,
      email: form.email,
      ssn: form.ssn,
      gender: form.gender,
      period: form.period,
      hasPaid: form.hasPaid,
      payMethod: form.payMethod,
      afMember: form.afMember,
    };
    const createAttempt = setDoc(doc(requestCollection, sliced_uid), createForm);
   //const createUserAttempt = createUser(uid, form.email, form.ssn);
    await callWithTimeout(createAttempt, 3000, "Create request timed out");
    /* await callWithTimeout(
      createUserAttempt,
      5000,
      "Create user request timed out"
    ); */
  } catch (error) {
    console.log(error);
    throw Error("could not create new request.");
  }
}

export async function deleteRequest(requestId: string): Promise<void> {
  let deleteAttempt = deleteDoc(doc(requestCollection, requestId));
  await callWithTimeout(deleteAttempt, 6000, "Delete request timed out");
}

export async function updateRequest(form: RequestForm): Promise<void> {
  try {
    console.log(form);
    const updateForm = {
      name: form.name,
      email: form.email,
      ssn: form.ssn,
      gender: form.gender,
      period: form.period,
      hasPaid: form.hasPaid,
      payMethod: form.payMethod,
      afMember: form.afMember,
      regDate: form.regDate,
    };
    let updateAttempt = updateDoc(
      doc(requestCollection, form.requestId),
      updateForm
    );
    await callWithTimeout(updateAttempt, 3000, "Update request timed out");
  } catch (error) {
    console.error(error);
    throw Error("could not update request.");
  }
}
