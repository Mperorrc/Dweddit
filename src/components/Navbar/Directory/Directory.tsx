import UseDirectory from '@/src/hooks/UseDirectory';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { Flex, Icon, Menu, MenuButton, MenuList,Text,Image } from '@chakra-ui/react';
import React from 'react';
import {TiHome} from "react-icons/ti"
import Communities from './Communities';

const UserMenu:React.FC= () => {
    const {directoryState,toggleMenu} = UseDirectory();
    
    return (
        <Menu isOpen={directoryState.isOpen}>
        <MenuButton 
            width={"300px"} 
            cursor="pointer"
            padding="0px 6px"
            borderRadius={4}
            ml={{base:0,md:2}}
            mr={2}
            _hover={{
                outline:"1px solid",
                outlineColor:"gray.400",
            }}
            onClick={toggleMenu}
        >
            <Flex align="center" justify="space-between" width={{base:"auto", lg:"100%" }}>
                <Flex alignItems="center">
                    {directoryState.selectedmenuItem.imageURL?(
                        <Image 
                            src={directoryState.selectedmenuItem.imageURL} 
                            borderRadius="full"
                            boxSize={"24px"}
                            mr={2}
                        />
                    ):(
                        <Icon fontSize={24} mr={{base:1,md:2}} as={directoryState.selectedmenuItem.icon} color={directoryState.selectedmenuItem.iconColor}/>
                    )}
                    
                    <Flex display={{base:"none",lg:"flex"}}>
                        <Text fontSize="10pt" fontWeight={400}>{directoryState.selectedmenuItem.displayText}</Text>
                    </Flex>
                </Flex>
                <ChevronDownIcon/>
            </Flex>
        </MenuButton>
        <MenuList>
            <Communities/>
        </MenuList>
        </Menu>
    )
}
export default UserMenu;