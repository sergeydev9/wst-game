import SectionHeader from './SectionHeader';

export default {
    component: SectionHeader,
    title: "Section Header"
}

const Template = () => {
    return (
        <section className="w-sceen text-center">
            <SectionHeader>Can you guess how many of your friends...</SectionHeader >
        </section>
    )
}

export const Header = Template.bind({})