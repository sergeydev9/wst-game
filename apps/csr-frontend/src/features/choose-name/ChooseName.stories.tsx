import { Story, Meta } from '@storybook/react';
import { routerDecorator } from '@whosaidtrue/util';
import { withReactContext } from 'storybook-react-context';
import { ARG_REDUX_PATH } from 'addon-redux';
import ChooseNameComponent from './ChooseName';

const remainingOptions = [
  'Electric Dynamo',
  'Furious Heisenberg',
  'Ecstatic Gauss',
  'Agitated Einstein',
  'Cool Curie',
  'Cucumber Tesla',
  'Frosty Edison',
  'Charming Lovelace',
  'Gallant Beaver',
];

const currentOptions = ['Mystic Racoon', 'Tipsy Sailor', 'Curious Giraffe'];

export default {
  component: ChooseNameComponent,
  title: 'Sections/Choose Name',
  decorators: [withReactContext, routerDecorator],
  argTypes: {
    currentOptions: {
      [ARG_REDUX_PATH]: 'chooseName.currentNameOptions',
    },
    remainingOptions: {
      [ARG_REDUX_PATH]: 'chooseName.remainingNameOptions',
    },
    rerolls: {
      [ARG_REDUX_PATH]: 'chooseName.rerolls',
    },
  },
} as Meta;

const Template: Story = (args) => <ChooseNameComponent {...args} />;

export const HasRerolls = Template.bind({});

HasRerolls.args = {
  rerolls: 3,
  remainingOptions,
  currentOptions,
};

export const NoRerolls = Template.bind({});

NoRerolls.args = {
  rerolls: 0,
  remainingOptions,
  currentOptions,
};
