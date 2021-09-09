import React, { CSSProperties } from 'react';
import { BsCaretLeftFill } from '@react-icons/all-files/bs/BsCaretLeftFill';
import { BsCaretRightFill } from '@react-icons/all-files/bs/BsCaretRightFill';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel as Crsl } from "react-responsive-carousel"

import Box from '../containers/box/Box';
import { Title3 } from '../typography/Typography';
import { IRenderArrow } from '@whosaidtrue/app-interfaces';

export interface CarouselProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    title: string;
}



const Carousel: React.FC<CarouselProps> = ({ title, children }) => {

    // use inline css for more fine grained control than tailwind provides.
    const arrowStyles: CSSProperties = {
        zIndex: 1,
        width: 30,
    };

    // Tailwind class applied to arrow icons
    const arrowClass = "absolute top-0 cursor-pointer text-gray-400 hover:bg-gray-400 hover:text-gray-200 h-full w-full"


    const prev: IRenderArrow = (clickHandler, hasPrev, label) => hasPrev && (
        <BsCaretLeftFill style={{ ...arrowStyles, left: 15 }} onClick={clickHandler} title={label} className={arrowClass} />
    )
    const next: IRenderArrow = (clickHandler, hasNext, label) => hasNext && (
        <BsCaretRightFill onClick={clickHandler} title={label} style={{ ...arrowStyles, right: 15 }} className={arrowClass} />
    )

    return (
        <Box boxstyle="white" className="text-basic-black py-6">
            <Title3 className="mb-4">{title}</Title3>
            <Crsl
                className="leading-7 text-body-small select-none font-semibold"
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                renderArrowPrev={prev}
                renderArrowNext={next}
            >
                {children as React.ReactChild[]}
            </Crsl>

        </Box>
    )
}

export default Carousel;