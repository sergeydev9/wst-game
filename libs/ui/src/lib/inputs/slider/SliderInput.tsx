import { useState, useMemo, useEffect } from 'react';
import { ReactElement } from 'react-router/node_modules/@types/react';
import tw from 'tailwind-styled-components';
import { ReactComponent as Divider } from './divider.svg';
import './SliderInput.css';

export interface SliderProps {
    max: number;
    changeHandler: (val: string) => void
}

const LabelBase = tw.label`
    text-black
    font-bold
    text-lg
    absolute
    top-full
`

const ToolTip = tw.div`
    absolute
    text-xl
    -top-full
    p-1
    text-white
    bg-purple-base
    z-20
    rounded-full
`

const Container = tw.div`
    relative
    select-none
    mx-2
`
// every divider has at least this in common. Main component only applies and shifts this base repeatedly.
const DividerBase: React.FC<React.HTMLAttributes<SVGElement>> = (props) => (
    <Divider
        {...props}
        className="z-10 absolute top-0"
        width="4px"
        height="30px" />
)

/**
 * Main slider input component used during gameplay. If number of players is
 * less than 10, has a marker at each value. If number of players is more than 10,
 * has 10 markers and labels, one for every 10%.
 */
const Slider: React.FC<SliderProps> = ({ max, changeHandler, ...rest }) => {

    const [cover, setCover] = useState('0');
    const [offset, setOffset] = useState(0);
    const [displayMax, setDisplayMax] = useState(max); // local max used for display
    const [tooltipVisible, setTooltipVisible] = useState(false);

    useEffect(() => {
        // if max is less than 10, just use max, else set max to 10
        if (max > 10) {
            setDisplayMax(10);
        }
    }, [max])


    // returns an array of divider elements
    const dividerHelper = () => {
        let counter = 1;
        const result = [];

        while (counter < displayMax) {
            const inset = (counter / displayMax);
            result.push(<DividerBase key={counter} style={{ left: `calc(calc(100% - ${inset}rem) * ${inset})` }} />);
            counter++;
        }
        return result;
    }

    // changes the position and display value of the tooltip whenever the value of the slider changes
    const coverChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const { value } = e.target;
        setTooltipVisible(true);

        // send value up to parent handler
        changeHandler(e.target.value);

        // if max over 10, show percentages, else show value
        const displayValue = max > 10 ? `${100 / (max / Number(value))}%` : value;
        setCover(displayValue);

        // shift elements by whatever percentage of max the current value is
        const displayOffset = 100 * (Number(value) / max);
        setOffset(displayOffset);
    }

    return (
        <Container style={{ width: '30rem' }}>
            {/* dark purple cover that stretches behind the thumb. Need to widen for lower values to account for the uneven movement of slider thumbs */}
            <div className="sl-prpl-cover" style={{ width: `calc(${offset}% + ${(100 - offset) / 100}rem)` }}></div>

            {/*light purple background*/}
            <div className="sl-backgrnd"></div>

            {/*tooltip*/}
            {tooltipVisible && <ToolTip
                style={{ left: `${offset}%`, transform: `translateX(-${offset}%) translateY(-2px)` }}>
                {cover}
            </ToolTip>
            }

            <input
                type="range"
                width="30rem"
                defaultValue={0}
                onChange={coverChange}
                min="0"
                step={max >= 10 ? `${max / 10}` : '1'}
                max={max}
                {...rest}
                className="sl-input-slider" />
            {dividerHelper()}
            <LabelBase className="left-0">0</LabelBase>
            <LabelBase className="right-0">{max <= 10 ? max : `100%`}</LabelBase>
        </Container>
    )
}

export default Slider;