import { AuthModalState } from '@/src/atoms/authModalAtom';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';
import React,{useEffect} from 'react';
import {useRecoilState} from "recoil";
import { Flex ,Text} from '@chakra-ui/react';
import AuthInputs from './AuthInputs';
import OAuthButtons from './OAuthButtons';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from "../../../firebase/clientApp";
import ResetPass from "./ResetPass";

const AuthModal:React.FC= () => {
    const [modalState,setModalState]=useRecoilState(AuthModalState)
    const handleClose=()=>{
        setModalState((prev)=>({
            ...prev,
            open:false,
        }))
    }
    const [user,loading,error]=useAuthState(auth);

    useEffect(() => {
      if(user) handleClose();
    }, [user])
    

    return (
    <>

      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalState.view==="login" && "Login"}
            {modalState.view==="signup" && "Signup"}
            {modalState.view==="resetPassword" && "Reset Password"}
        </ModalHeader>
            <ModalCloseButton />
            <ModalBody 
                display="flex" 
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Flex 
                    direction="column" 
                    align="center" 
                    justifyContent="center"
                    width="70%"
                >
                    {modalState.view==="login" ||modalState.view=="signup" ?(
                      <>
                        <OAuthButtons/>
                        <Text color="gray.900">OR</Text>
                        <AuthInputs/>
                      </>
                    ): <ResetPass/>} 
                    
                </Flex>
            </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
};
export default AuthModal;
