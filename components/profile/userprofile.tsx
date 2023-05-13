import React from "react";
import withAuth from "../auth/withAuth";
import { getAuth, updateEmail, sendEmailVerification, onAuthStateChanged, EmailAuthProvider } from "firebase/auth";
import { Input, Button, Stack, Heading, Select, IconButton, useDisclosure, FormLabel, TagLabel } from "@chakra-ui/react";
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { db } from "../../pages/api/firebase";
import { useState, useEffect } from 'react';
import { EditIcon,  } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'

const userprofile = () => {
  const auth = getAuth();
  const uid = auth.currentUser.uid;
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [ssn, setSSN] = useState(null);
  const [gender, setGender] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  

  
  const [mode, setMode] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  

  async function fetchUserData() {
    const docRef = doc(db, "members", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setName(data.name);
      setEmail(data.email);
      setSSN(data.ssn);
      setGender(data.gender);
      const expDate = data.exp_date?.toDate();
      const oneDay = 24 * 60 * 60 * 1000; // 1 dag i ms
      const daysLeft = Math.round((expDate - Date.now()) / oneDay);
      if(isNaN(expDate)) {
        setDaysLeft("You don't have an active membership, renew it")
      } else {
        setDaysLeft(daysLeft);
      }

    } else {
      throw new Error("User data not found");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


  async function updateUserData() {
    // todo , verification doesnt work correctly
    const user = auth.currentUser;
    const docRef = doc(db, "members", user.uid);
    const userData = {
      name: name,
      gender: gender,
      email: email
    };
  
    if (user.email !== email) {
      try {
        await updateEmail(user, email);
        sendEmailVerification(user);
      } catch (error) {
        console.log(error.message);
      }
    }
  
    await updateDoc(docRef, userData);
  };

  async function updateEmail(user, newEmail) {
    const credential = EmailAuthProvider.credential(
      user.email,
      user.currentPassword
    );
    await user.reauthenticateWithCredential(credential);
    await user.updateEmail(newEmail);
  }
  
  


   
  
  
  
  const handleCancel = () => {
    setMode(false);
    // todo defaultvalue doesnt rerender
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    onOpen();
    await updateUserData();
    console.log(name);
  };
  
  

  const handleMembership = () => {

  }
       
  return (
    <form onSubmit={handleSubmit}>
    <Stack spacing={4}>
      <Heading> Profile </Heading>
      <label> Name: 
      <Input 
        required
        defaultValue={name} 
        disabled ={!mode} 
        onChange={(event) => setName(event!.target!.value)}
      />
      </label>
      <label> Email:
      <Input 
        required
        defaultValue={email} 
        disabled ={!mode} 
        onChange={(event) => setEmail(event!.target!.value)}
      />
      </label>
      <label> SSN:
      <Input 
        defaultValue={ssn} 
        disabled
      />
      </label>
      <label> Gender:
      <Select 
        placeholder={gender} 
        disabled ={!mode} 
        onChange={(event) => setGender(event!.target!.value)}
      />
      </label>
      <label> Membership days left:
      <Input 
        defaultValue={daysLeft} 
        disabled
      />
      </label>  
      <Button onClick={handleMembership}>Renew your membership</Button>  
      <div style={{ display: "flex", justifyContent: "flex-end"}}>
        {mode ? (
          <>
            <Button type="submit" colorScheme='blue' mr={3}>Save</Button>
            <Modal onClose={onClose} isOpen={isOpen} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Verification</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  Verify your new email adress
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose}>Close</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
            <Button onClick={handleCancel} color="red">Cancel</Button>             
          </>       
        ) : (
          <IconButton onClick={() => setMode(true)}  icon={<EditIcon />} aria-label="Edit"/>
        )}
      </div>      
    </Stack>
   
    </form>
  )
};
export default withAuth(userprofile);
