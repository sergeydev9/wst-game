import React from 'react';
import {
    Form,
    LargeTitle,
    FormGroup,
    TextInput,
    TextArea,
    Button,
    SelectDropdown,
    InputLabel
} from "@whosaidtrue/ui";

// TODO: make this do something
const ContactUs: React.FC = () => {
    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
    }
    return (
        <div className="w-max mx-auto">
            <Form onSubmit={submitHandler}>
                {/* title */}
                <FormGroup>
                    <LargeTitle className="self-start">Contact Us</LargeTitle>
                </FormGroup>

                {/* name */}
                <FormGroup>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <TextInput name="name" type="text" />
                </FormGroup>

                {/* email */}
                <FormGroup>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <TextInput name="email" type="email" />
                </FormGroup>

                {/* category */}
                <FormGroup>
                    <InputLabel htmlFor="category">Category</InputLabel>
                    <SelectDropdown name="category">
                        <option>Bug</option>
                        <option>Give Feedback</option>
                        <option>Submit a Player Story</option>
                        <option>Suggest a Question</option>
                        <option>Report a Problem</option>
                    </SelectDropdown>
                </FormGroup>

                {/*comments */}
                <FormGroup>
                    <InputLabel htmlFor="comments">Comments, Questions, and / or Concerns</InputLabel>
                    <TextArea name="comments" />
                </FormGroup>

                {/* submit */}
                <Button type="submit" fontSize="label-big">Send</Button>
            </Form>
        </div>

    )
}

export default ContactUs;