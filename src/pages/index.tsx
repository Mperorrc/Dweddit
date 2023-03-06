import { Stack } from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post, PostVotes } from "../atoms/PostsAtom";
import CreatePostLink from "../components/Community/CreatePostLink";
import Recommendations from "../components/Community/Recommendations";
import PageContent from "../components/Layout/PageContent";
import PostItem from "../components/Posts/PostItem";
import PostLoader from "../components/Posts/PostLoader";
import { auth, firestore } from "../firebase/clientApp";
import useCommunityData from "../hooks/useCommunityData";
import UsePosts from "../hooks/UsePosts";

const Home: NextPage=()=>{
  const [user,loadingUser] = useAuthState(auth);
  const [loading,setLoading]=useState(false);
  const {postStateValue,setPostStateValue,onDeletePost,onSelectPost,onVote}= UsePosts();
  const {communityStateValue} = useCommunityData();
  const buildUserHomeFeed=async()=>{
    setLoading(true);
    try {
      if(communityStateValue.mySnippets.length){
        const myCommunityIds=communityStateValue.mySnippets.map(snippet=>snippet.communityId);
        const postQuery=query(collection(firestore,"posts"),where("communityId","in",myCommunityIds),limit(10));
        const postDocs=await getDocs(postQuery);
        const posts=postDocs.docs.map(doc=>({id:doc.id,...doc.data()}));
        setPostStateValue(prev=>({
          ...prev,
          posts:posts as Post[],
        }));
      }
      else{
        buildNoUserHomeFeed();
      }
    } catch (error) {
      console.log("builduserHomefeed error",error)
    }
    setLoading(false);
  };  
 
  const buildNoUserHomeFeed=async()=>{
    setLoading(true);
    try {
      const postQuery=query(collection(firestore,"posts"),orderBy("voteStatus","desc"),limit(10));
      const postDocs = await getDocs(postQuery);
      const posts=postDocs.docs.map((doc)=>({id:doc.id, ...doc.data() }));
      setPostStateValue((prev)=>({
        ...prev,
        posts:posts as Post[],
      }));
    } catch (error) {
      console.log("buildnouserhomefeed error",error);
    }
    setLoading(false);
  };
 
  const FetchUserPostVotes=async()=>{
    try {
      const postIds=postStateValue.posts.map(post => post.id);
      const postVoteQuery=query(collection(firestore,`users/${user?.uid}/postVotes`),where("postId","in",postIds));
      const postVoteDocs=await getDocs(postVoteQuery);
      const postVotes=postVoteDocs.docs.map(doc=>({id:doc.id,...doc.data()}));
      console.log("postVotes",postVotes);
      setPostStateValue(prev=>({
        ...prev,
        postVotes:postVotes as PostVotes[],
      }))
    } catch (error) {
      console.log("FetchUsePostVotes error",error)
    }
  };
  useEffect(()=>{
    if(communityStateValue.snippetsFetched){ buildUserHomeFeed();}
  },[communityStateValue.snippetsFetched])
  useEffect(()=>{
    if(!user && !loadingUser){ buildNoUserHomeFeed();}
  },[user,loadingUser])
  useEffect(()=>{
    if(!user && postStateValue.posts.length){ FetchUserPostVotes();}
  },[user,postStateValue.posts])
  return(
    <PageContent>
      <>
        <CreatePostLink/>
        {loading?(
          <PostLoader/>
        ):(
          <Stack>
            {postStateValue.posts.map(post=>(
              <PostItem 
                key={post.id} 
                post={post} 
                onSelectPost={onSelectPost} 
                onDeletePost={onDeletePost} 
                onVote={onVote} 
                userVoteValue={postStateValue.postVotes.find((item)=>item.postId===post.id)?.voteValue}
                userIsCreator={user?.uid===post.creatorId}
                homePage
                />
            ))}
          </Stack>
        )}
      </>
      <>
        <Recommendations/>
      </>
    </PageContent>
  )
};
export default Home;

function usePosts() {
  throw new Error("Function not implemented.");
}
