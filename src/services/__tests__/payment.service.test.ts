import { PaymentService, PaymentRequest } from '../payment.service';
import AfricaPaymentsProvider from '@tecafrik/africa-payment-sdk';
import { PaymentMethod, CheckoutResult } from '@tecafrik/africa-payment-sdk';

// Define TransactionStatus enum locally since it's not exported from the SDK
enum TransactionStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

// Mock the entire SDK module
jest.mock('@tecafrik/africa-payment-sdk');

// Mock the config module
jest.mock('../../config', () => ({
  config: {
    paydunya: {
      masterKey: 'test-master-key',
      privateKey: 'test-private-key',
      publicKey: 'test-public-key',
      token: 'test-token',
      mode: 'test' as const,
    },
    currency: 'XOF',
  },
}));

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockCheckoutMobileMoney: jest.Mock;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a mock for the checkoutMobileMoney method
    mockCheckoutMobileMoney = jest.fn();

    // Mock the AfricaPaymentsProvider constructor and its methods
    (AfricaPaymentsProvider as jest.MockedClass<typeof AfricaPaymentsProvider>).mockImplementation(() => ({
      checkoutMobileMoney: mockCheckoutMobileMoney,
    } as any));

    // Create a new instance of PaymentService
    paymentService = new PaymentService();
  });

  describe('initiatePayment', () => {
    const validPaymentRequest: PaymentRequest = {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+221771234567',
      paymentMethod: PaymentMethod.WAVE,
      amount: 5000,
      productName: 'Test Product',
    };

    it('should successfully initiate a WAVE payment with mocked SDK response', async () => {
      // Arrange
      const mockCheckoutResult: CheckoutResult = {
        transactionId: 'TXN-123456',
        transactionReference: 'REF-123456',
        transactionStatus: TransactionStatus.PENDING,
        transactionAmount: 5000,
        transactionCurrency: 'XOF' as any,
        redirectUrl: 'https://paydunya.com/checkout/123456',
      };

      mockCheckoutMobileMoney.mockResolvedValue(mockCheckoutResult);

      // Act
      const result = await paymentService.initiatePayment(validPaymentRequest);

      // Assert
      expect(result.success).toBe(true);
      expect(result.redirectUrl).toBe('https://paydunya.com/checkout/123456');
      expect(result.transactionId).toBe('TXN-123456');
      expect(result.message).toBe('Payment initiated successfully');
      expect(result.error).toBeUndefined();

      // Verify SDK was called with correct parameters
      expect(mockCheckoutMobileMoney).toHaveBeenCalledTimes(1);
      expect(mockCheckoutMobileMoney).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 5000,
          description: 'Test Product',
          currency: 'XOF',
          customer: {
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '+221771234567',
          },
          paymentMethod: PaymentMethod.WAVE,
          transactionId: expect.stringMatching(/^TXN-\d+-\d+$/),
        })
      );
    });

    it('should successfully initiate an ORANGE_MONEY payment with authorization code', async () => {
      // Arrange
      const orangeMoneyRequest: PaymentRequest = {
        ...validPaymentRequest,
        paymentMethod: PaymentMethod.ORANGE_MONEY,
        authorizationCode: '123456',
      };

      const mockCheckoutResult: CheckoutResult = {
        transactionId: 'TXN-789012',
        transactionReference: 'REF-789012',
        transactionStatus: TransactionStatus.PENDING,
        transactionAmount: 5000,
        transactionCurrency: 'XOF' as any,
        redirectUrl: 'https://paydunya.com/checkout/789012',
      };

      mockCheckoutMobileMoney.mockResolvedValue(mockCheckoutResult);

      // Act
      const result = await paymentService.initiatePayment(orangeMoneyRequest);

      // Assert
      expect(result.success).toBe(true);
      expect(result.redirectUrl).toBe('https://paydunya.com/checkout/789012');
      expect(mockCheckoutMobileMoney).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethod: PaymentMethod.ORANGE_MONEY,
          authorizationCode: '123456',
        })
      );
    });

    it('should handle SDK errors and return failure result', async () => {
      // Arrange
      const sdkError = new Error('Payment provider API error');
      mockCheckoutMobileMoney.mockRejectedValue(sdkError);

      // Act
      const result = await paymentService.initiatePayment(validPaymentRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Payment provider API error');
      expect(result.message).toBe('Payment initiation failed');
      expect(result.redirectUrl).toBeUndefined();
      expect(result.transactionId).toMatch(/^TXN-\d+-\d+$/);
    });

    it('should handle network timeout errors', async () => {
      // Arrange
      const timeoutError = new Error('Network timeout');
      mockCheckoutMobileMoney.mockRejectedValue(timeoutError);

      // Act
      const result = await paymentService.initiatePayment(validPaymentRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network timeout');
      expect(result.message).toBe('Payment initiation failed');
    });

    it('should handle unknown errors gracefully', async () => {
      // Arrange
      mockCheckoutMobileMoney.mockRejectedValue('Unknown error string');

      // Act
      const result = await paymentService.initiatePayment(validPaymentRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error occurred');
      expect(result.message).toBe('Payment initiation failed');
    });

    it('should throw error when ORANGE_MONEY payment is missing authorization code', async () => {
      // Arrange
      const orangeMoneyRequestWithoutCode: PaymentRequest = {
        ...validPaymentRequest,
        paymentMethod: PaymentMethod.ORANGE_MONEY,
      };

      // Act
      const result = await paymentService.initiatePayment(orangeMoneyRequestWithoutCode);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toBe('Authorization code is required for Orange Money payments');
      expect(mockCheckoutMobileMoney).not.toHaveBeenCalled();
    });

    it('should handle unsupported payment methods', async () => {
      // Arrange
      const unsupportedRequest: PaymentRequest = {
        ...validPaymentRequest,
        paymentMethod: 'UNSUPPORTED_METHOD' as PaymentMethod,
      };

      // Act
      const result = await paymentService.initiatePayment(unsupportedRequest);

      // Assert
      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported payment method');
      expect(mockCheckoutMobileMoney).not.toHaveBeenCalled();
    });
  });

  describe('generateTransactionId', () => {
    it('should generate unique transaction IDs', async () => {
      // Arrange
      const mockCheckoutResult: CheckoutResult = {
        transactionId: 'TXN-MOCK',
        transactionReference: 'REF-MOCK',
        transactionStatus: TransactionStatus.PENDING,
        transactionAmount: 5000,
        transactionCurrency: 'XOF' as any,
        redirectUrl: 'https://paydunya.com/checkout/mock',
      };

      mockCheckoutMobileMoney.mockResolvedValue(mockCheckoutResult);

      const paymentRequest: PaymentRequest = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+221771234567',
        paymentMethod: PaymentMethod.WAVE,
        amount: 5000,
        productName: 'Test Product',
      };

      // Act - Make multiple payment requests
      await Promise.all([
        paymentService.initiatePayment(paymentRequest),
        paymentService.initiatePayment(paymentRequest),
        paymentService.initiatePayment(paymentRequest),
      ]);

      // Assert - Extract transaction IDs from SDK calls
      const transactionIds = mockCheckoutMobileMoney.mock.calls.map(
        (call) => call[0].transactionId
      );

      // All transaction IDs should be unique
      const uniqueIds = new Set(transactionIds);
      expect(uniqueIds.size).toBe(3);

      // All should match the expected format
      transactionIds.forEach((id) => {
        expect(id).toMatch(/^TXN-\d+-\d+$/);
      });
    });

    it('should generate transaction IDs with timestamp and random components', async () => {
      // Arrange
      const mockCheckoutResult: CheckoutResult = {
        transactionId: 'TXN-MOCK',
        transactionReference: 'REF-MOCK',
        transactionStatus: TransactionStatus.PENDING,
        transactionAmount: 5000,
        transactionCurrency: 'XOF' as any,
        redirectUrl: 'https://paydunya.com/checkout/mock',
      };

      mockCheckoutMobileMoney.mockResolvedValue(mockCheckoutResult);

      const paymentRequest: PaymentRequest = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '+221771234567',
        paymentMethod: PaymentMethod.WAVE,
        amount: 5000,
        productName: 'Test Product',
      };

      // Act
      await paymentService.initiatePayment(paymentRequest);

      // Assert
      const transactionId = mockCheckoutMobileMoney.mock.calls[0][0].transactionId;
      const parts = transactionId.split('-');

      expect(parts).toHaveLength(3);
      expect(parts[0]).toBe('TXN');
      expect(parseInt(parts[1])).toBeGreaterThan(0); // Timestamp
      expect(parseInt(parts[2])).toBeGreaterThanOrEqual(0); // Random number
      expect(parseInt(parts[2])).toBeLessThan(10000); // Random number < 10000
    });
  });
});
