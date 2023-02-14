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
import { useState } from "react";
import createNewRequest from "../../pages/api/requestAPI/requestAPI";
import InputEmail from "../ui_components/InputEmail";
import LoadingButton from "../ui_components/LoadingButton";
import displayToast from "../ui_components/Toast";
import Info from "./DataInfo";

const AddRequestForm = ({ onCancel }) => {
  /* State Management */
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const requestForm = {
      email: email,
      name: name,
      ssn: birthDate + "-" + lastFour,
      gender: gender,
      afMember: afMember,
      payMethod: payMethod,
      period: period,
    };
    setTimeout(() => {
      createNewRequest(requestForm)
        .then(() => {
          console.log("Created a new request.");
          displayToast({
            toast: toast,
            title: "Successfully added a new request.",
            status: "success",
          });
          onCancel();
          resetForm();
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }, 3000);
  };

  /* Components */
  const DataModal = (
    <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Storing of your information!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{Info}</ModalBody>
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
          setEmail={setEmail}
          setErrorMessage={setErrorMessage}
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
              <Radio value="swish">Swish</Radio>
              <Radio value="swipe">Swipe</Radio>
              <Radio value="card">Card</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Membership Period</FormLabel>
          <RadioGroup value={period} onChange={(value) => setPeriod(value)}>
            <Stack direction="row">
              <Radio value="6">6 Months (50 kr)</Radio>
              <Radio value="12">12 Months (70 kr)</Radio>
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
          <Button variant="outline" onClick={onCancel}>
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
