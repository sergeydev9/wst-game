import SliderInput from "./SliderInput";

export default {
    component: SliderInput,
    title: 'Inputs/Slider',
    parameters: {
        backgrounds: {
            default: 'white'
        }
    }
}

export const Slider = () => (
    <div className="mt-20 w-1/3 mx-auto">
        <SliderInput min={1} max={100} />
    </div>
)