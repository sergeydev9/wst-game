import * as Yup from 'yup';

export const capitalizeFirstLetter = (input: string): string => {
    return `${input.charAt(0).toUpperCase()}${input.slice(1)}`;
}

export const passwordValidationObject = Yup.string()
    .min(8, 'Must be at least 8 characters long')
    .matches(/\d/, 'Must contain at least 1 number')
    .required('Password is required')