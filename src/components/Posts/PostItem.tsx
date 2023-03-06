import { Post } from '@/src/atoms/PostsAtom';
import { Alert, AlertIcon, Flex, Icon, Image, Skeleton, Spinner, Stack, Text } from '@chakra-ui/react';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AiOutlineDelete } from "react-icons/ai";
import { BsChat, BsDot } from 'react-icons/bs';
import { FaReddit } from 'react-icons/fa';
import { IoArrowDownCircleOutline, IoArrowDownCircleSharp, IoArrowRedoOutline, IoArrowUpCircleOutline, IoArrowUpCircleSharp, IoBookmarkOutline } from 'react-icons/io5';

type PostItemProps = {
    post : Post;
    userIsCreator:boolean; 
    userVoteValue?:number;
    onVote: (event:React.MouseEvent<SVGElement,MouseEvent>,post :Post , vote:number, communityId:string)=>{};
    onDeletePost:(post:Post)=>Promise<boolean>;
    onSelectPost?:(post:Post)=>void;
    homePage?:boolean;
    
};

const PostItem:React.FC<PostItemProps> = ({post,userIsCreator,homePage,userVoteValue,onDeletePost,onSelectPost,onVote}) => {
    const [loadingimg,setLoadingimg]=useState(true);
    const [error,setError]=useState("");
    const router=useRouter();
    const singlePostPage=!onSelectPost;
    const [loadingDelete,setLoadingDelete]=useState(false);
    const handleDelete=async(event:React.MouseEvent<HTMLDivElement,MouseEvent>)=>{
        event.stopPropagation();
        setLoadingDelete(true);
        try {
            const success= await onDeletePost(post);
            if(!success){
                throw new Error("Failed to delete Post")
            }
            if(singlePostPage){
                router.push(`/d/${post.communityId}`);
            }
        } catch (error:any) {
            setError(error.message);
            console.log(error.message);
        }
        setLoadingDelete(false);
    }
    return (
        <Flex 
            border="1px solid"
            borderColor= {singlePostPage?"white":"gray.300"}  
            bg="white"
            borderRadius={singlePostPage?"4px 4px 0px 0px":"4px"}
            _hover={{ 
                borderColor:singlePostPage?"none":"gray.500",
            }}
            cursor={singlePostPage?"default":"pointer"}
            onClick={()=> onSelectPost && onSelectPost(post)}
        >
            <Flex direction="column" align="center" p={2} width="40px" bg={singlePostPage? "none":"gray.100"} borderRadius={singlePostPage?"0":"3px 0px 0px 3px"}>
                <Icon 
                    as={userVoteValue ===1? IoArrowUpCircleSharp:IoArrowUpCircleOutline} 
                    color={userVoteValue ===1?"brand.100":"gray.400"}
                    onClick={(event) => onVote(event,post,1,post.communityId) }
                />
                <Text fontSize={"9pt"}>{post.voteStatus}</Text>
                <Icon 
                    as={userVoteValue===-1? IoArrowDownCircleSharp :IoArrowDownCircleOutline} 
                    color={userVoteValue===-1?"#4379ff":"gray.400"}
                    onClick={(event) => onVote(event,post,-1,post.communityId)}
                />
            </Flex>
            <Flex direction="column" width="100%">
                {error && (
                    <Alert status='error'>
                    <AlertIcon />
                    <Text mr={2}>{error}</Text>
                </Alert>
                )}
                <Stack spacing={1} p="10px">
                    <Stack direction="row" spacing={0.6} align="center" fontSize="9pt">
                       {homePage&&(
                        <>
                            {post.communityImageURL?(
                                <Image src={post.communityImageURL} alt="img" boxSize="18px" mr={2} borderRadius="full" />
                            ):(
                                <Icon as={FaReddit} fontSize="18pt" mr={1} color="blue.500" />
                            )}
                            <Link href={`d/${post.communityId}`}>
                                <Text 
                                    fontWeight={700} 
                                    _hover={{
                                        textDecoration:"underline",
                                    }}
                                    onClick={(event)=>event.stopPropagation()} 
                                >{`d/${post.communityId}`}</Text>
                            </Link>
                            <Icon as={BsDot} color="gray.500" fontSize={"8"}/>
                        </>
                       )}
                       <Text fontSize="8pt" fontWeight={100} color="gray.400" >Posted by u/{post.creatorDisplayName} {moment(new Date(post.createdAt?.seconds*1000)).fromNow()}</Text> 
                    </Stack>
                    <Text fontSize="12pt" fontWeight={600}>{post.title}</Text>
                    <Text fontSize="10pt">{post.body}</Text>
                    {post.imageURL&&(
                        <Flex justify="center" align="center" p={2}>
                            {loadingimg && (
                                <Skeleton height="200px" width="100%" borderRadius={4} />
                            )}
                            <Image src={post.imageURL} maxHeight="460px" alt="Post Image" display={loadingimg?'none':'unset'} onLoad={() => setLoadingimg(false)} />
                        </Flex>
                    )}
                </Stack>
                <Flex mt={2} ml={2} mb={0.5} color="gray.500">
                    <Flex align="center" fontSize="9pt" p="8px 10px" borderRadius={4} _hover={{bg:"gray.200"}} cursor="pointer">
                        <Icon fontSize={10} as={BsChat} mr={1}/>
                        <Text>{post.numberOfComments}</Text>
                    </Flex>
                    <Flex align="center" fontSize="9pt" p="8px 10px" borderRadius={4} _hover={{bg:"gray.200"}} cursor="pointer">
                        <Icon fontSize={10} as={IoArrowRedoOutline} mr={1}/>
                        <Text>Share</Text>
                    </Flex>
                    <Flex align="center" fontSize="9pt" p="8px 10px" borderRadius={4} _hover={{bg:"gray.200"}} cursor="pointer">
                        <Icon fontSize={10} as={IoBookmarkOutline} mr={1}/>
                        <Text>Save Post</Text>
                    </Flex>
                    { userIsCreator && <Flex align="center" fontSize="9pt" p="8px 10px" borderRadius={4} _hover={{bg:"gray.200"}} cursor="pointer" onClick={handleDelete}>
                        {loadingDelete?(
                            <Spinner color="red" size="sm"/>
                        ):(
                            <>
                                <Icon fontSize={10} as={AiOutlineDelete} mr={1}/>
                                <Text>Delete Post</Text>
                            </>
                        )}
                    </Flex>}
                </Flex>
            </Flex>
        </Flex>
    )
}
export default PostItem;