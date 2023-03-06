import { IconType } from "react-icons/lib";
import { TiHome } from "react-icons/ti";
import {atom} from "recoil";

export type DirectoryMenuItem={
    displayText:string;
    link:string;
    icon:IconType;
    iconColor:string;
    imageURL?:string;
}

interface DirectoryMenuState{
    isOpen:boolean;
    selectedmenuItem: DirectoryMenuItem;
}

export const defaultMenuItem:DirectoryMenuItem={
    displayText:"None",
    link:"/",
    icon: TiHome,
    iconColor:"black",
}

export const deafultMenuState:DirectoryMenuState={
    isOpen:false,
    selectedmenuItem:defaultMenuItem,
}

export const directoryMenuState = atom<DirectoryMenuState>({
    key:"directoryMenuState",
    default:deafultMenuState,
})