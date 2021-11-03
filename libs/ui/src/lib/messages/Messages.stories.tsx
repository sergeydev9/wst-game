import FlashMessageModal from "./Messages";

export default {
    component: FlashMessageModal,
    title: 'Message Displays/Flash Messages'
}

export const NotPersistent = () => <FlashMessageModal>This modal closes on its own</FlashMessageModal>
export const Persistent = () => <FlashMessageModal closeFn={() => console.log('closing')}>This modal needs to be closed manually</FlashMessageModal>
export const Error = () => <FlashMessageModal error={true}>This is an error message</FlashMessageModal>
export const Success = () => <FlashMessageModal success={true}>This is a success message</FlashMessageModal>