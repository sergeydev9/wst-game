import ReaderAnnouncementComponent from './ReaderAnnouncement';

export default {
    component: ReaderAnnouncementComponent,
    title: 'Message Displays/Reader Announcement',
    parameters: {
        backgrounds: {
            default: 'white'
        }
    }
}

export const ReaderAnnouncement = () => <ReaderAnnouncementComponent />