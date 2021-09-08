import React from 'react';
import './SliderInput.css';

export interface SliderProps {
    min: number;
    max: number;
}

const Slider: React.FC<SliderProps> = ({ min, max, ...rest }) => {
    const labelClass = "text-purple-base font-bold text-md"
    return (
        <div className="w-full flex flex-col items-stretch gap-1">
            <input type="range" min={min} max={max} {...rest} className="sl-input-slider"></input>
            <span>
                <label className={labelClass}>{min}</label>
                <label className={labelClass}>{max}</label>
            </span>
        </div>
    )
}

export default Slider;