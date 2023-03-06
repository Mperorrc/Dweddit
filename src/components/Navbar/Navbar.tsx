import React from 'react';
import { Flex,Image } from '@chakra-ui/react';
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from "../../firebase/clientApp";
import Directory from "./Directory/Directory"
import UseDirectory from '@/src/hooks/UseDirectory';
import { defaultMenuItem } from '@/src/atoms/DirectoryMenuAtom';
const Navbar:React.FC = () => {
    
    const[user,loading,error]=useAuthState(auth);
    const {onSelectMenuItem} =UseDirectory();
    return (
        <Flex 
            position={"sticky"}
            top="0"
            width="100%"
            bg="white" 
            zIndex={100}
            padding={"6px 12px"} 
            height="44px"
            justify={{md:"space-between"}}
            cursor="pointer"
        >
            <Flex 
                align={'center'} 
                width={{base:"40px",md:"auto"}}
                mr={{base:1,md:2}}
                onClick={()=>onSelectMenuItem(defaultMenuItem)} 
            >
                <Image src='/images/redditFace.svg' height={"30px"} />
                <Image 
                    src='/images/redditText.svg' 
                    height={"46px"} 
                    display={{base:'none', md:"unset"}} 
                />
            </Flex>
            {user && <Directory/>}
            <SearchInput user={user} />
            <RightContent user={user}/>
        </Flex>
    );
};
export default Navbar;