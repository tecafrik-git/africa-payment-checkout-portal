# Implementation Plan

- [x] 1. Initialize project structure and dependencies
  - Create package.json with TypeScript, Express, and @tecafrik/africa-payment-sdk dependencies
  - Set up tsconfig.json with strict mode enabled
  - Create src directory structure (routes, services, templates, types folders)
  - Create .env.example file with all required environment variables
  - _Requirements: 5.1, 5.2, 6.3_

- [x] 2. Implement configuration module
  - Create src/config.ts with Config interface
  - Load environment variables with defaults
  - Export typed configuration object for Paydunya credentials, port, and currency
  - _Requirements: 6.1, 6.4_

- [x] 3. Create custom TypeScript types
  - Create src/types/payment.types.ts
  - Define PaymentFormInput, ValidatedPaymentInput interfaces
  - Re-export SDK types (PaymentMethod, Currency, CheckoutResult)
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 4. Implement HTML template functions
  - Create src/templates/payment.template.ts with template interfaces
  - Implement renderPaymentForm() function with black and #FFDB15 color scheme
  - Implement renderErrorPage() function for error display
  - Implement renderSuccessPage() function for successful payments without redirect
  - Include inline CSS with responsive design and form validation attributes
  - _Requirements: 1.3, 1.4, 2.5, 4.2_

- [x] 5. Implement payment service
  - Create src/services/payment.service.ts with PaymentService class
  - Initialize AfricaPayments SDK with Paydunya provider configuration
  - Implement initiatePayment() method that calls SDK checkout with proper parameters
  - Implement generateTransactionId() helper for unique transaction IDs
  - Add error handling and logging for SDK operations
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.4_

- [x] 5.1 Write unit tests for payment service
  - Create tests for initiatePayment with mocked SDK responses
  - Test transaction ID generation uniqueness
  - Test error handling scenarios
  - _Requirements: 3.1, 3.2, 4.4_

- [x] 6. Implement payment route handlers
  - Create src/routes/payment.routes.ts with Express router
  - Implement GET /payment handler with query parameter validation
  - Implement POST /payment/process handler with form data validation
  - Add input validation for required fields and data types
  - Handle checkout results and perform redirects or render success/error pages
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 3.1, 4.1, 4.2, 4.3, 6.5_

- [x] 6.1 Write integration tests for payment routes
  - Test GET /payment with valid and missing parameters
  - Test POST /payment/process with valid and invalid form data
  - Test error handling with mocked payment service
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 4.3_

- [x] 7. Create server entry point
  - Create src/index.ts with Express app initialization
  - Configure body parsers (urlencoded and JSON)
  - Register payment routes
  - Add global error handling middleware
  - Implement startServer() function that listens on configured port
  - Add startup logging with port information
  - _Requirements: 6.1, 6.2, 6.4, 6.5_

- [x] 8. Add build and start scripts
  - Add TypeScript compilation script to package.json
  - Add development script with ts-node for local testing
  - Add start script for running compiled JavaScript
  - Verify TypeScript compilation produces no errors
  - _Requirements: 5.4, 6.1_

- [x] 9. Create documentation
  - Write README.md with setup instructions
  - Document environment variables and their purposes
  - Provide example usage with curl or browser
  - Include instructions for obtaining Paydunya credentials
  - _Requirements: 6.3, 6.4_

- [x] 10. Add URL prepopulation support for customer information
  - Update PaymentFormData interface to include optional firstName, lastName, phoneNumber, and paymentMethod fields
  - Modify GET /payment route handler to extract optional query parameters
  - Update renderPaymentForm template to prepopulate input fields with provided values
  - Ensure invalid paymentMethod values are ignored and default to empty selection
  - Verify all prepopulated fields remain editable
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 10.1 Write tests for URL prepopulation
  - Test GET /payment with prepopulated firstName, lastName, phoneNumber
  - Test GET /payment with valid paymentMethod prepopulation
  - Test GET /payment with invalid paymentMethod (should be ignored)
  - Test form rendering with partial prepopulation
  - Verify form validation still works with prepopulated values
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.7, 7.8_

- [x] 11. Update documentation for URL prepopulation
  - Add examples of URLs with prepopulated customer information to README.md
  - Document all optional query parameters and their expected formats
  - Include use cases for URL prepopulation feature
  - _Requirements: 7.1, 7.2, 7.3, 7.4_
