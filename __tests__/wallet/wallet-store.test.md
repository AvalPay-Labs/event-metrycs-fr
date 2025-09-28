# Wallet Store Test Specification

This document outlines the test cases for the wallet store functionality.
When a testing framework is added (Jest + React Testing Library), these tests should be implemented.

## Test Cases for Wallet Store

### 1. Initial State Tests
- `should have initial state with no connection`
- `should not be connected initially`
- `should have no error initially`
- `should not be connecting initially`

### 2. Connect Wallet Tests
- `should successfully connect Core wallet`
- `should successfully connect MetaMask wallet`
- `should successfully connect Avalanche wallet`
- `should generate valid mock address format`
- `should set connecting state during connection`
- `should persist connection to localStorage`
- `should clear error on successful connection`

### 3. Disconnect Wallet Tests
- `should disconnect wallet successfully`
- `should clear connection state`
- `should remove connection from localStorage`
- `should reset isConnected to false`

### 4. Error Handling Tests
- `should handle connection errors gracefully`
- `should set error state on connection failure`
- `should clear error when clearError is called`

### 5. Persistence Tests
- `should restore connection from localStorage on initialization`
- `should handle invalid localStorage data gracefully`
- `should convert stored date strings back to Date objects`

## Test Cases for Wallet Components

### WalletButton Component
- `should render "Connect Wallet" when not connected`
- `should render truncated address when connected`
- `should show appropriate wallet icon`
- `should open modal when clicked and not connected`
- `should disconnect when clicked and connected`

### WalletConnectionModal Component
- `should not render when isOpen is false`
- `should render all three wallet options`
- `should show demo tag and description`
- `should handle wallet selection`
- `should show loading state during connection`
- `should close on successful connection`
- `should display errors if connection fails`

### WalletStatus Component
- `should show disconnected state when no wallet`
- `should show connected state with wallet info`
- `should display full address when showFullAddress is true`
- `should display connection time when showConnectionTime is true`
- `should handle address copying`

## API Endpoint Tests

### POST /api/wallet/connect
- `should accept valid wallet connection request`
- `should validate wallet type`
- `should validate address format`
- `should return success response for valid request`
- `should return error for invalid wallet type`
- `should return error for invalid address format`
- `should return error for missing fields`

### GET /api/wallet/connect
- `should return API information`
- `should list supported wallet types`
- `should indicate demo mode`

## Integration Tests

### Dashboard Integration
- `should show wallet button in actions section`
- `should display wallet status when connected`
- `should initialize wallet state on page load`

### Profile Page Integration
- `should show wallet connection card`
- `should display wallet status or connection prompt`
- `should provide wallet management actions`

## Mock Data Tests

### Address Generation
- `should generate addresses with correct format (0x + 40 hex chars)`
- `should append 'demo' suffix to mock addresses`
- `should generate unique addresses for each connection`
- `should handle all supported wallet types`

## Implementation Notes

To implement these tests:

1. Install testing dependencies:
   ```bash
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
   ```

2. Configure Jest for Next.js in `jest.config.js`

3. Create test files with `.test.ts` or `.test.tsx` extensions

4. Mock localStorage for browser storage tests

5. Mock Next.js router for navigation tests

6. Use MSW (Mock Service Worker) for API endpoint testing