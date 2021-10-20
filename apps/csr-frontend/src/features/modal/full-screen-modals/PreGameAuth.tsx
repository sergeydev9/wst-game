import { useEffect } from 'react';
import { useHistory } from 'react-router';
import * as Yup from 'yup';
import { CreateGameResponse, CreateGameRequest } from '@whosaidtrue/api-interfaces';
import { api } from '../../../api'
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { AuthForm } from '../..'
import {
    TextInput,
    Headline,
    FormGroup,
    InputLabel,
    ErrorText,
    Button,
    Divider,
    Title2,
    ModalContent
} from "@whosaidtrue/ui";
import { setFullModal, showError, } from '../modalSlice';
import { useFormik } from 'formik';
import { setGameDeck, createGame, setGameStatus } from '../../game/gameSlice';
import { getSelectedDeck } from '../../decks/deckSlice';
import { AuthenticationResponse } from '@whosaidtrue/api-interfaces';
import { decodeUserToken } from '../../../util/functions';
import { login, isLoggedIn } from '../../auth/authSlice';

const PreGameAuth: React.FC<React.HtmlHTMLAttributes<HTMLDivElement>> = () => {
    const history = useHistory()
    const dispatch = useAppDispatch()
    const deck = useAppSelector(getSelectedDeck)
    const loggedIn = useAppSelector(isLoggedIn);

    // close if logged in
    useEffect(() => {
        if (loggedIn) {
            dispatch(setFullModal(''))
        }
    }, [loggedIn, dispatch])

    // Form
    const guestFormik = useFormik(
        {
            initialValues: {
                email: ''
            },
            validationSchema: Yup.object({
                email: Yup.string().email('Invalid email address').required('Email is required'),
            }),
            onSubmit: (values) => {
                return api.post<AuthenticationResponse>('/user/guest', { email: values.email }).then(response => {
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

    // send create request
    const startGame = async () => {
        try {
            const response = await api.post<CreateGameResponse>('/games/create', { deckId: deck.id } as CreateGameRequest)
            dispatch(createGame(response.data))
            dispatch(setGameStatus('gameCreateSuccess'))
            dispatch(setGameDeck(deck))
            history.push(`/game/invite`)
            dispatch(setFullModal(''))
        } catch (e) {
            console.error(e)
            dispatch(showError('An error occured while creating the game'))
            dispatch(setGameStatus('gameCreateError'))
            history.push('/')
        }
    }

    const guestEmailErr = guestFormik.touched.email && guestFormik.errors.email ? true : undefined;
    // render
    return (
        <ModalContent $narrow>
            <Title2 className="mx-8 text-center mt-2">Play as Guest Host</Title2>
            <form className="w-full flex flex-col gap-6" onSubmit={guestFormik.handleSubmit}>

                {/* Guest host email login */}
                <FormGroup className="mb-6">
                    <InputLabel>Email Address</InputLabel>
                    <TextInput {...guestFormik.getFieldProps('email')} $hasError={guestEmailErr} id="guest-email" $border name="email" type="email" />
                    <Headline className="text-basic-gray mt-2">(We'll send you the game results)</Headline>
                    {guestEmailErr && <ErrorText >{guestFormik.errors.email}</ErrorText>}
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