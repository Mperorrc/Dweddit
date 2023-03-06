import { collection, deleteDoc, doc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AuthModalState } from '../atoms/authModalAtom';
import { communityState } from '../atoms/communitiesAtom';
import { Post, postState, PostVotes } from '../atoms/PostsAtom';
import { auth, firestore, storage } from '../firebase/clientApp';

const UsePosts = () => {
    let [postStateValue,setPostStateValue]=useRecoilState(postState);
    const [user]=useAuthState(auth);
    const router=useRouter();
    const setAuthModalState = useSetRecoilState(AuthModalState);
    const currentCommunity= useRecoilValue(communityState).currentCommunity;
    
    const onVote = async (event:React.MouseEvent<SVGElement,MouseEvent>,  post: Post,vote:number,communityId:string) =>{
        event.stopPropagation();
        if(!user?.uid){
            setAuthModalState({open:true, view:"login"});
            console.log("issue");
            return;
        }
        const postVotesQuery=query(
            collection(firestore,"users",`${user?.uid}/postVotes`),
            where("postId","==",post.id),
        );
        const postVoteDocs= await (await getDocs(postVotesQuery));
        const postVotes=postVoteDocs.docs.map((doc)=>({id:doc.id,...doc.data()}))
        console.log(postVotes);
        const {voteStatus}=post;
        const existingVote=postVotes[0] as PostVotes;
        try {
            let voteChange=vote;
            const batch=writeBatch(firestore);
            const updatedPost={...post};
            const updatedPosts=[...postStateValue.posts];
            let updatedPostVotes=[...postStateValue.postVotes];
            if(!existingVote){
                const postVoteRef=doc(collection(firestore,"users",`/${user?.uid}/postVotes/`));
                const newVote: PostVotes ={
                    id: postVoteRef.id,
                    postId : post.id,
                    communityId,
                    voteValue:vote,
                }
                batch.set(postVoteRef,newVote);
                updatedPost.voteStatus=voteStatus + vote;
                updatedPostVotes=[...updatedPostVotes,newVote];
            }   
            else{
                const postVoteRef=doc(firestore,"users",`/${user?.uid}/postVotes/${existingVote.id}`)
                if(existingVote.voteValue==vote){
                    voteChange*=-1;
                    updatedPost.voteStatus=voteStatus - vote;
                    updatedPostVotes=updatedPostVotes.filter((vote)=>vote.id!==existingVote.id)
                    batch.delete(postVoteRef);
                }
                else{
                    updatedPost.voteStatus=voteStatus+2*vote;
                    const voteIndex=postStateValue.postVotes.findIndex((vote)=>vote.id===existingVote.id);
                    updatedPostVotes[voteIndex]={
                        ...existingVote,
                        voteValue:vote,
                    } as PostVotes;
                    batch.update(postVoteRef,{voteValue:vote});
                    voteChange=2*vote;
                }
            }
            let updatedState={...postStateValue,postVotes:updatedPostVotes};
            const postIndex = postStateValue.posts.findIndex(item => item.id === post.id );
            updatedPosts[postIndex]=updatedPost;
            updatedState={
                ...updatedState,
                posts:updatedPosts,
            }
            const postRef=doc(firestore,"posts",post.id);
            batch.update(postRef,{voteStatus:voteStatus+voteChange});
            setPostStateValue(updatedState);
            if(postStateValue.selectedPost){
                setPostStateValue((prev)=>({
                    ...prev,
                    selectedPost:updatedPost,
                }));
            }
            await batch.commit();
        } catch (error) {
            console.log("onVote error",error);
        }
    };

    const onSelectPost=(post:Post)=>{
        setPostStateValue(prev=>({
            ...prev,
            selectedPost:post,
        }));
        router.push(`/d/${post.communityId}/Comments/${post.id}`)
    };

    const onDeletePost = async(post:Post):Promise<boolean>=>{
        try {
            if(post.imageURL){
                const imageRef = ref(storage,`posts/${post.id}/image`);
                await deleteObject(imageRef);
            }

            const postDocRef=doc(firestore,"posts",post.id!);
            await deleteDoc(postDocRef);

            setPostStateValue((prev)=>({
                ...prev,
                posts:prev.posts.filter(item=> item.id!==post.id)
            }));
            return true;
        } catch (error) {
            return false;
        }
    };

    const getCommunityPostVotes= async(communityId:string)=>{
        const postVotesQuery=query(
            collection(firestore,"users",`${user?.uid}/postVotes`),
            where("communityId","==",communityId)
        );
        const postVoteDocs= await getDocs(postVotesQuery);
        const postVotes=postVoteDocs.docs.map((doc)=>({id:doc.id,...doc.data()}))
        setPostStateValue(prev=>({
            ...prev,
            postVotes:postVotes as PostVotes[],
        }))
    };

    useEffect(()=>{
        if(!user || !currentCommunity?.id) return;
        getCommunityPostVotes(currentCommunity?.id);
    },[user,currentCommunity]);

    useEffect(()=>{
        if(!user){
            setPostStateValue(prev=>({
                ...prev,
                postVotes:[],
            }))
        }
        
    },[user]);

    return {
        postStateValue,
        setPostStateValue,
        onVote,
        onDeletePost,
        onSelectPost,
        getCommunityPostVotes,
    }
}
export default UsePosts;