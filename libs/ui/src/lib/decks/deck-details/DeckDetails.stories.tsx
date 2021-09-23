import DeckDetailsComponent from "./DeckDetails";

export default {
    component: DeckDetailsComponent,
    title: 'Cards/Deck Details'
}

export const DeckDetails = () => (
    <div className="w-28rem bg-white-ish border-0 rounded-3xl py-6 px-8 filter">
        <DeckDetailsComponent
            description="The perfect after dinner game with friends and family. Hilarious questions with just hint of edginess."
            sfw={true}
            movie_rating='R'
            sample_question="I generally shower before going to bed (i.e. not in the mornings)"
        />
    </div>

)