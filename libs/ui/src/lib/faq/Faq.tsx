import { useState } from 'react';
import { FaAngleRight } from '@react-icons/all-files/fa/FaAngleRight';
import { Title3 } from '../typography/Typography';
import Box from '../box/Box';
import React from 'react';

export interface FaqProps {
    question: string,
    answer: string
}



const Faq: React.FC<FaqProps> = ({ question, answer }) => {
    const [open, setOpen] = useState(false)

    const clickHandler = (e: React.MouseEvent) => {
        setOpen(!open)
    }

    return (
        <Box boxstyle="white" className='text-basic-black py-6 px-16 relative'>
            <Title3 className="bg-white-ish z-10">{question}</Title3>
            <FaAngleRight onClick={clickHandler} className={`
            top-5
            right-5
            absolute
            text-3xl
            ${open ? 'transition duration-100 transform rotate-90' : 'transition duration-100 transform rotate-0'}
            cursor-pointer
            hover:text-basic-gray
            motion-reduce:transition-none
            motion-reduce:transform-none`} />
            <Title3 className={`
            pt-5
            transition-display
            motion-reduce:transition-none
            motion-reduce:transform-none
            ${open ? 'block' : 'hidden'}
            `}>{answer}</Title3>
        </Box>
    )
}

export default Faq