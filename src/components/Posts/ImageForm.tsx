import { Button, Flex, Image, Input, Stack } from '@chakra-ui/react';
import React, { useRef } from 'react';

type ImageFormProps = {
    selectedFile?:string;
    onSelectImage:(event:React.ChangeEvent<HTMLInputElement>)=>void;
    setSelected:(value:boolean)=>void;
    setSelectedFile:(value:string)=>void;
};

const ImageForm:React.FC<ImageFormProps> = ({selectedFile,onSelectImage,setSelected,setSelectedFile}) => {
    const selectedFileRef=useRef<HTMLInputElement>(null);
    return (
        <Flex direction="column" justify="center" align="center" width="100%">
            {selectedFile?(
                <>
                    <Image src={selectedFile} alt="image" maxWidth="300px" maxHeight={"300px"} />
                    <Stack direction="row" mt={4}>
                        <Button
                            height="30px"
                            fontWeight={600}
                            onClick={()=>setSelected(false)}
                            mb={4} mr={4}
                        >Back to Post</Button>
                        <Button
                            height="30px"
                            fontWeight={600}
                            onClick={()=>setSelectedFile("")}
                            mb={4}
                            variant="outline"
                        >Remove Image</Button>
                    </Stack>
                </>
            ):
            (<Flex 
                justify="center" 
                align="center"
                p={20}
                border="1px dashed gray.200"
                width={"100%"}
                borderRadius={4}
            >
                <Button
                    variant="outline"
                    height="28px"
                    onClick={()=>
                        selectedFileRef.current?.click()
                }
                >Upload</Button>
                <Input ref={selectedFileRef} type="file" hidden onChange={onSelectImage}/>
            </Flex>)}
        </Flex>
    )
}
export default ImageForm;