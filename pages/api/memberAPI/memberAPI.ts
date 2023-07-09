import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import moment from "moment";
import { calculateNextDate } from "../../../utils/date-utils";
import { v4 } from "uuid";
import { db } from "../firebase";
import { MemberForm } from "../../../interfaces";
import { callWithTimeout } from "../../../utils";

const memberCollection = collection(db, "members");

//@Does not require regdate
export async function addExistingMember(form) {
  try {
    /* Create primary key */
    const uid = v4();
    const sliced_uid = uid.slice(0, 10);
    /* Registration Date */
    const regDate = form.reg_date;
    /* Calculate expiration date using Moment */
    const exp = calculateNextDate(
      moment(regDate.toDate()),
      parseInt(form.period)
    );
    /* Convert to Timestamp object for Firebase */
    const expDate = Timestamp.fromDate(exp.toDate());

    /* Create Form */
    const memberForm: MemberForm = {
      memberId: sliced_uid,
      name: form.name,
      email: form.email,
      period: form.period,
      gender: form.gender,
      reg_date: regDate,
      exp_date: expDate,
      ssn: form.ssn,
      status: "active",
    };
    console.log(memberForm);

    return await setDoc(doc(memberCollection, sliced_uid), memberForm).catch(
      (error) => console.error(error)
    );
  } catch (error) {
    console.log(error);
  }
}

// @Requires reg date
export async function createMember(form) {
  try {
    /* Create primary key */
    const uid = v4();
    const sliced_uid = uid.slice(0, 10);
    /* Registration Date */
    const regDate = Timestamp.now();
    /* Calculate expiration date using Moment */
    const exp = calculateNextDate(
      moment(regDate.toDate()),
      parseInt(form.period)
    );
    /* Convert to Timestamp object for Firebase */
    const expDate = Timestamp.fromDate(exp.toDate());

    /* Create Form */
    const memberForm: MemberForm = {
      memberId: sliced_uid,
      name: form.name,
      email: form.email,
      period: form.period,
      gender: form.gender,
      reg_date: regDate,
      exp_date: expDate,
      ssn: form.ssn,
      status: "active",
    };
    console.log(memberForm);

    return await setDoc(doc(memberCollection, sliced_uid), memberForm).catch(
      (error) => console.error(error)
    );
  } catch (error) {
    console.log(error);
  }
}

export async function deleteMember(memberId: string): Promise<void> {
  let deleteAttempt = deleteDoc(doc(memberCollection, memberId));
  await callWithTimeout(deleteAttempt, 6000, "Delete member timed out");
}
