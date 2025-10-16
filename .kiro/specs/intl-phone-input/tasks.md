# Implementation Plan

- [x] 1. Add intl-tel-input CDN resources to payment template
  - Add CSS link for intl-tel-input in the `<head>` section
  - Add preconnect link hint for CDN performance optimization
  - Add JavaScript script tag for intl-tel-input library before closing `</body>`
  - Ensure proper ordering of script tags for dependencies
  - _Requirements: 5.1, 5.2, 5.5_

- [x] 2. Update phone input HTML structure
  - Rename existing phone input's `name` attribute from "phoneNumber" to "phoneNumber_display"
  - Remove the `pattern` attribute as validation will be handled by intl-tel-input
  - Add hidden input field with `name="phoneNumber"` and `id="phoneNumberFull"` for E.164 format
  - Add error message container div with `id="phoneError"` below the phone input
  - Keep the existing `value` attribute for prepopulation support
  - _Requirements: 6.1, 6.2, 6.3, 7.1, 7.2_

- [x] 3. Add custom CSS styling for intl-tel-input integration
  - Add CSS rules to style `.iti` container to match existing form inputs
  - Style `.iti__input` with black border and yellow focus state matching design
  - Add error and valid state styles (red and green borders)
  - Style country dropdown (`.iti__country-list`) with black border and yellow hover
  - Style selected country button to match design aesthetic
  - Add mobile-specific styles for fullscreen popup
  - Style search input within country dropdown
  - Add styles for phone error message display
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 4. Implement intl-tel-input initialization script
  - Add JavaScript to initialize intl-tel-input on the phone input element
  - Configure `initialCountry` to "sn" (Senegal)
  - Set `preferredCountries` to ["sn", "ci", "ml", "bf", "gn"] for West African countries
  - Configure `utilsScript` to load validation utilities from CDN
  - Enable `formatAsYouType`, `formatOnDisplay`, and `strictMode` options
  - Enable `separateDialCode` to show dial code separately
  - Enable `countrySearch` for searchable country dropdown
  - Set `useFullscreenPopup` to true for mobile optimization
  - Set `validationNumberTypes` to ["MOBILE"] for mobile number validation
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 5.3, 5.4_

- [x] 5. Implement form submission handler with validation
  - Add event listener to intercept form submission
  - Call `iti.isValidNumber()` to validate phone number before submission
  - If invalid, prevent submission and display error message with red border
  - If valid, extract full international number using `iti.getNumber()` in E.164 format
  - Populate hidden `phoneNumberFull` input field with E.164 formatted number
  - Remove error styling and allow form submission to proceed
  - _Requirements: 3.1, 3.4, 3.5, 7.1, 7.2, 7.3_

- [x] 6. Implement real-time validation feedback
  - Add blur event listener to phone input for validation on focus loss
  - Check if number is valid using `iti.isValidNumber()`
  - If valid, add green border (`.valid` class) and hide error message
  - If invalid, add red border (`.error` class) and show specific error message
  - Use `iti.getValidationError()` to get error code and map to user-friendly message
  - Add input event listener to clear validation styling while user is typing
  - Implement `getErrorMessage()` helper function to map error codes to messages
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 7. Add graceful degradation for CDN failures
  - Wrap intl-tel-input initialization in try-catch block
  - Check for `window.intlTelInput` existence before initialization
  - If library fails to load, log error and fall back to standard HTML5 tel input
  - Update form submission handler to check if `iti` instance exists
  - If no `iti` instance, use raw input value as fallback
  - Ensure form can still submit with basic HTML5 validation if library fails
  - _Requirements: 5.1, 5.2, 7.4_

- [x] 8. Test prepopulation with international phone numbers
  - Test form with URL parameter `?phoneNumber=%2B221771234567` (Senegal format)
  - Verify country is auto-detected as Senegal and number is formatted correctly
  - Test with different country code like `?phoneNumber=%2B33612345678` (France)
  - Verify country auto-detection works for various international formats
  - Test with national format without country code `?phoneNumber=771234567`
  - Verify default country (Senegal) is used and number formats correctly
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 9. Test mobile responsiveness and fullscreen popup
  - Test form on mobile device or using browser mobile emulation
  - Verify country dropdown appears as fullscreen popup on mobile
  - Test tapping country selector opens fullscreen popup correctly
  - Test country search functionality within mobile popup
  - Verify popup can be closed by tapping outside or close button
  - Test that numeric keyboard appears when tapping phone input on mobile
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 10. Verify backward compatibility with payment processing
  - Submit form with valid phone number and verify hidden field contains E.164 format
  - Check that backend receives `phoneNumber` field in expected format
  - Verify existing payment service processes the number without errors
  - Test complete payment flow end-to-end with enhanced phone input
  - Verify no breaking changes to existing payment processing logic
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 11. Update documentation
  - Add section to README.md about enhanced phone input feature
  - Document the intl-tel-input integration and configuration
  - Explain default country (Senegal) and how to change if needed
  - Document the E.164 format used for phone number submission
  - _Requirements: 1.1, 1.2, 5.1, 5.2_
