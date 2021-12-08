import FooterLinks from './footer-links/FooterLinks';
import Footer from './Footer';
import Socials from '../social-media-links/SocialMediaLinks';
import { Headline } from '../typography/Typography';

export default {
  component: Footer,
  title: 'Page Sections/Footer',
};

export const FooterStory = () => {
  return (
    <Footer>
      <FooterLinks className="cursor-pointer">
        <Headline>Who Said True For Schools</Headline>
        <Headline>Privacy Policy</Headline>
        <Headline>Terms &amp; Conditions</Headline>
      </FooterLinks>
      <Socials
        fbook="facebook.com"
        insta="instagram.com"
        twitter="twitter.com"
      />
    </Footer>
  );
};

FooterStory.storyName = 'Footer';
