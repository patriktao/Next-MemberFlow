import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  ButtonGroup,
  Button,
  Flex,
  HStack,
  PinInput,
  PinInputField,
  Radio,
  RadioGroup,
  Checkbox,
  Grid,
  Link,
  Modal,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  useDisclosure,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Timestamp } from "firebase/firestore";
import { useState } from "react";
import { createNewRequest } from "../../../pages/api/requestAPI/requestAPI";
import {
  membershipPeriods,
  paymentMethods,
} from "../../../utils/payment-methods";
import InputEmail from "../../ui_components/InputEmail";
import LoadingButton from "../../ui_components/LoadingButton";
import displayToast from "../../ui_components/Toast";
import GDPR from "./GDPR/GDPR";
import { createUser } from "../../../pages/api/requestAPI/requestAPI";
import { v4 } from "uuid";

interface Props {
  onCancel: Function;
}

const AddRequestForm: React.FC<Props> = (props: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [lastFour, setLastFour] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [afMember, setAfMember] = useState<string>("");
  const [payMethod, setPayMethod] = useState<string>("");
  const [period, setPeriod] = useState<string>("");
  const [readInfo, setReadInfo] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);

  /* Conditions */
  const emailError = email === "";

  const isFilled =
    email !== "" &&
    name !== "" &&
    birthDate.length === 8 &&
    lastFour.length === 4 &&
    gender !== "" &&
    afMember !== "" &&
    payMethod !== "" &&
    period !== "" &&
    readInfo === true;

  /* Functions */
  const toast = useToast();

  const resetForm = () => {
    setEmail("");
    setName("");
    setErrorMessage("");
    setBirthDate("");
    setLastFour("");
    setGender("");
    setAfMember("");
    setPayMethod("");
    setPeriod("");
    setReadInfo(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const uid = v4();
    const requestForm = {
      email: email,
      name: name,
      ssn: birthDate + "-" + lastFour,
      gender: gender,
      afMember: afMember,
      payMethod: payMethod,
      period: period,
      regDate: Timestamp.now(),
      hasPaid: "no",
      uid: uid,
    };

    await createNewRequest(requestForm).then(() => {
      createUser(requestForm.uid, requestForm.email, requestForm.ssn)
        .then(() => {
          console.log("RequestForm uid: ", requestForm.uid);
          displayToast({
            toast: toast,
            title: "Successfully added a new request.",
            status: "success",
            position: "right-top",
          });
          props.onCancel();
          resetForm();
        })
        .catch((error) => {
          setErrorMessage(error.message);
          displayToast({
            toast: toast,
            title: "Error adding a new request.",
            description: error.message,
            status: "error",
          });
        });
    });
    setLoading(false);
  };

  /* Components */
  const DataModal = (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Storing of your information!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{GDPR}</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  /* Render */
  return (
    <Grid padding="8px">
      <form
        style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}
        onSubmit={handleSubmit}
      >
        <FormControl isInvalid={Boolean(errorMessage)}>
          <FormLabel>Full name</FormLabel>
          <Input
            placeholder="Type full name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            isRequired
          />
        </FormControl>
        <InputEmail
          errorMessage={errorMessage}
          setEmail={(e) => {
            setEmail(e.target.value);
            setErrorMessage("");
          }}
          emailError={emailError}
          value={email}
        />
        <FormControl>
          <FormLabel>
            SSN (YYYYMMDD-XXXX) <Text as="i">e.g., 20230101-1234</Text>
          </FormLabel>
          <Flex>
            <HStack>
              <PinInput
                size="sm"
                type="number"
                value={birthDate}
                onChange={(value) => setBirthDate(value)}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
            -
            <HStack>
              <PinInput
                size="sm"
                placeholder="X"
                type="alphanumeric"
                value={lastFour}
                onChange={(value) => setLastFour(value)}
              >
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </Flex>
        </FormControl>
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup value={gender} onChange={(value) => setGender(value)}>
            <Stack direction="row">
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Are you a member of AF?</FormLabel>
          <Text as="i">
            {" "}
            You must be a member of AF (Akademiska Föreningen) in order to
            become an EASA member. If you are a Studentlund member you are
            automatically an AF member.
          </Text>
          <RadioGroup value={afMember} onChange={(value) => setAfMember(value)}>
            <Stack direction="row">
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Payment Method</FormLabel>
          <RadioGroup
            value={payMethod}
            onChange={(value) => setPayMethod(value)}
          >
            <Stack direction="row">
              {paymentMethods.map((item) => (
                <Radio value={item}>{item}</Radio>
              ))}
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Membership Period (months)</FormLabel>
          <RadioGroup value={period} onChange={(value) => setPeriod(value)}>
            <Stack direction="row">
              {membershipPeriods.map((item) => (
                <Radio value={item}>{item}</Radio>
              ))}
            </Stack>
          </RadioGroup>
        </FormControl>
        <Checkbox
          isRequired
          isChecked={readInfo}
          onChange={() => setReadInfo(!readInfo)}
        >
          Do you agree of the storing of your information?{" "}
          <Link onClick={onOpen}>Click here</Link> for more info
        </Checkbox>
        {DataModal}
        <ButtonGroup display="flex" justifyContent="flex-end">
          <Button variant="outline" onClick={() => props.onCancel()}>
            Cancel
          </Button>
          <LoadingButton
            color="teal"
            isLoading={isLoading}
            isDisabled={!isFilled}
          >
            Save
          </LoadingButton>
        </ButtonGroup>
      </form>
    </Grid>
  );
};

export default AddRequestForm;
