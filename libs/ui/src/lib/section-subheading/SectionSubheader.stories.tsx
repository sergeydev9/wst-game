import SectionSubheader from './SectionSubheader';

export default {
    component: SectionSubheader,
    title: "Section Sub-Header"
}

const Template = () => {
    return (
        <section className="w-sceen text-center">
            <SectionSubheader>on Who Said True?</SectionSubheader >
        </section>
    )
}

export const Header = Template.bind({})