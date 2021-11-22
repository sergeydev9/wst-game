import { ClipboardEvent, FormEvent, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Title1, Button } from '@whosaidtrue/ui';
import { StatusRequestResponse } from '@whosaidtrue/api-interfaces';
import { initialRequest } from '../game/gameSlice';
import { showError } from '../modal/modalSlice';
import { api } from '../../api';
import { useAppDispatch } from '../../app/hooks';

const CODE_LENGTH = 4;

const JoinGame: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const joinButtonRef = useRef(null);
  const [errorText, setErrorText] = useState('');

  const formik = useFormik({
    initialValues: {
      accessCode: new Array(CODE_LENGTH).fill(''),
    },
    validationSchema: Yup.object({
      accessCode: Yup.array()
        .of(Yup.string().length(1))
        .length(CODE_LENGTH)
        .required(),
    }),
    onSubmit: async (values) => {
      if (formik.isValid) {
        const accessCode = values.accessCode.join('');

        try {
          const statusResponse = await api.get<StatusRequestResponse>(
            `/games/status?access_code=${accessCode}`
          );
          const { status } = statusResponse.data;

          if (status === 'finished') {
            setErrorText(
              'The game you are trying to join has already finished.'
            );
          } else {
            dispatch(initialRequest(accessCode));
            history.push(`/x/${accessCode}`);
          }
        } catch (e) {
          setErrorText('That Game Code is not valid. Please try again.');
        }
      }
    },
  });

  const handleFocus = (event: FormEvent<HTMLInputElement>) => {
    event.currentTarget.select();
  };

  const handleInput = (event: FormEvent<HTMLInputElement>) => {
    setErrorText('');
    if (event.currentTarget.nextElementSibling) {
      (event.currentTarget.nextElementSibling as HTMLElement)?.focus();
    } else {
      (joinButtonRef.current as unknown as HTMLElement)?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    setErrorText('');
    const newAccessCodeValues = event.clipboardData
      .getData('Text')
      .split('')
      .slice(0, CODE_LENGTH);
    formik.setFieldValue('accessCode', newAccessCodeValues).then(() => {
      (joinButtonRef.current as unknown as HTMLElement)?.focus();
    });
  };

  return (
    <section className="flex flex-col justify-center items-center h-full p-6 relative select-none">
      <Title1 className="mb-5" style={{ textShadow: '0 0 10px white' }}>
        Join a Game
      </Title1>
      <form
        className="flex flex-col sm:flex-row gap-6 items-center"
        onSubmit={formik.handleSubmit}
        autoComplete="off"
      >
        <div className="flex gap-2 md:gap-4">
          {[...new Array(CODE_LENGTH)].map((value, index) => {
            return (
              <input
                className="bg-purple-subtle-fill border-2 border-purple-base h-16 font-extrabold rounded text-center text-4xl shadow-md uppercase focus:border-pink-base focus:outline-none"
                key={index}
                maxLength={1}
                pattern="[a-zA-Z0-9]*"
                required
                style={{ maxWidth: 56 }}
                type="text"
                aria-label={`Access code field ${index + 1} of ${CODE_LENGTH}`}
                {...formik.getFieldProps(`accessCode[${index}]`)}
                onFocus={handleFocus}
                onInput={handleInput}
                onPaste={handlePaste}
              />
            );
          })}
        </div>
        <Button className="flex-shrink-0" ref={joinButtonRef} type="submit">
          Join Game!
        </Button>
      </form>
      <div className="font-bold text-center text-lg text-destructive mt-4">
        {errorText}
      </div>
    </section>
  );
};

export default JoinGame;
