import DividerComponent from './Divider';

export default {
    component: DividerComponent,
    title: 'Misc/Divider'
}

export const Divider = () => {
    return (
        <div className="w-96 h-96 bg-basic-black flex items-center px-8">
            <DividerComponent />
        </div>
    )
}