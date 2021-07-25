import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";

// local impots
import { useAppDispatch } from "../../app/hooks";
import { logInThunk } from "../../features";
import {
  FormContainer,
  ErrorText,
  FormButton,
  Heading,
  TextInput,
  FullPageForm,
} from "@whosaidtrue/ui";
import { ROUTES } from "../../util/constants";

const Login: React.FC = () => {
  // send to redux store
  const dispatch = useAppDispatch();

  // form event handlers
  const { errors, handleChange, handleSubmit, values } = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: ({ email, password }) => {
      dispatch(logInThunk({ email, password }));
    },
    validateOnChange: false,
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
      password: Yup.string().required(" Password is required"),
    }),
  });
  // TODO: Add loading spinner while login req is pending
  return (
    <FormContainer>
      <FullPageForm onSubmit={handleSubmit}>
        <Heading>Login</Heading>
        <section>
          <TextInput
            name="email"
            onChange={handleChange}
            type="text"
            value={values.email}
            placeholder="email"
            aria-label="email"
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </section>
        <section>
          <TextInput
            name="password"
            onChange={handleChange}
            type="password"
            value={values.password}
            placeholder="Password..."
            aria-label="password"
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}
        </section>
        <FormButton type="submit" aria-label="submit-button">
          Log In
        </FormButton>
        <section>
          <Link className="text-blue-900 underline" to={ROUTES.register}>
            Don't have an account? Sign up!
          </Link>
        </section>
      </FullPageForm>
    </FormContainer>
  );
};

export default Login;
