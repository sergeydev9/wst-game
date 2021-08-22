import WrappedButton from './WrappedButton';

export default {
    component: WrappedButton,
    title: 'Buttons/Wrapped Button (Border gradient effect)',
}

export const Yellow = () => {
    return (
        <div className="w-96">
            <WrappedButton color="yellow" >
                Blue Wrapped Button
            </WrappedButton>
        </div>
    )
}

export const Blue = () => {
    return (
        <div className="w-96">
            <WrappedButton color="blue" >
                Blue Wrapped Button
            </WrappedButton>
        </div>
    )
}

export const SmallYellow = () => {
    return (
        <div className="w-max">
            <WrappedButton color="yellow" $small >
                Small Yellow Wrapped Button
            </WrappedButton>
        </div>
    )
}

export const SmallBlue = () => {
    return (
        <div className="w-max">
            <WrappedButton color="blue" $small >
                Small Blue Wrapped Button
            </WrappedButton>
        </div>
    )
}