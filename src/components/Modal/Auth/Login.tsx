import React,{useState} from 'react';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { AuthModalState } from '@/src/atoms/authModalAtom';
import {useSetRecoilState} from "recoil";
import {auth} from "../../../firebase/clientApp"
import {useSignInWithEmailAndPassword} from "react-firebase-hooks/auth"
import { FIREBASE_ERRORS } from '@/src/firebase/error';

type LoginProps = {};

const Login:React.FC<LoginProps> = () => {
    const setAuthModalState=useSetRecoilState(AuthModalState);

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

    const [loginForm,setLoginForm] =useState({
        email:" ",
        password: " ",
    });


    const onSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        signInWithEmailAndPassword(loginForm.email,loginForm.password);
    }

    const onChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setLoginForm(prev=>({
            ...prev,
            [event.target.name]:event.target.value,
        }))
    }
    return (
        <form onSubmit={onSubmit}>
            <Input 
                required
                name="email" 
                placeholder="Email"
                type="email"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{color:"gray.500"}}
                _hover={{
                    bg:"white",
                    border:"1px solid",
                    borderColor:"blue.500"
                }}
                _focus={{
                    outline:"none",
                    bg:"white",
                    border:"1px solid",
                    borderColor:"blue.500"
                }}
                bg="grey.50"
            />
            <Input 
                required
                name="password" 
                placeholder="Password"
                type="password"
                mb={2}
                onChange={onChange}
                fontSize="10pt"
                _placeholder={{color:"gray.500"}}
                _hover={{
                    bg:"white",
                    border:"1px solid",
                    borderColor:"blue.500"
                }}
                _focus={{
                    outline:"none",
                    bg:"white",
                    border:"1px solid",
                    borderColor:"blue.500"
                }}
                bg="grey.50"
            />
            <Text textAlign="center" color="red" fontSize="10pt">
                {FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
            </Text>
            <Button 
                type="submit"
                width="100%"
                height="36px"
                mt={2}
                mb={2}
                isLoading={loading}
                cursor="pointer"

            >
                Log In
            </Button>
            <Flex mt={3}
                fontSize="9pt"
                justifyContent="center"
            >
                <Text mr={1}>Forgot Password?</Text>
                <Text 
                    fontSize="9pt"
                    color="blue.600" 
                    fontWeight={700} 
                    cursor="pointer"
                    onClick={()=>
                        setAuthModalState((prev)=>({
                            ...prev,
                            view:"resetPassword",
                        }))   
                    }
                >
                    RESET PASSWORD
                </Text>
            </Flex>
            <Flex 
                mt={3}
                mb={4}
                fontSize="9pt"
                justifyContent="center"
            >
                <Text mr={1}>New to Dweddit?</Text>
                <Text 
                    color="blue.600" 
                    fontWeight={700} 
                    cursor="pointer"
                    onClick={()=>
                        setAuthModalState((prev)=>({
                            ...prev,
                            view:"signup",
                        }))   
                    }
                >
                    SIGN UP
                </Text>
            </Flex>
        </form>
    )
}
export default Login;