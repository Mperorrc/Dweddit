import { AuthModalState } from '@/src/atoms/authModalAtom';
import { auth } from '@/src/firebase/clientApp';
import UseDirectory from '@/src/hooks/UseDirectory';
import { Button, Flex, Icon, Stack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { FaReddit } from 'react-icons/fa';
import { useSetRecoilState } from 'recoil';
import CreateCommunityModal from '../Modal/CreateCommunity/CreateCommunityModal';

const PHome:React.FC = () => {
    const router=useRouter();
    const [user]=useAuthState(auth);
    const setAuthModalState=useSetRecoilState(AuthModalState);
    const {toggleMenu}=UseDirectory();
    const onClick=()=>{
        if(!user){
            setAuthModalState({open:true,view:"login"});
            return;
        }
        const {communityId} =router.query;
        if(communityId){
            router.push(`/d/${communityId}/submit`);
        }
        else{
            toggleMenu()
        }
    }
    const [open,setOpen]=useState(false);
    return(
        <>
        <CreateCommunityModal open={open} handleClose={()=>setOpen(false)} />
        <Flex
            direction={"column"}
            bg="white"
            borderRadius={4}
            cursor="pointer"
            border="1px solid"
            borderColor={"gray.300"}
            position="sticky"
        >
            <Flex
                align="flex-end"
                color="white"
                borderRadius={"4px 4px 0px 0px"}
                bg="blue.500"
                p="6px 10px"
                height="80px"
                fontWeight={600}
                bgImage="url(/images/redditPersonalHome.png)"
                backgroundSize={"cover"}
            >
            </Flex>
            <Flex direction="column" p={"12px"} width="100%">
                <Flex align="center" mb={2} >
                    <Icon  as ={FaReddit} fontSize={50} color="blue.500" mr={2} />
                    <Text fontWeight={600} >Home</Text>
                </Flex>
                <Stack spacing={3}>
                    <Text>
                        Your Personal Dweddit FrontPage, built for you
                    </Text>
                    <Button height="28px" width="100%" fontWeight={500} onClick={onClick} >Create Post</Button>
                    <Button variant="outline" height="30px" onClick={()=>setOpen(true)} >Create Community</Button>
                </Stack>

            </Flex>
        </Flex>
        </>
    )
}
export default PHome;