import {
    Form,
    LargeTitle,
    FormGroup,
    TextInput,
    TextArea,
    Button,
    SelectDropdown,
    InputLabel,
    Box
} from "@whosaidtrue/ui";

// TODO: finish
const ContactUs: React.FC = () => {
    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
    }
    return (
        <Box boxstyle='white' className="w-max mx-auto px-8 py-10">
            <Form onSubmit={submitHandler}>
                {/* title */}
                <FormGroup>
                    <LargeTitle className="text-center mb-8">Contact Us</LargeTitle>
                </FormGroup>

                {/* name */}
                <div className='w-11/12 flex-shrink-1 text-left'>
                    <InputLabel htmlFor="name">Name</InputLabel>
                    <TextInput $border name="name" type="text" />
                </div>

                {/* email */}
                <FormGroup>
                    <InputLabel htmlFor="email">Email</InputLabel>
                    <TextInput $border name="email" type="email" />
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
                <Button color="blue" type="submit" className="w-full">Send</Button>
            </Form>
        </Box>

    )
}

export default ContactUs;