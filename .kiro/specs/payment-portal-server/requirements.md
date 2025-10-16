# Requirements Document

## Introduction

This feature implements a simple payment portal NodeJS server that integrates with the @tecafrik/africa-payment-sdk to process mobile money payments through the Paydunya provider. The server provides a web interface where users can enter their customer information and initiate payments for products specified via URL parameters. The portal uses TypeScript for full type safety and HTML templates with inline styling using a black and yellow (#FFDB15) color scheme.

## Requirements

### Requirement 1

**User Story:** As a customer, I want to access a payment form via a URL with product details, so that I can make a payment for a specific product.

#### Acceptance Criteria

1. WHEN a user navigates to a GET route with `amount` and `productName` query parameters THEN the system SHALL display a payment form with the product details
2. WHEN the `amount` or `productName` query parameters are missing THEN the system SHALL display an error message indicating required parameters
3. WHEN the payment form is displayed THEN the system SHALL show the product name and amount prominently
4. WHEN the payment form is rendered THEN the system SHALL use black as the primary color and #FFDB15 as the secondary color

### Requirement 2

**User Story:** As a customer, I want to enter my personal information in the payment form, so that the payment can be processed with my details.

#### Acceptance Criteria

1. WHEN the payment form is displayed THEN the system SHALL provide input fields for first name, last name, phone number, and payment method
2. WHEN the user submits the form without filling all required fields THEN the system SHALL display validation errors
3. WHEN the user enters a phone number THEN the system SHALL accept international format (e.g., +221771234567)
4. WHEN the payment method field is displayed THEN the system SHALL show only mobile money payment options supported by Paydunya
5. WHEN the form is rendered THEN the system SHALL use HTML templates written with TypeScript template literals using the `html` format

### Requirement 3

**User Story:** As a customer, I want the system to initiate a payment when I submit the form, so that I can complete my transaction.

#### Acceptance Criteria

1. WHEN the user submits a valid payment form THEN the system SHALL call the africa-payment-sdk checkout method with the Paydunya provider
2. WHEN calling the checkout method THEN the system SHALL pass the customer information (firstName, lastName, phoneNumber), amount, product name as description, and payment method
3. WHEN calling the checkout method THEN the system SHALL generate a unique transactionId for each payment
4. WHEN the checkout method is called THEN the system SHALL use the PaymentMethod enum for mobile money options
5. WHEN the SDK is initialized THEN the system SHALL configure it to use the Paydunya provider

### Requirement 4

**User Story:** As a customer, I want to be redirected to the payment provider's page after form submission, so that I can complete the payment process.

#### Acceptance Criteria

1. WHEN the checkout result contains a `redirectUrl` THEN the system SHALL redirect the user to that URL
2. WHEN the checkout result does not contain a `redirectUrl` THEN the system SHALL display a success message with payment details
3. WHEN the checkout process fails THEN the system SHALL display an error message to the user
4. WHEN an error occurs during checkout THEN the system SHALL log the error details for debugging

### Requirement 5

**User Story:** As a developer, I want the entire codebase to be fully typed with TypeScript, so that I can catch errors at compile time and have better IDE support.

#### Acceptance Criteria

1. WHEN any code is written THEN the system SHALL use TypeScript with strict type checking enabled
2. WHEN using the africa-payment-sdk THEN the system SHALL import and use the proper TypeScript types from the SDK
3. WHEN defining functions or variables THEN the system SHALL explicitly type them or rely on TypeScript inference
4. WHEN the project is compiled THEN the system SHALL produce no TypeScript errors
5. WHEN HTML templates are created THEN the system SHALL use TypeScript template literals with proper type safety for interpolated variables

### Requirement 6

**User Story:** As a developer, I want a simple server setup with minimal dependencies, so that the project is easy to maintain and deploy.

#### Acceptance Criteria

1. WHEN the server is started THEN the system SHALL run on a configurable port with a default value
2. WHEN the server receives requests THEN the system SHALL use a lightweight Node.js web framework (Express or similar)
3. WHEN the project is set up THEN the system SHALL include only necessary dependencies (@tecafrik/africa-payment-sdk, web framework, TypeScript)
4. WHEN the server is running THEN the system SHALL log startup information including the port number
5. WHEN the server handles errors THEN the system SHALL provide appropriate HTTP status codes and error messages
