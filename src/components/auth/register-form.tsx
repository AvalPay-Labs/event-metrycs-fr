'use client';

// Registration form component with mock OAuth providers
// Implements EM-001 user registration requirements

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth-store';
import { registerSchema, RegisterFormData, getPasswordStrength } from '@/lib/validation';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, registerWithGoogle, registerWithApple, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const password = watch('password');
  const passwordStrength = password ? getPasswordStrength(password) : null;

  const onSubmit = async (data: RegisterFormData) => {
    clearError();
    const success = await registerUser(data);
    if (success) {
      onSuccess?.();
    }
  };

  const handleGoogleRegister = async () => {
    clearError();
    const success = await registerWithGoogle();
    if (success) {
      onSuccess?.();
    }
  };

  const handleAppleRegister = async () => {
    clearError();
    const success = await registerWithApple();
    if (success) {
      onSuccess?.();
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <div className=\"max-w-md mx-auto p-6 bg-white rounded-lg shadow-md\">
      <div className=\"text-center mb-6\">
        <h1 className=\"text-2xl font-bold text-gray-900 mb-2\">
          Registrarse en EventMetrics
        </h1>
        <p className=\"text-gray-600\">
          Únete a la plataforma de métricas de eventos blockchain
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className=\"mb-4 p-3 bg-red-50 border border-red-200 rounded-md\">
          <p className=\"text-red-600 text-sm\">{error}</p>
        </div>
      )}

      {/* OAuth Mock Buttons */}
      <div className=\"space-y-3 mb-6\">
        <button
          type=\"button\"
          onClick={handleGoogleRegister}
          disabled={isFormLoading}
          className=\"w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors\"
        >
          {isLoading ? (
            <div className=\"animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 mr-2\"></div>
          ) : (
            <svg className=\"w-4 h-4 mr-2\" viewBox=\"0 0 24 24\">
              <path fill=\"#4285F4\" d=\"M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z\"/>
              <path fill=\"#34A853\" d=\"M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z\"/>
              <path fill=\"#FBBC05\" d=\"M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z\"/>
              <path fill=\"#EA4335\" d=\"M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z\"/>
            </svg>
          )}
          Continuar con Google (Mock)
        </button>

        <button
          type=\"button\"
          onClick={handleAppleRegister}
          disabled={isFormLoading}
          className=\"w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors\"
        >
          {isLoading ? (
            <div className=\"animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2\"></div>
          ) : (
            <svg className=\"w-4 h-4 mr-2\" fill=\"currentColor\" viewBox=\"0 0 24 24\">
              <path d=\"M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z\"/>
            </svg>
          )}
          Continuar con Apple (Mock)
        </button>
      </div>

      <div className=\"relative mb-6\">
        <div className=\"absolute inset-0 flex items-center\">
          <div className=\"w-full border-t border-gray-300\" />
        </div>
        <div className=\"relative flex justify-center text-sm\">
          <span className=\"px-2 bg-white text-gray-500\">O registrarse con email</span>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className=\"space-y-4\">
        {/* First Name */}
        <div>
          <label htmlFor=\"firstName\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Nombre *
          </label>
          <input
            {...register('firstName')}
            type=\"text\"
            id=\"firstName\"
            className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
            placeholder=\"Tu nombre\"
          />
          {errors.firstName && (
            <p className=\"mt-1 text-sm text-red-600\">{errors.firstName.message}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor=\"lastName\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Apellido *
          </label>
          <input
            {...register('lastName')}
            type=\"text\"
            id=\"lastName\"
            className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
            placeholder=\"Tu apellido\"
          />
          {errors.lastName && (
            <p className=\"mt-1 text-sm text-red-600\">{errors.lastName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor=\"email\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Email *
          </label>
          <input
            {...register('email')}
            type=\"email\"
            id=\"email\"
            className=\"w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
            placeholder=\"tu@email.com\"
          />
          {errors.email && (
            <p className=\"mt-1 text-sm text-red-600\">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor=\"password\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Contraseña *
          </label>
          <div className=\"relative\">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id=\"password\"
              className=\"w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
              placeholder=\"Mínimo 8 caracteres\"
            />
            <button
              type=\"button\"
              onClick={() => setShowPassword(!showPassword)}
              className=\"absolute inset-y-0 right-0 pr-3 flex items-center\"
            >
              <svg className=\"h-4 w-4 text-gray-400\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                {showPassword ? (
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21\" />
                ) : (
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" />
                )}
              </svg>
            </button>
          </div>
          {password && (
            <div className=\"mt-1\">
              <div className=\"flex items-center space-x-2\">
                <div className=\"flex-1 bg-gray-200 rounded-full h-1\">
                  <div
                    className={`h-1 rounded-full transition-all duration-300 ${
                      passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                      passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                      'w-full bg-green-500'
                    }`}
                  />
                </div>
                <span className={`text-xs ${
                  passwordStrength === 'weak' ? 'text-red-500' :
                  passwordStrength === 'medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {passwordStrength === 'weak' ? 'Débil' :
                   passwordStrength === 'medium' ? 'Media' : 'Fuerte'}
                </span>
              </div>
            </div>
          )}
          {errors.password && (
            <p className=\"mt-1 text-sm text-red-600\">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor=\"confirmPassword\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Confirmar Contraseña *
          </label>
          <div className=\"relative\">
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              id=\"confirmPassword\"
              className=\"w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
              placeholder=\"Confirma tu contraseña\"
            />
            <button
              type=\"button\"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className=\"absolute inset-y-0 right-0 pr-3 flex items-center\"
            >
              <svg className=\"h-4 w-4 text-gray-400\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\">
                {showConfirmPassword ? (
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21\" />
                ) : (
                  <path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" />
                )}
              </svg>
            </button>
          </div>
          {errors.confirmPassword && (
            <p className=\"mt-1 text-sm text-red-600\">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms and Privacy */}
        <div className=\"space-y-3\">
          <div className=\"flex items-start\">
            <input
              {...register('termsAccepted')}
              type=\"checkbox\"
              id=\"termsAccepted\"
              className=\"mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500\"
            />
            <label htmlFor=\"termsAccepted\" className=\"ml-2 text-sm text-gray-700\">
              Acepto los{' '}
              <a href=\"#\" className=\"text-blue-600 hover:text-blue-800 underline\">
                términos de servicio
              </a>
              {' '}*
            </label>
          </div>
          {errors.termsAccepted && (
            <p className=\"text-sm text-red-600\">{errors.termsAccepted.message}</p>
          )}

          <div className=\"flex items-start\">
            <input
              {...register('privacyAccepted')}
              type=\"checkbox\"
              id=\"privacyAccepted\"
              className=\"mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500\"
            />
            <label htmlFor=\"privacyAccepted\" className=\"ml-2 text-sm text-gray-700\">
              Acepto la{' '}
              <a href=\"#\" className=\"text-blue-600 hover:text-blue-800 underline\">
                política de privacidad
              </a>
              {' '}*
            </label>
          </div>
          {errors.privacyAccepted && (
            <p className=\"text-sm text-red-600\">{errors.privacyAccepted.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type=\"submit\"
          disabled={isFormLoading}
          className=\"w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors\"
        >
          {isFormLoading ? (
            <div className=\"animate-spin rounded-full h-4 w-4 border-b-2 border-white\"></div>
          ) : (
            'Crear Cuenta'
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className=\"mt-6 text-center\">
        <p className=\"text-sm text-gray-600\">
          ¿Ya tienes cuenta?{' '}
          <button
            onClick={onSwitchToLogin}
            className=\"text-blue-600 hover:text-blue-800 font-medium\"
          >
            Iniciar sesión
          </button>
        </p>
      </div>

      {/* Mock Data Notice */}
      <div className=\"mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md\">
        <p className=\"text-xs text-yellow-800\">
          <strong>DEMO:</strong> Esta es una implementación con datos simulados.
          Los OAuth y emails son mock para demostración.
        </p>
      </div>
    </div>
  );
}