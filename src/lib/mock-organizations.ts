export interface Organization {
  id: number;
  name: string;
  type: 'default' | 'community' | 'company' | 'university' | 'startup';
  description: string;
  memberCount: number;
  eventsCount: number;
  isDefault?: boolean;
  isPublic: boolean;
  logoUrl?: string;
  createdAt: string;
  status: 'active' | 'inactive';
}

export interface UserOrganization {
  organizationId: number;
  role: 'user' | 'admin' | 'ambassador' | 'staff';
  status: 'active' | 'pending' | 'rejected';
  joinedAt: string;
}

export interface OrganizationMember {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'ambassador' | 'staff';
  avatarUrl: string;
  joinedAt: string;
  walletAddress: string;
}

export interface OrganizationEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  type: 'workshop' | 'hackathon' | 'meetup' | 'conference';
  attendees: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export const mockOrganizations: Organization[] = [
  {
    id: 1,
    name: "Team 1",
    type: "default",
    description: "Default organization for new users - explore EventMetrics features",
    memberCount: 156,
    eventsCount: 12,
    isDefault: true,
    isPublic: true,
    logoUrl: "/org-logos/team1.png",
    createdAt: "2024-01-15T10:00:00Z",
    status: "active"
  },
  {
    id: 2,
    name: "Avalanche Developers Colombia",
    type: "community",
    description: "Blockchain developer community in Colombia building on Avalanche",
    memberCount: 89,
    eventsCount: 8,
    isPublic: true,
    logoUrl: "/org-logos/avax-colombia.png",
    createdAt: "2024-02-20T14:30:00Z",
    status: "active"
  },
  {
    id: 3,
    name: "CryptoStartup Inc",
    type: "startup",
    description: "Innovative DeFi startup revolutionizing decentralized finance",
    memberCount: 23,
    eventsCount: 15,
    isPublic: false,
    logoUrl: "/org-logos/cryptostartup.png",
    createdAt: "2024-01-08T09:15:00Z",
    status: "active"
  },
  {
    id: 4,
    name: "Universidad Nacional Blockchain Lab",
    type: "university",
    description: "Research lab focusing on blockchain applications in academia",
    memberCount: 45,
    eventsCount: 6,
    isPublic: true,
    logoUrl: "/org-logos/unal-blockchain.png",
    createdAt: "2024-03-10T16:45:00Z",
    status: "active"
  },
  {
    id: 5,
    name: "Web3 Enterprise Solutions",
    type: "company",
    description: "Enterprise-grade blockchain solutions for traditional businesses",
    memberCount: 78,
    eventsCount: 22,
    isPublic: false,
    logoUrl: "/org-logos/web3enterprise.png",
    createdAt: "2023-11-25T11:20:00Z",
    status: "active"
  }
];

export const mockUserOrganizations: UserOrganization[] = [
  {
    organizationId: 1,
    role: "user",
    status: "active",
    joinedAt: "2024-09-27T10:00:00Z"
  }
];

export const generateMockMembers = (organizationId: number, count: number): OrganizationMember[] => {
  const names = [
    "Ana García", "Carlos Rodríguez", "María López", "Juan Pérez", "Laura Martínez",
    "Diego Sánchez", "Carmen Torres", "Antonio González", "Elena Ruiz", "Miguel Fernández",
    "Sofia Jiménez", "Fernando Castro", "Lucia Morales", "Roberto Silva", "Isabel Vargas",
    "Alejandro Ortiz", "Natalia Herrera", "Raúl Mendoza", "Patricia Ramírez", "Andrés Cruz"
  ];

  const roles: Array<'user' | 'admin' | 'ambassador' | 'staff'> = ['user', 'admin', 'ambassador', 'staff'];

  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: names[index % names.length],
    email: `${names[index % names.length].toLowerCase().replace(' ', '.')}@eventmetrics.demo`,
    role: index === 0 ? 'admin' : roles[Math.floor(Math.random() * roles.length)],
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${names[index % names.length]}`,
    joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`
  }));
};

export const generateMockEvents = (organizationId: number, count: number): OrganizationEvent[] => {
  const eventTitles = [
    "Blockchain Fundamentals Workshop",
    "DeFi Development Hackathon",
    "Smart Contract Security Meetup",
    "Avalanche C-Chain Deep Dive",
    "Web3 UX/UI Design Conference",
    "NFT Marketplace Development",
    "DAO Governance Workshop",
    "Cryptocurrency Trading Seminar",
    "Layer 2 Solutions Discussion",
    "Cross-chain Bridge Development"
  ];

  const eventTypes: Array<'workshop' | 'hackathon' | 'meetup' | 'conference'> =
    ['workshop', 'hackathon', 'meetup', 'conference'];

  const statuses: Array<'upcoming' | 'ongoing' | 'completed' | 'cancelled'> =
    ['upcoming', 'ongoing', 'completed', 'cancelled'];

  return Array.from({ length: count }, (_, index) => {
    const baseDate = new Date();
    const randomDays = Math.floor(Math.random() * 180) - 90; // ±90 days from now
    const eventDate = new Date(baseDate.getTime() + randomDays * 24 * 60 * 60 * 1000);

    return {
      id: index + 1,
      title: eventTitles[index % eventTitles.length],
      description: `Hands-on ${eventTitles[index % eventTitles.length].toLowerCase()} for blockchain enthusiasts`,
      date: eventDate.toISOString(),
      type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
      attendees: Math.floor(Math.random() * 100) + 10,
      status: randomDays < -7 ? 'completed' : randomDays < 0 ? 'ongoing' : 'upcoming'
    };
  });
};

export class MockOrganizationService {
  static async getUserOrganizations(userId: number): Promise<Array<Organization & UserOrganization>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    return mockUserOrganizations.map(userOrg => {
      const org = mockOrganizations.find(o => o.id === userOrg.organizationId)!;
      const { status: _orgStatus, ...orgRest } = org;
      return {
        ...orgRest,
        organizationId: userOrg.organizationId,
        role: userOrg.role,
        status: userOrg.status,
        joinedAt: userOrg.joinedAt
      } as Organization & UserOrganization;
    });
  }

  static async getPublicOrganizations(): Promise<Organization[]> {
    await new Promise(resolve => setTimeout(resolve, 1200));

    return mockOrganizations.filter(org => org.isPublic && !org.isDefault);
  }

  static async getOrganizationDetail(orgId: number): Promise<{
    organization: Organization;
    members: OrganizationMember[];
    events: OrganizationEvent[];
    userRole?: string;
  } | null> {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const organization = mockOrganizations.find(org => org.id === orgId);
    if (!organization) return null;

    const userOrg = mockUserOrganizations.find(uo => uo.organizationId === orgId);

    return {
      organization,
      members: generateMockMembers(orgId, Math.min(organization.memberCount, 20)),
      events: generateMockEvents(orgId, Math.min(organization.eventsCount, 10)),
      userRole: userOrg?.role
    };
  }

  static async requestToJoinOrganization(orgId: number, userId: number): Promise<{
    success: boolean;
    message: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const org = mockOrganizations.find(o => o.id === orgId);
    if (!org) {
      return { success: false, message: "Organization not found" };
    }

    if (!org.isPublic) {
      return { success: false, message: "This organization is private" };
    }

    // Simulate adding pending request
    mockUserOrganizations.push({
      organizationId: orgId,
      role: "user",
      status: "pending",
      joinedAt: new Date().toISOString()
    });

    return {
      success: true,
      message: `Join request sent to ${org.name}. You'll be notified when approved.`
    };
  }

  static getRolePermissions(role: string): {
    canViewMetrics: boolean;
    canManageMembers: boolean;
    canCreateEvents: boolean;
    canViewReports: boolean;
  } {
    switch (role) {
      case 'admin':
        return {
          canViewMetrics: true,
          canManageMembers: true,
          canCreateEvents: true,
          canViewReports: true
        };
      case 'ambassador':
        return {
          canViewMetrics: true,
          canManageMembers: false,
          canCreateEvents: true,
          canViewReports: true
        };
      case 'staff':
        return {
          canViewMetrics: false,
          canManageMembers: false,
          canCreateEvents: false,
          canViewReports: false
        };
      case 'user':
      default:
        return {
          canViewMetrics: false,
          canManageMembers: false,
          canCreateEvents: false,
          canViewReports: false
        };
    }
  }
}