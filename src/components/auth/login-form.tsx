'use client';

// Login form component for mock authentication
// Supports switching between login and registration

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/auth-store';
import { loginSchema, LoginFormData } from '@/lib/validation';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormData) => {
    clearError();
    const success = await login(data);
    if (success) {
      onSuccess?.();
    }
  };

  const isFormLoading = isLoading || isSubmitting;

  return (
    <div className=\"max-w-md mx-auto p-6 bg-white rounded-lg shadow-md\">
      <div className=\"text-center mb-6\">
        <h1 className=\"text-2xl font-bold text-gray-900 mb-2\">
          Iniciar Sesión
        </h1>
        <p className=\"text-gray-600\">
          Accede a tu cuenta de EventMetrics
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className=\"mb-4 p-3 bg-red-50 border border-red-200 rounded-md\">
          <p className=\"text-red-600 text-sm\">{error}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className=\"space-y-4\">
        {/* Email */}
        <div>
          <label htmlFor=\"email\" className=\"block text-sm font-medium text-gray-700 mb-1\">
            Email
          </label>
          <input
            {...register('email')}
            type=\"email\"
            id=\"email\"
            autoFocus
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
            Contraseña
          </label>
          <div className=\"relative\">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              id=\"password\"
              className=\"w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent\"
              placeholder=\"Tu contraseña\"
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
          {errors.password && (
            <p className=\"mt-1 text-sm text-red-600\">{errors.password.message}</p>
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
            'Iniciar Sesión'
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className=\"mt-6 text-center\">
        <p className=\"text-sm text-gray-600\">
          ¿No tienes cuenta?{' '}
          <button
            onClick={onSwitchToRegister}
            className=\"text-blue-600 hover:text-blue-800 font-medium\"
          >
            Registrarse
          </button>
        </p>
      </div>

      {/* Mock Data Notice */}
      <div className=\"mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md\">
        <p className=\"text-xs text-yellow-800\">
          <strong>DEMO:</strong> Para testing, puedes usar cualquier email/contraseña que cumpla los requisitos.
          Los datos se almacenan localmente.
        </p>
      </div>
    </div>
  );
}