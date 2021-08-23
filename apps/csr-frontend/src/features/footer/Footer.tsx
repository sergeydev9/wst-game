import { Footer, SocialMediaLinks, FooterLinks } from '@whosaidtrue/ui';
import { Link } from 'react-router-dom'

const FooterComponent: React.FC = () => {

    // TODO: Fill in with real urls/links
    return (
        <Footer>
            <SocialMediaLinks fbook="facebook.com" insta="instagram.com" twitter="twitter.com" />
            <FooterLinks>
                <a>Who Said True For Schools</a>
                <a>FAQs</a>
                <a>Privacy Policy</a>
                <a>Terms &amp; Conditions</a>
                <Link to='/contact-us'>Contact Us</Link>

            </FooterLinks>
        </Footer>
    )

}

export default FooterComponent