import { Meta, Story } from '@storybook/react';
import { HelmetProvider } from 'react-helmet-async';
import { withReactContext } from 'storybook-react-context';
import { routerDecorator } from '@whosaidtrue/util';
import Layout from '../../app/Layout';
import HomePage from './Home';

// TODO: fix backgrounds
export default {
  component: HomePage,
  title: 'Pages/Home',
  decorators: [withReactContext, routerDecorator],
  argTypes: {},
} as Meta;

const Template: Story = () => {
  return (
    <HelmetProvider>
      <Layout>
        <HomePage />
      </Layout>
    </HelmetProvider>
  );
};

export const HomeStory = Template.bind({});

HomeStory.storyName = 'Home';
