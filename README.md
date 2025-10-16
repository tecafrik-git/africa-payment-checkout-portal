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
cd africa-payment-checkout-portal
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

## Enhanced International Phone Input

The payment portal features an enhanced phone number input powered by the [intl-tel-input](https://github.com/jackocnr/intl-tel-input) library. This provides a superior user experience with automatic country detection, real-time formatting, and validation.

### Key Features

- 🌍 **Country Selection**: Visual country flags with searchable dropdown of all countries
- 📱 **Smart Formatting**: Automatic phone number formatting as you type based on selected country
- ✅ **Real-time Validation**: Instant feedback with visual indicators (green for valid, red for invalid)
- 🎯 **Auto-detection**: Automatically detects country from international phone numbers
- 📲 **Mobile Optimized**: Fullscreen country picker on mobile devices for better usability
- 🇸🇳 **Senegal Default**: Defaults to Senegal (+221) with West African countries prioritized
- 🔄 **Backward Compatible**: Seamlessly integrates with existing payment processing

### How It Works

The enhanced phone input automatically:

1. **Displays country flag and dial code** next to the input field
2. **Formats numbers in real-time** according to the selected country's format
3. **Validates phone numbers** against international standards for the selected country
4. **Converts to E.164 format** (+[country_code][number]) for submission to the backend
5. **Provides visual feedback** with color-coded borders (green = valid, red = invalid)

### Default Configuration

The phone input is configured with the following defaults:

- **Default Country**: Senegal (SN) with +221 dial code
- **Preferred Countries**: Senegal, Côte d'Ivoire, Mali, Burkina Faso, Guinea (displayed at top of list)
- **Validation Type**: Mobile numbers only
- **Format**: E.164 international format for submission (e.g., `+221771234567`)

### Using the Enhanced Phone Input

#### Basic Usage

1. The country selector defaults to Senegal 🇸🇳 (+221)
2. Type your phone number - it formats automatically as you type
3. The input validates on blur and shows:
   - **Green border** ✓ if the number is valid
   - **Red border** ✗ with error message if invalid
4. On form submission, the number is automatically converted to E.164 format

#### Changing Countries

1. Click the country flag/selector on the left side of the input
2. Search for a country by typing in the search box
3. Select your country from the list
4. Your number will automatically reformat for the selected country

#### Mobile Experience

On mobile devices:
- Country selection opens as a **fullscreen popup** for easier selection
- **Numeric keyboard** appears automatically when entering phone number
- **Search functionality** helps quickly find countries
- Touch-optimized interface with larger tap targets

### Phone Number Formats

The enhanced input accepts and formats various phone number formats:

#### Input Formats Accepted

```
National format:     771234567
International:       +221771234567
With spaces:         +221 77 123 45 67
With parentheses:    +221 (77) 123-4567
```

#### Output Format (E.164)

All phone numbers are submitted to the backend in **E.164 format**:

```
+221771234567
```

This is the international standard format:
- Starts with `+`
- Followed by country code (1-3 digits)
- Followed by subscriber number (up to 15 digits total)
- No spaces, parentheses, or other formatting

### Validation Error Messages

The input provides specific error messages for different validation issues:

| Error | Message | Cause |
|-------|---------|-------|
| Invalid country code | "Invalid country code" | Country code doesn't exist |
| Too short | "Phone number is too short" | Number has fewer digits than required |
| Too long | "Phone number is too long" | Number has more digits than allowed |
| Invalid format | "Invalid phone number" | Number doesn't match country's format |
| General error | "Please enter a valid phone number" | Other validation issues |

### Prepopulation with Enhanced Input

The enhanced phone input works seamlessly with URL prepopulation:

#### Example 1: International Format (Auto-detects Country)
```
?phoneNumber=%2B221771234567
```
- Country automatically detected as Senegal 🇸🇳
- Number formatted as: (77) 123-4567
- Dial code shown separately: +221

#### Example 2: Different Country
```
?phoneNumber=%2B33612345678
```
- Country automatically detected as France 🇫🇷
- Number formatted according to French format
- Dial code shown: +33

#### Example 3: National Format (Uses Default Country)
```
?phoneNumber=771234567
```
- Default country used: Senegal 🇸🇳
- Number formatted as: (77) 123-4567
- Dial code added: +221

### Customizing the Default Country

If you need to change the default country from Senegal, modify the initialization in `src/templates/payment.template.ts`:

```javascript
const iti = window.intlTelInput(phoneInput, {
  initialCountry: "ci",  // Change to Côte d'Ivoire
  preferredCountries: ["ci", "sn", "ml", "bf", "gn"],  // Reorder preferred countries
  // ... other options
});
```

**Common Country Codes**:
- `sn` - Senegal (+221)
- `ci` - Côte d'Ivoire (+225)
- `ml` - Mali (+223)
- `bf` - Burkina Faso (+226)
- `gn` - Guinea (+224)
- `gh` - Ghana (+233)
- `ng` - Nigeria (+234)
- `fr` - France (+33)

### Technical Implementation

The enhanced phone input is implemented using:

- **Library**: intl-tel-input v24.7.0+
- **Loading**: CDN-based (no build dependencies)
- **Assets**: ~60KB initial load, ~320KB with validation utilities
- **Compatibility**: Works on all modern browsers (Chrome, Firefox, Safari, Edge)
- **Fallback**: Gracefully degrades to standard HTML5 tel input if CDN fails

### Browser Compatibility

The enhanced phone input is fully supported on:

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Android Chrome)

If the library fails to load (e.g., CDN unavailable), the form automatically falls back to a standard HTML5 phone input with basic validation.

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
africa-payment-checkout-portal/
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
