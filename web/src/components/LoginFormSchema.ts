import {InferType, object, string} from "yup";
export const loginFormSchema = object().shape({
  email: string().email('must be a valid email').required(),
  password: string().required().min(8),
})

export const forgotPasswordSchema = object().shape({
  email: string().email('must be a valid email').required(),
})

export const resetPasswordSchema = object().shape({
  password: string().required().min(8),
  confirmPassword: string().required().min(8).test('passwords-match', 'Passwords must match', function (value) {
    return this.parent.password === value
  }),
})

export type LoginFormSchemaType = InferType<typeof loginFormSchema>
