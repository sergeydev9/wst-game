import { LargeTitle, Title1, Title2, Title3, BodyLarge, BodyMedium, BodySmall, Headline, LabelBig, LabelSmall } from './typography';

export default {
    component: LargeTitle,
    title: 'Typography/Typography'

}

export const Typography = () => {
    return (
        <section className="w-full flex flex-col items-center gap-5">
            <LargeTitle>Large Title</LargeTitle>
            <Title1>Title 1</Title1>
            <Title2>Title 2</Title2>
            <Title3>Title 3</Title3>
            <BodyLarge>Body Large</BodyLarge>
            <BodyMedium>Body Medium</BodyMedium>
            <BodySmall>Body Small</BodySmall>
            <Headline>Headline</Headline>
            <LabelBig>Label Big</LabelBig>
            <LabelSmall>Label Small</LabelSmall>
        </section>
    )
}
