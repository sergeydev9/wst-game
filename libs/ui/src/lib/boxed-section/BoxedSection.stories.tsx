import BoxedSection from './BoxedSection';
import SectionHeader from '../section-header/SectionHeader';

export default {
    component: BoxedSection,
    title: "Boxed Section"
}

const Template = () => {
    return (
        <BoxedSection>
            <SectionHeader>Binge watched an entire season of a show in a weekend?</SectionHeader>
        </BoxedSection >
    )
}

export const Boxed = Template.bind({})