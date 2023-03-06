import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { FaReddit } from 'react-icons/fa';
import { useRecoilState, useRecoilValue } from 'recoil';
import { communityState } from '../atoms/communitiesAtom';
import { DirectoryMenuItem, directoryMenuState } from '../atoms/DirectoryMenuAtom';

const UseDirectory= () => {
    const communityStateValue=useRecoilValue(communityState);
    const [directoryState,setDirectoryState]=useRecoilState(directoryMenuState);
    const router=useRouter();
    
    const onSelectMenuItem=(menuItem:DirectoryMenuItem)=>{
        setDirectoryState(prev=>({
            ...prev,
            selectedmenuItem:menuItem,
        }));
        router.push(menuItem.link);
        setDirectoryState(prev=>({
            ...prev,
            isOpen: false,
        }))
    };
    const toggleMenu=()=>{
        setDirectoryState(prev=>({
            ...prev,
            isOpen: !directoryState.isOpen,
        }));
    };

    useEffect(()=>{
        const {currentCommunity}=communityStateValue;
        if(currentCommunity){
            setDirectoryState(prev=>({
                ...prev,
                selectedmenuItem:{
                    displayText:`d/${currentCommunity.id}`,
                    link:`/d/${currentCommunity.id}`,
                    imageURL:currentCommunity.imageURL,
                    icon:FaReddit,
                    iconColor:"blue.500",
                },
            }));
        };
    },[communityStateValue.currentCommunity])
    
    return {
        directoryState,
        toggleMenu,
        onSelectMenuItem,
    }
}
export default UseDirectory;