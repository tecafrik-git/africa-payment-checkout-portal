import { PaymentMethod } from '@tecafrik/africa-payment-sdk';

// Re-export SDK types for convenience
export { PaymentMethod, Currency, CheckoutResult } from '@tecafrik/africa-payment-sdk';

// Application-specific types

/**
 * Raw form input data from POST request body
 * All fields are strings as received from HTML form
 */
export interface PaymentFormInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  paymentMethod: string;
  amount: string;
  productName: string;
  authorizationCode?: string; // Required for ORANGE_MONEY
}

/**
 * Validated and transformed payment input
 * Ready for SDK consumption with proper types
 */
export interface ValidatedPaymentInput {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  paymentMethod: PaymentMethod;
  amount: number;
  productName: string;
  authorizationCode?: string; // Required for ORANGE_MONEY
}
