import { collection, where } from "@firebase/firestore";
import { doc, DocumentData, getDoc, getDocs, query } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, fbFunctions } from "../firebase";

const adminCollection = collection(db, "admins");

export const addAdmin = (email: string) => {
  try {
    const addAdmin = httpsCallable(fbFunctions, "addAdmin");
    return addAdmin({
      email: email,
    });
  } catch (error) {
    console.error(error);
  }
};

export const getAdmin = async (id): Promise<DocumentData> => {
  try {
    console.log(id);
    const q = query(adminCollection, where("userID", "==", id));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data[0];
  } catch (error) {
    console.error("admin user can't be found with uid");
    console.error(error);
  }
};
