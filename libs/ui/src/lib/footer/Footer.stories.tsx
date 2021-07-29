import FooterLinks from "../footer-links/FooterLinks";
import BlueLink from '../blue-link/BlueLink';
import Foot from "./Footer";
import Socials from "../social-links/SocialLinks";

export default {
    component: Foot,
    title: "Footer"
}


const Template = () => {
    return (
        <Foot>
            <Socials fbook="facebook.com" insta="instagram.com" twitter="twitter.com" twitch="twitch.com" />
            <FooterLinks>
                <BlueLink>Who Said True For Schools</BlueLink>
                <BlueLink>Privacy Policy</BlueLink>
                <BlueLink>Terms &amp; Conditions</BlueLink>
            </FooterLinks>
        </Foot>
    )
}

export const Footer = Template.bind({})