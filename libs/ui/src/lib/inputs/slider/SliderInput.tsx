import { useState, useMemo, useEffect } from 'react';
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
    w-full
    relative
    select-none
    mx-2
`
// every divider has at least this in common. Main component only applies and shifts this base repeatedly.
const DividerBase: React.FC<{ className: string }> = ({ className }) => <Divider className={`${className} z-10 absolute top-0`} width="4px" height="30px" />

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


    const dividerHelper = () => {
        let counter = 1;
        const result = [];

        while (counter < displayMax) {
            result.push(<DividerBase className={`left-${counter}/${displayMax}`} />);
            counter++;
        }
        return result;
    }
    //     return (<>
    //         <LabelBase className="left-0">0</LabelBase>
    //         <LabelBase style={{ left: `16.6666%`, }}>{max / 6}</LabelBase>
    //         <Divider className="z-10 absolute top-0" style={{ left: 'calc(16.6666%)' }} width="4px" height="30px" />

    //         <LabelBase style={{ left: `33.3333%` }}>{2 * max / 6}</LabelBase>
    //         <Divider className="z-10 absolute top-0" style={{ left: 'calc(33.3333% )' }} width="4px" height="30px" />

    //         <LabelBase style={{ left: `50%` }}>{3 * max / 6}</LabelBase>
    //         <Divider className="z-10 absolute top-0" style={{ left: 'calc(50%)' }} width="4px" height="30px" />

    //         <LabelBase style={{ left: `66.6666%` }}>{4 * max / 6}</LabelBase>
    //         <Divider className="z-10 absolute top-0" style={{ left: 'calc(66.6666%)' }} width="4px" height="30px" />

    //         <LabelBase style={{ left: `83.3333%` }}>{5 * max / 6}</LabelBase>
    //         <Divider className="z-10 absolute top-0" style={{ left: 'calc(83.3333% )' }} width="4px" height="30px" />

    //         <LabelBase className="right-0">{max}</LabelBase>
    //     </>
    //     )
    //
    //     return (<>
    //         <LabelBase className="left-0">0</LabelBase>
    //         <LabelBase className="left-1/4">{Math.round(max / 4)}</LabelBase>
    //         <Divider className="z-10 absolute top-0" style={{ left: 'calc(25%)' }} width="4px" height="30px" />
    //         <LabelBase className="left-2/4">{Math.round(2 * max / 4)}</LabelBase>
    //         <Divider className="z-10 absolute top-0" style={{ left: 'calc(50% )' }} width="4px" height="30px" />
    //         <LabelBase className="left-3/4">{Math.round(3 * max / 4)}</LabelBase>
    //         <Divider className="z-10 absolute top-0" style={{ left: 'calc(75%)' }} width="4px" height="30px" />
    //         <LabelBase className="right-0">{max}</LabelBase>
    //     </>
    //     )
    // }

    const coverChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {

        setTooltipVisible(true)

        // send value up to parent handler
        changeHandler(e.target.value)
        // set local state for purple slider cover
        setCover(e.target.value)
        setOffset((Math.ceil(parseFloat(e.target.value)) / displayMax) * 100)
    }

    return (
        <Container>
            {/* dark purple cover. Offset is off because when it's low it gets out of sync with the thumb */}
            <div className="sl-prpl-cover" style={{ width: `${offset < 35 ? offset + 3 : offset}%` }}></div>
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
                value={cover}
                onChange={coverChange}
                min="0"
                step={max >= 10 ? `${max / 10}` : '1'}
                max={max}
                {...rest}
                className="sl-input-slider" />
            {dividerHelper()}
            <LabelBase className="left-0">0</LabelBase>
            <LabelBase className="right-0">{max}</LabelBase>
        </Container>
    )
}

export default Slider;