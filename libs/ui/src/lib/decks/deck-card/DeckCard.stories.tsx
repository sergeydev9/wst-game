import DeckCard, { DeckCardProps } from './DeckCard';
import placeholder from '../../assets/placeholder.svg';
import { Meta, Story } from '@storybook/react';

export default {
    component: DeckCard,
    title: 'Cards/Deck',
    argTypes: {
        movieRating: {
            control: {
                type: 'select',

            },
            options: ['PG', 'PG13', 'R']
        },
        name: {
            name: 'name',
            type: 'string'
        },
        thumbnailUrl: {
            table: {
                disable: true
            }
        }
    }
}


export const Deck: Story<DeckCardProps> = (args) => {
    return <DeckCard {...args} />
}

Deck.args = {
    thumbnailUrl: placeholder,
    name: 'In your 20s',
    movieRating: 'PG13'
}