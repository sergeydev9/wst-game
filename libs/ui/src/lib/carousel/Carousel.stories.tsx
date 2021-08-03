import { UserStory } from '@whosaidtrue/app-interfaces';
import { Title3 } from '../typography/typography';
import StoryCarousel from './Carousel';

export default {
    component: StoryCarousel,
    title: "Page Sections/Carousel"
}


const Template = () => {
    const stories = [
        {
            lines: ["\"True or False, I have been to a strip club in the last 5 years?\"", "\"Did you say, 'in the last five years'?\"", "\"Would that matter?! You're 17 years old\""]
        },
        {
            lines: ["\"True or False, this is a test story?\"", "\"True...very true\""]
        }
    ]

    const helper = (stories: UserStory[]) => stories.map((story, i) => {
        return (
            <div key={i}>
                {story.lines.map((line, j) => <p key={j}>{line}</p>)}
            </div>
        )
    })


    const title = <Title3>Overheard on Who Said True?</Title3>

    return <StoryCarousel title={title}>{helper(stories)}</StoryCarousel>
}

export const Carousel = Template.bind({})