import React from 'react';
import './SliderInput.css';

export interface SliderProps {
    min: number;
    max: number;
}

// TODO: finish this when this part of the design is actually done
const Slider: React.FC<SliderProps> = ({ min, max }, rest) => {
    const labelClass = "text-primary font-bold text-md"
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