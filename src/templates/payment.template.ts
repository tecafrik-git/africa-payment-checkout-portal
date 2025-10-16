/**
 * Payment template interfaces and HTML rendering functions
 * Uses TypeScript template literals with inline CSS
 * Color scheme: Black (#000000) primary, Yellow (#FFDB15) secondary
 */

/**
 * Data required to render the payment form
 */
export interface PaymentFormData {
    amount: number;
    productName: string;
    error?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    paymentMethod?: string;
}

/**
 * Data required to render an error page
 */
export interface ErrorPageData {
    message: string;
    details?: string;
}

/**
 * Data required to render a success page
 */
export interface SuccessPageData {
    transactionId: string;
    amount: number;
    productName: string;
}

/**
 * Renders the payment form with product details and customer input fields
 */
export function renderPaymentForm(data: PaymentFormData): string {
    const { amount, productName, error, firstName, lastName, phoneNumber, paymentMethod } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment - ${productName}</title>
  <link rel="preconnect" href="https://cdn.jsdelivr.net">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@24.7.0/build/css/intlTelInput.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background-color: #f5f5f5;
      color: #000000;
      line-height: 1.6;
      padding: 20px;
    }
    
    .container {
      max-width: 500px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 2px solid #000000;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    h1 {
      color: #000000;
      margin-bottom: 10px;
      font-size: 24px;
    }
    
    .product-info {
      background-color: #FFDB15;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 25px;
      border: 1px solid #000000;
    }
    
    .product-name {
      font-size: 18px;
      font-weight: bold;
      color: #000000;
      margin-bottom: 5px;
    }
    
    .product-amount {
      font-size: 28px;
      font-weight: bold;
      color: #000000;
    }
    
    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 20px;
      border: 1px solid #c62828;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      color: #000000;
    }
    
    input, select {
      width: 100%;
      padding: 12px;
      border: 2px solid #000000;
      border-radius: 4px;
      font-size: 16px;
      background-color: #ffffff;
      color: #000000;
    }
    
    input:focus, select:focus {
      outline: none;
      border-color: #FFDB15;
      box-shadow: 0 0 0 3px rgba(255, 219, 21, 0.2);
    }
    
    button {
      width: 100%;
      padding: 14px;
      background-color: #FFDB15;
      color: #000000;
      border: 2px solid #000000;
      border-radius: 4px;
      font-size: 18px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    button:hover {
      background-color: #000000;
      color: #FFDB15;
    }
    
    button:active {
      transform: translateY(1px);
    }
    
    .hidden {
      display: none;
    }
    
    .help-text {
      font-size: 13px;
      color: #666666;
      margin-top: 4px;
    }
    
    /* intl-tel-input custom styling */
    .iti {
      width: 100%;
      display: block;
    }
    
    .iti__input {
      width: 100%;
      padding: 12px;
      padding-left: 52px;
      border: 2px solid #000000;
      border-radius: 4px;
      font-size: 16px;
      background-color: #ffffff;
      color: #000000;
    }
    
    .iti__input:focus {
      outline: none;
      border-color: #FFDB15;
      box-shadow: 0 0 0 3px rgba(255, 219, 21, 0.2);
    }
    
    .iti__input.error {
      border-color: #c62828;
    }
    
    .iti__input.valid {
      border-color: #2e7d32;
    }
    
    .iti__selected-country {
      background-color: #ffffff;
      border-right: 1px solid #000000;
    }
    
    .iti__selected-country:hover {
      background-color: #f5f5f5;
    }
    
    .iti__country-list {
      border: 2px solid #000000;
      border-radius: 4px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-height: 300px;
    }
    
    .iti__country:hover {
      background-color: #FFDB15;
    }
    
    .iti__country.iti__highlight {
      background-color: #FFDB15;
    }
    
    .iti__search-input {
      border: 2px solid #000000;
      border-radius: 4px;
      padding: 8px;
      margin: 8px;
      width: calc(100% - 16px);
    }
    
    .iti__search-input:focus {
      outline: none;
      border-color: #FFDB15;
      box-shadow: 0 0 0 2px rgba(255, 219, 21, 0.2);
    }
    
    .iti__dial-code {
      color: #666666;
    }
    
    #phoneError {
      display: none;
      color: #c62828;
      font-size: 13px;
      margin-top: 4px;
    }
    
    @media (max-width: 600px) {
      .container {
        padding: 20px;
      }
      
      h1 {
        font-size: 20px;
      }
      
      .product-amount {
        font-size: 24px;
      }
      
      /* Mobile fullscreen popup styling */
      .iti--fullscreen-popup .iti__country-list {
        max-height: none;
        border: none;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Complete Your Payment</h1>
    
    <div class="product-info">
      <div class="product-name">${productName}</div>
      <div class="product-amount">${amount} XOF</div>
    </div>
    
    ${error ? `<div class="error-message">${error}</div>` : ''}
    
    <form method="POST" action="/payment/process">
      <input type="hidden" name="amount" value="${amount}">
      <input type="hidden" name="productName" value="${productName}">
      
      <div class="form-group">
        <label for="firstName">First Name *</label>
        <input type="text" id="firstName" name="firstName" value="${firstName || ''}" required>
      </div>
      
      <div class="form-group">
        <label for="lastName">Last Name *</label>
        <input type="text" id="lastName" name="lastName" value="${lastName || ''}" required>
      </div>
      
      <div class="form-group">
        <label for="phoneNumber">Phone Number *</label>
        <input 
          type="tel" 
          id="phoneNumber" 
          name="phoneNumber_display" 
          value="${phoneNumber || ''}"
          required>
        <input 
          type="hidden" 
          id="phoneNumberFull" 
          name="phoneNumber">
        <div id="phoneError"></div>
      </div>
      
      <div class="form-group">
        <label for="paymentMethod">Payment Method *</label>
        <select id="paymentMethod" name="paymentMethod" required>
          <option value="">Select payment method</option>
          <option value="WAVE"${paymentMethod === 'WAVE' ? ' selected' : ''}>Wave</option>
          <option value="ORANGE_MONEY"${paymentMethod === 'ORANGE_MONEY' ? ' selected' : ''}>Orange Money</option>
        </select>
      </div>
      
      <div class="form-group hidden" id="authCodeGroup">
        <label for="authorizationCode">Authorization Code *</label>
        <input 
          type="text" 
          id="authorizationCode" 
          name="authorizationCode" 
          placeholder="Enter code from #144#391#">
        <div class="help-text">Dial #144#391# to get your Orange Money authorization code</div>
      </div>
      
      <button type="submit">Pay Now</button>
    </form>
  </div>
  
  <script>
    // Show/hide authorization code field based on payment method
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const authCodeGroup = document.getElementById('authCodeGroup');
    const authCodeInput = document.getElementById('authorizationCode');
    
    paymentMethodSelect.addEventListener('change', function() {
      if (this.value === 'ORANGE_MONEY') {
        authCodeGroup.classList.remove('hidden');
        authCodeInput.setAttribute('required', 'required');
      } else {
        authCodeGroup.classList.add('hidden');
        authCodeInput.removeAttribute('required');
        authCodeInput.value = '';
      }
    });
  </script>
  <script src="https://cdn.jsdelivr.net/npm/intl-tel-input@24.7.0/build/js/intlTelInput.min.js"></script>
  <script>
    // Initialize intl-tel-input with graceful degradation
    const phoneInput = document.querySelector("#phoneNumber");
    let iti = null;
    
    // Check if intl-tel-input library loaded successfully
    if (typeof window.intlTelInput !== 'undefined') {
      try {
        iti = window.intlTelInput(phoneInput, {
          // Default to Senegal
          initialCountry: "sn",
          
          // Preferred West African countries at the top of the list
          preferredCountries: ["sn", "ci", "ml", "bf", "gn"],
          
          // Load utils for validation and formatting
          utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@24.7.0/build/js/utils.js",
          
          // Format as user types
          formatAsYouType: true,
          
          // Automatically format on display
          formatOnDisplay: true,
          
          // Strict mode for input validation
          strictMode: true,
          
          // Separate dial code display
          separateDialCode: true,
          
          // Enable country search
          countrySearch: true,
          
          // Use fullscreen popup on mobile
          useFullscreenPopup: true,
          
          // Validation number types (mobile)
          validationNumberTypes: ["MOBILE"],
          
          // Auto placeholder based on selected country
          autoPlaceholder: "polite"
        });
      } catch (error) {
        console.error('Failed to initialize intl-tel-input:', error);
        console.log('Falling back to standard HTML5 tel input');
        // Fall back to standard HTML5 tel input
        iti = null;
      }
    } else {
      console.error('intl-tel-input library failed to load from CDN');
      console.log('Falling back to standard HTML5 tel input');
    }
    
    // Form submission handler with validation
    const form = document.querySelector('form');
    const phoneNumberFull = document.querySelector("#phoneNumberFull");
    const errorContainer = document.querySelector("#phoneError");
    
    // Helper function to map error codes to user-friendly messages
    function getErrorMessage(errorCode) {
      if (iti && window.intlTelInput && window.intlTelInput.utils) {
        const validationError = window.intlTelInput.utils.validationError;
        const errorMap = {
          [validationError.INVALID_COUNTRY_CODE]: 'Invalid country code',
          [validationError.TOO_SHORT]: 'Phone number is too short',
          [validationError.TOO_LONG]: 'Phone number is too long',
          [validationError.IS_POSSIBLE_LOCAL_ONLY]: 'Phone number is not valid for mobile use',
          [validationError.INVALID_LENGTH]: 'Invalid phone number length'
        };
        return errorMap[errorCode] || 'Please enter a valid phone number';
      }
      return 'Please enter a valid phone number';
    }
    
    // Real-time validation on blur (focus loss)
    phoneInput.addEventListener('blur', function() {
      if (phoneInput.value.trim()) {
        // Only use intl-tel-input validation if library loaded successfully
        if (iti && iti.isValidNumber) {
          if (iti.isValidNumber()) {
            phoneInput.classList.remove('error');
            phoneInput.classList.add('valid');
            errorContainer.style.display = 'none';
          } else {
            phoneInput.classList.add('error');
            phoneInput.classList.remove('valid');
            const errorCode = iti.getValidationError();
            errorContainer.textContent = getErrorMessage(errorCode);
            errorContainer.style.display = 'block';
          }
        }
        // If library not loaded, rely on HTML5 validation (no visual feedback on blur)
      }
    });
    
    // Clear validation styling while user is typing
    phoneInput.addEventListener('input', function() {
      phoneInput.classList.remove('error', 'valid');
      errorContainer.style.display = 'none';
    });
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let phoneNumber;
      
      // If intl-tel-input is available, use it for validation and formatting
      if (iti && iti.isValidNumber && iti.getNumber) {
        // Validate phone number
        if (!iti.isValidNumber()) {
          // Show error
          phoneInput.classList.add('error');
          phoneInput.classList.remove('valid');
          const errorCode = iti.getValidationError();
          errorContainer.textContent = getErrorMessage(errorCode);
          errorContainer.style.display = 'block';
          return false;
        }
        
        // Get full international number in E.164 format
        phoneNumber = iti.getNumber();
        
        // Remove error styling
        phoneInput.classList.remove('error');
        phoneInput.classList.add('valid');
        errorContainer.style.display = 'none';
      } else {
        // Fallback: use raw input value with basic HTML5 validation
        phoneNumber = phoneInput.value.trim();
        
        // Basic validation - check if phone number is not empty (HTML5 required attribute handles this)
        if (!phoneNumber) {
          errorContainer.textContent = 'Please enter a phone number';
          errorContainer.style.display = 'block';
          return false;
        }
        
        // If no country code, add default Senegal code
        if (!phoneNumber.startsWith('+')) {
          phoneNumber = '+221' + phoneNumber;
        }
      }
      
      // Populate hidden field
      phoneNumberFull.value = phoneNumber;
      
      // Submit form
      form.submit();
    });
  </script
</body>
</html>
  `.trim();
}

/**
 * Renders an error page with message and optional details
 */
export function renderErrorPage(data: ErrorPageData): string {
    const { message, details } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Error</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background-color: #f5f5f5;
      color: #000000;
      line-height: 1.6;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    
    .container {
      max-width: 500px;
      width: 100%;
      background-color: #ffffff;
      border: 2px solid #000000;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .error-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #c62828;
      margin-bottom: 15px;
      font-size: 28px;
    }
    
    .message {
      font-size: 18px;
      color: #000000;
      margin-bottom: 10px;
    }
    
    .details {
      font-size: 14px;
      color: #666666;
      margin-bottom: 30px;
    }
    
    .back-button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #FFDB15;
      color: #000000;
      text-decoration: none;
      border: 2px solid #000000;
      border-radius: 4px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .back-button:hover {
      background-color: #000000;
      color: #FFDB15;
    }
    
    @media (max-width: 600px) {
      .container {
        padding: 30px 20px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      .error-icon {
        font-size: 48px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="error-icon">⚠️</div>
    <h1>Payment Error</h1>
    <p class="message">${message}</p>
    ${details ? `<p class="details">${details}</p>` : ''}
    <a href="javascript:history.back()" class="back-button">Go Back</a>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Renders a success page for completed payments without redirect
 */
export function renderSuccessPage(data: SuccessPageData): string {
    const { transactionId, amount, productName } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background-color: #f5f5f5;
      color: #000000;
      line-height: 1.6;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    
    .container {
      max-width: 500px;
      width: 100%;
      background-color: #ffffff;
      border: 2px solid #000000;
      border-radius: 8px;
      padding: 40px;
      text-align: center;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .success-icon {
      font-size: 64px;
      margin-bottom: 20px;
    }
    
    h1 {
      color: #2e7d32;
      margin-bottom: 15px;
      font-size: 28px;
    }
    
    .message {
      font-size: 18px;
      color: #000000;
      margin-bottom: 30px;
    }
    
    .details-box {
      background-color: #FFDB15;
      padding: 20px;
      border-radius: 6px;
      margin-bottom: 30px;
      border: 1px solid #000000;
      text-align: left;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }
    
    .detail-row:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    
    .detail-label {
      font-weight: 600;
      color: #000000;
    }
    
    .detail-value {
      color: #000000;
      font-weight: bold;
    }
    
    .transaction-id {
      font-family: monospace;
      font-size: 14px;
    }
    
    .home-button {
      display: inline-block;
      padding: 12px 30px;
      background-color: #FFDB15;
      color: #000000;
      text-decoration: none;
      border: 2px solid #000000;
      border-radius: 4px;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .home-button:hover {
      background-color: #000000;
      color: #FFDB15;
    }
    
    @media (max-width: 600px) {
      .container {
        padding: 30px 20px;
      }
      
      h1 {
        font-size: 24px;
      }
      
      .success-icon {
        font-size: 48px;
      }
      
      .detail-row {
        flex-direction: column;
        gap: 5px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="success-icon">✅</div>
    <h1>Payment Successful!</h1>
    <p class="message">Your payment has been processed successfully.</p>
    
    <div class="details-box">
      <div class="detail-row">
        <span class="detail-label">Product:</span>
        <span class="detail-value">${productName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Amount:</span>
        <span class="detail-value">${amount} XOF</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Transaction ID:</span>
        <span class="detail-value transaction-id">${transactionId}</span>
      </div>
    </div>
    
    <a href="/" class="home-button">Return Home</a>
  </div>
</body>
</html>
  `.trim();
}
