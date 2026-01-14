# Jean Test Mobile

JeanTest is a React Native invoicing mobile application built with Expo. It allows business owners to create and manage invoices with their customers.

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Technologies](#technologies)

## ✨ Features

- **List & Search Invoices** - Browse invoices with infinite scroll, search by customer name, and sort by various criteria
- **Create New Invoices** - Build invoices with customer selection, multiple product lines, dates, and status configuration
- **Manage Existing Invoices** - View, edit, finalize, mark as paid, or delete invoices
- **Customer & Product Selection** - Search and select from customers and products when creating invoices
- **Form Validation** - Comprehensive validation with real-time feedback
- **Loading States** - Proper loading indicators and error handling throughout the app

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Yarn** package manager
- **Expo CLI** (optional, but recommended)
- **iOS Simulator** (for macOS) or **Android Emulator** (for testing)
- **Expo Go** app on your mobile device (for physical device testing)

## 🚀 Installation

1. **Clone the repository**

```bash
git clone <your-repository-url>
cd jean_test_mobile
```

2. **Install dependencies**

```bash
yarn install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
API_URL=https://jean-test-api.herokuapp.com/
API_TOKEN=your-api-token-here
```

> **Note**: The API is documented with [OpenAPI](https://jean-test-api.herokuapp.com/api-docs/index.html). All requests require an `X-SESSION` header with your API token.

4. **Start the development server**

```bash
yarn start
```

This will start the Expo development server. You can then:
- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan the QR code with Expo Go app on your device

## 📱 Usage

### Home Screen

- **View invoices**: Scroll through the list of invoices
- **Search**: Use the search bar to find invoices by customer first name
- **Sort**: Tap the sort icon to change sorting options (date, total, status)
- **Refresh**: Pull down to refresh the invoice list
- **View details**: Tap on any invoice card to see full details

### Invoice Details Screen

- **View information**: See customer details, dates, invoice lines, and totals
- **Edit**: Tap the edit button to modify the invoice
- **Finalize**: Tap "Finalize invoice" to convert a draft to a finalized invoice
- **Mark as paid**: Tap "Set as paid" to mark an invoice as paid
- **Delete**: Tap the delete button to remove an invoice (only available for non-finalized, unpaid invoices)

### Editor Screen

- **Create new invoice**: Navigate to the Editor tab and fill in the form
- **Edit existing invoice**: Open an invoice and tap "Edit"
- **Select customer**: Tap the customer field to search and select a customer
- **Add invoice lines**: Tap "Add line" to add products to the invoice
- **Select products**: Tap on a product field to search and select a product
- **Set dates**: Use the date pickers to set invoice date and deadline
- **Configure status**: Toggle finalized and paid status
- **Save**: Tap "Create Invoice" or "Update Invoice" to save

## 📁 Project Structure

The project follows a feature-based structure with clear separation of concerns:

- **`src/api/`** - API client and generated types
- **`src/components/`** - Reusable UI components
- **`src/screens/`** - Screen components (Home, Invoice, Editor, etc.)
- **`src/queries/`** - React Query hooks for data fetching
- **`src/hooks/`** - Custom React hooks
- **`src/navigators/`** - Navigation configuration
- **`src/utils/`** - Utility functions
- **`src/ui/`** - UI configuration and themes
- **`src/types/`** - TypeScript type definitions

## 🧪 Testing

The project includes comprehensive test coverage with Jest and React Native Testing Library.

### Run Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with coverage
yarn test --coverage
```

### Test Structure

- Tests are located alongside their components with `.spec.tsx` extension
- All components and screens have corresponding test files
- Test utilities are in `src/specs/wrapper.tsx`

### Test Coverage

- **27 test suites** covering all major components and screens
- **155+ tests** ensuring functionality and edge cases
- Tests include rendering, user interactions, and data flow validation

## 🛠 Technologies

- **React Native** (0.81.5) - Mobile framework
- **Expo** (54.0.30) - Development platform
- **TypeScript** - Type safety
- **React Navigation** - Navigation library
- **Tamagui** - UI component library
- **React Query** (@tanstack/react-query) - Data fetching and caching
- **React Hook Form** - Form management
- **Jest** - Testing framework
- **React Native Testing Library** - Component testing
- **OpenAPI Client Axios** - API client generation
- **date-fns** - Date manipulation


## 🎯 Key Implementation Details

### State Management

- **React Query** for server state management
- **React Hook Form** for form state
- **React Context** for API client and UI theme

### Data Fetching

- Infinite scroll pagination for large lists
- Optimistic updates for better UX
- Automatic cache invalidation on mutations
- Debounced search queries

### Form Handling

- Comprehensive validation
- Dynamic field arrays for invoice lines
- Real-time calculations
- Error handling and user feedback

### Navigation

- Tab-based navigation for main screens
- Stack navigation for detail views
- Modal screens for selection (customers, products)

## 🤝 Contributing

This is a hiring test project. For questions or issues, please refer to the original test instructions.

## 📄 License

This project is part of a hiring test for Pennylane.

---

**Built with ❤️ using React Native and Expo**
