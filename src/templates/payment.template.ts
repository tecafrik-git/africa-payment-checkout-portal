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
    const { amount, productName, error } = data;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment - ${productName}</title>
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
        <input type="text" id="firstName" name="firstName" required>
      </div>
      
      <div class="form-group">
        <label for="lastName">Last Name *</label>
        <input type="text" id="lastName" name="lastName" required>
      </div>
      
      <div class="form-group">
        <label for="phoneNumber">Phone Number *</label>
        <input 
          type="tel" 
          id="phoneNumber" 
          name="phoneNumber" 
          placeholder="+221771234567"
          pattern="\\+?[0-9]{10,15}"
          required>
      </div>
      
      <div class="form-group">
        <label for="paymentMethod">Payment Method *</label>
        <select id="paymentMethod" name="paymentMethod" required>
          <option value="">Select payment method</option>
          <option value="WAVE">Wave</option>
          <option value="ORANGE_MONEY">Orange Money</option>
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
