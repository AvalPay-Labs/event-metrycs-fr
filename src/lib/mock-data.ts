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
  type: 'default' | 'community' | 'company' | 'startup' | 'university';
  description: string;
  memberCount: number;
  eventsCount: number;
  isDefault: boolean;
  isPublic: boolean;
  logoUrl?: string;
  createdAt: string;
}

export interface UserOrganization {
  id: string;
  userId: string;
  organizationId: string;
  role: 'super_admin' | 'admin' | 'ambassador' | 'staff' | 'user';
  status: 'active' | 'pending' | 'suspended';
  joinedAt: string;
}

export interface OrganizationMember {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'ambassador' | 'staff' | 'user';
  status: 'active' | 'pending' | 'suspended';
  joinedAt: string;
  avatarUrl?: string;
}

export interface OrganizationEvent {
  id: string;
  organizationId: string;
  name: string;
  type: 'workshop' | 'hackathon' | 'meetup' | 'conference';
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  attendees: number;
  location: string;
}

export interface OrganizationActivity {
  id: string;
  organizationId: string;
  type: 'member_joined' | 'event_created' | 'event_completed' | 'milestone_reached';
  description: string;
  timestamp: string;
  userId?: string;
  userName?: string;
}

// Default organization (Team 1)
export const DEFAULT_ORG: Organization = {
  id: 'org_team1',
  name: 'Team 1',
  slug: 'team-1',
  type: 'default',
  description: 'Default organization for new users',
  memberCount: 156,
  eventsCount: 12,
  isDefault: true,
  isPublic: true,
  createdAt: new Date().toISOString()
};

// Mock organizations data
export const MOCK_ORGANIZATIONS: Organization[] = [
  DEFAULT_ORG,
  {
    id: 'org_avax_col',
    name: 'Avalanche Developers Colombia',
    slug: 'avalanche-developers-colombia',
    type: 'community',
    description: 'Blockchain developer community in Colombia',
    memberCount: 89,
    eventsCount: 8,
    isDefault: false,
    isPublic: true,
    logoUrl: 'https://ui-avatars.com/api/?name=AD&background=E84142&color=fff',
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'org_cryptostartup',
    name: 'CryptoStartup Inc',
    slug: 'cryptostartup-inc',
    type: 'startup',
    description: 'Startup focused on DeFi solutions',
    memberCount: 23,
    eventsCount: 15,
    isDefault: false,
    isPublic: false,
    logoUrl: 'https://ui-avatars.com/api/?name=CS&background=3B82F6&color=fff',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'org_blockchain_uni',
    name: 'Blockchain University Network',
    slug: 'blockchain-university-network',
    type: 'university',
    description: 'Academic blockchain research and education',
    memberCount: 234,
    eventsCount: 42,
    isDefault: false,
    isPublic: true,
    logoUrl: 'https://ui-avatars.com/api/?name=BU&background=8B5CF6&color=fff',
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'org_defi_corp',
    name: 'DeFi Corporation',
    slug: 'defi-corporation',
    type: 'company',
    description: 'Enterprise blockchain and DeFi solutions',
    memberCount: 67,
    eventsCount: 28,
    isDefault: false,
    isPublic: true,
    logoUrl: 'https://ui-avatars.com/api/?name=DC&background=10B981&color=fff',
    createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'org_web3_innovators',
    name: 'Web3 Innovators Hub',
    slug: 'web3-innovators-hub',
    type: 'community',
    description: 'Global Web3 innovation and collaboration',
    memberCount: 512,
    eventsCount: 64,
    isDefault: false,
    isPublic: true,
    logoUrl: 'https://ui-avatars.com/api/?name=W3&background=F59E0B&color=fff',
    createdAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString()
  }
];

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