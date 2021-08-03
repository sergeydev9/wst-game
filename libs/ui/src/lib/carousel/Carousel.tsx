import React, { CSSProperties } from 'react';
import { BsCaretLeftFill } from '@react-icons/all-files/bs/BsCaretLeftFill';
import { BsCaretRightFill } from '@react-icons/all-files/bs/BsCaretRightFill';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel"

import Box from '../box/Box';

export interface CarouselProps {
    title: React.ReactElement;
}

interface IRenderArrow {
    (clickHandler: () => void, hasNext: boolean, label: string): React.ReactNode
}

const storyCarousel: React.FC<CarouselProps> = ({ title, children }) => {

    // use inline css for more fine grained control than tailwind provides.
    const arrowStyles: CSSProperties = {
        zIndex: 2,
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
        <Box>
            {title}
            <Carousel
                className="font-body-large mt-4 leading-8"
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                renderArrowPrev={prev}
                renderArrowNext={next}
            >
                {children as React.ReactChild[]}
            </Carousel>

        </Box>
    )
}

export default storyCarousel;