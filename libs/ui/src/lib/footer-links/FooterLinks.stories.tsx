import FLinks from "./FooterLinks";

export default {
    component: FLinks,
    title: "Footer Links"
}

const Template = () => {
    return (
        <FLinks>
            <a>Who Said True For Schools</a>
            <a>Privacy Policy</a>
            <a>Terms &amp; Conditions</a>
        </FLinks>
    )
}

export const FooterLinks = Template.bind({})