import {InferType, object, string} from "yup";
export const loginFormSchema = object().shape({
  email: string().email('must be a valid email').required(),
  password: string().required().min(8),
})

export type LoginFormSchemaType = InferType<typeof loginFormSchema>
