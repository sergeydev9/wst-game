import { Story } from '@storybook/react';
import Card, { CardProps } from './Card';

export default {
  component: Card,
  title: 'Cards/Card',
  argTypes: {},
};

export const CardStory: Story<CardProps> = (args) => {
  return <Card {...args} />;
};

CardStory.storyName = 'Card';

CardStory.args = {};
