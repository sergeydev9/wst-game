import Fav, { StarProps } from "./FavoriteStar";
import { Story, Meta } from '@storybook/react';


export default {
    component: Fav,
    title: "Favorite Star",
    argTypes: {
        favorite: {
            type: 'boolean',
            default: true
        }
    }
} as Meta;

const Template: Story<StarProps> = (args) => {
    return (
        <Fav {...args} />
    )
}

export const Star = Template.bind({});

Star.args = {
    favorite: true
}
