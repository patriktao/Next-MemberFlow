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
import LoadingButton from "../../ui_components/LoadingSubmitButton";
import { updateRequest } from "../../../pages/api/requestAPI/requestAPI";
import DeleteRowPopover from "../../ui_components/DeleteRowPopover";
import { Row } from "@tanstack/react-table";
import { defaultToastProps } from "../../../utils";
import { editRequestHook } from "../../../hooks/RequestHooks";

interface Props {
  onClose: Function;
  handleDelete: Function;
  row: Row<DocumentData>;
  isDeleting: boolean;
}

export interface State {
  email: string;
  name: string;
  ssn: string;
  gender: string;
  afMember: string;
  payMethod: string;
  period: string;
  hasPaid: string;
  regDate: Timestamp;
  requestId: string;
}

export type Action =
  | { type: "email"; input: string }
  | { type: "name"; input: string }
  | { type: "ssn"; input: string }
  | { type: "gender"; input: string }
  | { type: "afMember"; input: string }
  | { type: "payMethod"; input: string }
  | { type: "hasPaid"; input: string }
  | { type: "period"; input: string }
  | { type: "regDate"; input: Timestamp };

export const reducer = (state: State, action: Action): State => {
  try {
    switch (action.type) {
      case "email":
        return { ...state, email: action.input };
      case "name":
        return { ...state, name: action.input };
      case "gender":
        return { ...state, gender: action.input };
      case "ssn":
        return { ...state, ssn: action.input };
      case "afMember":
        return { ...state, afMember: action.input };
      case "payMethod":
        return { ...state, payMethod: action.input };
      case "period":
        return { ...state, period: action.input };
      case "hasPaid":
        return { ...state, hasPaid: action.input };
      case "regDate":
        return { ...state, regDate: action.input };
      default:
        return state;
    }
  } catch (error) {
    console.error(error);
  }
};

const EditRowForm: React.FC<Props> = ({
  onClose,
  handleDelete,
  row,
  isDeleting,
}: Props) => {
  const data = row.original;
  const [state, dispatch] = useReducer(reducer, {
    email: data.email,
    regDate: data.regDate,
    name: data.name,
    ssn: data.ssn,
    gender: data.gender,
    afMember: data.afMember,
    payMethod: data.payMethod,
    period: data.period,
    hasPaid: data.hasPaid,
    requestId: data.requestId,
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const emailError = data.email === "" || false;
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

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      if (isChanged) {
        editRequestHook({
          setLoading: setLoading,
          row: row,
          onClose: onClose,
          state: state,
          setErrorMessage: setErrorMessage,
        });
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
        <ButtonGroup display="flex" justifyContent="space-between">
          <DeleteRowPopover
            header="Delete request"
            handleDelete={handleDelete}
            isDeleting={isDeleting}
          >
            delete
          </DeleteRowPopover>
          <ButtonGroup>
            <Button variant="outline" onClick={() => onClose()}>
              cancel
            </Button>
            <LoadingButton
              color="teal"
              isDisabled={!isChanged}
              isLoading={isLoading}
            >
              save
            </LoadingButton>
          </ButtonGroup>
        </ButtonGroup>
      </Flex>
    </form>
  );
};

export default EditRowForm;
