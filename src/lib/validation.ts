// Validation schemas using Zod for form validation
// Matches the requirements from EM-001 story

import { z } from 'zod';

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[A-Z]/, 'La contraseña debe incluir al menos una mayúscula')
  .regex(/[a-z]/, 'La contraseña debe incluir al menos una minúscula')
  .regex(/\d/, 'La contraseña debe incluir al menos un número')
  .regex(/[!@#$%^&*(),.?\":{}|<>]/, 'La contraseña debe incluir al menos un símbolo especial');

// Email validation schema
export const emailSchema = z
  .string()
  .email('Por favor ingresa un email válido')
  .min(1, 'El email es requerido');

// Registration form validation schema
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  firstName: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  lastName: z
    .string()
    .min(1, 'El apellido es requerido')
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no puede exceder 50 caracteres'),
  termsAccepted: z
    .boolean()
    .refine(value => value === true, {
      message: 'Debes aceptar los términos de servicio'
    }),
  privacyAccepted: z
    .boolean()
    .refine(value => value === true, {
      message: 'Debes aceptar la política de privacidad'
    })
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

// Login form validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es requerida')
});

// Type inference for form data
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

// Validation helper functions
export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

export const validatePassword = (password: string): boolean => {
  try {
    passwordSchema.parse(password);
    return true;
  } catch {
    return false;
  }
};

// Password strength indicator
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?\":{}|<>]/.test(password)) score += 1;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};

// Common validation error messages in Spanish
export const validationMessages = {
  required: 'Este campo es requerido',
  emailInvalid: 'Por favor ingresa un email válido',
  passwordWeak: 'La contraseña no cumple con los requisitos de seguridad',
  passwordMismatch: 'Las contraseñas no coinciden',
  termsRequired: 'Debes aceptar los términos de servicio',
  privacyRequired: 'Debes aceptar la política de privacidad'
} as const;