import { Button, Flex,Icon,Input,Text } from '@chakra-ui/react';
import {BsReddit} from "react-icons/bs";
import React,{useState} from 'react';
import { useRecoilState } from 'recoil';
import { AuthModalState } from '@/src/atoms/authModalAtom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';
import { auth } from '@/src/firebase/clientApp';

const ResetPass:React.FC= () => {
    const setAuthModalState = useRecoilState(AuthModalState);
    // console.log(ModalState.view)
    const [email,setEmail]=useState("");
    const [success,setSuccess]=useState(false);
    const [sendPasswordResetEmail,sending,error]=useSendPasswordResetEmail(auth);

    const onSubmit = async(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        await sendPasswordResetEmail(email);
        setSuccess(true);
    };

    return (
        <Flex direction="column" alignItems="center" width="100%">
            <Icon as={BsReddit} color="brand.100" fontSize="40" mb={2}/>
            {success? (
                <Text textAlign="center" mb={4}>Check your email</Text>
            ):(
                <>
                    <Text fontSize="sm" textAlign="center" mb={2}>
                        Enter the email associated with your account to change your password 
                    </Text>
                    <form onSubmit={onSubmit} style={{width:"100%"}}>
                        <Input 
                            required
                            name="email"
                            placeholder="email"
                            type="email"
                            mb={2}
                            onChange={(event)=>setEmail(event.target.value)}
                            fontSize="10pt"
                            bg="gray.50"
                            _placeholder={{color:"gray.50"}}
                            _hover={{
                                bg:"white",
                                border:"1px solid",
                                borderColor:"blue.500",

                            }}
                            _focus={{
                                outline:"none",
                                bg:"white",
                                border:"1px solid",
                                borderColor:"blue.500",
                            }}
                        />
                        <Text
                            textAlign="center"
                            fontSize="10pt"
                            color="red"
                        >
                            {error?.message} 
                        </Text>
                        <Button
                            width="100%"
                            height="36px"
                            mb={2}
                            mt={2}
                            type="submit"
                            isLoading={sending}
                        >
                            Reset Password
                        </Button>
                    </form>
                </>
            )}
        </Flex>
    )
}
export default ResetPass;