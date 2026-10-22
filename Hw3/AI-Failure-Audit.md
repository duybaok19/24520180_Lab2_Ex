# AI Failure Mode Audit — HW3

## Purpose

This document records issues found while using AI-generated code for the flash-sale countdown, inventory, and purchase form. Each issue describes the original behavior, its risk, how it was detected, and the corrective action.

## Failure 1 — Countdown timer export and integration

### Prompt

"Implement a drift-free countdown timer using requestAnimationFrame. Export the timer function so that other TypeScript modules can import and use it."

### AI-generated code issue

The timer implementation initially had an export/integration problem: the countdown module could not correctly import the timer function until the export was fixed.

### Risk

The countdown module could fail to compile or run because the imported function was not available as expected.

### Detection

The issue was identified while reviewing the TypeScript code in VS Code, where the import/export problem produced an editor error.

### Fix

Export the timer function explicitly from `timer.ts` and ensure that `countdown.ts` imports the same named export.

### Verification

Recheck the import in VS Code and run the countdown page in a compatible development environment.

---

## Failure 2 — Purchase button re-enabled after successful submission

### Prompt

"Review the purchase form JavaScript. Prevent double-submit while the state is submitting, and disable the button while waiting."

### AI-generated code issue

The initial purchase form implementation used a `finally` block that always executed:

```javascript
finally {
  button.disabled = false;
}
```

This re-enabled the Purchase button even after the state had changed to `success`.

### Risk

A user could submit the form again after a successful demo purchase. In a real application, relying only on the browser to prevent duplicate orders would be insufficient.

### Detection

The issue was found by inspecting the `finally` block and comparing its behavior with the success state.

### Fix

Set the button's disabled state according to the form state:

```javascript
finally {
  button.disabled = state !== 'idle';
}
```

The corrected version keeps the button disabled during submission and after success, and enables it again after a recoverable failure.

### Verification

Test successful submission and failed submission separately. Confirm that the button stays disabled after success and becomes enabled after failure.

---

## Failure 3 — Purchase form did not initially cover all requested user input

### Prompt

"Prevent double-submit and ensure that all user-provided data, including name and address, is displayed using `textContent`, never `innerHTML`."

### AI-generated code issue

The initial purchase form contained a name field but did not include an address field. Consequently, the implementation could not demonstrate safe handling of both requested inputs.

### Risk

The address-handling requirement remained unimplemented. If user-controlled address data were later inserted into the page using `innerHTML`, it could introduce a cross-site scripting (XSS) vulnerability.

### Detection

The issue was detected by comparing the form's HTML and JavaScript with the requirements. The original JavaScript read only `user-name`, and the original HTML had no `user-address` element.

### Fix

Add the address input to the HTML and read its value in the JavaScript. Render both the name and address using `textContent`, without interpreting either value as HTML.

### Verification

Submit the form with ordinary values and with strings resembling HTML markup. Confirm that the values appear as plain text and do not create HTML elements or execute event handlers.

---

## Lessons Learned

1. Check exports, imports, and module integration rather than relying only on generated code.
2. Review asynchronous state transitions, especially `try`, `catch`, and `finally`.
3. Compare every requested requirement against the actual HTML and JavaScript.
4. Test loading, success, failure, and repeated submissions rather than checking only the happy path.
5. Use `textContent` for displaying untrusted text. A client-side state guard does not replace server-side validation and duplicate-order protection.

## Scope and Limitations

The purchase form uses simulated asynchronous operations and hard-coded product data. It does not prove that a real order-processing backend is secure. The XSS and duplicate-order checks described here apply to the demonstrated frontend implementation; backend behavior requires separate testing.
