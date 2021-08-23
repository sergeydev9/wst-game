import { Carousel } from "react-responsive-carousel"
import { FaAngleRight } from '@react-icons/all-files/fa/FaAngleRight';
import { Title3 } from '../typography/Typography';
import Box from '../box/Box';
import { IRenderArrow } from "@whosaidtrue/app-interfaces";

export interface FaqProps {
    question: string,
    answer: string
}

// use inline css for more fine grained control than tailwind provides.
const arrowStyles: React.CSSProperties = {
    zIndex: 2,
    width: 15,
};


const next: IRenderArrow = (clickHandler, hasNext, label) => hasNext && (
    <FaAngleRight onClick={clickHandler} title={label} style={{ ...arrowStyles }} className='h-full w-full absolute top-0 right-0 text-xl cursor-pointer hover:text-basic-gray' />
)

const Faq: React.FC<FaqProps> = ({ question, answer }) => {
    return (
        <Box boxstyle="white" className="text-basic-black py-6 px-4">
            <Carousel
                className="leading-7 text-body-small font-semibold"
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                renderArrowPrev={() => undefined}
                renderArrowNext={next}
            >
                {[<Title3 className="mr-4" key={1}>{question}</Title3>, <Title3 className="mr-4" key={2}>{answer}</Title3>]}
            </Carousel>

        </Box>
    )
}

export default Faq