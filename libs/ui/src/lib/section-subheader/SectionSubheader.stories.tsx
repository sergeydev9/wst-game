import Subheader from './SectionSubheader';

export default {
    component: Subheader,
    title: "Section Subheader"
}

const Template = () => {
    return (
        <section className="w-sceen text-center">
            <Subheader>on Who Said True?</Subheader >
        </section>
    )
}

export const SectionSubheader = Template.bind({})