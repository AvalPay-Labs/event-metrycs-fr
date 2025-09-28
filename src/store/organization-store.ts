import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  Organization,
  UserOrganization,
  OrganizationMember,
  OrganizationEvent,
  MockOrganizationService
} from '@/lib/mock-organizations';

interface OrganizationState {
  // User's organizations
  userOrganizations: Array<Organization & UserOrganization>;
  isLoadingUserOrgs: boolean;

  // Public organizations for joining
  publicOrganizations: Organization[];
  isLoadingPublicOrgs: boolean;

  // Currently selected organization details
  selectedOrganization: {
    organization: Organization | null;
    members: OrganizationMember[];
    events: OrganizationEvent[];
    userRole?: string;
  };
  isLoadingOrgDetail: boolean;

  // Join requests
  joinRequests: Array<{ orgId: number; status: 'pending' | 'approved' | 'rejected' }>;
  isJoining: boolean;

  // Error handling
  error: string | null;
}

interface OrganizationActions {
  // Load user's organizations
  loadUserOrganizations: (userId: number) => Promise<void>;

  // Load public organizations
  loadPublicOrganizations: () => Promise<void>;

  // Load organization details
  loadOrganizationDetail: (orgId: number) => Promise<void>;

  // Join organization
  requestToJoinOrganization: (orgId: number, userId: number) => Promise<{ success: boolean; message: string }>;

  // Get user's role in a specific organization
  getUserRoleInOrganization: (orgId: number) => string | undefined;

  // Get role permissions
  getRolePermissions: (role: string) => {
    canViewMetrics: boolean;
    canManageMembers: boolean;
    canCreateEvents: boolean;
    canViewReports: boolean;
  };

  // Clear errors
  clearError: () => void;

  // Reset selected organization
  clearSelectedOrganization: () => void;
}

type OrganizationStore = OrganizationState & OrganizationActions;

const initialState: OrganizationState = {
  userOrganizations: [],
  isLoadingUserOrgs: false,
  publicOrganizations: [],
  isLoadingPublicOrgs: false,
  selectedOrganization: {
    organization: null,
    members: [],
    events: [],
    userRole: undefined
  },
  isLoadingOrgDetail: false,
  joinRequests: [],
  isJoining: false,
  error: null
};

export const useOrganizationStore = create<OrganizationStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      loadUserOrganizations: async (userId: number) => {
        set({ isLoadingUserOrgs: true, error: null });

        try {
          const userOrganizations = await MockOrganizationService.getUserOrganizations(userId);
          set({
            userOrganizations,
            isLoadingUserOrgs: false
          });
        } catch (error) {
          set({
            error: 'Failed to load your organizations',
            isLoadingUserOrgs: false
          });
        }
      },

      loadPublicOrganizations: async () => {
        set({ isLoadingPublicOrgs: true, error: null });

        try {
          const publicOrganizations = await MockOrganizationService.getPublicOrganizations();
          set({
            publicOrganizations,
            isLoadingPublicOrgs: false
          });
        } catch (error) {
          set({
            error: 'Failed to load public organizations',
            isLoadingPublicOrgs: false
          });
        }
      },

      loadOrganizationDetail: async (orgId: number) => {
        set({ isLoadingOrgDetail: true, error: null });

        try {
          const detail = await MockOrganizationService.getOrganizationDetail(orgId);

          if (detail) {
            set({
              selectedOrganization: detail,
              isLoadingOrgDetail: false
            });
          } else {
            set({
              error: 'Organization not found',
              isLoadingOrgDetail: false
            });
          }
        } catch (error) {
          set({
            error: 'Failed to load organization details',
            isLoadingOrgDetail: false
          });
        }
      },

      requestToJoinOrganization: async (orgId: number, userId: number) => {
        set({ isJoining: true, error: null });

        try {
          const result = await MockOrganizationService.requestToJoinOrganization(orgId, userId);

          if (result.success) {
            // Add to join requests
            const { joinRequests } = get();
            set({
              joinRequests: [...joinRequests, { orgId, status: 'pending' }],
              isJoining: false
            });
          } else {
            set({
              error: result.message,
              isJoining: false
            });
          }

          return result;
        } catch (error) {
          const errorResult = { success: false, message: 'Failed to send join request' };
          set({
            error: errorResult.message,
            isJoining: false
          });
          return errorResult;
        }
      },

      getUserRoleInOrganization: (orgId: number) => {
        const { userOrganizations } = get();
        const userOrg = userOrganizations.find(org => org.id === orgId);
        return userOrg?.role;
      },

      getRolePermissions: (role: string) => {
        return MockOrganizationService.getRolePermissions(role);
      },

      clearError: () => {
        set({ error: null });
      },

      clearSelectedOrganization: () => {
        set({
          selectedOrganization: {
            organization: null,
            members: [],
            events: [],
            userRole: undefined
          }
        });
      }
    }),
    {
      name: 'organization-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist user organizations and join requests
        userOrganizations: state.userOrganizations,
        joinRequests: state.joinRequests
      })
    }
  )
);

// Helper hooks for common use cases
export const useUserOrganizations = () => {
  const store = useOrganizationStore();
  return {
    organizations: store.userOrganizations,
    isLoading: store.isLoadingUserOrgs,
    loadOrganizations: store.loadUserOrganizations,
    error: store.error
  };
};

export const usePublicOrganizations = () => {
  const store = useOrganizationStore();
  return {
    organizations: store.publicOrganizations,
    isLoading: store.isLoadingPublicOrgs,
    loadOrganizations: store.loadPublicOrganizations,
    joinRequests: store.joinRequests,
    requestToJoin: store.requestToJoinOrganization,
    isJoining: store.isJoining,
    error: store.error
  };
};

export const useOrganizationDetail = () => {
  const store = useOrganizationStore();
  return {
    detail: store.selectedOrganization,
    isLoading: store.isLoadingOrgDetail,
    loadDetail: store.loadOrganizationDetail,
    clearDetail: store.clearSelectedOrganization,
    getUserRole: store.getUserRoleInOrganization,
    getRolePermissions: store.getRolePermissions,
    error: store.error
  };
};