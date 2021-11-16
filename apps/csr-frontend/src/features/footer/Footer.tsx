import { Footer, SocialMediaLinks, FooterLinks } from '@whosaidtrue/ui';
import { Link, useLocation } from 'react-router-dom'

const FooterComponent: React.FC = () => {
    const location = useLocation();

    const isHidden = location.pathname === '/play'
    return (
        <Footer className={isHidden ? "hidden" : ""}>
            <FooterLinks>
                {/* <a href="http://www.whosaidtrueforschools.com">Who Said True For Schools</a> */}
                <Link to="/faq">FAQs</Link>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
                <Link to='/contact-us'>Contact Us</Link>
            </FooterLinks>
            <SocialMediaLinks fbook="https://www.facebook.com/WhoSaidTrueGame" insta="https://www.instagram.com/whosaidtrue/" twitter="https://twitter.com/WhoSaidTrue" />
        </Footer>
    )

}

export default FooterComponent
