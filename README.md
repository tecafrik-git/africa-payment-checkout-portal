# Payment Portal Server

A lightweight Node.js payment portal server that integrates with the Paydunya mobile money payment provider through the [@tecafrik/africa-payment-sdk](https://www.npmjs.com/package/@tecafrik/africa-payment-sdk). Built with TypeScript and Express for type safety and simplicity.

## Features

- 🎨 Clean web interface with black and yellow (#FFDB15) color scheme
- 💳 Support for multiple mobile money providers (Orange Money, MTN, Moov, Wave)
- 🔒 Full TypeScript type safety
- ⚡ Lightweight with minimal dependencies
- 🧪 Comprehensive test coverage
- 📱 Responsive design for mobile and desktop

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Paydunya account with API credentials

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd payment-portal-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Configure your environment variables (see [Configuration](#configuration) section)

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | `3000` |
| `PAYDUNYA_MASTER_KEY` | Paydunya master key for authentication | Yes | - |
| `PAYDUNYA_PRIVATE_KEY` | Paydunya private key for API access | Yes | - |
| `PAYDUNYA_PUBLIC_KEY` | Paydunya public key for client-side operations | Yes | - |
| `PAYDUNYA_TOKEN` | Paydunya authentication token | Yes | - |
| `PAYDUNYA_MODE` | Operating mode: `test` or `live` | No | `test` |
| `CURRENCY` | Payment currency code (e.g., XOF, GHS, XAF) | No | `XOF` |

### Obtaining Paydunya Credentials

1. **Sign up for a Paydunya account**:
   - Visit [https://paydunya.com](https://paydunya.com)
   - Click "Sign Up" and complete the registration process
   - Verify your email address

2. **Access your API credentials**:
   - Log in to your Paydunya dashboard
   - Navigate to **Settings** → **API Keys**
   - You'll find your Master Key, Private Key, Public Key, and Token

3. **Test vs Live Mode**:
   - **Test Mode**: Use test credentials for development and testing
   - **Live Mode**: Switch to live credentials when ready for production
   - Set `PAYDUNYA_MODE=test` for testing, `PAYDUNYA_MODE=live` for production

4. **Supported Currencies**:
   - XOF (West African CFA franc) - Côte d'Ivoire, Senegal, etc.
   - GHS (Ghanaian Cedi) - Ghana
   - XAF (Central African CFA franc) - Cameroon, Gabon, etc.

### Example .env File

```env
# Server Configuration
PORT=3000

# Paydunya Configuration
PAYDUNYA_MASTER_KEY=tppk_test_xxxxxxxxxxxxxxxx
PAYDUNYA_PRIVATE_KEY=test_private_xxxxxxxxxxxxxxxx
PAYDUNYA_PUBLIC_KEY=test_public_xxxxxxxxxxxxxxxx
PAYDUNYA_TOKEN=test_token_xxxxxxxxxxxxxxxx
PAYDUNYA_MODE=test

# Payment Configuration
CURRENCY=XOF
```

## Usage

### Development Mode

Run the server with auto-reload on file changes:

```bash
npm run dev
```

### Production Mode

1. Build the TypeScript code:
```bash
npm run build
```

2. Start the server:
```bash
npm start
```

The server will start on the configured port (default: 3000) and log:
```
Payment Portal Server running on port 3000
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## API Endpoints

### GET /payment

Display the payment form with product details.

**Query Parameters**:
- `amount` (required): Payment amount in the configured currency
- `productName` (required): Name of the product being purchased
- `firstName` (optional): Prepopulate the first name field
- `lastName` (optional): Prepopulate the last name field
- `phoneNumber` (optional): Prepopulate the phone number field
- `paymentMethod` (optional): Preselect the payment method (e.g., `orange_money_ci`, `mtn_ci`, `moov_ci`, `wave`)

**Example**:
```bash
# Browser - Basic
http://localhost:3000/payment?amount=5000&productName=Premium%20Subscription

# Browser - With prepopulated customer information
http://localhost:3000/payment?amount=5000&productName=Premium%20Subscription&firstName=John&lastName=Doe&phoneNumber=%2B221771234567&paymentMethod=orange_money_ci

# curl
curl "http://localhost:3000/payment?amount=5000&productName=Premium%20Subscription"
```

**Response**: HTML payment form

### POST /payment/process

Process the payment submission.

**Request Body** (application/x-www-form-urlencoded):
- `firstName`: Customer's first name
- `lastName`: Customer's last name
- `phoneNumber`: Customer's phone number (international format, e.g., +221771234567)
- `paymentMethod`: Selected payment method
- `amount`: Payment amount
- `productName`: Product name

**Example**:
```bash
curl -X POST http://localhost:3000/payment/process \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "firstName=John" \
  -d "lastName=Doe" \
  -d "phoneNumber=+221771234567" \
  -d "paymentMethod=orange_money_ci" \
  -d "amount=5000" \
  -d "productName=Premium Subscription"
```

**Response**: 
- Redirect to Paydunya payment page (302)
- Or HTML success/error page

## Supported Payment Methods

The following mobile money payment methods are supported through Paydunya:

- **Orange Money** (Côte d'Ivoire) - `orange_money_ci`
- **MTN Mobile Money** (Côte d'Ivoire) - `mtn_ci`
- **Moov Money** (Côte d'Ivoire) - `moov_ci`
- **Wave** - `wave`

## URL Prepopulation Feature

The payment portal supports prepopulating customer information via URL query parameters. This feature enables a smoother checkout experience by reducing the amount of data customers need to enter manually.

### How It Works

When you include optional query parameters in the payment URL, the corresponding form fields will be automatically filled with the provided values. Customers can still edit any prepopulated field before submitting the form.

### Optional Query Parameters

| Parameter | Description | Format | Example |
|-----------|-------------|--------|---------|
| `firstName` | Customer's first name | String | `John` |
| `lastName` | Customer's last name | String | `Doe` |
| `phoneNumber` | Customer's phone number | International format with + | `%2B221771234567` (URL-encoded `+221771234567`) |
| `paymentMethod` | Preferred payment method | One of: `orange_money_ci`, `mtn_ci`, `moov_ci`, `wave` | `orange_money_ci` |

**Note**: Invalid `paymentMethod` values are silently ignored, and the form will display the default empty selection.

### URL Prepopulation Examples

#### Example 1: Prepopulate Name Only
```
http://localhost:3000/payment?amount=5000&productName=Premium%20Plan&firstName=Marie&lastName=Diallo
```
- First name field shows: "Marie"
- Last name field shows: "Diallo"
- Phone number and payment method remain empty

#### Example 2: Prepopulate All Customer Information
```
http://localhost:3000/payment?amount=10000&productName=Monthly%20Subscription&firstName=Jean&lastName=Kouassi&phoneNumber=%2B2250707123456&paymentMethod=mtn_ci
```
- First name field shows: "Jean"
- Last name field shows: "Kouassi"
- Phone number field shows: "+2250707123456"
- Payment method dropdown preselects: "MTN Mobile Money"

#### Example 3: Prepopulate Phone and Payment Method
```
http://localhost:3000/payment?amount=2500&productName=Basic%20Plan&phoneNumber=%2B221771234567&paymentMethod=wave
```
- Phone number field shows: "+221771234567"
- Payment method dropdown preselects: "Wave"
- Name fields remain empty

### Use Cases for URL Prepopulation

1. **Returning Customers**: If you have customer information from a previous interaction, prepopulate their details to speed up checkout.

2. **CRM Integration**: When sending payment links via email or SMS from your CRM system, include customer information to personalize the experience.

3. **Mobile App Integration**: When redirecting from a mobile app where you already have user data, pass it along to minimize data entry.

4. **Subscription Renewals**: For recurring payments, prepopulate all customer information so they only need to confirm and pay.

5. **Assisted Sales**: Customer service representatives can generate personalized payment links with customer information already filled in.

### Important Notes

- All prepopulated fields remain **fully editable** by the customer
- Form validation still applies regardless of prepopulation
- Invalid or missing optional parameters are gracefully ignored
- Phone numbers must be URL-encoded (e.g., `+` becomes `%2B`)
- Required parameters (`amount` and `productName`) must always be provided

## Example Usage Scenarios

### Scenario 1: Basic Payment Flow (Browser)

1. Navigate to the payment URL:
```
http://localhost:3000/payment?amount=10000&productName=Monthly%20Subscription
```

2. Fill in the payment form:
   - First Name: Jean
   - Last Name: Kouassi
   - Phone Number: +2250707123456
   - Payment Method: Orange Money

3. Click "Pay Now"

4. You'll be redirected to the Paydunya payment page to complete the transaction

### Scenario 2: Payment Flow with Prepopulated Customer Information

1. Navigate to the payment URL with customer information:
```
http://localhost:3000/payment?amount=10000&productName=Monthly%20Subscription&firstName=Jean&lastName=Kouassi&phoneNumber=%2B2250707123456&paymentMethod=orange_money_ci
```

2. Review the prepopulated form (all fields are editable):
   - First Name: Jean ✓ (prepopulated)
   - Last Name: Kouassi ✓ (prepopulated)
   - Phone Number: +2250707123456 ✓ (prepopulated)
   - Payment Method: Orange Money ✓ (preselected)

3. Make any necessary edits and click "Pay Now"

4. You'll be redirected to the Paydunya payment page to complete the transaction

### Scenario 3: Programmatic Payment Initiation

```bash
# Step 1: Get the payment form (optional, for testing)
curl "http://localhost:3000/payment?amount=5000&productName=Test%20Product"

# Step 2: Submit payment directly
curl -X POST http://localhost:3000/payment/process \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "firstName=Marie" \
  -d "lastName=Diallo" \
  -d "phoneNumber=+221771234567" \
  -d "paymentMethod=orange_money_ci" \
  -d "amount=5000" \
  -d "productName=Test Product"
```

### Scenario 4: Integration with Your Application

```javascript
// Generate basic payment link
const paymentUrl = `http://localhost:3000/payment?amount=${amount}&productName=${encodeURIComponent(productName)}`;

// Redirect user to payment portal
window.location.href = paymentUrl;
```

### Scenario 5: Integration with Prepopulated Customer Data

```javascript
// Generate payment link with customer information for returning users
const customer = {
  firstName: 'Marie',
  lastName: 'Diallo',
  phoneNumber: '+221771234567',
  preferredMethod: 'orange_money_ci'
};

const params = new URLSearchParams({
  amount: '5000',
  productName: 'Premium Subscription',
  firstName: customer.firstName,
  lastName: customer.lastName,
  phoneNumber: customer.phoneNumber,
  paymentMethod: customer.preferredMethod
});

const paymentUrl = `http://localhost:3000/payment?${params.toString()}`;

// Redirect user to prepopulated payment form
window.location.href = paymentUrl;
```

## Project Structure

```
payment-portal-server/
├── src/
│   ├── index.ts                 # Server entry point
│   ├── config.ts                # Configuration management
│   ├── routes/
│   │   ├── payment.routes.ts    # Payment route handlers
│   │   └── __tests__/           # Route integration tests
│   ├── services/
│   │   ├── payment.service.ts   # Payment SDK integration
│   │   └── __tests__/           # Service unit tests
│   ├── templates/
│   │   └── payment.template.ts  # HTML template functions
│   └── types/
│       └── payment.types.ts     # TypeScript type definitions
├── dist/                        # Compiled JavaScript (generated)
├── coverage/                    # Test coverage reports (generated)
├── .env                         # Environment variables (not committed)
├── .env.example                 # Environment variables template
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
└── jest.config.js               # Jest test configuration
```

## Error Handling

The server handles various error scenarios:

- **Missing Parameters** (400): Required query parameters or form fields are missing
- **Invalid Input** (400): Phone number format is invalid or amount is not numeric
- **Payment Failure** (500): Payment provider API errors or network issues
- **Server Errors** (500): Unexpected server-side errors

All errors are displayed in user-friendly HTML pages with appropriate error messages.

## Security Considerations

- Store all sensitive credentials in `.env` file (never commit to version control)
- Use HTTPS in production environments
- Validate and sanitize all user inputs
- Keep dependencies up to date
- Use `PAYDUNYA_MODE=test` for development and testing

## Troubleshooting

### Server won't start

- Check that all required environment variables are set in `.env`
- Verify the port is not already in use
- Ensure Node.js version is 18 or higher

### Payment fails with "Invalid credentials"

- Verify your Paydunya API credentials are correct
- Check that you're using the right mode (test vs live)
- Ensure your Paydunya account is active

### Phone number validation errors

- Use international format: `+[country_code][number]`
- Example: `+221771234567` for Senegal
- Remove spaces and special characters except `+`

### TypeScript compilation errors

```bash
# Clean and rebuild
rm -rf dist
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## License

ISC

## Support

For issues related to:
- **This server**: Open an issue in this repository
- **Paydunya API**: Contact [Paydunya support](https://paydunya.com/support)
- **Africa Payment SDK**: Visit [@tecafrik/africa-payment-sdk](https://www.npmjs.com/package/@tecafrik/africa-payment-sdk)
