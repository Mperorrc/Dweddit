import { Community } from '@/src/atoms/communitiesAtom';
import { Post } from '@/src/atoms/PostsAtom';
import { auth, firestore } from '@/src/firebase/clientApp';
import UsePosts from '@/src/hooks/UsePosts';
import { Stack } from '@chakra-ui/react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import PostItem from './PostItem';
import PostLoader from './PostLoader';

type PostsProps = {
    communityData:Community;
};

const Posts:React.FC<PostsProps> = ({communityData}) => {
    const [user]=useAuthState(auth);
    const [loading,setLoading]=useState(false);
    const {
        postStateValue,
        setPostStateValue,
        onVote,
        onDeletePost,
        onSelectPost,
    }=UsePosts();
    const getPosts = async ()=>{
        try {
            setLoading(true);
            const postQuery = query(
                collection(firestore,"posts"),
                where("communityId",`==`, communityData.id),
                orderBy("createdAt","desc"),
            );
            const postDocs = await getDocs(postQuery);
            const posts = postDocs.docs.map((doc)=>({id:doc.id,...doc.data()}));
            setPostStateValue((prev)=>({
                ...prev,
                posts:posts as Post[],
            }));
        } catch (error:any) {
            console.log("getPosts error",error.message);
        }
        setLoading(false);
    }
    useEffect(() => {
        getPosts();
    }, [communityData]);

    return (
        <>
        {loading? <PostLoader/> :(
            <Stack>
            {postStateValue.posts.map((item)=>(
                <PostItem 
                    key={item.id}
                    post={item} 
                    userIsCreator={user?.uid===item.creatorId}
                    userVoteValue={postStateValue.postVotes.find(vote => vote.postId === item.id) ?.voteValue}
                    onVote={onVote}
                    onDeletePost={onDeletePost}
                    onSelectPost={onSelectPost}
                />
            ))}
            </Stack>
        )}
            
        </>
    )
}
export default Posts;