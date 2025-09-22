# shadcn/ui Vanilla JavaScript Components - Examples & Documentation

This document provides comprehensive examples and documentation for using the shadcn/ui components in your Figma plugin. All components are implemented in pure vanilla JavaScript with no React dependencies.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Utilities](#utilities)
3. [Button Component](#button-component)
4. [Card Component](#card-component)
5. [Input Component](#input-component)
6. [Badge Component](#badge-component)
7. [Alert Component](#alert-component)
8. [Label Component](#label-component)
9. [Separator Component](#separator-component)
10. [Tabs Component](#tabs-component)
11. [Select Component](#select-component)
12. [Complete Examples](#complete-examples)
13. [Best Practices](#best-practices)

## Getting Started

### Option 1: Using Individual Component Files

```html
<script src="./components/ui/utils.js"></script>
<script src="./components/ui/button.js"></script>
<script src="./components/ui/card.js"></script>
<!-- Include other components as needed -->
```

### Option 2: Using the Standalone Bundle

```html
<script src="./components/ui/shadcn-ui.js"></script>
<script>
  // All components are available under ShadcnUI namespace
  const button = ShadcnUI.createButton({ text: 'Click me' });
  document.body.appendChild(button);
</script>
```

### Option 3: In Figma Plugin UI

```javascript
// In your plugin's UI code
const { createButton, createCard } = window.shadcnButton || {};
const { cn } = window.shadcnUtils || {};
```

## Utilities

### Class Name Utilities

```javascript
// Combine class names
const className = cn('base-class', 'additional-class', {
  'conditional-class': condition,
  'another-class': anotherCondition
});

// Use with arrays
const className = cn(['class1', 'class2'], 'class3');

// Merge Tailwind classes (handles conflicts)
const merged = cn('p-4 px-6'); // Results in 'p-4 px-6' -> 'py-4 px-6'
```

### Class Variance Authority (CVA)

```javascript
// Create variant-based styling
const buttonVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes"
      },
      size: {
        sm: "small-classes",
        lg: "large-classes"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "sm"
    }
  }
);

// Use the variant function
const className = buttonVariants({ variant: 'secondary', size: 'lg' });
```

## Button Component

### Basic Usage

```javascript
// Simple button
const button = createButton({
  text: 'Click me',
  onClick: () => console.log('Button clicked!')
});
document.body.appendChild(button);
```

### Button Variants

```javascript
// Primary button (default)
const primaryBtn = createButton({
  text: 'Primary',
  variant: 'default'
});

// Secondary button
const secondaryBtn = createButton({
  text: 'Secondary',
  variant: 'secondary'
});

// Outline button
const outlineBtn = createButton({
  text: 'Outline',
  variant: 'outline'
});

// Destructive button
const destructiveBtn = createButton({
  text: 'Delete',
  variant: 'destructive'
});

// Ghost button
const ghostBtn = createButton({
  text: 'Ghost',
  variant: 'ghost'
});

// Link button
const linkBtn = createButton({
  text: 'Link',
  variant: 'link'
});
```

### Button Sizes

```javascript
// Small button
const smallBtn = createButton({
  text: 'Small',
  size: 'sm'
});

// Default button
const defaultBtn = createButton({
  text: 'Default',
  size: 'default'
});

// Large button
const largeBtn = createButton({
  text: 'Large',
  size: 'lg'
});

// Icon button
const iconBtn = createButton({
  content: '<svg>...</svg>',
  size: 'icon'
});
```

### Advanced Button Usage

```javascript
// Using Button class for dynamic behavior
const dynamicButton = new Button({
  text: 'Dynamic Button',
  variant: 'outline'
});

// Change variant after creation
dynamicButton.setVariant('destructive');

// Change text
dynamicButton.setText('Updated Text');

// Add event listeners
dynamicButton.on('click', () => {
  dynamicButton.setVariant('secondary');
  dynamicButton.setText('Clicked!');
});

// Disable/enable
dynamicButton.setDisabled(true);
setTimeout(() => dynamicButton.setDisabled(false), 2000);

// Append to DOM
dynamicButton.appendTo(document.body);
```

### Button with Icon

```javascript
const iconButton = createButton({
  content: `
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
    </svg>
    Add Item
  `,
  variant: 'default'
});
```

## Card Component

### Basic Card

```javascript
const card = createCard({
  content: '<p>Simple card content</p>'
});
document.body.appendChild(card);
```

### Complete Card with All Sections

```javascript
// Using individual functions
const card = createCard();
const header = createCardHeader();
const title = createCardTitle({ text: 'Card Title' });
const description = createCardDescription({ text: 'Card description goes here' });
const content = createCardContent({ content: '<p>Main content</p>' });
const footer = createCardFooter({ content: '<button>Action</button>' });

header.appendChild(title);
header.appendChild(description);
card.appendChild(header);
card.appendChild(content);
card.appendChild(footer);

document.body.appendChild(card);
```

### Using Card Class (Method Chaining)

```javascript
const card = new Card()
  .addTitle({ text: 'Project Settings' })
  .addDescription({ text: 'Manage your project configuration' })
  .addContent({ 
    content: `
      <div class="space-y-3">
        <div>
          <label class="text-sm font-medium">Project Name</label>
          <input type="text" class="w-full mt-1 px-3 py-2 border rounded-md" value="My Project">
        </div>
        <div>
          <label class="text-sm font-medium">Description</label>
          <textarea class="w-full mt-1 px-3 py-2 border rounded-md" rows="3">Project description</textarea>
        </div>
      </div>
    `
  })
  .addFooter({ 
    content: `
      <button class="bg-primary text-primary-foreground px-4 py-2 rounded-md mr-2">Save</button>
      <button class="border px-4 py-2 rounded-md">Cancel</button>
    `
  });

card.appendTo(document.body);
```

## Input Component

### Basic Input

```javascript
const input = createInput({
  placeholder: 'Enter your name',
  onChange: (e) => console.log('Value:', e.target.value)
});
document.body.appendChild(input);
```

### Input Types

```javascript
// Text input
const textInput = createInput({
  type: 'text',
  placeholder: 'Enter text'
});

// Email input
const emailInput = createInput({
  type: 'email',
  placeholder: 'Enter email'
});

// Password input
const passwordInput = createInput({
  type: 'password',
  placeholder: 'Enter password'
});

// Number input
const numberInput = createInput({
  type: 'number',
  placeholder: 'Enter number',
  attributes: { min: '0', max: '100' }
});
```

### Advanced Input with Validation

```javascript
const emailInput = new Input({
  type: 'email',
  placeholder: 'Enter your email address'
});

// Add validators
emailInput.addValidator((value) => {
  if (!value) return 'Email is required';
  if (!/\S+@\S+\.\S+/.test(value)) return 'Please enter a valid email';
  return true;
});

// Validate on blur
emailInput.on('blur', () => {
  emailInput.validate();
});

// Clear validation on input
emailInput.on('input', () => {
  emailInput.clearError();
});

emailInput.appendTo(document.body);
```

### Input Group with Label

```javascript
const { container, input, setError } = createInputGroup({
  label: 'Username',
  inputOptions: {
    placeholder: 'Enter username',
    id: 'username'
  },
  helpText: 'Must be at least 3 characters long'
});

// Add validation
input.addEventListener('blur', () => {
  const value = input.value.trim();
  if (!value) {
    setError('Username is required');
  } else if (value.length < 3) {
    setError('Username must be at least 3 characters');
  } else {
    setError(null);
  }
});

document.body.appendChild(container);
```

## Badge Component

### Basic Badges

```javascript
// Default badge
const defaultBadge = createBadge({
  text: 'Default',
  variant: 'default'
});

// Secondary badge
const secondaryBadge = createBadge({
  text: 'Secondary',
  variant: 'secondary'
});

// Destructive badge
const destructiveBadge = createBadge({
  text: 'Error',
  variant: 'destructive'
});

// Outline badge
const outlineBadge = createBadge({
  text: 'Outline',
  variant: 'outline'
});
```

### Interactive Badges

```javascript
const clickableBadge = createBadge({
  text: 'Click me',
  variant: 'secondary',
  onClick: () => alert('Badge clicked!')
});
```

### Removable Badge

```javascript
const removableBadge = createRemovableBadge({
  text: 'Removable Tag',
  variant: 'secondary',
  onRemove: (badge) => {
    console.log('Badge removed');
    badge.element.remove();
  }
});
```

### Notification Badge

```javascript
const notificationBadge = createNotificationBadge({
  count: 5,
  maxCount: 99
});

// Update count
setTimeout(() => {
  notificationBadge.setCount(150); // Will show "99+"
}, 2000);

// Hide when count is 0
setTimeout(() => {
  notificationBadge.setCount(0); // Will hide badge
}, 4000);
```

## Alert Component

### Basic Alerts

```javascript
// Default alert
const defaultAlert = createAlert({
  content: '<strong>Info:</strong> This is an informational message.'
});

// Destructive alert
const errorAlert = createAlert({
  variant: 'destructive',
  content: '<strong>Error:</strong> Something went wrong.'
});
```

### Alert with Components

```javascript
const alert = new Alert({ variant: 'destructive' })
  .addTitle({ text: 'Error' })
  .addDescription({ text: 'There was a problem with your request.' });

alert.appendTo(document.body);
```

### Alert with Icon

```javascript
const alertWithIcon = new Alert({ variant: 'default' })
  .addIcon('success')
  .addTitle({ text: 'Success!' })
  .addDescription({ text: 'Your changes have been saved.' });

alertWithIcon.appendTo(document.body);
```

### Dismissible Alert

```javascript
const dismissibleAlert = createDismissibleAlert({
  variant: 'default',
  onDismiss: (alert) => {
    console.log('Alert dismissed');
    alert.remove();
  }
});

dismissibleAlert.addTitle({ text: 'Notice' })
  .addDescription({ text: 'This alert can be dismissed.' });

dismissibleAlert.appendTo(document.body);
```

## Label Component

### Basic Label

```javascript
const label = createLabel({
  text: 'Username',
  htmlFor: 'username-input'
});
```

### Required Label

```javascript
const requiredLabel = createLabel({
  text: 'Email Address',
  htmlFor: 'email-input',
  required: true
});
```

### Form Field with Label

```javascript
const { container, label, input, setError } = createFormField({
  label: 'Full Name',
  inputOptions: {
    placeholder: 'Enter your full name',
    required: true
  },
  helpText: 'Enter your first and last name'
});

// Add validation
input.addEventListener('blur', () => {
  if (!input.value.trim()) {
    setError('Full name is required');
  } else {
    setError(null);
  }
});

document.body.appendChild(container);
```

## Separator Component

### Basic Separators

```javascript
// Horizontal separator
const horizontalSep = createSeparator();

// Vertical separator (needs height)
const verticalSep = createSeparator({
  orientation: 'vertical',
  className: 'h-20'
});
```

### Text Separator

```javascript
const textSeparator = createTextSeparator({
  text: 'OR',
  className: 'my-4'
});
```

### Custom Separator with Icon

```javascript
const iconSeparator = createCustomSeparator({
  content: '<svg class="w-4 h-4 text-muted-foreground">...</svg>',
  className: 'my-6'
});
```

## Complete Examples

### Login Form

```javascript
function createLoginForm() {
  const card = new Card({ className: 'w-96 mx-auto mt-8' })
    .addTitle({ text: 'Sign In' })
    .addDescription({ text: 'Enter your credentials to access your account' });

  // Email field
  const { container: emailContainer, input: emailInput, setError: setEmailError } = createFormField({
    label: 'Email',
    inputOptions: {
      type: 'email',
      placeholder: 'Enter your email',
      required: true
    }
  });

  // Password field
  const { container: passwordContainer, input: passwordInput, setError: setPasswordError } = createFormField({
    label: 'Password',
    inputOptions: {
      type: 'password',
      placeholder: 'Enter your password',
      required: true
    }
  });

  // Submit button
  const submitBtn = createButton({
    text: 'Sign In',
    variant: 'default',
    className: 'w-full',
    onClick: handleSubmit
  });

  // Separator
  const separator = createSeparator({ className: 'my-4' });

  // Google sign in button
  const googleBtn = createButton({
    content: `
      <svg class="w-4 h-4 mr-2" viewBox="0 0 24 24">...</svg>
      Continue with Google
    `,
    variant: 'outline',
    className: 'w-full'
  });

  // Assemble form
  const content = document.createElement('div');
  content.className = 'space-y-4';
  content.appendChild(emailContainer);
  content.appendChild(passwordContainer);
  content.appendChild(submitBtn);
  content.appendChild(separator);
  content.appendChild(googleBtn);

  card.addContent({ content });

  function handleSubmit() {
    let hasErrors = false;

    // Validate email
    if (!emailInput.value.trim()) {
      setEmailError('Email is required');
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
      setEmailError('Please enter a valid email');
      hasErrors = true;
    } else {
      setEmailError(null);
    }

    // Validate password
    if (!passwordInput.value.trim()) {
      setPasswordError('Password is required');
      hasErrors = true;
    } else {
      setPasswordError(null);
    }

    if (!hasErrors) {
      // Process login
      console.log('Login:', { email: emailInput.value, password: passwordInput.value });
    }
  }

  return card;
}

// Usage
const loginForm = createLoginForm();
loginForm.appendTo(document.body);
```

### Settings Panel

```javascript
function createSettingsPanel() {
  const container = document.createElement('div');
  container.className = 'max-w-2xl mx-auto p-6 space-y-6';

  // Header
  const header = document.createElement('div');
  header.innerHTML = `
    <h1 class="text-3xl font-bold">Settings</h1>
    <p class="text-muted-foreground">Manage your account settings and preferences.</p>
  `;

  // Profile section
  const profileCard = new Card()
    .addHeader()
    .addTitle({ text: 'Profile Information' })
    .addDescription({ text: 'Update your profile details' });

  const profileContent = document.createElement('div');
  profileContent.className = 'space-y-4';

  const { container: nameField } = createFormField({
    label: 'Display Name',
    inputOptions: { placeholder: 'Your name', value: 'John Doe' }
  });

  const { container: emailField } = createFormField({
    label: 'Email Address',
    inputOptions: { type: 'email', placeholder: 'your@email.com', value: 'john@example.com' }
  });

  profileContent.appendChild(nameField);
  profileContent.appendChild(emailField);

  const saveBtn = createButton({
    text: 'Save Changes',
    variant: 'default'
  });

  profileContent.appendChild(saveBtn);
  profileCard.addContent({ content: profileContent });

  // Notifications section
  const notificationsCard = new Card()
    .addTitle({ text: 'Notifications' })
    .addDescription({ text: 'Configure how you receive notifications' });

  const notificationContent = document.createElement('div');
  notificationContent.className = 'space-y-4';

  // Toggle switches would go here (not implemented in this example)
  const emailNotifLabel = createLabel({ text: 'Email notifications' });
  const pushNotifLabel = createLabel({ text: 'Push notifications' });

  notificationContent.appendChild(emailNotifLabel);
  notificationContent.appendChild(pushNotifLabel);

  notificationsCard.addContent({ content: notificationContent });

  // Assemble panel
  container.appendChild(header);
  container.appendChild(profileCard.getElement());
  container.appendChild(notificationsCard.getElement());

  return container;
}

// Usage
const settingsPanel = createSettingsPanel();
document.body.appendChild(settingsPanel);
```

## Best Practices

### 1. Error Handling

```javascript
// Always check if elements exist before using them
const button = document.getElementById('my-button');
if (button) {
  button.addEventListener('click', handleClick);
}

// Use try-catch for complex operations
try {
  const formData = collectFormData();
  submitData(formData);
} catch (error) {
  console.error('Form submission failed:', error);
  showErrorAlert('Failed to submit form');
}
```

### 2. Memory Management

```javascript
// Store references for cleanup
const eventHandlers = [];

function addEventHandler(element, event, handler) {
  element.addEventListener(event, handler);
  eventHandlers.push({ element, event, handler });
}

// Clean up when done
function cleanup() {
  eventHandlers.forEach(({ element, event, handler }) => {
    element.removeEventListener(event, handler);
  });
  eventHandlers.length = 0;
}
```

### 3. Accessibility

```javascript
// Always include proper ARIA attributes
const button = createButton({
  text: 'Delete Item',
  variant: 'destructive',
  attributes: {
    'aria-label': 'Delete this item permanently',
    'aria-describedby': 'delete-warning'
  }
});

// Include focus management
const modal = createCard();
const firstInput = modal.querySelector('input');
if (firstInput) {
  firstInput.focus();
}
```

### 4. Responsive Design

```javascript
// Use responsive classes
const card = createCard({
  className: 'w-full max-w-sm sm:max-w-md lg:max-w-lg'
});

// Handle different screen sizes
const button = createButton({
  text: 'Submit',
  className: 'w-full sm:w-auto'
});
```

### 5. Performance

```javascript
// Batch DOM operations
const fragment = document.createDocumentFragment();
items.forEach(item => {
  const badge = createBadge({ text: item.name });
  fragment.appendChild(badge);
});
container.appendChild(fragment);

// Use event delegation for dynamic content
container.addEventListener('click', (e) => {
  if (e.target.matches('.badge')) {
    handleBadgeClick(e.target);
  }
});
```

## Success Criteria & Testing

### Feature: Button Component
- Success criteria:
  - ✅ Creates buttons with all variants (default, destructive, outline, secondary, ghost, link)
  - ✅ Supports all sizes (default, sm, lg, icon)
  - ✅ Handles click events properly
  - ✅ Can be disabled/enabled dynamically
  - ✅ Text and HTML content work correctly
- Test steps:
  1. Create buttons with different variants and verify styling
  2. Test click handlers and event propagation
  3. Verify disabled state prevents interaction
  4. Check dynamic variant/size changes

### Feature: Form Validation
- Success criteria:
  - ✅ Input validation works with custom validators
  - ✅ Error states display correctly
  - ✅ Form submission prevents when validation fails
  - ✅ Error messages clear appropriately
- Test steps:
  1. Enter invalid data and verify error display
  2. Correct data and verify error clearing
  3. Submit form and verify validation prevents submission

### Feature: Card Layout
- Success criteria:
  - ✅ Card components render with proper structure
  - ✅ Method chaining works for building cards
  - ✅ All card sections (header, title, description, content, footer) display correctly
- Test steps:
  1. Create card with all sections and verify layout
  2. Test method chaining approach
  3. Verify responsive behavior

## Tabs Component

### Basic Tabs

```javascript
// Simple tabs creation using the class
const tabs = new Tabs({ defaultValue: 'tab1' })
  .addTabsList()
  .addTab({
    value: 'tab1',
    label: 'Account',
    content: '<div class="space-y-4"><h3>Account Settings</h3><p>Manage your account settings here.</p></div>'
  })
  .addTab({
    value: 'tab2',
    label: 'Password',
    content: '<div class="space-y-4"><h3>Password</h3><p>Change your password here.</p></div>'
  });

tabs.appendTo(document.body);
```

### Advanced Tabs Usage

```javascript
// Using Tabs class with event handling
const settingsTabs = new Tabs({ defaultValue: 'general' });

settingsTabs.addTabsList()
  .addTab({
    value: 'general',
    label: 'General',
    content: `
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">General Settings</h3>
        <div class="space-y-3">
          <div>
            <label class="text-sm font-medium">Site Name</label>
            <input type="text" class="w-full mt-1 px-3 py-2 border rounded-md" value="My Website">
          </div>
        </div>
      </div>
    `
  })
  .addTab({
    value: 'security',
    label: 'Security',
    content: `
      <div class="space-y-4">
        <h3 class="text-lg font-semibold">Security Settings</h3>
        <div class="space-y-3">
          <div class="flex items-center space-x-2">
            <input type="checkbox" id="two-factor" checked>
            <label for="two-factor" class="text-sm font-medium">Enable Two-Factor Authentication</label>
          </div>
        </div>
      </div>
    `
  });

// Listen for tab changes
settingsTabs.element.addEventListener('tabchange', (e) => {
  console.log('Tab changed to:', e.detail.value);
});

settingsTabs.appendTo(document.body);
```

## Select Component

### Basic Select

```javascript
// Simple select creation
const select = new Select({
  placeholder: 'Select a framework...',
  name: 'framework'
})
  .addTrigger()
  .addContent()
  .addItem({ value: 'react', text: 'React' })
  .addItem({ value: 'vue', text: 'Vue' })
  .addItem({ value: 'angular', text: 'Angular' })
  .addItem({ value: 'svelte', text: 'Svelte' });

// Listen for value changes
select.onValueChange((e) => {
  console.log('Selected:', e.detail.value);
});

select.appendTo(document.body);
```

### Select with Default Value

```javascript
// Select with pre-selected value
const themeSelect = new Select({
  placeholder: 'Select theme...',
  value: 'dark',
  name: 'theme'
})
  .addTrigger()
  .addContent()
  .addItem({ value: 'light', text: 'Light' })
  .addItem({ value: 'dark', text: 'Dark' })
  .addItem({ value: 'system', text: 'System' });

themeSelect.appendTo(document.body);
```

### Advanced Select with Custom Styling

```javascript
// Select with custom styling and disabled options
const advancedSelect = new Select({
  placeholder: 'Choose your plan...',
  name: 'plan'
})
  .addTrigger()
  .addContent()
  .addItem({ value: 'free', text: 'Free Plan - $0/month' })
  .addItem({ value: 'pro', text: 'Pro Plan - $10/month' })
  .addItem({ value: 'enterprise', text: 'Enterprise Plan - $50/month' })
  .addItem({ value: 'custom', text: 'Custom Plan - Contact Us', disabled: true });

advancedSelect.onValueChange((e) => {
  console.log(`Plan selected: ${e.detail.value}`);
  // Could trigger pricing updates, feature toggles, etc.
});

advancedSelect.appendTo(document.body);
```

This documentation provides a comprehensive guide to using the vanilla JavaScript versions of shadcn/ui components. Each component includes multiple usage patterns and real-world examples to help you build beautiful, accessible interfaces for your Figma plugins.
