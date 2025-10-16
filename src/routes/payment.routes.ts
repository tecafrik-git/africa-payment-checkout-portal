import { Router, Request, Response } from 'express';
import { PaymentService } from '../services/payment.service';
import { renderPaymentForm, renderErrorPage, renderSuccessPage } from '../templates/payment.template';
import { PaymentFormInput, ValidatedPaymentInput, PaymentMethod } from '../types/payment.types';

const router = Router();
const paymentService = new PaymentService();

/**
 * GET /payment - Display payment form with product details
 * Query parameters: amount (required), productName (required)
 */
router.get('/payment', (req: Request, res: Response): void => {
    try {
        const { amount, productName } = req.query;

        // Validate required query parameters
        if (!amount || !productName) {
            res.status(400).send(
                renderErrorPage({
                    message: 'Missing required parameters',
                    details: 'Both amount and productName are required query parameters',
                })
            );
            return;
        }

        // Validate amount is a valid number
        const amountNum = parseFloat(amount as string);
        if (isNaN(amountNum) || amountNum <= 0) {
            res.status(400).send(
                renderErrorPage({
                    message: 'Invalid amount',
                    details: 'Amount must be a positive number',
                })
            );
            return;
        }

        // Render payment form
        res.send(
            renderPaymentForm({
                amount: amountNum,
                productName: productName as string,
            })
        );
    } catch (error) {
        console.error('Error displaying payment form:', error);
        res.status(500).send(
            renderErrorPage({
                message: 'Server error',
                details: 'Unable to display payment form. Please try again later.',
            })
        );
    }
});

/**
 * POST /payment/process - Process payment form submission
 * Body: firstName, lastName, phoneNumber, paymentMethod, amount, productName, authorizationCode (optional)
 */
router.post('/payment/process', async (req: Request, res: Response): Promise<void> => {
    try {
        const formInput: PaymentFormInput = req.body;

        // Validate and transform input
        const validationResult = validatePaymentInput(formInput);
        if (!validationResult.valid) {
            res.status(400).send(
                renderErrorPage({
                    message: 'Invalid form data',
                    details: validationResult.error,
                })
            );
            return;
        }

        const validatedInput = validationResult.data!;

        // Initiate payment through payment service
        const paymentResult = await paymentService.initiatePayment({
            firstName: validatedInput.firstName,
            lastName: validatedInput.lastName,
            phoneNumber: validatedInput.phoneNumber,
            paymentMethod: validatedInput.paymentMethod,
            amount: validatedInput.amount,
            productName: validatedInput.productName,
            authorizationCode: validatedInput.authorizationCode,
        });

        // Handle payment result
        if (!paymentResult.success) {
            res.status(500).send(
                renderErrorPage({
                    message: 'Payment processing failed',
                    details: paymentResult.error || 'Please try again later',
                })
            );
            return;
        }

        // If redirectUrl is present, redirect to payment provider
        if (paymentResult.redirectUrl) {
            res.redirect(paymentResult.redirectUrl);
            return;
        }

        // Otherwise, display success page
        res.send(
            renderSuccessPage({
                transactionId: paymentResult.transactionId,
                amount: validatedInput.amount,
                productName: validatedInput.productName,
            })
        );
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).send(
            renderErrorPage({
                message: 'Payment processing error',
                details: 'An unexpected error occurred. Please try again later.',
            })
        );
    }
});

/**
 * Validate and transform payment form input
 */
function validatePaymentInput(input: PaymentFormInput): {
    valid: boolean;
    data?: ValidatedPaymentInput;
    error?: string;
} {
    // Check required fields
    if (!input.firstName || !input.lastName || !input.phoneNumber || !input.paymentMethod || !input.amount || !input.productName) {
        return {
            valid: false,
            error: 'All fields are required',
        };
    }

    // Validate and parse amount
    const amount = parseFloat(input.amount);
    if (isNaN(amount) || amount <= 0) {
        return {
            valid: false,
            error: 'Amount must be a positive number',
        };
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(input.phoneNumber)) {
        return {
            valid: false,
            error: 'Invalid phone number format. Use international format (e.g., +221771234567)',
        };
    }

    // Validate payment method
    const paymentMethod = input.paymentMethod.toUpperCase();
    if (paymentMethod !== 'WAVE' && paymentMethod !== 'ORANGE_MONEY') {
        return {
            valid: false,
            error: 'Invalid payment method. Supported methods: WAVE, ORANGE_MONEY',
        };
    }

    // Map payment method string to enum
    let paymentMethodEnum: PaymentMethod;
    if (paymentMethod === 'WAVE') {
        paymentMethodEnum = PaymentMethod.WAVE;
    } else if (paymentMethod === 'ORANGE_MONEY') {
        paymentMethodEnum = PaymentMethod.ORANGE_MONEY;

        // Validate authorization code for Orange Money
        if (!input.authorizationCode || input.authorizationCode.trim() === '') {
            return {
                valid: false,
                error: 'Authorization code is required for Orange Money payments',
            };
        }
    } else {
        return {
            valid: false,
            error: 'Unsupported payment method',
        };
    }

    return {
        valid: true,
        data: {
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            phoneNumber: input.phoneNumber.trim(),
            paymentMethod: paymentMethodEnum,
            amount,
            productName: input.productName.trim(),
            authorizationCode: input.authorizationCode?.trim(),
        },
    };
}

export default router;
