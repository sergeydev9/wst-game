import React from 'react';
import { Footer, SocialMediaLinks, FooterLinks, BlueLink } from '@whosaidtrue/ui';

const FooterComponent: React.FC = () => {

    // TODO: Fill in with real urls/links
    return (
        <Footer>
            <SocialMediaLinks fbook="facebook.com" insta="instagram.com" twitter="twitter.com" twitch="twitch.com" />
            <FooterLinks>
                <BlueLink>Who Said True For Schools</BlueLink>
                <BlueLink>Privacy Policy</BlueLink>
                <BlueLink>Terms &amp; Conditions</BlueLink>
            </FooterLinks>
        </Footer>
    )

}

export default FooterComponent