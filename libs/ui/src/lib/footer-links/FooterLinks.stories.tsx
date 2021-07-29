import BlueLink from "../blue-link/BlueLink";
import FLinks from "./FooterLinks";

export default {
    component: FLinks,
    title: "Footer Links"
}

const Template = () => {
    return (
        <FLinks>
            <BlueLink>Who Said True For Schools</BlueLink>
            <BlueLink>Privacy Policy</BlueLink>
            <BlueLink>Terms &amp; Conditions</BlueLink>
        </FLinks>
    )
}

export const FooterLinks = Template.bind({})