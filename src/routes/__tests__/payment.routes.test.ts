import request from 'supertest';
import express, { Express } from 'express';
import { PaymentService } from '../../services/payment.service';
import { PaymentMethod } from '../../types/payment.types';

// Mock the PaymentService module
jest.mock('../../services/payment.service');

describe('Payment Routes Integration Tests', () => {
    let app: Express;
    let mockInitiatePayment: jest.Mock;

    beforeEach(() => {
        // Clear all mocks
        jest.clearAllMocks();

        // Setup mock for initiatePayment method
        mockInitiatePayment = jest.fn();
        (PaymentService as jest.MockedClass<typeof PaymentService>).mockImplementation(() => {
            return {
                initiatePayment: mockInitiatePayment,
            } as any;
        });

        // Import router after mocking (to ensure mock is applied)
        jest.isolateModules(() => {
            const paymentRouter = require('../payment.routes').default;

            // Create Express app with payment routes
            app = express();
            app.use(express.json());
            app.use(express.urlencoded({ extended: true }));
            app.use(paymentRouter);
        });
    });

    describe('GET /payment', () => {
        describe('with valid parameters', () => {
            it('should return 200 and render payment form with valid amount and productName', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ amount: '5000', productName: 'Premium Subscription' });

                expect(response.status).toBe(200);
                expect(response.text).toContain('Premium Subscription');
                expect(response.text).toContain('5000');
                expect(response.text).toContain('form');
            });

            it('should handle decimal amounts correctly', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ amount: '99.99', productName: 'Test Product' });

                expect(response.status).toBe(200);
                expect(response.text).toContain('Test Product');
                expect(response.text).toContain('99.99');
            });
        });

        describe('with missing parameters', () => {
            it('should return 400 when amount is missing', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ productName: 'Test Product' });

                expect(response.status).toBe(400);
                expect(response.text).toContain('Missing required parameters');
                expect(response.text).toContain('amount and productName are required');
            });

            it('should return 400 when productName is missing', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ amount: '5000' });

                expect(response.status).toBe(400);
                expect(response.text).toContain('Missing required parameters');
            });

            it('should return 400 when both parameters are missing', async () => {
                const response = await request(app)
                    .get('/payment');

                expect(response.status).toBe(400);
                expect(response.text).toContain('Missing required parameters');
            });
        });

        describe('with invalid parameters', () => {
            it('should return 400 when amount is not a number', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ amount: 'invalid', productName: 'Test Product' });

                expect(response.status).toBe(400);
                expect(response.text).toContain('Invalid amount');
                expect(response.text).toContain('positive number');
            });

            it('should return 400 when amount is negative', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ amount: '-100', productName: 'Test Product' });

                expect(response.status).toBe(400);
                expect(response.text).toContain('Invalid amount');
            });

            it('should return 400 when amount is zero', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ amount: '0', productName: 'Test Product' });

                expect(response.status).toBe(400);
                expect(response.text).toContain('Invalid amount');
            });
        });

        describe('with optional prepopulation parameters', () => {
            it('should prepopulate firstName when provided', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ 
                        amount: '5000', 
                        productName: 'Test Product',
                        firstName: 'John'
                    });

                expect(response.status).toBe(200);
                expect(response.text).toContain('value="John"');
            });

            it('should prepopulate lastName when provided', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ 
                        amount: '5000', 
                        productName: 'Test Product',
                        lastName: 'Doe'
                    });

                expect(response.status).toBe(200);
                expect(response.text).toContain('value="Doe"');
            });

            it('should prepopulate phoneNumber when provided', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ 
                        amount: '5000', 
                        productName: 'Test Product',
                        phoneNumber: '+221771234567'
                    });

                expect(response.status).toBe(200);
                expect(response.text).toContain('value="+221771234567"');
            });

            it('should preselect valid paymentMethod WAVE', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ 
                        amount: '5000', 
                        productName: 'Test Product',
                        paymentMethod: 'WAVE'
                    });

                expect(response.status).toBe(200);
                expect(response.text).toContain('value="WAVE" selected');
            });

            it('should preselect valid paymentMethod ORANGE_MONEY', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ 
                        amount: '5000', 
                        productName: 'Test Product',
                        paymentMethod: 'ORANGE_MONEY'
                    });

                expect(response.status).toBe(200);
                expect(response.text).toContain('value="ORANGE_MONEY" selected');
            });

            it('should ignore invalid paymentMethod and show default empty selection', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ 
                        amount: '5000', 
                        productName: 'Test Product',
                        paymentMethod: 'INVALID_METHOD'
                    });

                expect(response.status).toBe(200);
                expect(response.text).not.toContain('selected');
            });

            it('should prepopulate all customer fields when provided', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ 
                        amount: '5000', 
                        productName: 'Test Product',
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '+221771234567',
                        paymentMethod: 'WAVE'
                    });

                expect(response.status).toBe(200);
                expect(response.text).toContain('value="John"');
                expect(response.text).toContain('value="Doe"');
                expect(response.text).toContain('value="+221771234567"');
                expect(response.text).toContain('value="WAVE" selected');
            });

            it('should handle partial prepopulation correctly', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ 
                        amount: '5000', 
                        productName: 'Test Product',
                        firstName: 'John',
                        paymentMethod: 'WAVE'
                    });

                expect(response.status).toBe(200);
                expect(response.text).toContain('value="John"');
                expect(response.text).toContain('value="WAVE" selected');
                // lastName and phoneNumber should be empty
                expect(response.text).toMatch(/name="lastName"[^>]*value=""/);
            });

            it('should handle case-insensitive paymentMethod values', async () => {
                const response = await request(app)
                    .get('/payment')
                    .query({ 
                        amount: '5000', 
                        productName: 'Test Product',
                        paymentMethod: 'wave'
                    });

                expect(response.status).toBe(200);
                expect(response.text).toContain('value="WAVE" selected');
            });
        });

        describe('form validation with prepopulated values', () => {
            it('should validate form submission even with prepopulated values', async () => {
                // First, verify the form renders with prepopulated values
                const getResponse = await request(app)
                    .get('/payment')
                    .query({ 
                        amount: '5000', 
                        productName: 'Test Product',
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '+221771234567',
                        paymentMethod: 'WAVE'
                    });

                expect(getResponse.status).toBe(200);
                expect(getResponse.text).toContain('value="John"');

                // Now submit the form with valid data (simulating user kept prepopulated values)
                const mockResult = {
                    success: true,
                    redirectUrl: 'https://paydunya.com/checkout/abc123',
                    transactionId: 'TXN-123456',
                };
                mockInitiatePayment.mockResolvedValue(mockResult);

                const postResponse = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '+221771234567',
                        paymentMethod: 'WAVE',
                        amount: '5000',
                        productName: 'Test Product',
                    });

                expect(postResponse.status).toBe(302);
                expect(mockInitiatePayment).toHaveBeenCalled();
            });

            it('should reject invalid data even if form was prepopulated', async () => {
                // Form was prepopulated with valid data
                const getResponse = await request(app)
                    .get('/payment')
                    .query({ 
                        amount: '5000', 
                        productName: 'Test Product',
                        firstName: 'John',
                        phoneNumber: '+221771234567'
                    });

                expect(getResponse.status).toBe(200);

                // But user submits with invalid phone number
                const postResponse = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '123', // Invalid phone number
                        paymentMethod: 'WAVE',
                        amount: '5000',
                        productName: 'Test Product',
                    });

                expect(postResponse.status).toBe(400);
                expect(postResponse.text).toContain('Invalid phone number format');
            });

            it('should validate edited prepopulated values on submission', async () => {
                // Form prepopulated with some values
                const getResponse = await request(app)
                    .get('/payment')
                    .query({ 
                        amount: '5000', 
                        productName: 'Test Product',
                        firstName: 'John'
                    });

                expect(getResponse.status).toBe(200);

                // User edits and submits with missing required field
                const postResponse = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'John',
                        // Missing lastName
                        phoneNumber: '+221771234567',
                        paymentMethod: 'WAVE',
                        amount: '5000',
                        productName: 'Test Product',
                    });

                expect(postResponse.status).toBe(400);
                expect(postResponse.text).toContain('All fields are required');
            });
        });
    });

    describe('POST /payment/process', () => {
        describe('with valid form data', () => {
            it('should redirect to payment provider when redirectUrl is returned', async () => {
                const mockResult = {
                    success: true,
                    redirectUrl: 'https://paydunya.com/checkout/abc123',
                    transactionId: 'TXN-123456',
                };

                mockInitiatePayment.mockResolvedValue(mockResult);

                const response = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '+221771234567',
                        paymentMethod: 'WAVE',
                        amount: '5000',
                        productName: 'Premium Subscription',
                    });

                expect(response.status).toBe(302);
                expect(response.header.location).toBe('https://paydunya.com/checkout/abc123');
                expect(mockInitiatePayment).toHaveBeenCalledWith({
                    firstName: 'John',
                    lastName: 'Doe',
                    phoneNumber: '+221771234567',
                    paymentMethod: PaymentMethod.WAVE,
                    amount: 5000,
                    productName: 'Premium Subscription',
                    authorizationCode: undefined,
                });
            });

            it('should render success page when no redirectUrl is returned', async () => {
                const mockResult = {
                    success: true,
                    transactionId: 'TXN-789012',
                };

                mockInitiatePayment.mockResolvedValue(mockResult);

                const response = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'Jane',
                        lastName: 'Smith',
                        phoneNumber: '+221771234567',
                        paymentMethod: 'WAVE',
                        amount: '2500',
                        productName: 'Basic Plan',
                    });

                expect(response.status).toBe(200);
                expect(response.text).toContain('TXN-789012');
                expect(response.text).toContain('Basic Plan');
                expect(response.text).toContain('2500');
            });

            it('should handle Orange Money payment with authorization code', async () => {
                const mockResult = {
                    success: true,
                    redirectUrl: 'https://paydunya.com/checkout/xyz789',
                    transactionId: 'TXN-456789',
                };

                mockInitiatePayment.mockResolvedValue(mockResult);

                const response = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'Alice',
                        lastName: 'Johnson',
                        phoneNumber: '+221771234567',
                        paymentMethod: 'ORANGE_MONEY',
                        amount: '10000',
                        productName: 'Enterprise Plan',
                        authorizationCode: '123456',
                    });

                expect(response.status).toBe(302);
                expect(mockInitiatePayment).toHaveBeenCalledWith({
                    firstName: 'Alice',
                    lastName: 'Johnson',
                    phoneNumber: '+221771234567',
                    paymentMethod: PaymentMethod.ORANGE_MONEY,
                    amount: 10000,
                    productName: 'Enterprise Plan',
                    authorizationCode: '123456',
                });
            });
        });

        describe('with invalid form data', () => {
            it('should return 400 when required fields are missing', async () => {
                const response = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'John',
                        // Missing other required fields
                    });

                expect(response.status).toBe(400);
                expect(response.text).toContain('Invalid form data');
                expect(response.text).toContain('All fields are required');
            });

            it('should return 400 when phone number format is invalid', async () => {
                const response = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '123', // Too short
                        paymentMethod: 'WAVE',
                        amount: '5000',
                        productName: 'Test Product',
                    });

                expect(response.status).toBe(400);
                expect(response.text).toContain('Invalid phone number format');
            });

            it('should return 400 when amount is invalid', async () => {
                const response = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '+221771234567',
                        paymentMethod: 'WAVE',
                        amount: 'invalid',
                        productName: 'Test Product',
                    });

                expect(response.status).toBe(400);
                expect(response.text).toContain('Amount must be a positive number');
            });

            it('should return 400 when payment method is invalid', async () => {
                const response = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '+221771234567',
                        paymentMethod: 'INVALID_METHOD',
                        amount: '5000',
                        productName: 'Test Product',
                    });

                expect(response.status).toBe(400);
                expect(response.text).toContain('Invalid payment method');
            });

            it('should return 400 when Orange Money is selected without authorization code', async () => {
                const response = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '+221771234567',
                        paymentMethod: 'ORANGE_MONEY',
                        amount: '5000',
                        productName: 'Test Product',
                        // Missing authorizationCode
                    });

                expect(response.status).toBe(400);
                expect(response.text).toContain('Authorization code is required for Orange Money');
            });
        });

        describe('error handling with mocked payment service', () => {
            it('should return 500 when payment service returns failure', async () => {
                const mockResult = {
                    success: false,
                    transactionId: 'TXN-FAILED',
                    error: 'Payment provider unavailable',
                };

                mockInitiatePayment.mockResolvedValue(mockResult);

                const response = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '+221771234567',
                        paymentMethod: 'WAVE',
                        amount: '5000',
                        productName: 'Test Product',
                    });

                expect(response.status).toBe(500);
                expect(response.text).toContain('Payment processing failed');
                expect(response.text).toContain('Payment provider unavailable');
            });

            it('should return 500 when payment service throws an error', async () => {
                mockInitiatePayment.mockRejectedValue(
                    new Error('Network error')
                );

                const response = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '+221771234567',
                        paymentMethod: 'WAVE',
                        amount: '5000',
                        productName: 'Test Product',
                    });

                expect(response.status).toBe(500);
                expect(response.text).toContain('Payment processing error');
                expect(response.text).toContain('unexpected error occurred');
            });

            it('should handle timeout errors gracefully', async () => {
                mockInitiatePayment.mockRejectedValue(
                    new Error('Request timeout')
                );

                const response = await request(app)
                    .post('/payment/process')
                    .send({
                        firstName: 'John',
                        lastName: 'Doe',
                        phoneNumber: '+221771234567',
                        paymentMethod: 'WAVE',
                        amount: '5000',
                        productName: 'Test Product',
                    });

                expect(response.status).toBe(500);
                expect(response.text).toContain('Payment processing error');
            });
        });
    });
});
