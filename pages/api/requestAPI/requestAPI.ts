import {
  collection,
  Timestamp,
  setDoc,
  doc,
  deleteDoc,
  DocumentData,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 } from "uuid";

const requestCollection = collection(db, "requests");

interface RequestForm {
  requestId?: string;
  email: string;
  name: string;
  ssn: string;
  period: string;
  gender: string;
  afMember: string;
  payMethod: string;
  regDate: Timestamp;
  hasPaid: string;
}

export async function fetchRequests(
  prevData: React.MutableRefObject<DocumentData[]>
): Promise<DocumentData[]> {
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

export async function createNewRequest(form: RequestForm): Promise<void> {
  try {
    console.log(form);
    const uid = v4();
    return await setDoc(doc(requestCollection, uid), {
      requestId: uid,
      regDate: form.regDate,
      name: form.name,
      email: form.email,
      ssn: form.ssn,
      gender: form.gender,
      period: form.period,
      hasPaid: form.hasPaid,
      payMethod: form.payMethod,
      afMember: form.afMember,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function deleteRequest(requestId: string): Promise<void> {
  try {
    return await deleteDoc(doc(requestCollection, requestId));
  } catch (error) {
    console.error(error);
  }
}

export async function updateRequest(form: RequestForm): Promise<void> {
  try {
    return await updateDoc(doc(requestCollection, form.requestId), {
      name: form.name,
      email: form.email,
      ssn: form.ssn,
      gender: form.gender,
      period: form.period,
      hasPaid: form.hasPaid,
      payMethod: form.payMethod,
      afMember: form.afMember,
      regDate: form.regDate,
    });
  } catch (error) {
    console.error(error);
  }
}
