import {
  collection,
  setDoc,
  doc,
  deleteDoc,
  DocumentData,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { v4 } from "uuid";
import { RequestForm } from "../../../interfaces";

const requestCollection = collection(db, "requests");


/* NOT USED RN */
export function fetchRequests(
  prevData: React.MutableRefObject<DocumentData[]>
): Promise<DocumentData[]> {
  return new Promise((resolve, reject) => {
    try {
      onSnapshot(collection(db, "requests"), (snapshot) => {
        let requests = prevData.current.map((x) => x);
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
        resolve(requests);
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function createNewRequest(form: RequestForm): Promise<void> {
  try {
    console.log(form);
    const uid = v4();
    return new Promise((resolve) => {
      setDoc(doc(requestCollection, uid), {
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
      resolve();
    });
  } catch (error) {
    console.error(error);
    throw Error("could not create new request.");
  }
}

export async function deleteRequest(requestId: string): Promise<void> {
  try {
    return await deleteDoc(doc(requestCollection, requestId));
  } catch (error) {
    console.error(error);
    throw Error("could not delete requests.");
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
    throw Error("could not update request.");
  }
}
