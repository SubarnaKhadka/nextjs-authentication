import * as z from "zod"

export const RegisterSchema = z.object({
    name: z.string({message: 'please enter name'}),
    email: z.string().email({
        message: "Please enter a valid email",
    }),
    password: z.string().min(1, { message: "Please enter a password" }),
})