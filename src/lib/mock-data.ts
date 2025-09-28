// Mock data structures for EventMetrics
// All data is simulated for MVP demonstration

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  provider: 'email' | 'google' | 'apple';
  providerId?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  termsAcceptedAt?: string;
  privacyAcceptedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  isDefault: boolean;
  createdAt: string;
}

export interface UserOrganization {
  id: string;
  userId: string;
  organizationId: string;
  role: 'super_admin' | 'admin' | 'embajador' | 'staff' | 'user';
  status: 'active' | 'pending' | 'suspended';
  joinedAt: string;
}

// Default organization (Team 1)
export const DEFAULT_ORG: Organization = {
  id: 'org_team1',
  name: 'Team 1',
  slug: 'team-1',
  isDefault: true,
  createdAt: new Date().toISOString()
};

// Mock OAuth user data generators
export const generateMockGoogleUser = (email?: string) => ({
  id: 'google_' + Math.random().toString(36).substr(2, 9),
  email: email || 'usuario@gmail.com',
  name: 'Usuario Demo',
  given_name: 'Usuario',
  family_name: 'Demo',
  picture: 'https://ui-avatars.com/api/?name=Usuario+Demo'
});

export const generateMockAppleUser = (email?: string) => ({
  id: 'apple_' + Math.random().toString(36).substr(2, 9),
  email: email || 'usuario@icloud.com',
  name: { firstName: 'Usuario', lastName: 'Demo' }
});

// Mock email simulation
export const simulateWelcomeEmail = (user: User) => {
  console.log('📧 MOCK EMAIL SENT:', {
    to: user.email,
    subject: 'Bienvenido a EventMetrics',
    body: `Hola ${user.firstName}, bienvenido a EventMetrics! Tu cuenta ha sido creada exitosamente.`,
    timestamp: new Date().toISOString()
  });

  // Simulate email delay
  return new Promise(resolve => setTimeout(resolve, 1000));
};

// Storage keys for localStorage
export const STORAGE_KEYS = {
  USERS: 'eventmetrics_users',
  CURRENT_USER: 'eventmetrics_current_user',
  USER_ORGANIZATIONS: 'eventmetrics_user_organizations',
  ORGANIZATIONS: 'eventmetrics_organizations'
} as const;