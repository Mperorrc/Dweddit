import { Flex, MenuItem ,Icon, Box, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import CreateCommunityModal from '../../Modal/CreateCommunity/CreateCommunityModal';
import { GrAdd } from 'react-icons/gr'; 
import { useRecoilValue } from 'recoil';
import { communityState } from '@/src/atoms/communitiesAtom';
import MenuListItem from './MenuListItem';
import { FaReddit } from 'react-icons/fa';

type CommunitiesProps = {
    
};

const Communities:React.FC<CommunitiesProps> = () => {
    const mySnippets=useRecoilValue(communityState).mySnippets;
    const [open,setOpen]=useState(false);
    console.log(mySnippets);
    return(
        <>
            <CreateCommunityModal open={open} handleClose={()=>setOpen(false)} />
            <Box mt={3} mb={4}>
                <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500" >MODERATING</Text>

                {mySnippets.filter(snippet => snippet.isModerator).map(snippet=>(
                    <MenuListItem 
                        key={snippet.communityId} 
                        icon={FaReddit} 
                        displayText={`d/${snippet.communityId}`} 
                        link={`/d/${snippet.communityId}`} 
                        iconColor="blue.500" 
                        imageURL={snippet.imageURL} 
                    />
                ))}
            </Box>
            <Box mt={3} mb={4}>
                <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500" >MY COMMUNITIES</Text>
                <MenuItem 
                    width="100%" 
                    fontSize="10pt" 
                    _hover={{bg:"gray.100"}}
                    onClick={()=>setOpen(true)}
                >
                    <Flex align="center">
                        <Icon fontSize={20} mr={2} as={GrAdd} />
                        Create Community
                    </Flex>
                </MenuItem>
                {mySnippets.map(snippet =>(
                    <MenuListItem 
                        key={snippet.communityId} 
                        icon={FaReddit} 
                        displayText={`d/${snippet.communityId}`} 
                        link={`/d/${snippet.communityId}`} 
                        iconColor="blue.500" 
                        imageURL={snippet.imageURL} 
                    />
                ))}
            </Box>
        </>
    )
}
export default Communities;