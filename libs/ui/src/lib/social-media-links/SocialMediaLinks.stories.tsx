import Socials from './SocialMediaLinks'


export default {
    component: Socials,
    title: 'Social Media Links'
}

const Template = () => <Socials fbook="facebook.com" insta="instagram.com" twitter="twitter.com" twitch="twitch.com" />

export const SocialMediaLinks = Template.bind({})