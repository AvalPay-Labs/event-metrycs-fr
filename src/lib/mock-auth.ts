// Mock authentication service for EventMetrics
// Simulates all authentication functionality using localStorage

import {
  User,
  UserOrganization,
  DEFAULT_ORG,
  generateMockGoogleUser,
  generateMockAppleUser,
  simulateWelcomeEmail,
  STORAGE_KEYS
} from './mock-data';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

export class MockAuthService {
  // Initialize default data if not exists
  static initializeStorage() {
    if (typeof window === 'undefined') return; // SSR safety

    // Initialize organizations with default Team 1
    if (!localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS)) {
      localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify([DEFAULT_ORG]));
    }

    // Initialize users array with test users
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      const testUsers: User[] = [
        {
          id: 'user_test001',
          email: 'user@test.com',
          firstName: 'Test',
          lastName: 'User',
          emailVerified: true,
          provider: 'email',
          termsAccepted: true,
          privacyAccepted: true,
          termsAcceptedAt: '2025-09-27T10:00:00.000Z',
          privacyAcceptedAt: '2025-09-27T10:00:00.000Z',
          createdAt: '2025-09-27T10:00:00.000Z',
          updatedAt: '2025-09-27T10:00:00.000Z'
        },
        {
          id: 'user_admin001',
          email: 'admin@team1.com',
          firstName: 'Admin',
          lastName: 'User',
          emailVerified: true,
          provider: 'email',
          termsAccepted: true,
          privacyAccepted: true,
          termsAcceptedAt: '2025-09-27T10:00:00.000Z',
          privacyAcceptedAt: '2025-09-27T10:00:00.000Z',
          createdAt: '2025-09-27T10:00:00.000Z',
          updatedAt: '2025-09-27T10:00:00.000Z'
        },
        {
          id: 'user_ambassador001',
          email: 'ambassador@team1.com',
          firstName: 'Ambassador',
          lastName: 'User',
          emailVerified: true,
          provider: 'email',
          termsAccepted: true,
          privacyAccepted: true,
          termsAcceptedAt: '2025-09-27T10:00:00.000Z',
          privacyAcceptedAt: '2025-09-27T10:00:00.000Z',
          createdAt: '2025-09-27T10:00:00.000Z',
          updatedAt: '2025-09-27T10:00:00.000Z'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(testUsers));
    }

    // Initialize user organizations with test user assignments
    if (!localStorage.getItem(STORAGE_KEYS.USER_ORGANIZATIONS)) {
      const testUserOrgs: UserOrganization[] = [
        {
          id: 'user_org_test001',
          userId: 'user_test001',
          organizationId: DEFAULT_ORG.id,
          role: 'user',
          status: 'active',
          joinedAt: '2025-09-27T10:00:00.000Z'
        },
        {
          id: 'user_org_admin001',
          userId: 'user_admin001',
          organizationId: DEFAULT_ORG.id,
          role: 'admin',
          status: 'active',
          joinedAt: '2025-09-27T10:00:00.000Z'
        },
        {
          id: 'user_org_ambassador001',
          userId: 'user_ambassador001',
          organizationId: DEFAULT_ORG.id,
          role: 'ambassador',
          status: 'active',
          joinedAt: '2025-09-27T10:00:00.000Z'
        }
      ];
      localStorage.setItem(STORAGE_KEYS.USER_ORGANIZATIONS, JSON.stringify(testUserOrgs));
    }
  }

  // Get all users
  static getUsers(): User[] {
    if (typeof window === 'undefined') return [];
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  }

  // Save users
  static saveUsers(users: User[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  // Get user organizations
  static getUserOrganizations(): UserOrganization[] {
    if (typeof window === 'undefined') return [];
    const userOrgs = localStorage.getItem(STORAGE_KEYS.USER_ORGANIZATIONS);
    return userOrgs ? JSON.parse(userOrgs) : [];
  }

  // Save user organizations
  static saveUserOrganizations(userOrgs: UserOrganization[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_ORGANIZATIONS, JSON.stringify(userOrgs));
  }

  // Check if email exists
  static emailExists(email: string): boolean {
    const users = this.getUsers();
    return users.some(user => user.email.toLowerCase() === email.toLowerCase());
  }

  // Mock password validation (simulate hashing)
  static validatePassword(password: string): boolean {
    return password.length >= 8 &&
           /[A-Z]/.test(password) &&
           /[a-z]/.test(password) &&
           /\d/.test(password) &&
           /[!@#$%^&*(),.?\":{}|<>]/.test(password);
  }

  // Mock password hashing
  static hashPassword(password: string): string {
    // Simulate password hashing (in real app, use bcrypt)
    return 'mock_hash_' + btoa(password);
  }

  // Register new user
  static async register(data: RegisterData): Promise<{ success: boolean; user?: User; message?: string }> {
    this.initializeStorage();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { success: false, message: 'Formato de email inválido' };
    }

    // Check if email already exists
    if (this.emailExists(data.email)) {
      return { success: false, message: 'Este email ya está registrado' };
    }

    // Validate password
    if (!this.validatePassword(data.password)) {
      return {
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos'
      };
    }

    // Validate terms and privacy
    if (!data.termsAccepted || !data.privacyAccepted) {
      return { success: false, message: 'Debes aceptar los términos de servicio y política de privacidad' };
    }

    // Create new user
    const now = new Date().toISOString();
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email: data.email.toLowerCase(),
      firstName: data.firstName,
      lastName: data.lastName,
      emailVerified: true, // Mock: auto-verified
      provider: 'email',
      termsAccepted: data.termsAccepted,
      privacyAccepted: data.privacyAccepted,
      termsAcceptedAt: now,
      privacyAcceptedAt: now,
      createdAt: now,
      updatedAt: now
    };

    // Save user
    const users = this.getUsers();
    users.push(newUser);
    this.saveUsers(users);

    // Auto-assign to Team 1 organization
    await this.assignUserToDefaultOrganization(newUser.id);

    // Simulate welcome email
    await simulateWelcomeEmail(newUser);

    return { success: true, user: newUser };
  }

  // Login user
  static async login(data: LoginData): Promise<{ success: boolean; user?: User; message?: string }> {
    this.initializeStorage();

    const users = this.getUsers();
    const user = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());

    if (!user) {
      return { success: false, message: 'Email o contraseña incorrectos' };
    }

    // Mock password verification - allow simple test passwords for pre-seeded users
    const testCredentials = [
      { email: 'user@test.com', password: 'password123' },
      { email: 'admin@team1.com', password: 'admin123' },
      { email: 'ambassador@team1.com', password: 'ambassador123' }
    ];

    const isTestUser = testCredentials.some(cred =>
      cred.email === data.email.toLowerCase() && cred.password === data.password
    );

    // For test users, accept simple passwords; for new users, validate complexity
    if (!isTestUser && !this.validatePassword(data.password)) {
      return { success: false, message: 'Email o contraseña incorrectos' };
    }

    // Set current user
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));

    return { success: true, user };
  }

  // Mock Google OAuth registration
  static async registerWithGoogle(email?: string): Promise<{ success: boolean; user?: User; message?: string }> {
    this.initializeStorage();

    const mockGoogleData = generateMockGoogleUser(email);

    // Check if email already exists
    if (this.emailExists(mockGoogleData.email)) {
      return { success: false, message: 'Este email ya está registrado' };
    }

    // Create user from Google data
    const now = new Date().toISOString();
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email: mockGoogleData.email,
      firstName: mockGoogleData.given_name,
      lastName: mockGoogleData.family_name,
      emailVerified: true,
      provider: 'google',
      providerId: mockGoogleData.id,
      termsAccepted: true, // Mock: auto-accepted for OAuth
      privacyAccepted: true,
      termsAcceptedAt: now,
      privacyAcceptedAt: now,
      createdAt: now,
      updatedAt: now
    };

    // Save user
    const users = this.getUsers();
    users.push(newUser);
    this.saveUsers(users);

    // Auto-assign to Team 1
    await this.assignUserToDefaultOrganization(newUser.id);

    // Simulate welcome email
    await simulateWelcomeEmail(newUser);

    console.log('🔗 MOCK GOOGLE OAUTH: User registered successfully');

    return { success: true, user: newUser };
  }

  // Mock Apple OAuth registration
  static async registerWithApple(email?: string): Promise<{ success: boolean; user?: User; message?: string }> {
    this.initializeStorage();

    const mockAppleData = generateMockAppleUser(email);

    // Check if email already exists
    if (this.emailExists(mockAppleData.email)) {
      return { success: false, message: 'Este email ya está registrado' };
    }

    // Create user from Apple data
    const now = new Date().toISOString();
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email: mockAppleData.email,
      firstName: mockAppleData.name.firstName,
      lastName: mockAppleData.name.lastName,
      emailVerified: true,
      provider: 'apple',
      providerId: mockAppleData.id,
      termsAccepted: true, // Mock: auto-accepted for OAuth
      privacyAccepted: true,
      termsAcceptedAt: now,
      privacyAcceptedAt: now,
      createdAt: now,
      updatedAt: now
    };

    // Save user
    const users = this.getUsers();
    users.push(newUser);
    this.saveUsers(users);

    // Auto-assign to Team 1
    await this.assignUserToDefaultOrganization(newUser.id);

    // Simulate welcome email
    await simulateWelcomeEmail(newUser);

    console.log('🍎 MOCK APPLE ID: User registered successfully');

    return { success: true, user: newUser };
  }

  // Assign user to default organization (Team 1)
  static async assignUserToDefaultOrganization(userId: string) {
    const userOrganizations = this.getUserOrganizations();
    const newAssignment: UserOrganization = {
      id: 'user_org_' + Math.random().toString(36).substr(2, 9),
      userId,
      organizationId: DEFAULT_ORG.id,
      role: 'user',
      status: 'active',
      joinedAt: new Date().toISOString()
    };

    userOrganizations.push(newAssignment);
    this.saveUserOrganizations(userOrganizations);

    console.log('🏢 MOCK ORG ASSIGNMENT: User assigned to Team 1 with User role');
  }

  // Get current user
  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    const currentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return currentUser ? JSON.parse(currentUser) : null;
  }

  // Logout
  static logout() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  // Get user organizations for a user
  static getUserOrgMemberships(userId: string): UserOrganization[] {
    const userOrgs = this.getUserOrganizations();
    return userOrgs.filter(uo => uo.userId === userId);
  }
}