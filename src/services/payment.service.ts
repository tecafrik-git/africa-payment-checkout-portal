import AfricaPaymentsProvider, { PaydunyaPaymentProvider } from '@tecafrik/africa-payment-sdk';
import { CheckoutResult, PaymentMethod } from '@tecafrik/africa-payment-sdk';
import { config } from '../config';

/**
 * Payment request interface for initiating payments
 */
export interface PaymentRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    paymentMethod: PaymentMethod;
    amount: number;
    productName: string;
    authorizationCode?: string; // Required for ORANGE_MONEY
}

/**
 * Payment result interface with success status and details
 */
export interface PaymentResult {
    success: boolean;
    redirectUrl?: string;
    transactionId: string;
    message?: string;
    error?: string;
}

/**
 * PaymentService class encapsulates all payment SDK interactions
 */
export class PaymentService {
    private sdk: AfricaPaymentsProvider;

    constructor() {
        // Initialize Paydunya provider with configuration
        const paydunyaProvider = new PaydunyaPaymentProvider({
            masterKey: config.paydunya.masterKey,
            privateKey: config.paydunya.privateKey,
            publicKey: config.paydunya.publicKey,
            token: config.paydunya.token,
            mode: config.paydunya.mode,
            store: {
                name: 'Tecafrik Payment Portal',
            },
            callbackUrl: '', // Not needed for basic checkout flow
        });

        // Initialize AfricaPayments SDK with Paydunya provider
        this.sdk = new AfricaPaymentsProvider(paydunyaProvider);
    }

    /**
     * Initiate a payment using the Africa Payments SDK
     * @param request Payment request details
     * @returns Payment result with redirect URL or error
     */
    async initiatePayment(request: PaymentRequest): Promise<PaymentResult> {
        try {
            const transactionId = this.generateTransactionId();

            console.log(`Initiating payment for transaction ${transactionId}`, {
                amount: request.amount,
                productName: request.productName,
                paymentMethod: request.paymentMethod,
                customer: `${request.firstName} ${request.lastName}`,
            });

            let checkoutResult: CheckoutResult;

            // Handle different payment methods
            if (request.paymentMethod === PaymentMethod.WAVE) {
                checkoutResult = await this.sdk.checkoutMobileMoney({
                    amount: request.amount,
                    description: request.productName,
                    currency: config.currency,
                    transactionId,
                    customer: {
                        firstName: request.firstName,
                        lastName: request.lastName,
                        phoneNumber: request.phoneNumber,
                    },
                    paymentMethod: PaymentMethod.WAVE,
                });
            } else if (request.paymentMethod === PaymentMethod.ORANGE_MONEY) {
                if (!request.authorizationCode) {
                    throw new Error('Authorization code is required for Orange Money payments');
                }
                checkoutResult = await this.sdk.checkoutMobileMoney({
                    amount: request.amount,
                    description: request.productName,
                    currency: config.currency,
                    transactionId,
                    customer: {
                        firstName: request.firstName,
                        lastName: request.lastName,
                        phoneNumber: request.phoneNumber,
                    },
                    paymentMethod: PaymentMethod.ORANGE_MONEY,
                    authorizationCode: request.authorizationCode,
                });
            } else {
                throw new Error(`Unsupported payment method: ${request.paymentMethod}`);
            }

            console.log(`Payment initiated successfully for transaction ${transactionId}`, {
                transactionReference: checkoutResult.transactionReference,
                status: checkoutResult.transactionStatus,
            });

            return {
                success: true,
                redirectUrl: checkoutResult.redirectUrl,
                transactionId: checkoutResult.transactionId,
                message: 'Payment initiated successfully',
            };
        } catch (error) {
            // Log error details for debugging
            console.error('Payment initiation failed:', error);

            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

            return {
                success: false,
                transactionId: this.generateTransactionId(),
                error: errorMessage,
                message: 'Payment initiation failed',
            };
        }
    }

    /**
     * Generate a unique transaction ID
     * Uses timestamp and random number for uniqueness
     * @returns Unique transaction ID string
     */
    private generateTransactionId(): string {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `TXN-${timestamp}-${random}`;
    }
}
