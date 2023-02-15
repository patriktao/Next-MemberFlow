import {
  collection,
  Timestamp,
  setDoc,
  doc,
  deleteDoc,
  DocumentData,
  onSnapshot,
} from "firebase/firestore";
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

export async function fetchRequests(
  prevData: React.MutableRefObject<DocumentData[]>
) {
  try {
    let requests = prevData.current.map((x) => x);
    await onSnapshot(collection(db, "requests"), (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const personData = change.doc.data();
        const personId = personData.requestId;
        switch (change.type) {
          case "added":
            if (
              !requests.find(
                (member: DocumentData) => member.requestId === personId
              )
            ) {
              requests.push(personData);
            }
            break;
          case "removed":
            requests = requests.filter(
              (member: DocumentData) => member.requestId !== personId
            );
            break;
          case "modified":
            requests = requests.filter(
              (member: DocumentData) => member.requestId !== personId
            );
            requests.push(personData);
            break;
          default:
            break;
        }
      });
    });
    return requests;
  } catch (error) {
    console.error(error);
  }
}

export async function createNewRequest(form: RequestForm) {
  try {
    console.log(form);
    const uid = v4();
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

export async function deleteRequest(requestId: string) {
  try {
    return await deleteDoc(doc(requestCollection, requestId));
  } catch (error) {
    console.error(error);
  }
}
