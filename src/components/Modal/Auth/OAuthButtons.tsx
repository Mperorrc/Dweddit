import { Button, Flex,Image,Text} from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import {useSignInWithGoogle} from "react-firebase-hooks/auth"
import {auth, firestore} from "../../../firebase/clientApp"

const OAuthButtons:React.FC = () => {
    
    const [signInWithGoogle, userCredentials, loading, error]=useSignInWithGoogle(auth);

    const createUserDocument = async (user: User) =>{
        const userDocRef= doc(firestore,"users",user.uid);
        await setDoc(userDocRef,JSON.parse(JSON.stringify(user)));
    }

    useEffect(() => {
      if(userCredentials){
        createUserDocument(userCredentials.user);
      }
    }, [userCredentials])
    

    return (
        <Flex 
            direction="column"
            width="100%"
            mb={4}
        >
            <Button 
                variant="oauth" 
                mb={2}
                isLoading={loading}
                onClick={()=>signInWithGoogle()}
                cursor="pointer"
            >
                <Image src="/images/googlelogo.png" alt="img" height="20px" mr={4}/>
                Continue With Google
            </Button>
            <Text>{error?.message}</Text>
        </Flex>
    )
}
export default OAuthButtons;