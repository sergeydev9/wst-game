// import React from "react";
// import { Link } from "react-router-dom";
// import { useHistory } from "react-router";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// // local imports
// import { useAppSelector, useAppDispatch } from "../../app/hooks";
// import { selectAuthStatus, registerThunk } from "../../features";
// import { ROUTES } from "../../util/constants";
// import {
//   FormContainer,
//   ErrorText,
//   FormButton,
//   Heading,
//   TextInput,
//   FullPageForm,
// } from "@whosaidtrue/ui";

// // TODO: Add loading spinner while request is pending
// // TODO: Add confirmation on page leave attempt
// const Register: React.FC = () => {
//   const status = useAppSelector(selectAuthStatus);
//   const history = useHistory();
//   const dispatch = useAppDispatch();

//   if (status === "loggedIn") {
//     history.push(ROUTES.home);
//   }

//   const { errors, handleChange, handleSubmit, values } = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//       confirmPassword: "",
//     },
//     onSubmit: async ({ email, password }) => {
//       dispatch(registerThunk({ email, password }));
//     },
//     validateOnChange: false,
//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email("Please enter a valid email address")
//         .required("Email is required"),
//       password: Yup.string().required("Password is required"),
//       confirmPassword: Yup.string()
//         .required("Please confirm your password")
//         .when("password", {
//           is: (val: string) => (val && val.length > 0 ? true : false),
//           then: Yup.string().oneOf(
//             [Yup.ref("password")],
//             "Passwords do not match"
//           ),
//         }),
//     }),
//   });
//   return (
//     <FormContainer>
//       <FullPageForm onSubmit={handleSubmit}>
//         <Heading>Register</Heading>
//         <section>
//           <TextInput
//             name="email"
//             onChange={handleChange}
//             type="text"
//             value={values.email}
//             placeholder="email"
//             aria-label="email"
//           />
//           {errors.email && <ErrorText>{errors.email}</ErrorText>}
//         </section>
//         <section>
//           <TextInput
//             name="password"
//             onChange={handleChange}
//             type="password"
//             value={values.password}
//             placeholder="Password..."
//             aria-label="password"
//           />
//           {errors.password && <ErrorText>{errors.password}</ErrorText>}
//         </section>
//         <section>
//           <TextInput
//             name="confirmPassword"
//             onChange={handleChange}
//             type="password"
//             value={values.confirmPassword}
//             placeholder="Confirm Password..."
//             aria-label="confirm-password"
//           />
//           {errors.confirmPassword && (
//             <ErrorText>{errors.confirmPassword}</ErrorText>
//           )}
//         </section>
//         <FormButton type="submit" aria-label="submit-button">
//           Sign up
//         </FormButton>
//         <section>
//           <Link className="text-blue-900 underline" to={ROUTES.login}>
//             Have an account? Login!
//           </Link>
//         </section>
//       </FullPageForm>
//     </FormContainer>
//   );
// };

// export default Register;
