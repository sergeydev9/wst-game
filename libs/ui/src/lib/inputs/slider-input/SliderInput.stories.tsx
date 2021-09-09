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

export const FourDividers = () => (
    <div className="mt-20 w-1/3 mx-auto px-2">
        <SliderInput max={20} changeHandler={() => null} />
    </div>
)

export const SixDividers = () => (
    <div className="mt-20 w-1/3 mx-auto px-2">
        <SliderInput max={30} changeHandler={() => null} />
    </div>
)