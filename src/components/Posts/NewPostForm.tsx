import { Post } from '@/src/atoms/PostsAtom';
import { firestore, storage } from '@/src/firebase/clientApp';
import UseSelecctFIles from '@/src/hooks/UseSelecctFIles';
import { Alert, AlertIcon, Flex, Icon, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { addDoc, collection, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import ImageForm from './ImageForm';
import PostForm from './PostForm';

type NewPostFormProps = {
    user:User;
    communityImageURL?:string;
};

const NewPostForm:React.FC<NewPostFormProps> = ({user,communityImageURL}) => {
    const router=useRouter();
    const [selected,setSelected]=useState(false);
    const [textInputs,setTextInputs]=useState({
        title:"",
        body:"",
    });
    const {setSelectedFile,selectedFile,onSelectFile} = UseSelecctFIles(); 
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState(false);
    const handleCreatePost = async () => {
        const {communityId}=router.query;
        const newPost: Post ={
            communityId:communityId as string,
            communityImageURL:communityImageURL||"",
            creatorId:user?.uid,
            creatorDisplayName:user.email?.split("@")[0] as string,
            title:textInputs.title,
            body:textInputs.body,
            numberOfComments:0,
            voteStatus:0,
            createdAt:serverTimestamp() as Timestamp,
        } as Post;
        setLoading(true);
        try {  
            const postDocRef= addDoc(collection(firestore,"posts"),newPost);
            if(selectedFile){
                const imageRef = ref(storage,`posts/${(await postDocRef).id}/image`);
                await uploadString(imageRef,selectedFile,"data_url");
                const downloadURL=await getDownloadURL(imageRef);
                await updateDoc(await postDocRef,{
                    imageURL:downloadURL,
                });
            }
            router.back();
        } catch (error:any) {
            console.log("handleCreatePost error",error.message);
            setError(true);
        }
        setLoading(false);
    }
    const onTextChange = (
        event: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>
    ) =>{
        const {target:{name,value}}=event;
        setTextInputs((prev)=>({
            ...prev,
            [name]:value
        }));
    }

    const reverseSelected=(newVal:boolean)=>{
        setSelected(newVal);
    }
    return(
        <Flex direction="column" width={"100%"} bg="white" borderRadius={4} mt={2}>
            <Flex direction="row">
                <Flex 
                    justify={"center"}
                    fontWeight={400} 
                    align="center" 
                    flexGrow={1} 
                    p="14px 0px" 
                    cursor="pointer" 
                    _hover={{bg:"gray.50"}} 
                    color={!selected? "blue.500":"gray.600"}
                    borderWidth={!selected? "0px 1px 2px 0px":"0px 1px 1px 0px"}
                    borderBottomColor={!selected?"blue.500":"gray.200"}
                    borderRightColor="gray.200"
                    onClick={()=>reverseSelected(false)}
                >
                    <Flex>
                        <Icon fontSize={20} as={IoDocumentText} />
                    </Flex>
                    <Text pl={4} fontFamily="sans-serif" fontSize={"10pt"}>Post</Text>
                </Flex>
                <Flex 
                    justify={"center"}
                    fontWeight={400}  
                    align="center" 
                    flexGrow={1} 
                    p="14px 0px" 
                    cursor="pointer" 
                    _hover={{bg:"gray.50"}} 
                    color={selected? "blue.500":"gray.600"}
                    borderWidth={selected? "0px 1px 2px 0px":"0px 1px 1px 0px"}
                    borderBottomColor={selected?"blue.500":"gray.200"}
                    borderRightColor="gray.200"
                    onClick={()=>reverseSelected(true)}
                >
                    <Flex>
                        <Icon fontSize={20} as={IoImageOutline} />
                    </Flex>
                    <Text pl={4} fontFamily="sans-serif" fontSize={"10pt"}>Images & Video</Text>
                </Flex>
            </Flex>
            <Flex p="20px 10px 20px 10px">
                {!selected?(
                    <PostForm textInputs={textInputs} handleCreatePost={handleCreatePost} onChange={onTextChange} loading={loading} />
                ):(
                    <ImageForm selectedFile={selectedFile} onSelectImage={onSelectFile} setSelected={setSelected} setSelectedFile={setSelectedFile} />
                )}
            </Flex>
            {error && (
                <Alert status='error'>
                <AlertIcon />
                <Text mr={2}>Error Creating Post</Text>
              </Alert>
            )}
        </Flex>
    )
}
export default NewPostForm;