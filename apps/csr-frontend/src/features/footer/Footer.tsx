import React from 'react';
import { Footer, SocialMediaLinks, FooterLinks } from '@whosaidtrue/ui';

const FooterComponent: React.FC = () => {

    // TODO: Fill in with real urls/links
    return (
        <Footer>
            <SocialMediaLinks fbook="facebook.com" insta="instagram.com" twitter="twitter.com" />
            <FooterLinks>
                <a>Who Said True For Schools</a>
                <a>Privacy Policy</a>
                <a>Terms &amp; Conditions</a>
            </FooterLinks>
        </Footer>
    )

}

export default FooterComponent