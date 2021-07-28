import React, { CSSProperties } from 'react';
import { BsCaretLeftFill } from '@react-icons/all-files/bs/BsCaretLeftFill';
import { BsCaretRightFill } from '@react-icons/all-files/bs/BsCaretRightFill';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import { UserStory } from '@whosaidtrue/app-interfaces';
import BoxedSpan from '../boxed-span/BoxedSpan';
import SectionHeader from '../section-header/SectionHeader';
import SectionSubheader from '../section-subheading/SectionSubheader';


export interface IUserStoryCarousel {
    stories: UserStory[];
}

interface IRenderArrow {
    (clickHandler: () => void, hasNext: boolean, label: string): React.ReactNode
}

const storyCarousel: React.FC<IUserStoryCarousel> = ({ stories }) => {

    // use inline css for more fine grained control than tailwind provides.
    const arrowStyles: CSSProperties = {
        position: 'absolute',
        zIndex: 2,
        top: 0,
        width: 30,
        height: '100%',
        cursor: 'pointer',
    };

    const arrowClass = "text-gray-400 hover:bg-gray-400 hover:text-gray-200 h-full w-full"

    const helper = stories.map((story, i) => {
        return (
            <div key={i}>
                {story.lines.map((line, j) => <p key={j}>{line}</p>)}
            </div>
        )
    })
    const prev: IRenderArrow = (clickHandler, hasPrev, label) => hasPrev && (
        <BsCaretLeftFill style={{ ...arrowStyles, left: 15 }} onClick={clickHandler} title={label} className={arrowClass} />
    )
    const next: IRenderArrow = (clickHandler, hasNext, label) => hasNext && (
        <BsCaretRightFill onClick={clickHandler} title={label} style={{ ...arrowStyles, right: 15 }} className={arrowClass} />
    )

    return (
        <BoxedSpan>
            <SectionHeader>Overheard</SectionHeader>
            <SectionSubheader>on Who Said True?</SectionSubheader>
            <Carousel
                className="font-light mt-4 leading-8 pb-4 border-black"
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                renderArrowPrev={prev}
                renderArrowNext={next}
            >
                {helper}
            </Carousel>

        </BoxedSpan>
    )
}

export default storyCarousel;