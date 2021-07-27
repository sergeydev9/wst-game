import HeroHeader from './HeroHeader';

export default {
    component: HeroHeader,
    title: "Hero Header"
}

const Template = () => {
    return (
        <section className="w-sceen text-center">
            <HeroHeader>Can you guess how many of your friends...</HeroHeader >
        </section>
    )
}

export const Header = Template.bind({})