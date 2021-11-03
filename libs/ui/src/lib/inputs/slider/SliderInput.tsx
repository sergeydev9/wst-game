import { useState } from 'react';
import tw from 'tailwind-styled-components';
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

const Slider: React.FC<SliderProps> = ({ max, changeHandler, ...rest }) => {

    const [cover, setCover] = useState('0')
    const [offset, setOffset] = useState(0)
    const [tooltipVisible, setTooltipVisible] = useState(false)

    const coverChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {

        setTooltipVisible(true)

        // send value up to parent handler
        changeHandler(e.target.value)
        // set local state for purple slider cover
        setCover(e.target.value)
        setOffset((Math.ceil(parseFloat(e.target.value)) / max) * 100)
    }

    return (
        <div className="w-full relative select-none mx-2">
            {/* dark purple cover. Offset is off because when it's low it gets out of sync with the thumb */}
            <div className="sl-prpl-cover" style={{ width: `${offset < 35 ? offset + 3 : offset}%` }}></div>
            {/*light purple background*/}
            <div className="sl-backgrnd"></div>
            {/*tooltip*/}
            {tooltipVisible && <div className="absolute text-xl top-full p-1 text-white bg-purple-base z-20 rounded-full" style={{ left: `${offset}%`, transform: `translateX(-${offset}%) translateY(-2px)` }}>{cover}</div>}
            <input type="range" value={cover} onChange={coverChange} min="0" step="1" max={max} {...rest} className="sl-input-slider"></input>
            <LabelBase className="left-0">0</LabelBase>
            <LabelBase className="right-0">{max}</LabelBase>

        </div>
    )
}

export default Slider;