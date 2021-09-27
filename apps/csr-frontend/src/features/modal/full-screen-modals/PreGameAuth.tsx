import { useHistory } from 'react-router';
import * as Yup from 'yup';
import { api } from '../../../api'
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { AuthForm } from '../..'
import { TextInput, Headline, FormGroup, InputLabel, ErrorText, Button, Divider, Title2, ModalContent } from "@whosaidtrue/ui";
import { setFullModal, } from '../modalSlice';
import { useFormik } from 'formik';
import { setGameDeck, createGame } from '../../game/gameSlice';
import { clearCart, selectCartDeck } from '../../cart/cartSlice';
import { AuthenticationResponse } from '@whosaidtrue/api-interfaces';
import { decodeUserToken } from '../../../util/functions';
import { login } from '../../auth/authSlice';

const PreGameAuth: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    const history = useHistory()
    const dispatch = useAppDispatch()
    const cartDeck = useAppSelector(selectCartDeck)

    // Form
    const formik = useFormik(
        {
            initialValues: {
                email: ''
            },
            validationSchema: Yup.object({
                email: Yup.string().email('Invalid email address').required('Email is required'),
            }),
            onSubmit: (values) => {
                api.post<AuthenticationResponse>('/user/guest', { email: values.email }).then(response => {
                    const token = response.data.token
                    const decoded = decodeUserToken(token)
                    const { user } = decoded;

                    // login
                    dispatch(login({ ...user, token }))

                    // start game
                    startGame();
                }).catch(e => {
                    console.error(e)
                }).finally(() => {
                    dispatch(setFullModal(''))
                })
            }
        }
    );

    const startGame = () => {
        dispatch(setGameDeck(cartDeck)) // get deck from cart and add it to game
        dispatch(createGame(cartDeck.id)) // create the game
        dispatch(clearCart()) // clear cart
        dispatch(setFullModal('')) // close modals
        history.push('/game/invite') // go to invite page
    }


    const emailErr = formik.touched.email && formik.errors.email ? true : undefined;
    // render
    return (
        <ModalContent $narrow>
            <Title2 className="mx-8 text-center mt-2">Play as Guest Host</Title2>
            <form className="w-full flex flex-col gap-6" onSubmit={formik.handleSubmit}>

                {/* Guest host email login */}
                <FormGroup className="mb-6">
                    <InputLabel>Email Address</InputLabel>
                    <TextInput {...formik.getFieldProps('email')} $hasError={emailErr} id="guest-email" $border name="email" type="email" />
                    <Headline className="text-basic-gray mt-2">(We'll send you the game results)</Headline>
                    {emailErr && <ErrorText >{formik.errors.email}</ErrorText>}
                </FormGroup>
                <Button type="submit">Continue</Button>
            </form>

            {/* divider */}
            <div className="w-full flex flex-row justify-center items-center gap-3 h-8 px-20">
                <Divider dividerColor='grey' />
                <h3 className="font-black text-title-3" >OR</h3>
                <Divider dividerColor='grey' />
            </div>

            {/* user login */}
            <AuthForm
                onSuccess={startGame}
                endpoint="/user/login"
                buttonlabel="Log In"
                title="Log In"
                $showForgotPassword
                $smallTitle />

        </ModalContent>

    )
}

export default PreGameAuth;