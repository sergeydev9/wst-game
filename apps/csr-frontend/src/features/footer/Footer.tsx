import { Footer, SocialMediaLinks, FooterLinks } from '@whosaidtrue/ui';
import { Link, useLocation } from 'react-router-dom'

const FooterComponent: React.FC = () => {
    const location = useLocation();
    // TODO: Fill in with real urls/links

    const isHidden = location.pathname === '/play'
    return (
        <Footer className={isHidden ? "hidden" : ""}>
            <FooterLinks>
                <a>Who Said True For Schools</a>
                <a>FAQs</a>
                <a>Privacy Policy</a>
                <a>Terms &amp; Conditions</a>
                <Link to='/contact-us'>Contact Us</Link>
            </FooterLinks>
            <SocialMediaLinks fbook="facebook.com" insta="instagram.com" twitter="twitter.com" />
        </Footer>
    )

}

export default FooterComponent