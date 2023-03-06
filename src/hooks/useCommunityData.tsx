import { filter } from '@chakra-ui/react';
import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { Snippet } from 'next/font/google';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AuthModalState } from '../atoms/authModalAtom';
import { Community, CommunitySnippet, communityState } from '../atoms/communitiesAtom';
import { auth, firestore } from '../firebase/clientApp';

const useCommunityData = () => {
    const[user]=useAuthState(auth)
    const setAuthModalState = useSetRecoilState(AuthModalState);
    const [communityStateValue,setCommunityStateValue]=useRecoilState(communityState);
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState("");
    const router=useRouter();
    const joinOrLeaveCommunity=(communityData:Community,isJoined:boolean)=>{
        if(isJoined){
            leaveCommunity(communityData.id);
            return;
        }
        joinCommunity(communityData);
    }

    const getMySnippets = async () =>{
        setLoading(true);
        try {
            const snippetDocs = await getDocs(
                collection(firestore,`users/${user?.uid}/communitySnippets`)
            );
            const snippets=snippetDocs.docs.map((doc)=>({
                ...doc.data()
            }));
            setCommunityStateValue((prev)=>({
                ...prev,
                mySnippets:snippets as CommunitySnippet[],
                snippetsFetched:true,
            }));
        } catch (error) {
            console.log("getMySnippets error",error)
        }
        setLoading(false);
    }

    const joinCommunity= async (communityData:Community)=>{
        
        if(!user){
            setAuthModalState({open:true,view:"login"});
            return;
        }

        try {
            const batch=writeBatch(firestore);
            const newSnippet:CommunitySnippet={
                communityId : communityData.id,
                imageURL: communityData.imageURL||"",
                isModerator:user?.uid===communityData.creatorId,
            }
            batch.set(
                doc(firestore,`users/${user?.uid}/communitySnippets`,communityData.id),
                newSnippet
            )
            batch.update(doc(firestore,"communities",communityData.id),{
                numberOfMembers:increment(1),
            });

            await batch.commit();
            setCommunityStateValue((prev)=>({
                ...prev,
                mySnippets:[...prev.mySnippets,newSnippet]
            }));
        } catch (error:any) {
            console.log("joinCommunity error",error);
            setError(error.message);
        }
        setLoading(false);
    };

    const leaveCommunity=async(communityId:string)=>{
        try {
            const batch=writeBatch(firestore);

            batch.delete(doc(firestore,`users/${user?.uid}/communitySnippets`,communityId))

            batch.update(doc(firestore,"communities",communityId),{
                numberOfMembers:increment(-1),
            });
            await batch.commit();
            setCommunityStateValue((prev)=>({
                ...prev,
                mySnippets: prev.mySnippets.filter(
                    (item)=>item.communityId!==communityId
                ),
            }));
        } catch (error:any) {
            console.log("leaveCommunity error",error)
            setError(error.message);
        }
        setLoading(false);
    };

    useEffect(()=>{
        if(!user){
            setCommunityStateValue(prev=>({
                ...prev,
                mySnippets:[],
            }));
            return;
        };
        getMySnippets();
    },[user]);

    const FetchCOmmunityData=async(communityId: string)=>{
        try {
            const communityDocRef=doc(firestore,"communities",communityId);
            const communityDoc=await getDoc(communityDocRef);
            setCommunityStateValue(prev=>({
                ...prev,
                currentCommunity: {id:communityDoc.id,...communityDoc.data()} as Community,
            }));
        } catch (error) {
            console.log("FetchCommunityData Error",error);
        }
    }

    useEffect(()=>{
        const {communityId} = router.query;
        if(communityId&&!communityStateValue.currentCommunity){
            FetchCOmmunityData(communityId as string);
        }
    },[router.query,communityStateValue.currentCommunity]);


    return{
        communityStateValue,
        joinOrLeaveCommunity,
        loading,
    }
}

export default useCommunityData;