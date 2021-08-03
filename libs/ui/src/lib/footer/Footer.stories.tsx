import FooterLinks from "../footer-links/FooterLinks";
import Foot from "./Footer";
import Socials from "../social-media-links/SocialMediaLinks";
import { BodySmall } from "../typography/typography";

export default {
    component: Foot,
    title: "Page Sections/Footer"
}


const Template = () => {
    return (
        <Foot>
            <Socials fbook="facebook.com" insta="instagram.com" twitter="twitter.com" />
            <FooterLinks className="cursor-pointer">
                <BodySmall>Who Said True For Schools</BodySmall>
                <BodySmall>Privacy Policy</BodySmall>
                <BodySmall>Terms &amp; Conditions</BodySmall>
            </FooterLinks>
        </Foot>
    )
}

export const Footer = Template.bind({})