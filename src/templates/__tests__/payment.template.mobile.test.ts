/**
 * Mobile responsiveness tests for payment template
 * Verifies intl-tel-input mobile configurations
 */

import { renderPaymentForm } from '../payment.template';

describe('Payment Template - Mobile Responsiveness', () => {
  describe('Mobile Configuration', () => {
    it('should include useFullscreenPopup configuration', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      expect(html).toContain('useFullscreenPopup: true');
    });

    it('should include countrySearch configuration for mobile popup', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      expect(html).toContain('countrySearch: true');
    });

    it('should include mobile-specific CSS for fullscreen popup', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      // Check for mobile media query
      expect(html).toContain('@media (max-width: 600px)');
      
      // Check for fullscreen popup styling
      expect(html).toContain('.iti--fullscreen-popup .iti__country-list');
      expect(html).toContain('max-height: none');
      expect(html).toContain('border: none');
      expect(html).toContain('border-radius: 0');
    });

    it('should have tel input type for numeric keyboard on mobile', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      expect(html).toContain('type="tel"');
      expect(html).toContain('id="phoneNumber"');
    });
  });

  describe('Responsive Design', () => {
    it('should include viewport meta tag for mobile', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      expect(html).toContain('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
    });

    it('should include mobile-responsive container styles', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      // Check for responsive container
      expect(html).toContain('max-width: 500px');
      
      // Check for mobile padding adjustment
      expect(html).toMatch(/@media \(max-width: 600px\)[\s\S]*\.container[\s\S]*padding: 20px/);
    });
  });


  describe('Touch Target Sizes', () => {
    it('should have adequate input padding for touch targets', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      // Input elements should have 12px padding
      expect(html).toContain('padding: 12px');
      expect(html).toContain('input, select');
    });

    it('should style intl-tel-input for proper touch targets', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      // Check for intl-tel-input input styling
      expect(html).toContain('.iti__input');
      expect(html).toMatch(/\.iti__input[\s\S]*padding: 12px/);
      expect(html).toMatch(/\.iti__input[\s\S]*padding-left: 52px/);
    });
  });

  describe('Country Selector Styling', () => {
    it('should style country selector for mobile interaction', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      expect(html).toContain('.iti__selected-country');
      expect(html).toContain('.iti__country-list');
      expect(html).toContain('.iti__country:hover');
    });

    it('should include search input styling for mobile popup', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      expect(html).toContain('.iti__search-input');
      expect(html).toMatch(/\.iti__search-input[\s\S]*padding: 8px/);
      expect(html).toMatch(/\.iti__search-input[\s\S]*margin: 8px/);
    });

    it('should use yellow highlight color for country hover', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      // Check for yellow (#FFDB15) hover state
      expect(html).toMatch(/\.iti__country:hover[\s\S]*background-color: #FFDB15/);
      expect(html).toMatch(/\.iti__country\.iti__highlight[\s\S]*background-color: #FFDB15/);
    });
  });

  describe('Mobile Keyboard Configuration', () => {
    it('should configure intl-tel-input for mobile number validation', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      expect(html).toContain('validationNumberTypes: ["MOBILE"]');
    });

    it('should enable format as you type for mobile', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      expect(html).toContain('formatAsYouType: true');
      expect(html).toContain('formatOnDisplay: true');
    });
  });

  describe('Mobile Prepopulation', () => {
    it('should support prepopulated phone numbers on mobile', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product',
        phoneNumber: '+221771234567'
      });

      expect(html).toContain('value="+221771234567"');
    });

    it('should maintain hidden field for E.164 format on mobile', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      expect(html).toContain('type="hidden"');
      expect(html).toContain('id="phoneNumberFull"');
      expect(html).toContain('name="phoneNumber"');
    });
  });

  describe('Mobile Error Handling', () => {
    it('should include error container for validation messages', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      expect(html).toContain('id="phoneError"');
      expect(html).toContain('#phoneError');
    });

    it('should style error states for mobile visibility', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      expect(html).toContain('.iti__input.error');
      expect(html).toMatch(/\.iti__input\.error[\s\S]*border-color: #c62828/);
    });

    it('should style valid states for mobile feedback', () => {
      const html = renderPaymentForm({
        amount: 5000,
        productName: 'Test Product'
      });

      expect(html).toContain('.iti__input.valid');
      expect(html).toMatch(/\.iti__input\.valid[\s\S]*border-color: #2e7d32/);
    });
  });
});
