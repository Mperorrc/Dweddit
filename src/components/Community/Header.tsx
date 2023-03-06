import { Community } from '@/src/atoms/communitiesAtom';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { FaReddit } from 'react-icons/fa';
import useCommunityData from '@/src/hooks/useCommunityData';

type HeaderProps = {
    communityData : Community;    
};

const Header:React.FC<HeaderProps> = ({communityData}) => {
    const {communityStateValue,joinOrLeaveCommunity,loading}=useCommunityData();
    const isJoined=!!communityStateValue.mySnippets.find(
        (item)=>item.communityId===communityData.id
    );

    return(
        <Flex
            direction="column"
            width="100%"
            height="146px"
        >
            <Box height="50%" bg="blue.400"/>
            <Flex justify="center" bg="white" flexGrow={1}>
                <Flex width="95%" maxWidth="860px">
                    {communityStateValue.currentCommunity?.imageURL?(
                    <Image src={communityStateValue.currentCommunity.imageURL}  
                        borderRadius="full"
                        boxSize={"60px"}
                        alt="Community Img"
                        position={"relative"}
                        color="blue.500"
                        top={-3}
                        border="4px solid white"
                    />
                    ):(
                    <Icon 
                        as={FaReddit} 
                        fontSize={64} 
                        position="relative" 
                        top={-3} 
                        color="blue.500"
                        border="4px solid white"
                        borderRadius="50%"
                    />)}
                    <Flex padding="10px 16px">
                        <Flex direction="column" mr={6}>
                            <Text 
                                fontWeight={600}
                                fontSize="16pt" 
                            >
                                {communityData.id}
                            </Text>
                            <Text 
                                fontWeight={100}
                                fontSize="11pt"
                                color="gray.400" 
                            >
                                d/{communityData.id}
                            </Text>
                        </Flex>
                        <Button 
                            variant={isJoined? "outline":"solid"}
                            height="30px"
                            pr={6}
                            pl={6}
                            isLoading={loading}
                            onClick={()=>joinOrLeaveCommunity(communityData,isJoined)}
                        >
                            {isJoined? "Joined":"Join"}
                        </Button>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}
export default Header;