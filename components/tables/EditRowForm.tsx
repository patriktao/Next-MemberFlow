import { Flex, Grid, Text } from "@chakra-ui/react";
import { DocumentData } from "firebase/firestore";
import { isEqual } from "lodash";
import { useState, useCallback, useReducer } from "react";
import { getTimestamp } from "../../utils/date-utils";
import { membershipPeriods, paymentMethods } from "../../utils/payment-methods";
import Datepicker from "../ui_components/Datepicker";
import FormModal from "../ui_components/FormModal";
import Input from "../ui_components/Input";
import InputEmail from "../ui_components/InputEmail";
import Select from "../ui_components/Select";
import { reducer, State } from "./EditRowHooks";

interface Props {
  row: DocumentData;
  onSave: Function;
  onClose: Function;
}

const EditRowForm: React.FC<Props> = (props: Props) => {
  const prevRow = props.row;
  console.log(prevRow);

  const initialState: State = {
    email: prevRow.email,
    regDate: prevRow.regDate,
    name: prevRow.name,
    ssn: prevRow.ssn,
    gender: prevRow.gender,
    afMember: prevRow.afMember,
    payMethod: prevRow.payMethod,
    period: prevRow.period,
    hasPaid: prevRow.hasPaid,
    errorMessage: prevRow.errorMessage,
    isLoading: prevRow.isLoading,
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  const emailError = prevRow.email === "" || false;

  const handleChange: Function = useCallback(
    (e): void => {
      try {
        console.log(e.target.name);
        dispatch({ type: e.target.name, input: e.target.value });
        console.log(state);
      } catch (error) {
        console.error(error);
      }
    },
    [state]
  );

  const handleSubmit: Function = useCallback(
    (e): void => {
      try {
        e.preventDefault();
        console.log(state);
        console.log(prevRow);
      } catch (error) {
        console.error(error);
      }
    },
    [props.onSave]
  );

  return (
    <FormModal
      isOpen={true}
      onClose={() => props.onClose()}
      onSave={() => props.onSave()}
      title={"Edit Request"}
      size="3xl"
    >
      <form>
        <Flex flexDirection="column" rowGap={"1rem"}>
          <Grid templateColumns={"1fr 1fr"} gap={"1rem"}>
            <Input
              label="Full Name"
              value={state.name}
              name="name"
              placeholder="Type full name"
              isRequired={true}
              onChange={handleChange}
            />
            <InputEmail
              value={state.email}
              setEmail={handleChange}
              errorMessage={state.errorMessage}
              setErrorMessage={handleChange}
              emailError={emailError}
            />
          </Grid>
          <Datepicker
            label="Registration Date"
            date={getTimestamp(state.regDate)}
            onChange={(e) => console.log(e)}
          />
          <Grid templateColumns={"1fr 1fr 1fr"} gap={6}>
            <Input
              label="SSN (YYYYMMDD-XXXX)"
              name="ssn"
              value={state.ssn}
              type="alphanumeric"
              onChange={handleChange}
            />
            <Select
              name="gender"
              value={state.gender}
              label="Gender"
              onChange={handleChange}
            >
              <option value="male">male</option>
              <option value="female">female</option>
              <option value="other">other</option>
            </Select>
            <Select
              name="afMember"
              value={state.afMember}
              label="AF Member?"
              onChange={handleChange}
            >
              <option value="yes">yes</option>
              <option value="no">no</option>
            </Select>
          </Grid>
          <Grid templateColumns={"1fr 1fr 1fr"} gap={6}>
            <Select
              label="Payment Method"
              name="payMethod"
              value={state.payMethod}
              onChange={handleChange}
            >
              {paymentMethods.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </Select>
            <Select
              label="Period (months)"
              name="period"
              value={state.period}
              onChange={handleChange}
            >
              {membershipPeriods.map((item) => (
                <option value={item}>{item}</option>
              ))}
            </Select>
            <Select
              label="Has Paid?"
              name="hasPaid"
              value={state.hasPaid}
              onChange={handleChange}
            >
              <option value={"yes"}>{"yes"}</option>
              <option value={"no"}>{"no"}</option>
            </Select>
          </Grid>
        </Flex>
      </form>
    </FormModal>
  );
};

export default EditRowForm;
