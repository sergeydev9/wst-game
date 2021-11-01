import tw from "tailwind-styled-components";
import { BsCaretLeftFill } from '@react-icons/all-files/bs/BsCaretLeftFill';
import { BsCaretRightFill } from '@react-icons/all-files/bs/BsCaretRightFill';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel"

import { RenderArrow } from "../carousel/Carousel";

const Container = tw.div`
    bg-purple-subtle-fill
    border-purple-subtle-stroke
    text-center
    border
    rounded-3xl
    filter
    w-11/12
    sm:w-96
    mx-auto
    drop-shadow-pie
    `

/**
 * Carousel for fun facts. Will render its children as the slides of the carousel
 */
const FactsCarousel: React.FC = ({ children }) => {

    // use inline css for more fine grained control than tailwind provides.
    const arrowStyles = {
        zIndex: 10,
        width: 30,
    };

    // Tailwind class applied to arrow icons
    const arrowClass = "absolute top-1/4 cursor-pointer text-gray-400 hover:bg-gray-400 hover:text-gray-200 h-20 w-full"

    const prev: RenderArrow = (clickHandler, hasPrev, label) => hasPrev && (
        <BsCaretLeftFill style={{ ...arrowStyles, left: 2 }} onClick={clickHandler} title={label} className={arrowClass} />
    )
    const next: RenderArrow = (clickHandler, hasNext, label) => hasNext && (
        <BsCaretRightFill onClick={clickHandler} title={label} style={{ ...arrowStyles, right: 2 }} className={arrowClass} />
    )

    return (
        <Container>
            <Carousel
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                renderArrowPrev={prev}
                renderArrowNext={next}
            >
                {children as React.ReactChild[]}
            </Carousel>
        </Container>
    )
}

export default FactsCarousel;