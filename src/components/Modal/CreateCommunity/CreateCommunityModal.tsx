import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Flex, Divider, Text, Box, Input, Stack, Checkbox, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import {HiLockClosed} from "react-icons/hi"; 
import {BsFillEyeFill,BsFillPersonFill} from "react-icons/bs"; 
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, firestore } from '@/src/firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import UseDirectory from '@/src/hooks/UseDirectory';

type CreateCommunityModalProps = {
    open:boolean;
    handleClose:()=>void;
};

const CreateCommunityModal:React.FC<CreateCommunityModalProps> = ({open,handleClose}) => {
    const [communityName,setCommunityName]=useState("");
    const [charsRemaining,setCharsRemaining]=useState(21);
    const [communityType,setCommunityType]=useState("public")
    const [error,setError]=useState("");
    const [user]=useAuthState(auth);
    const [loading,setLoading]=useState(false);
    const router=useRouter();
    const {toggleMenu}=UseDirectory()
    const handleChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        if(event.target.value.length>21) return;
        setCommunityName(event.target.value);
        setCharsRemaining(21-event.target.value.length);
    }

    const onCommunityTypeChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
        setCommunityType(event.target.name)
    }

    const handleCreateCommunity = async () => {
        if(error) setError("");
        if(communityName.length<3){
            setError("Dweddit community names can have a minimum of 3 characters and a maximum of 21 characters");
            return;
        }
        const failChars = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
        if(failChars.test(communityName)||communityName.length<3){
            setError("Dweddit community names can only contain letters, numbers and underscores");
            return;
        }
        if(communityName[0]==='_'){
            setError("Dweddit community names must begin with a letter or a number");
            return;
        }
        
        setLoading(true);

        try {
            const communityDocRef = doc(firestore,"communities",communityName);
            
            await runTransaction(firestore, async(transaction)=>{
                const communityDoc = await transaction.get(communityDocRef);
                if(communityDoc.exists()){
                    throw new Error(`Sorry, d/${communityName} is already taken. Try Another`);
                }

                transaction.set(communityDocRef,{
                    creatorId:user?.uid,
                    createdAt:serverTimestamp(),
                    numberOfMembers:1,
                    privacyType:communityType,
                });
                
                transaction.set(
                    doc(firestore,`users/${user?.uid}/communitySnippets`,communityName),{
                    communityId:communityName,
                    isModerator:true,
                });                
            });
            handleClose();
            toggleMenu();
            router.push(`d/${communityName}`);
        } catch (error:any) {
            console.log('handleCreateCommunity error',error)
            setError(error.message);
        }

        setLoading(false);
    }


    return(
        <>
            <Modal isOpen={open} onClose={handleClose} size="lg">
                <ModalOverlay />
                <ModalContent>
                <ModalHeader
                    display="flex"
                    flexDirection="column"
                    fontSize="18"
                    padding={3}
                    textAlign="center"
                >
                    Create a Dweddit Community
                </ModalHeader>
                <Box
                    pl={3}
                    pr={3}
                >
                    <Divider/>
                    <ModalCloseButton/>
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        padding="10px 0px"
                        border="1px solid gray.50"
                    >
                        <Text fontSize={15} fontWeight={600} textAlign="center">
                            Dweddit Community Name
                        </Text>
                        <Text textAlign="center" mt={4} fontSize={13} color="gray.500">
                            Community names including capitalization cannot be changed
                        </Text>
                        <Text position="relative" top="28px" left="10px" width="20px" color="gray.300">
                            d/
                        </Text>
                        <Input 
                            position="relative"
                            value={communityName} 
                            size="sm" 
                            pl="25px" 
                            onChange={handleChange}
                        />
                        <Text mb={4} color={charsRemaining? "gray.500":"red"} fontSize="12" >
                            {charsRemaining} characters remaining
                        </Text>
                        <Text align="center" color="red" fontSize="9pt" pt={1} >{error}</Text>
                        <Divider/>
                        <Box mt={2} mb={4}>
                            <Text fontWeight={600} fontSize={15}>
                                <Text textAlign={"center"}>Dweddit Community Type</Text>
                                <Stack spacing={2} mt={2} onChange={onCommunityTypeChange} fontWeight={300}>
                                    <Checkbox name="public" isChecked={communityType==="public"} >
                                        <Flex align="center">
                                            <Icon as={BsFillPersonFill} color="gary.500" mr={2} />
                                            <Text fontSize="10pt" mr={1}>Public</Text>
                                            <Text  fontSize="8pt" color="gray.500" pt={1}>
                                                - Anyone can view,post,and comment to this community
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                    <Checkbox name="restricted" isChecked={communityType==="restricted"}>
                                        <Flex align="center">
                                         <Icon as={BsFillEyeFill} color="gary.500" mr={2} />
                                            <Text fontSize="10pt" mr={1}>Restricted</Text>
                                            <Text  fontSize="8pt" color="gray.500" pt={1}>
                                                - Anyone can view this community but only approved users can post
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                    <Checkbox name="private" isChecked={communityType==="private"} >
                                    <Flex align="center">
                                            <Icon as={HiLockClosed} color="gary.500" mr={2} />
                                            <Text fontSize="10pt" mr={1}>Private</Text>
                                            <Text  fontSize="8pt" color="gray.500" pt={1}>
                                                - Only approved users can view and submit to this community
                                            </Text>
                                        </Flex>
                                    </Checkbox>
                                </Stack>
                            </Text>
                        </Box>
                    </ModalBody>
                </Box>

                <ModalFooter bg="gray.100" borderRadius="0px 0px 10px 10px" >
                    <Button fontFamily="sans-serif" fontWeight={300} height="25px" fontSize="15px" mr={3} onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button 
                        height="25px" 
                        fontSize="15px" 
                        fontFamily="sans-serif" 
                        fontWeight={300} 
                        onClick={handleCreateCommunity}
                        isLoading={loading}
                    >
                        Create Community
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
export default CreateCommunityModal;