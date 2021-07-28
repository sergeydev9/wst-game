import StoryCarousel from './UserStoryCarousel';

export default {
    component: StoryCarousel,
    title: "User Story Carousel"
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


    return <StoryCarousel stories={stories} />
}

export const Carousel = Template.bind({})