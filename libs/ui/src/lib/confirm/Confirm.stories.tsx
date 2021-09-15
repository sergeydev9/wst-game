import ConfirmModal from './Confirm';

export default {
    component: ConfirmModal,
    title: 'Modals/Confirm'
}

export const TakeOverReading = () => (
    <ConfirmModal
        header="Are you sure you want to take over reading this question?"
        subHeader="Take over reading as needed to keep the game moving."
        cancel={() => null}
        confirm={() => null} />)

export const SkipQuestion = () => (
    <ConfirmModal
        header="Are you sure you want to skip this question?"
        subHeader="The game will have one less question."
        cancel={() => null}
        confirm={() => null} />)