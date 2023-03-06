import React,{useEffect, useState} from 'react';
import { Button, Flex, Input, Text } from '@chakra-ui/react';
import { AuthModalState } from '@/src/atoms/authModalAtom';
import {useSetRecoilState} from "recoil";
import {auth, firestore} from '../../../firebase/clientApp';
import {useCreateUserWithEmailAndPassword} from "react-firebase-hooks/auth"
import {FIREBASE_ERRORS} from "../../../firebase/error";
import { User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';


const SignUp:React.FC = () => {
    const setAuthModalState=useSetRecoilState(AuthModalState);
    
    const [signUpForm,setSignUpForm] =useState({
        email:" ",
        password: " ",
        confirmPassword:" ",
    });

    const [error, setError]=useState('');

    const [
        createUserWithEmailAndPassword,
        userCredentials,
        loading,
        userError,
    ] = useCreateUserWithEmailAndPassword(auth);

    const createUserDocument = async (user:User) => {
        await addDoc(collection(firestore,"users"),JSON.parse(JSON.stringify(user)));
    };

    useEffect(()=>{
        if(userCredentials){
            createUserDocument(userCredentials.user);
        }
    },[userCredentials])

    const onSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        if(error) setError('');
        if(signUpForm.password.length<6){
            setError("Password is too short")
            return;
        }
        if(signUpForm.password.length>20){
            setError("Password is too long")
            return;
        }
        if(signUpForm.password!==signUpForm.confirmPassword){
            setError("Passwords do not match");
            return;
        }
        console.log("works")
        createUserWithEmailAndPassword(signUpForm.email,signUpForm.password)
    }

    const onChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setSignUpForm(prev=>({
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
            <Input 
                required
                name="confirmPassword" 
                placeholder="Confirm Password"
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
                {error||
                    FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]
                }
            </Text>
            <Button 
                type="submit"
                width="100%"
                height="36px"
                mt={2}
                mb={2}
                isLoading={loading}
            >
                Sign Up
            </Button>
            <Flex 
                mt={3}
                mb={3}
                fontSize="9pt"
                justifyContent="center"
            >
                <Text mr={1}>Already a Dwedditor?</Text>
                <Text 
                    color="blue.600" 
                    fontWeight={700} 
                    cursor="pointer"
                    onClick={()=>
                        setAuthModalState((prev)=>({
                            ...prev,
                            view:"login",
                        }))   
                    }
                >
                    LOG IN
                </Text>
            </Flex>
        </form>
    )
}
export default SignUp;