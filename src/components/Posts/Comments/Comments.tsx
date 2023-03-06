import { Post, postState } from '@/src/atoms/PostsAtom';
import { firestore } from '@/src/firebase/clientApp';
import { Box, Flex, SkeletonCircle, SkeletonText, Stack, Text } from '@chakra-ui/react';
import { User } from 'firebase/auth';
import { collection, doc, getDocs, increment, orderBy, query, serverTimestamp, Timestamp, where, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import CommentInput from './CommentInput';
import CommentItem, {Comment} from "./CommentItem";

type CommentsProps = {
    user:User;
    selectedPost:Post|null;
    communityId:string;
};

const Comments:React.FC<CommentsProps> = ({communityId,user,selectedPost}) => {
    const [commentText,setCommentText]=useState("");
    const [comments,setComments]=useState<Comment[]>([]);
    const [fetchLoading,setFecthLoading]=useState(true);
    const [createLoading,setCreateLoading]=useState(false);
    const [loadingDeleteId,setLoadingDeleteId]=useState("");
    const setPostSate =useSetRecoilState(postState);
    
    const onCreateComment=async(commentText:string)=>{
        setCreateLoading(true); 
        try {
            const batch=writeBatch(firestore);
            const commentDocRef=doc(collection(firestore,"comments"));
            const newComment:Comment={
                id:commentDocRef.id,
                creatorId:user.uid,
                creatorDisplayText:user.email!.split("@")[0],
                postId:selectedPost?.id!,
                postTitle:selectedPost?.title!,
                text:commentText,
                createdAt:serverTimestamp() as Timestamp,
            } as Comment;
            batch.set(commentDocRef,newComment);

            newComment.createdAt={seconds:Date.now()/1000}as Timestamp;

            const postDocref=doc(firestore,"posts",selectedPost?.id!);
            batch.update(postDocref,{
                numberOfComments:increment(1),
            });
            await batch.commit();

            setCommentText("");
            setComments((prev)=>[newComment,...prev]);
            setPostSate(prev=>({
                ...prev,
                selectedPost:{
                    ...prev.selectedPost,
                    numberOfComments:prev.selectedPost?.numberOfComments!+1,
                } as Post,
            }));
         } catch (error) {
            console.log("onCreateComment Error",error)
         }
         setCreateLoading(false);
    }
    
    const onDeleteComment=async(comments:any)=>{
        setLoadingDeleteId(comments.id);
        try {
            const batch=writeBatch(firestore);
            const commentDocRef=doc(firestore,"comments", comments.id);
            batch.delete(commentDocRef);
            const postDocref=doc(firestore,"posts",selectedPost?.id!);
            batch.update(postDocref,{
                numberOfComments:increment(-1),
            });
            await batch.commit();
            setPostSate(prev=>({
                ...prev,
                selectedPost:{
                    ...prev.selectedPost,
                    numberOfComments:prev.selectedPost?.numberOfComments!-1,
                } as Post,
            }));
            setComments(prev => prev.filter(item=> item.id!==comments.id))
        } catch (error) {
            console.log("onDeleteComment error",error);
        }
        setLoadingDeleteId("");
    }
    
    const fetchPostComments=async()=>{
        try {
            const commentQuery=query(collection(firestore,"comments"),where("postId","==",selectedPost?.id),orderBy("createdAt","desc"));
            const commentDocs =await getDocs(commentQuery);
            const comments=commentDocs.docs.map(doc=>({
                id:doc.id,
                ...doc.data(),
            }))
            setComments(comments as Comment[]);
        } catch (error) {
            console.log("FetchPostComments error",error);
        }
        setFecthLoading(false);
    }
    useEffect(()=>{
        if(!selectedPost) return;
        fetchPostComments();
    },[selectedPost])

    return(
        <Box bg="white" borderRadius={"0px 0px 4px 4px"}>
            <Flex direction={"column"} pl={10} pr={4} mb={6} fontSize="10pt" width={"100%"}  >
                { !fetchLoading && <CommentInput commentText={commentText} setCommentText={setCommentText} user={user} createLoading={createLoading} onCreateComment={onCreateComment} />} 
            </Flex>
            <Stack spacing={6} p={2} >
                {fetchLoading?(
                    <>
                        {[0,1,2].map((item)=>(
                            <Box key={item} padding="6" bg="white">
                                <SkeletonCircle size="26"/>
                                <SkeletonText mt="4" noOfLines={3} spacing="4"/>
                            </Box>
                        ))}
                    </>
                ):(
                    <>
                        {comments.length===0?(
                            <Flex direction={"column"} justify="center" align={"center"} borderTop="1px solid" borderColor={"gray.100"} p={20}>
                                <Text fontWeight={700} opacity={0.3}>
                                    No Comments Yet
                                </Text>
                            </Flex>
                        ):(
                            <>
                                {comments.map(comment=>(
                                    <CommentItem key={comment.id} comment={comment} onDeleteComment={onDeleteComment} loadingDelete={loadingDeleteId===comment.id} userId={user.uid}/>
                                ))}
                            </>
                        )}
                    </>
                )}
                
            </Stack>
        </Box>
    )
}
export default Comments;

function useEffecct(arg0: () => void, arg1: never[]) {
    throw new Error('Function not implemented.');
}
