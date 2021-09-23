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
    <div className="mt-20 w-1/3 mx-auto px-2">
        <SliderInput max={30} changeHandler={() => null} />
    </div>
)