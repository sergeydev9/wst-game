import Header from './HeroHeader';

export default {
    component: Header,
    title: "Hero Header"
}

const Template = () => {
    return (
        <section className="w-sceen text-center">
            <Header>Can you guess how many of your friends...</Header >
        </section>
    )
}

export const HeroHeader = Template.bind({})