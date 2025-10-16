/**
 * Tests for phone number prepopulation with intl-tel-input
 * Verifies that different phone number formats are correctly handled
 */

import request from 'supertest';
import express from 'express';
import paymentRoutes from '../payment.routes';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', paymentRoutes);

describe('Phone Number Prepopulation Tests', () => {
    describe('International format with country code', () => {
        it('should prepopulate Senegal phone number with +221 country code', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product',
                    phoneNumber: '+221771234567'
                });

            expect(response.status).toBe(200);
            expect(response.text).toContain('value="+221771234567"');
            expect(response.text).toContain('intl-tel-input');
            expect(response.text).toContain('initialCountry: "sn"');
        });

        it('should prepopulate France phone number with +33 country code', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product',
                    phoneNumber: '+33612345678'
                });

            expect(response.status).toBe(200);
            expect(response.text).toContain('value="+33612345678"');
            expect(response.text).toContain('intl-tel-input');
        });

        it('should prepopulate Ivory Coast phone number with +225 country code', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product',
                    phoneNumber: '+225071234567'
                });

            expect(response.status).toBe(200);
            expect(response.text).toContain('value="+225071234567"');
            expect(response.text).toContain('intl-tel-input');
        });

        it('should prepopulate Mali phone number with +223 country code', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product',
                    phoneNumber: '+22371234567'
                });

            expect(response.status).toBe(200);
            expect(response.text).toContain('value="+22371234567"');
            expect(response.text).toContain('intl-tel-input');
        });
    });

    describe('National format without country code', () => {
        it('should prepopulate national format number and use default country (Senegal)', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product',
                    phoneNumber: '771234567'
                });

            expect(response.status).toBe(200);
            expect(response.text).toContain('value="771234567"');
            expect(response.text).toContain('initialCountry: "sn"');
            expect(response.text).toContain('intl-tel-input');
        });

        it('should prepopulate 9-digit national format number', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product',
                    phoneNumber: '781234567'
                });

            expect(response.status).toBe(200);
            expect(response.text).toContain('value="781234567"');
            expect(response.text).toContain('initialCountry: "sn"');
        });
    });

    describe('URL encoded phone numbers', () => {
        it('should handle URL encoded Senegal phone number (%2B221)', async () => {
            const response = await request(app)
                .get('/payment?amount=5000&productName=Test%20Product&phoneNumber=%2B221771234567');

            expect(response.status).toBe(200);
            expect(response.text).toContain('value="+221771234567"');
            expect(response.text).toContain('intl-tel-input');
        });

        it('should handle URL encoded France phone number (%2B33)', async () => {
            const response = await request(app)
                .get('/payment?amount=5000&productName=Test%20Product&phoneNumber=%2B33612345678');

            expect(response.status).toBe(200);
            expect(response.text).toContain('value="+33612345678"');
            expect(response.text).toContain('intl-tel-input');
        });
    });

    describe('Edge cases', () => {
        it('should handle empty phone number parameter', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product',
                    phoneNumber: ''
                });

            expect(response.status).toBe(200);
            expect(response.text).toContain('value=""');
            expect(response.text).toContain('intl-tel-input');
        });

        it('should handle missing phone number parameter', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product'
                });

            expect(response.status).toBe(200);
            expect(response.text).toContain('intl-tel-input');
            // Should have empty value attribute
            expect(response.text).toMatch(/value=""/);
        });

        it('should handle phone number with spaces', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product',
                    phoneNumber: '+221 77 123 45 67'
                });

            expect(response.status).toBe(200);
            expect(response.text).toContain('value="+221 77 123 45 67"');
            expect(response.text).toContain('intl-tel-input');
        });

        it('should handle phone number with dashes', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product',
                    phoneNumber: '+221-77-123-4567'
                });

            expect(response.status).toBe(200);
            expect(response.text).toContain('value="+221-77-123-4567"');
            expect(response.text).toContain('intl-tel-input');
        });
    });

    describe('Verify intl-tel-input configuration', () => {
        it('should include intl-tel-input library and configuration', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product',
                    phoneNumber: '+221771234567'
                });

            expect(response.status).toBe(200);
            
            // Verify CDN resources are included
            expect(response.text).toContain('cdn.jsdelivr.net/npm/intl-tel-input@24.7.0');
            expect(response.text).toContain('intlTelInput.css');
            expect(response.text).toContain('intlTelInput.min.js');
            
            // Verify configuration options
            expect(response.text).toContain('initialCountry: "sn"');
            expect(response.text).toContain('preferredCountries: ["sn", "ci", "ml", "bf", "gn"]');
            expect(response.text).toContain('formatAsYouType: true');
            expect(response.text).toContain('formatOnDisplay: true');
            expect(response.text).toContain('separateDialCode: true');
            expect(response.text).toContain('countrySearch: true');
            expect(response.text).toContain('useFullscreenPopup: true');
            expect(response.text).toContain('strictMode: true');
            expect(response.text).toContain('validationNumberTypes: ["MOBILE"]');
            
            // Verify utils script for validation
            expect(response.text).toContain('utilsScript:');
            expect(response.text).toContain('utils.js');
        });

        it('should include hidden input field for E.164 format', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product',
                    phoneNumber: '+221771234567'
                });

            expect(response.status).toBe(200);
            
            // Verify visible input has name="phoneNumber_display"
            expect(response.text).toContain('name="phoneNumber_display"');
            
            // Verify hidden input has name="phoneNumber" and id="phoneNumberFull"
            expect(response.text).toContain('type="hidden"');
            expect(response.text).toContain('id="phoneNumberFull"');
            expect(response.text).toContain('name="phoneNumber"');
        });

        it('should include error container for validation messages', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product'
                });

            expect(response.status).toBe(200);
            expect(response.text).toContain('id="phoneError"');
        });
    });

    describe('Verify form submission handler', () => {
        it('should include form submission validation logic', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product'
                });

            expect(response.status).toBe(200);
            
            // Verify form submission handler exists
            expect(response.text).toContain('form.addEventListener(\'submit\'');
            
            // Verify validation logic
            expect(response.text).toContain('iti.isValidNumber()');
            expect(response.text).toContain('iti.getNumber()');
            expect(response.text).toContain('phoneNumberFull.value');
            
            // Verify error handling
            expect(response.text).toContain('getErrorMessage');
            expect(response.text).toContain('phoneError');
        });

        it('should include real-time validation on blur', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product'
                });

            expect(response.status).toBe(200);
            
            // Verify blur event listener
            expect(response.text).toContain('phoneInput.addEventListener(\'blur\'');
            
            // Verify validation classes
            expect(response.text).toContain('classList.add(\'error\')');
            expect(response.text).toContain('classList.add(\'valid\')');
        });

        it('should include graceful degradation for CDN failures', async () => {
            const response = await request(app)
                .get('/payment')
                .query({
                    amount: '5000',
                    productName: 'Test Product'
                });

            expect(response.status).toBe(200);
            
            // Verify fallback logic
            expect(response.text).toContain('typeof window.intlTelInput !== \'undefined\'');
            expect(response.text).toContain('try {');
            expect(response.text).toContain('catch (error)');
            expect(response.text).toContain('Falling back to standard HTML5 tel input');
        });
    });
});
