import { useState, useEffect } from 'react';
import tw from 'tailwind-styled-components';
import { ReactComponent as Divider } from './divider.svg'
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

const labels = (max: number) => {

    // if number divisible by 6, show 6 labels, else 4
    if (max % 6 === 0) {
        return (<>
            <LabelBase className="left-0">0</LabelBase>
            <LabelBase style={{ left: `16.6666%`, }}>{max / 6}</LabelBase>
            <Divider className="z-10 absolute top-0" style={{ left: 'calc(16.6666% + 0.5rem)' }} width="4px" height="30px" />

            <LabelBase style={{ left: `33.3333%` }}>{2 * max / 6}</LabelBase>
            <Divider className="z-10 absolute top-0" style={{ left: 'calc(33.3333% + 0.5rem)' }} width="4px" height="30px" />

            <LabelBase style={{ left: `50%` }}>{3 * max / 6}</LabelBase>
            <Divider className="z-10 absolute top-0" style={{ left: 'calc(50% + 0.5rem)' }} width="4px" height="30px" />

            <LabelBase style={{ left: `66.6666%` }}>{4 * max / 6}</LabelBase>
            <Divider className="z-10 absolute top-0" style={{ left: 'calc(66.6666% + 0.5rem)' }} width="4px" height="30px" />

            <LabelBase style={{ left: `83.3333%` }}>{5 * max / 6}</LabelBase>
            <Divider className="z-10 absolute top-0" style={{ left: 'calc(83.3333% + 0.5rem)' }} width="4px" height="30px" />

            <LabelBase className="right-0">{max}</LabelBase>
        </>
        )
    } else {
        return (<>
            <LabelBase className="left-0">0</LabelBase>
            <LabelBase className="left-1/4">{Math.round(max / 4)}</LabelBase>
            <Divider className="z-10 absolute top-0" style={{ left: 'calc(25% + 0.5rem)' }} width="4px" height="30px" />
            <LabelBase className="left-2/4">{Math.round(2 * max / 4)}</LabelBase>
            <Divider className="z-10 absolute top-0" style={{ left: 'calc(50% + 0.5rem)' }} width="4px" height="30px" />
            <LabelBase className="left-3/4">{Math.round(3 * max / 4)}</LabelBase>
            <Divider className="z-10 absolute top-0" style={{ left: 'calc(75% + 0.5rem)' }} width="4px" height="30px" />
            <LabelBase className="right-0">{max}</LabelBase>
        </>
        )
    }
}

const Slider: React.FC<SliderProps> = ({ max, changeHandler, ...rest }) => {

    const [cover, setCover] = useState('0')
    const [offset, setOffset] = useState(0)
    const [tooltipVisible, setTooltipVisible] = useState(false)
    const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null)


    useEffect(() => {

        return () => {
            if (timer) {
                clearTimeout(timer)

            }
        }
    }, [timer])

    const coverChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {

        setTooltipVisible(true)
        const timer = setTimeout(() => setTooltipVisible(false), 600)
        setTimer(timer)

        // send value up to parent handler
        changeHandler(e.target.value)
        // set local state for purple slider cover
        setCover(e.target.value)
        setOffset((parseFloat(e.target.value) / max) * 100)
    }

    return (
        <div className="w-full relative select-none mx-2">
            {/* dark purple cover. Offset is off because when it's low it gets out of sync with the thumb */}
            <div className="sl-prpl-cover" style={{ width: `${offset < 35 ? offset + 3 : offset}%` }}></div>
            {/*light purple background*/}
            <div className="sl-backgrnd"></div>
            {/*tooltip*/}
            {tooltipVisible && <div className="absolute text-xl -top-full p-1 text-white bg-purple-base rounded-full" style={{ left: `${offset}%`, transform: `translateX(-${offset}%) translateY(-2px)` }}>{cover}</div>}
            <input type="range" value={cover} onChange={coverChange} min="0" step="1" max={max} {...rest} className="sl-input-slider"></input>
            {labels(max)}
        </div>
    )
}

export default Slider;