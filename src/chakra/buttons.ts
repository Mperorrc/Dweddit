import {ComponentStyleConfig} from '@chakra-ui/theme'

export const Button : ComponentStyleConfig = {
    baseStyle: {
        borderRadius: '60px',
        color:"brand.100",
        border:"2px solid blue.600",
    },
    sizes:{
        sm:{
            fontsize:"8pt",
        },
        md:{
            fontsize:"10pt",
        },
    },
    variants:{
        solid:{
            color:"white",
            bg:"blue.500",
            border:"1px solid",
            borderColor:"blue.900",
            _hover:{
                bg:"blue.400",
            },
        },
        outline:{
            color:"blue.500",
            border:"1px solid",
            borderColor:"blue.900",
        },
        oauth:{
            height:"34px",
            color:"black",
            border:"1px solid",
            borderColor:"gray.300",
            _hover:{
                bg:"gary.50",
            },
        },
    },
}