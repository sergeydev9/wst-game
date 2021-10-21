import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
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

    /**
     * Guest Form
     */
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
                    startGame(token);
                }).catch(e => {
                    if (e.response.data === "A user already exists with that email") {
                        dispatch(showError('An account already exists with that email'))
                    }
                }).finally(() => {
                    dispatch(setFullModal(''))
                })
            }
        }
    );

    // send create request
    const startGame = (token: string) => {
        // passing token in here as a prop because axios interceptor won't have access to the token
        // before the request starts executing, leading to a 401 even when log in is successful.
        return api.post<CreateGameResponse>('/games/create', { deckId: deck.id } as CreateGameRequest, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            dispatch(createGame(response.data))
            dispatch(setGameStatus('gameCreateSuccess'))
            dispatch(setGameDeck(deck))
            history.push(`/game/invite`)
            dispatch(setFullModal(''))
        }).catch(e => {
            console.error(e)
            dispatch(showError('An error occured while creating the game'))
            dispatch(setGameStatus('gameCreateError'))
            history.push('/')
        })
    }

    /**
     * User form
     */
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is required'),
            password: Yup.string()
                .min(8, 'Password must be at least 8 characters long')
                .matches(/\d/, 'Password must contain at least 1 number')
                .required('Password is required')
        }),
        onSubmit: async (values) => {
            const { email, password } = values


            return api.post<AuthenticationResponse>('/user/login', { email, password }).then(response => {
                const { token } = response.data
                const decoded = decodeUserToken(token)
                const { user } = decoded;

                // login
                dispatch(login({ ...user, token }))
                startGame(token)
            }).catch(e => {
                const { status, data } = e.response
                if ((status === 422 || status === 401) && data) {
                    if (status === 401) {
                        dispatch(showError("Incorrect email/password"));
                    } else {
                        dispatch(showError('Invalid credentials'));
                    }
                } else {
                    // show error message
                    dispatch(showError('An unknown error has occurred, please try again later'));
                    console.error(e);
                }
            })
        },
    });
    const emailErr = formik.touched.email && formik.errors.email ? true : undefined;
    const pwErr = formik.touched.password && formik.errors.password ? true : undefined;


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
            <form className="w-full" onSubmit={formik.handleSubmit}>

                {/* title */}
                <Title2 className="text-center mb-3">Log In</Title2>

                {/* email */}
                <FormGroup>
                    <InputLabel data-cy="email-input" htmlFor="email">Email</InputLabel>
                    <TextInput {...formik.getFieldProps('email')} className="block" $hasError={emailErr} id="email" $border name="email" type="email" />
                    {emailErr && <ErrorText>{formik.errors.email}</ErrorText>}
                </FormGroup>

                {/* password */}
                <FormGroup className="mb-3">
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <TextInput data-cy="password-input" {...formik.getFieldProps('password')} id="password" $hasError={pwErr} $border name="password" type="password" />
                    <Headline><Link className="text-basic-gray underline cursor-pointer mt-4" onClick={() => dispatch(setFullModal(''))} to="/reset/send-email">Forgot Password?</Link></Headline>
                    {pwErr && <ErrorText>{formik.errors.password}</ErrorText>}
                </FormGroup>

                <div className="mb-3 h-2"></div>
                {/* submit */}
                <Button color="blue" data-cy="login-submit" type="submit">Log In</Button>
            </form>
        </ModalContent >

    )
}

export default PreGameAuth;