import { collection, Timestamp, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { v4 } from "uuid";

const requestCollection = collection(db, "requests");

interface RequestForm {
  email: string;
  name: string;
  ssn: string;
  period: string;
  gender: string;
  afMember: string;
  payMethod: string;
}

export default async function createNewRequest(form: RequestForm) {
  try {
    console.log(form);
    const uid = v4(); //Creates a primary key
    return await setDoc(doc(requestCollection, uid), {
      requestId: uid,
      reg_date: Timestamp.now(),
      name: form.name,
      email: form.email,
      ssn: form.ssn,
      gender: form.gender,
      period: form.period,
      hasPaid: "no",
      payMethod: form.payMethod,
      afMember: form.afMember,
    });
  } catch (error) {
    console.error(error);
  }
}
