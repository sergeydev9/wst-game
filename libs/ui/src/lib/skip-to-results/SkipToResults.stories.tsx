import SkipToResultsComponent from "./SkipToResults";
import SkipPlayerRow from "./SkipPlayerRow";

export default {
    component: SkipToResultsComponent,
    title: 'Modals/Skip To Results'
}

const factory = (id: number) => () => console.log(`I was called with id: ${id}`);

export const SkipToResults = () => (
    <SkipToResultsComponent
        confirm={() => console.log('confirm')}
        cancel={() => console.log('cancel')}
        numHaveNotAnswered={2} >
        <SkipPlayerRow playerName="Mystic Racoon" playerId={1} handlerFactory={factory} />
        <SkipPlayerRow playerName="Chuffed Caterpillar" playerId={2} handlerFactory={factory} />
        <SkipPlayerRow playerName="Neville Chaimberlain" playerId={3} handlerFactory={factory} />
    </SkipToResultsComponent>
)