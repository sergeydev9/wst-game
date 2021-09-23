import RadioInput from './RadioInput';

export default {
    component: RadioInput,
    title: "Inputs/Radio"
}

export const Radio = () => {
    return (
        <div className="flex flex-col gap-4 bg-true-white p-10">
            <div className="flex flex-row items-center">
                <label className="font-semibold text-label-big font-roboto mr-6" htmlFor="test-val-1">Value 1:</label>
                <RadioInput type="radio" name="test-radio" id="test-val-1" value="Value 1" />
            </div>
            <div className="flex flex-row items-center">
                <label className="font-semibold text-label-big font-roboto mr-6" htmlFor="test-val-2">Value 2:</label>
                <RadioInput type="radio" name="test-radio" id="test-val-2" value="Value 2" />
            </div>
        </div>
    )
}