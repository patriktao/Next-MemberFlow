import { Button, ButtonGroup, Flex, Grid, useToast } from "@chakra-ui/react";
import { DocumentData, Timestamp } from "firebase/firestore";
import { isEqual } from "lodash";
import { ChangeEvent, useCallback, useReducer, useState } from "react";
import { getTimestamp } from "../../../utils/date-utils";
import { membershipPeriods, paymentMethods } from "../../../types";
import Datepicker from "../../ui_components/Datepicker";
import Input from "../../ui_components/Input";
import InputEmail from "../../ui_components/InputEmail";
import Select from "../../ui_components/Select";
import { reducer } from "./EditRowReducer";
import LoadingButton from "../../ui_components/LoadingButton";
import { updateRequest } from "../../../pages/api/requestAPI/requestAPI";
import displayToast from "../../ui_components/Toast";

interface Props {
  row: DocumentData;
  onClose: Function;
}

const EditRowForm: React.FC<Props> = ({ row, onClose }: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    email: row.email,
    regDate: row.regDate,
    name: row.name,
    ssn: row.ssn,
    gender: row.gender,
    afMember: row.afMember,
    payMethod: row.payMethod,
    period: row.period,
    hasPaid: row.hasPaid,
    requestId: row.requestId,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const emailError = row.email === "" || false;
  const isChanged = !isEqual(state, row);

  const handleChange: Function = useCallback(
    (e): void => {
      try {
        const { name, value } = e.target;
        dispatch({ type: name, input: value });
      } catch (error) {
        console.error(error);
      }
    },
    [state]
  );

  const toast = useToast();

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      if (isChanged) {
        setLoading(true);
        await updateRequest(state)
          .then(() => {
            console.log("Edited request");
            displayToast({
              toast: toast,
              title: "Successfully edit the request.",
              status: "success",
              position: "right-top",
            });
            row = state;
            onClose();
          })
          .catch((error) => {
            setErrorMessage(error.message);
            displayToast({
              toast: toast,
              title: "Error editing the request.",
              description: error.message,
              status: "error",
            });
          });
        setLoading(false);
      }
    },
    [state]
  );

  const setDate = (date: Date) => {
    dispatch({ type: "regDate", input: Timestamp.fromDate(date) });
  };

  return (
    <form onSubmit={(e) => handleSave(e)}>
      <Flex flexDirection="column" rowGap={"1rem"} paddingBottom="1rem">
        <Grid templateColumns={"1fr 1fr"} gap={"1rem"}>
          <Input
            label="Full Name"
            value={state.name}
            name="name"
            placeholder="Type full name"
            isRequired
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange(e);
              setErrorMessage("");
            }}
          />
          <InputEmail
            value={state.email}
            setEmail={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange(e);
              setErrorMessage("");
            }}
            errorMessage={errorMessage}
            emailError={emailError}
          />
        </Grid>
        <Datepicker
          name="regDate"
          label="Registration Date"
          onChange={(value) => setDate(value)}
          date={getTimestamp(state.regDate)}
        />
        <Grid templateColumns={"1fr 1fr 1fr"} gap={6}>
          <Input
            label="SSN (YYYYMMDD-XXXX)"
            name="ssn"
            value={state.ssn}
            type="alphanumeric"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              handleChange(e);
            }}
            maxLength={13}
          />
          <Select
            name="gender"
            value={state.gender}
            label="Gender"
            onChange={handleChange}
          >
            <option key="1" value="male">
              male
            </option>
            <option key="2" value="female">
              female
            </option>
            <option key="3" value="other">
              other
            </option>
          </Select>
          <Select
            name="afMember"
            value={state.afMember}
            label="AF Member?"
            onChange={handleChange}
          >
            <option key="1" value="yes">
              yes
            </option>
            <option key="2" value="no">
              no
            </option>
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
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select
            label="Period (months)"
            name="period"
            value={state.period}
            onChange={handleChange}
          >
            {membershipPeriods.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select
            label="Has Paid?"
            name="hasPaid"
            value={state.hasPaid}
            onChange={handleChange}
          >
            <option key="1" value={"yes"}>
              {"yes"}
            </option>
            <option key="2" value={"no"}>
              {"no"}
            </option>
          </Select>
        </Grid>
        <ButtonGroup display="flex" justifyContent="flex-end">
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <LoadingButton
            color="teal"
            isDisabled={!isChanged}
            isLoading={isLoading}
          >
            Save
          </LoadingButton>
        </ButtonGroup>
      </Flex>
    </form>
  );
};

export default EditRowForm;
