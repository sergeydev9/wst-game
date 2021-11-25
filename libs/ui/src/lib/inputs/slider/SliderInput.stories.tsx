import { Story, Meta } from '@storybook/react';
import tw from 'tailwind-styled-components';
import SliderInput, { SliderProps } from "./SliderInput";


const Container = tw.div`
    mt-20
    w-1/3
    mx-auto
    px-2
`

export default {
    component: SliderInput,
    title: 'Inputs/Slider',
    arTypes: {
        max: {
            name: 'max',
            type: 'number',
            default: 10
        }
    },
    parameters: {
        backgrounds: {
            default: 'white'
        }
    }
} as Meta;

const Template: Story<SliderProps> = (args) => {
    return (
        <Container>
            <SliderInput {...args} changeHandler={(v) => null} />
        </Container>
    )
}


export const SevenPlayers = Template.bind({});

SevenPlayers.args = {
    max: 7
}

export const ThirtySevenPlayers = Template.bind({});

ThirtySevenPlayers.args = {
    max: 37
}

export const ElevenPlayers = Template.bind({});

ElevenPlayers.args = {
    max: 11
}

export const ThreePlayers = Template.bind({});

ThreePlayers.args = {
    max: 3
}