import { useState } from "react";
import { seventy, fifty, stripeTestPK } from "./StripeID";
import { userAuth, db } from "../../pages/api/firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { loadStripe } from "@stripe/stripe-js";
import { Select, Stack, Button } from "@chakra-ui/react";

type CheckoutSession = {
  cancel_url?: string;
  client?: string;
  mode?: string;
  price?: string;
  sessionId?: string;
  success_url?: string;
  url?: string;
};

const PaymentButton = () => {
  const [period, setPeriod] = useState(0);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  function setPeriodAndPrice(value: string) {
    switch (value) {
      case "0":
        setPrice(0);
        break;
      case "6":
        setPrice(50);
        break;
      case "12":
        setPrice(70);
        break;
    }
    setPeriod(parseInt(value));
  }

  async function startPayment() {
    setLoading(true);
    let priceID = "";

    if (!userAuth.currentUser) {
      alert("NOT LOGGED IN");
      return;
    }

    price === 50 ? (priceID = fifty) : (priceID = seventy);
    const colRef = collection(
      db,
      "members",
      userAuth.currentUser.uid,
      "checkout_sessions"
    );

    const docRef = await addDoc(colRef, {
      mode: "payment",
      price: priceID,
      success_url: window.location.origin + "/test",
      cancel_url: window.location.origin,
    });

    onSnapshot(docRef, async (snap) => {
      const stripe = await loadStripe(stripeTestPK);

      const data = snap.data() as CheckoutSession;

      const { sessionId } = data;
      if (sessionId) {
        await stripe?.redirectToCheckout({ sessionId });
      }
    });
  }

  return (
    <Stack>
      <Select
        onChange={(e) => setPeriodAndPrice(e.target.value)}
        defaultValue="0"
      >
        <option value="0" disabled hidden>
          Select period
        </option>
        <option value="6">6 Months</option>
        <option value="12">12 Months</option>
      </Select>

      <Button
        isLoading={loading}
        isDisabled={period === 0 || price === 0}
        onClick={startPayment}
      >
        {price === 0 || period === 0 ? (
          <div>Select period</div>
        ) : (
          <div>
            Pay {price}kr for {period} months of membership
          </div>
        )}
      </Button>
    </Stack>
  );
};

export default PaymentButton;
