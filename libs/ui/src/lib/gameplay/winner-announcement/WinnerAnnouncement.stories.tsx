import WinnerAnnouncementComponent from "./WinnerAnnouncement";

export default {
    component: WinnerAnnouncementComponent,
    title: 'Gameplay/Winner Announcement'
}

export const WinnerAnnouncement = () => <WinnerAnnouncementComponent name='Mystic Racoon' />
export const PluralWinnerAnnouncement = () => <WinnerAnnouncementComponent name='Mystic Racoon & Angry Edison & Laura Palmer' />