import Layout from '../../app/Layout';
import HomePage from './Home';
import { Story, Meta } from '@storybook/react';

// TODO: fix backgrounds
export default {
    component: HomePage,
    title: 'Pages/Home',
    decorators: [(story: Story) => {
        <Layout>
            {story}
        </Layout>
    }]
}

const Template = () => <HomePage />

export const Home = Template.bind({})