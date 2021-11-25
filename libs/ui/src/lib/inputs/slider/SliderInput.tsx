import { useState, useEffect } from 'react';
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
    const min = max > 10 ? `${0 - max / 10}` : '-1';
    const step = max >= 10 ? `${max / 10}` : '1';
    const stepNum = Number(step);


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

        while (counter <= displayMax) {
            const inset = (counter / (displayMax + 1));
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
        changeHandler(value);

        const numVal = Number(value);

        // hide tooltip if user slides it below 0
        if (numVal < 0) {
            setTooltipVisible(false);
        }

        // if max over 10, show percentages, else show value
        const displayValue = max > 10 ? `${100 / (max / numVal)}%` : value;
        setCover(displayValue);

        // shift elements by whatever percentage of max the current value is
        // while taking into account the slider starting below 0. This shifts the display percentage by close to 1 step
        // for low values, but almost nothing for higher values. This cancels out the lensing effect
        // that slider elements have. Both the tooltip and the slider cover are shifted by this offset.
        const displayOffset = max < 10 ? (numVal + stepNum) * (100 * (stepNum / (max + stepNum))) : (100 * (numVal / max)) + ((max - numVal) / stepNum);
        setOffset(displayOffset);
    }

    const labelHelper = () => {
        let counter = 1;
        const result = [];

        while (counter <= displayMax + 1) {
            const inset = (counter / (displayMax + 1));
            const labelText = max > 10 ? `${(counter - 1) * displayMax}%` : counter - 1;

            // if max is over 10, only show percentages divisible by 20
            if ((counter % 2 !== 0) || max <= 10) {
                result.push(
                    <LabelBase key={counter} style={{ left: `calc(calc(100% - ${inset}rem) * ${inset})` }} >
                        {labelText}
                    </LabelBase>
                )
            }

            counter++;
        }

        return result;
    }


    return (
        <Container style={{ width: '30rem' }}>
            {/* dark purple cover that stretches behind the thumb. Need to widen it only for lower values to account for the uneven movement of slider thumbs. That's what the right half of this equation does */}
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
                defaultValue={min}
                onChange={coverChange}
                min={min}
                step={step}
                max={max}
                {...rest}
                className="sl-input-slider" />
            {dividerHelper()}
            {labelHelper()}
        </Container>
    )
}

export default Slider;