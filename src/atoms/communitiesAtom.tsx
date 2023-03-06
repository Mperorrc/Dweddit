import { Timestamp } from "firebase/firestore";
import {atom} from "recoil";

export interface Community{
    creatorId: string | undefined;
    numberOfMembers: any;
    id:string;
    createId:string;
    numberOfMember:number;
    privacyType:"public"|"restricted"|"private";
    createdAt?: Timestamp;
    imageURL?: string;
}

export interface CommunitySnippet{
    communityId:string;
    isModerator?:boolean;
    imageURL?:string;
}

interface CommunityState{
    mySnippets: CommunitySnippet[]
    currentCommunity?:Community;
    snippetsFetched:boolean;
}

const defaultCommuityState={
    mySnippets:[],
    snippetsFetched:false,
}

export const communityState=atom<CommunityState>({
    key:"communityState",
    default: defaultCommuityState,
})