import React from "react";
import withAuth from "../auth/withAuth";
import { getAuth, updateEmail, sendEmailVerification, onAuthStateChanged } from "firebase/auth";
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
  const [period, setPeriod] = useState(null);
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
      setPeriod(data.period);
      const expDate = data.exp_date.toDate();
      const oneDay = 24 * 60 * 60 * 1000; // 1 dag i ms
      const daysLeft = Math.round((expDate - Date.now()) / oneDay);
      setDaysLeft(daysLeft);
      

      
    } else {
      throw new Error("User data not found");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // async function updateUserData() {
  //   const docRef = doc(db, "members", uid);
  //   await updateDoc(docRef,{
  //     "name" : name,
  //     "email" : email,
  //     "gender" : gender,
  //   });
  //   updateEmail(auth.currentUser, email).then(() => {
  //     sendEmailVerification(auth.currentUser).then(() => {
        
  //     });
  //   }).catch((error) => {
  //     throw new Error(error);
  //   });
  // };

  async function updateUserData() {
    const user = auth.currentUser;
    const docRef = doc(db, "members", user.uid);
    const userData = {
      name: name,
      gender: gender,
      email: email
    };
  
    if (user.email !== email) {
      await updateEmail(user, email).then(()=>{
        sendEmailVerification(user).then(() => {
          if(user.emailVerified) {
            updateDoc(docRef, userData);
          } else {
            console.log("NEJ")
          }
        });
      });
    };

    console.log(onAuthStateChanged);
    await updateDoc(docRef, userData);
  };


   
  
  
  
  const handleCancel = () => {
    setMode(false);
    // todo defaultvalue doesnt rerender
  };

  const handleSubmit = (event) => {
    updateUserData();
    event.preventDefault();
    setMode(false);
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
            <Button type="submit" color="green">Save</Button>
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
