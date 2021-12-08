import FactsCarousel from "./FactsCarousel";
import GroupComparison from "./GroupComparison";
import MostSimilar from "./MostSimilar";
import QuestionResults from "../gameplay/question-scores/QuestionScores";
import QuestionCard from "../gameplay/QuestionCard";


export default {
    component: FactsCarousel,
    title: 'Page Sections/Fun Facts'
}

export const Carousel = () => {
    return (
        <QuestionCard questionNumber={1} category="Entertainment" totalQuestions={9}>
            <QuestionResults guess={'3'} correctAnswer={'3'} hasGuessed={true} pointsEarned={1500}>
                <FactsCarousel>
                    <MostSimilar groupWide={true} totalCommon={8} totalQuestions={9} heading="Gentle Doctor &amp; Happy Wagon" />
                    <GroupComparison groupPercentage={10} globalPercentage={80} isBucketList={true} questionText="Have tasted the nectar" />
                    <MostSimilar groupWide={false} totalCommon={8} totalQuestions={9} heading="Psycho Giraffe" />
                    <GroupComparison groupPercentage={50} globalPercentage={30} isBucketList={false} questionText="Have tasted the nectar" />
                </FactsCarousel>
            </QuestionResults>
        </QuestionCard>
    )
}


export const MostSimilarToYou = () => {
    return (
        <QuestionCard questionNumber={1} category="Entertainment" totalQuestions={9}>
            <QuestionResults guess={'3'} correctAnswer={'3'} hasGuessed={true} pointsEarned={1500}>
                <FactsCarousel>
                    <MostSimilar groupWide={false} totalCommon={8} totalQuestions={9} heading="Psycho Giraffe" />
                </FactsCarousel>
            </QuestionResults>
        </QuestionCard>
    )
}

export const MostSimilarOverall = () => {
    return (
        <QuestionCard questionNumber={1} category="Entertainment" totalQuestions={9}>
            <QuestionResults guess={'3'} correctAnswer={'3'} hasGuessed={true} pointsEarned={1500}>
                <FactsCarousel>
                    <MostSimilar groupWide={true} totalCommon={8} totalQuestions={9} heading="Gentle Doctor &amp; Happy Wagon" />
                </FactsCarousel>
            </QuestionResults>
        </QuestionCard>
    )
}

export const BucketList = () => {
    return (
        <QuestionCard questionNumber={1} category="Entertainment" totalQuestions={9}>
            <QuestionResults guess={'3'} correctAnswer={'3'} hasGuessed={true} pointsEarned={1500}>
                <FactsCarousel>
                    <GroupComparison groupPercentage={10} globalPercentage={80} isBucketList={true} questionText="Have tasted the nectar" />
                </FactsCarousel>
            </QuestionResults>
        </QuestionCard>
    )
}

export const YourGroupVsTheWorld = () => {
    return (
        <QuestionCard questionNumber={1} category="Entertainment" totalQuestions={9}>
            <QuestionResults guess={'3'} correctAnswer={'3'} hasGuessed={true} pointsEarned={1500}>
                <FactsCarousel>
                    <GroupComparison groupPercentage={50} globalPercentage={30} isBucketList={false} questionText="Have tasted the nectar" />
                </FactsCarousel>
            </QuestionResults>
        </QuestionCard>
    )
}
