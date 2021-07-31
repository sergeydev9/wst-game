import FooterLinks from "../footer-links/FooterLinks";
import Foot from "./Footer";
import Socials from "../social-media-links/SocialMediaLinks";

export default {
    component: Foot,
    title: "Footer"
}


const Template = () => {
    return (
        <Foot>
            <Socials fbook="facebook.com" insta="instagram.com" twitter="twitter.com" twitch="twitch.com" />
            <FooterLinks>
                <a>Who Said True For Schools</a>
                <a>Privacy Policy</a>
                <a>Terms &amp; Conditions</a>
            </FooterLinks>
        </Foot>
    )
}

export const Footer = Template.bind({})