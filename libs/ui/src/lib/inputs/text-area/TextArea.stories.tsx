import TextAreaInput, { TextAreaProps } from './TextArea';
import { Story, Meta } from '@storybook/react';

export default {
    component: TextAreaInput,
    title: 'Inputs/Text Area',
    argTypes: {
        $hasError: {
            name: '$hasError',
            type: 'boolean',
            default: false
        }
    },
    parameters: {
        backgrounds: {
            default: 'white'
        }
    }
} as Meta;

export const TextArea: Story<TextAreaProps> = (args) => <div className="w-64"><TextAreaInput {...args} /></div>

TextArea.args = {
    $hasError: false
}