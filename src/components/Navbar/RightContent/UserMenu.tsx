import { AuthModalState } from '@/src/atoms/authModalAtom';
import { communityState } from '@/src/atoms/communitiesAtom';
import { auth } from '@/src/firebase/clientApp';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { signOut, User } from 'firebase/auth';
import React from 'react';
import { CgProfile } from "react-icons/cg";
import { FaRedditSquare } from "react-icons/fa";
import { IoSparkles } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { useResetRecoilState, useSetRecoilState } from 'recoil';

type UserMenuProps={
    user?: User|null;
};

const UserMenu:React.FC<UserMenuProps>= ({user}) => {
    const resetCommunityState=useResetRecoilState(communityState)
    const setAuthModalState=useSetRecoilState(AuthModalState)
    const logout = async () =>{
        await signOut(auth);
    }

    return (
        <Menu>
        <MenuButton 
            cursor="pointer"
            padding="0px 6px"
            borderRadius={4}
            _hover={{
                outline:"1px solid",
                outlineColor:"gray.400",
            }}
        >
            <Flex align="center">
                <Flex alignItems="center">
                {user?( 
                    <>
                        <Icon fontSize={30} mr={1} color="greay.300" as={FaRedditSquare}/>
                        <Flex 
                            direction="column"
                            display={{base:"none",lg:"flex"}}
                            fontSize="8pt"
                            align="flex-end"
                            mr={8}
                        >
                            <Text fontWeight={500}>
                                {user?.displayName||user.email?.split("@")[0]}
                            </Text>
                            <Flex>
                                <Icon mt={0.5} as={IoSparkles} color="brand.100" mr={1} />
                                <Text color="gray.400">1 karma</Text>
                            </Flex>
                        </Flex>
                    </>
                    ):(
                        <Icon fontSize={24} mr={1} color="greay.300" as={VscAccount} />
                    )}
                </Flex>
                <ChevronDownIcon/>
            </Flex>
        </MenuButton>
        <MenuList>
            {user?(
                <>
                    <MenuItem fontSize="11pt" fontWeight={500} _hover={{bg:"blue.500",color:"white"}}>
                        <Flex alignItems="center" align="center" mr={2} > 
                            <Icon as={CgProfile}/>
                            <Text ml={2}>Profile</Text>
                        </Flex>
                    </MenuItem>
                    <MenuDivider/>
                    <MenuItem 
                        fontSize="11pt" 
                        fontWeight={500} 
                        _hover={{bg:"blue.500",color:"white"}}
                        onClick={logout}
                    >
                        <Flex alignItems="center" align="center" mr={2} > 
                            <Icon as={MdLogout}/>
                            <Text ml={2}>Logout</Text>
                        </Flex>
                    </MenuItem>
                </>
            ):(
                <>
                    <MenuItem 
                        fontSize="11pt" 
                        fontWeight={500} 
                        _hover={{bg:"blue.500",color:"white"}}
                        onClick={()=>setAuthModalState({open:true,view:"login"})}
                    >
                        <Flex alignItems="center" align="center" mr={2} > 
                            <Text ml={2}>Login</Text>
                        </Flex>
                    </MenuItem>
                    <MenuItem 
                        fontSize="11pt" 
                        fontWeight={500} 
                        _hover={{bg:"blue.500",color:"white"}}
                        onClick={()=>setAuthModalState({open:true,view:"signup"})}
                    >
                        <Flex alignItems="center" align="center" mr={2} > 
                            <Text ml={2}>Sign Up</Text>
                        </Flex>
                    </MenuItem>
                </>
            )}
            
        </MenuList>
        </Menu>
    )
}
export default UserMenu;