# Design Document

## Overview

The payment portal server is a lightweight Node.js application built with Express and TypeScript that provides a web interface for processing mobile money payments through the Paydunya provider using the @tecafrik/africa-payment-sdk. The application follows a simple request-response pattern with two main routes: one for displaying the payment form and another for processing the payment submission.

The architecture prioritizes simplicity and type safety, using TypeScript template literals for HTML rendering to avoid additional templating engine dependencies while maintaining full type safety.

## Architecture

### High-Level Architecture

```mermaid
graph TD
    A[User Browser] -->|GET /payment?amount=X&productName=Y| B[Express Server]
    B -->|Render| C[Payment Form HTML]
    C -->|POST /payment/process| B
    B -->|checkout| D[@tecafrik/africa-payment-sdk]
    D -->|API Call| E[Paydunya Provider]
    E -->|Response with redirectUrl| D
    D -->|checkoutResult| B
    B -->|Redirect| F[Paydunya Payment Page]
```

### Technology Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript (strict mode)
- **Web Framework**: Express.js
- **Payment SDK**: @tecafrik/africa-payment-sdk
- **Template Engine**: TypeScript template literals (no external engine)
- **Body Parser**: express built-in JSON and urlencoded parsers

### Project Structure

```
payment-portal-server/
├── src/
│   ├── index.ts                 # Server entry point
│   ├── config.ts                # Configuration and environment variables
│   ├── routes/
│   │   └── payment.routes.ts    # Payment route handlers
│   ├── services/
│   │   └── payment.service.ts   # Payment SDK integration logic
│   ├── templates/
│   │   └── payment.template.ts  # HTML template functions
│   └── types/
│       └── payment.types.ts     # Custom TypeScript types
├── package.json
├── tsconfig.json
└── .env.example
```

## Components and Interfaces

### 1. Server Entry Point (index.ts)

**Responsibility**: Initialize Express server, configure middleware, register routes, and start listening.

**Key Functions**:
- `startServer()`: Initializes and starts the Express application
- Configures body parsers for form data
- Sets up error handling middleware
- Listens on configured port

**Dependencies**: Express, payment routes, config

### 2. Configuration Module (config.ts)

**Responsibility**: Centralize all configuration values and environment variables.

**Interface**:
```typescript
interface Config {
  port: number;
  paydunya: {
    masterKey: string;
    privateKey: string;
    publicKey: string;
    token: string;
    mode: 'live' | 'test';
  };
  currency: Currency;
}
```

**Environment Variables**:
- `PORT`: Server port (default: 3000)
- `PAYDUNYA_MASTER_KEY`: Paydunya master key
- `PAYDUNYA_PRIVATE_KEY`: Paydunya private key
- `PAYDUNYA_PUBLIC_KEY`: Paydunya public key
- `PAYDUNYA_TOKEN`: Paydunya token
- `PAYDUNYA_MODE`: 'live' or 'test' (default: 'test')
- `CURRENCY`: Payment currency (default: XOF)

### 3. Payment Routes (payment.routes.ts)

**Responsibility**: Handle HTTP requests for payment form display and payment processing.

**Routes**:

1. `GET /payment`
   - Query Parameters: 
     - `amount` (required): Payment amount
     - `productName` (required): Product name
     - `firstName` (optional): Prepopulate first name field
     - `lastName` (optional): Prepopulate last name field
     - `phoneNumber` (optional): Prepopulate phone number field
     - `paymentMethod` (optional): Preselect payment method
   - Response: HTML payment form with prepopulated values
   - Error Cases: Missing required parameters return 400 with error page

2. `POST /payment/process`
   - Body: `{ firstName, lastName, phoneNumber, paymentMethod, amount, productName }`
   - Response: Redirect to payment provider or success/error page
   - Error Cases: Validation errors, SDK errors

**Route Handlers**:
```typescript
async function showPaymentForm(req: Request, res: Response): Promise<void>
async function processPayment(req: Request, res: Response): Promise<void>
```

### 4. Payment Service (payment.service.ts)

**Responsibility**: Encapsulate all payment SDK interactions and business logic.

**Interface**:
```typescript
interface PaymentRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
  amount: number;
  productName: string;
}

interface PaymentResult {
  success: boolean;
  redirectUrl?: string;
  transactionId: string;
  message?: string;
  error?: string;
}

class PaymentService {
  private sdk: AfricaPayments;
  
  constructor(config: PaydunyaConfig);
  async initiatePayment(request: PaymentRequest): Promise<PaymentResult>;
  private generateTransactionId(): string;
}
```

**Key Functions**:
- `initiatePayment()`: Calls SDK checkout method and handles response
- `generateTransactionId()`: Generates unique transaction IDs (timestamp + random)

### 5. HTML Templates (payment.template.ts)

**Responsibility**: Generate type-safe HTML using TypeScript template literals.

**Interface**:
```typescript
interface PaymentFormData {
  amount: number;
  productName: string;
  error?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  paymentMethod?: string;
}

interface ErrorPageData {
  message: string;
  details?: string;
}

interface SuccessPageData {
  transactionId: string;
  amount: number;
  productName: string;
}

function renderPaymentForm(data: PaymentFormData): string;
function renderErrorPage(data: ErrorPageData): string;
function renderSuccessPage(data: SuccessPageData): string;
```

**Template Features**:
- Responsive design with mobile-first approach
- Black (#000000) primary color for text and borders
- Yellow (#FFDB15) secondary color for buttons and accents
- Form validation attributes (required, pattern for phone)
- Support for prepopulating form fields via optional properties
- All prepopulated fields remain editable by users
- Inline CSS to avoid external dependencies

### 6. Custom Types (payment.types.ts)

**Responsibility**: Define application-specific TypeScript types that extend or complement SDK types.

```typescript
// Re-export SDK types for convenience
export { PaymentMethod, Currency, CheckoutResult } from '@tecafrik/africa-payment-sdk';

// Application-specific types
export interface PaymentFormInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  paymentMethod: string;
  amount: string;
  productName: string;
}

export interface ValidatedPaymentInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
  amount: number;
  productName: string;
}
```

## Data Models

### Payment Request Flow

1. **URL Parameters** → `PaymentFormData`
   - Extracted from query string
   - Required: `amount`, `productName`
   - Optional: `firstName`, `lastName`, `phoneNumber`, `paymentMethod`
   - Validated for presence and type
   - Optional parameters passed directly to template as optional properties

2. **Form Submission** → `PaymentFormInput`
   - Raw string data from POST body
   - May contain user-edited values from prepopulated fields
   - Requires validation and transformation

3. **Validated Input** → `ValidatedPaymentInput`
   - Type-safe, validated data
   - Ready for SDK consumption

4. **SDK Checkout** → `CheckoutResult`
   - Response from africa-payment-sdk
   - Contains redirectUrl or error information

5. **User Response** → HTML or Redirect
   - Either redirect to payment provider
   - Or display success/error page

### Payment Method Mapping

For Paydunya provider, the supported mobile money payment methods are:
- `PaymentMethod.ORANGE_MONEY_CI` (Orange Money Côte d'Ivoire)
- `PaymentMethod.MTN_CI` (MTN Mobile Money Côte d'Ivoire)
- `PaymentMethod.MOOV_CI` (Moov Money Côte d'Ivoire)
- `PaymentMethod.WAVE` (Wave)

The payment form will display these as dropdown options with user-friendly labels.

### URL Prepopulation

When optional query parameters are provided in the payment URL, the form fields will be prepopulated:

**Example URL**:
```
/payment?amount=5000&productName=Premium%20Plan&firstName=John&lastName=Doe&phoneNumber=%2B221771234567&paymentMethod=WAVE
```

**Prepopulation Behavior**:
- Values are URL-decoded and inserted into form field `value` attributes
- For select dropdowns, the matching option is marked as `selected`
- Invalid payment method values are ignored (form shows default empty selection)
- All fields remain editable regardless of prepopulation
- Form validation still applies on submission

## Error Handling

### Error Categories

1. **Validation Errors** (400 Bad Request)
   - Missing required query parameters (`amount`, `productName`)
   - Missing required form fields
   - Invalid phone number format
   - Invalid amount (non-numeric or negative)
   - Note: Invalid optional prepopulation parameters are silently ignored

2. **SDK Errors** (500 Internal Server Error)
   - Payment provider API failures
   - Network timeouts
   - Invalid credentials

3. **Server Errors** (500 Internal Server Error)
   - Unexpected exceptions
   - Configuration errors

### Error Handling Strategy

```typescript
// Route-level error handling
try {
  // Process payment
} catch (error) {
  console.error('Payment processing error:', error);
  
  if (error instanceof ValidationError) {
    return res.status(400).send(renderErrorPage({
      message: 'Invalid input',
      details: error.message
    }));
  }
  
  return res.status(500).send(renderErrorPage({
    message: 'Payment processing failed',
    details: 'Please try again later'
  }));
}
```

### Logging

- Log all payment initiation attempts with transaction ID
- Log SDK errors with full error details
- Log server startup and configuration (without sensitive data)
- Use console.log for info, console.error for errors

## Testing Strategy

### Unit Testing

- **Payment Service**: Mock SDK responses to test payment initiation logic
- **Template Functions**: Test HTML generation with various input data
- **Validation Logic**: Test input validation with valid and invalid data

### Integration Testing

- **Route Handlers**: Test full request-response cycle with mocked SDK
- **Form Submission**: Test POST endpoint with various form data
- **Error Scenarios**: Test error handling for various failure modes

### Manual Testing

- **End-to-End Flow**: Test complete payment flow with Paydunya test credentials
- **UI/UX**: Verify form rendering, styling, and responsiveness
- **Provider Integration**: Test actual redirect to Paydunya payment page

### Testing Tools

- Jest for unit and integration tests
- Supertest for HTTP endpoint testing
- Mock implementations of AfricaPayments SDK for isolated testing

## Security Considerations

1. **Environment Variables**: Store all sensitive credentials in .env file (not committed)
2. **Input Validation**: Validate and sanitize all user inputs
3. **HTTPS**: Recommend HTTPS in production (handled by deployment platform)
4. **CORS**: Not required for server-rendered forms, but can be added if needed
5. **Rate Limiting**: Consider adding rate limiting for production use

## Deployment Considerations

1. **Environment Setup**: Provide .env.example with all required variables
2. **Build Process**: Compile TypeScript to JavaScript before deployment
3. **Process Management**: Use PM2 or similar for production
4. **Port Configuration**: Use PORT environment variable for flexibility
5. **Logging**: Ensure logs are accessible for debugging

## Future Enhancements

- Support for additional payment providers beyond Paydunya
- Webhook handling for payment status updates
- Payment history and transaction tracking
- Admin dashboard for viewing transactions
- Multi-currency support
- Internationalization (i18n) for multiple languages
