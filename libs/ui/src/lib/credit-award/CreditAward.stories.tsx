import CreditAwardComponent from "./CreditAward";

export default {
    component: CreditAwardComponent,
    title: 'Modals/Credit Award'
}

export const CreditAward = () => <CreditAwardComponent numTotal={3} clickHandler={() => null} />