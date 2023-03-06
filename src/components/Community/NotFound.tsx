import { Button, Flex, Link, Text } from '@chakra-ui/react';
import React from 'react';

const NotFound:React.FC = () => {
    
    return (
        <Flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            minHeight="80vh"
        >
            Sorry, that community does not exist or has been removed
            <Link href="/">
                <Button 
                    mt={4}
                    _hover={{
                        bg:"gray.800",
                        color:"yellow",
                        border:"1px solid white"
                    }}
                ><Text>GO BACK TO HOME</Text></Button>
            </Link>            
        </Flex>
    )
}
export default NotFound;