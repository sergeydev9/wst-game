import Header from './SectionHeader';

export default {
    component: Header,
    title: "Section Header"
}

const Template = () => {
    return (
        <section className="w-sceen text-center">
            <Header>Can you guess how many of your friends...</Header >
        </section>
    )
}

export const SectionHeader = Template.bind({})