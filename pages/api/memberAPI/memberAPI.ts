import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import moment from "moment";
import { calculateNextDate } from "../../../utils/date-utils";
import { v4 } from "uuid";
import { db } from "../firebase";

const memberCollection = collection(db, "members");

export async function createMember(props) {
  try {
    /* Create primary key */
    const uid = v4();
    /* Registration Date */
    const reg_date = Timestamp.now();
    /* Calculate expiration date using Moment */
    const next_date = calculateNextDate(
      moment(reg_date.toDate()),
      parseInt(props.period)
    );
    /* Convert to Timestamp object for Firebase */
    const exp_date = Timestamp.fromDate(next_date.toDate());

    return await setDoc(doc(memberCollection, uid), {});
  } catch (error) {
    console.log(error);
  }
}
