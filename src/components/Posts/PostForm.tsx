import { Button, Flex, Input, Stack, Textarea,Text, Alert, AlertIcon } from '@chakra-ui/react';
import React, { useState } from 'react';

type PostFormProps = {
    textInputs:{
        title:string;
        body:string;
    };
    onChange:(
        event:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>
    )=>void;
    handleCreatePost:()=>void;
    loading:boolean;
};

const PostForm:React.FC<PostFormProps> = ({textInputs,handleCreatePost,onChange,loading}) => {
    const [error,setError]=useState("")
    const onClick=()=>{
        if(!textInputs.title||!textInputs.body){
            setError("Post must contain title and body");
            return;
        }
        handleCreatePost();
    }

    return (
        <Stack spacing={3} width="100%">
            <Input
                name="title"
                value={textInputs.title}
                onChange={onChange}
                fontSize="10pt"
                borderRadius={4}
                placeholder="Title"
                _placeholder={{color:"gray.500"}}
                _focus={{
                    outline:"none",
                    bg:"white",
                    border:"1px solid blue.600"
                }}
            />
            <Textarea
                name="body"
                value={textInputs.body}
                onChange={onChange}
                fontSize="10pt"
                borderRadius={4}
                placeholder="Text"
                height="240px"
                _placeholder={{color:"gray.500"}}
                _focus={{
                    outline:"none",
                    bg:"white",
                    border:"1px solid blue.600"
                }}
            />
            <Flex direction="row" justify="flex-end">
                {error && (
                    <Flex width="70%" justify={"center"} align="center" mt={2}>
                        <Alert status='error'>
                        <AlertIcon />
                        <Text mr={2} fontWeight={900}>{error}</Text>
                        </Alert>
                    </Flex>
                )}
                <Flex width="30%" align="center" justify="center">
                    <Button 
                        height="34px" 
                        padding="0px 30px" 
                        isLoading={loading}
                        onClick={onClick}
                        mt={2.5}
                    >
                        Post
                    </Button>
                </Flex>                
            </Flex>
        </Stack>
    )
}
export default PostForm;