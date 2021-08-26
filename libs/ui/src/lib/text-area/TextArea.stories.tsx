import TextAreaInput, { TextAreaProps } from './TextArea';
import { Story, Meta } from '@storybook/react';

export default {
    component: TextAreaInput,
    title: 'Inputs/Text Area',
    argTypes: {
        error: {
            name: 'error',
            type: 'boolean',
            default: false
        }
    }
} as Meta;

export const TextArea: Story<TextAreaProps> = (args) => <div className="w-64"><TextAreaInput {...args} /></div>

TextArea.args = {
    error: false
}