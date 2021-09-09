import DividerComponent from './Divider';

export default {
    component: DividerComponent,
    title: 'Misc/Divider'
}

// TODO: add a control for color
export const WhiteDivider = () => {
    return (
        <div className="w-96 h-96 bg-basic-black flex items-center px-8">
            <DividerComponent dividerColor="white" />
        </div>
    )
}

export const GreyDivider = () => {
    return (
        <div className="w-96 h-96 flex items-center px-8">
            <DividerComponent dividerColor="grey" />
        </div>
    )
}