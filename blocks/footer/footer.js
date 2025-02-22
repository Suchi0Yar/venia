import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // Load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // Decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  footer.classList.add('footer-container');

  let sectionIndex = 1;
  let footerSection6 = null; // Store section 6 separately

  while (fragment.firstElementChild) {
    const section = fragment.firstElementChild;
    section.classList.add(`footer-section-${sectionIndex}`);

    if (sectionIndex === 6) {
      footerSection6 = section; // Store section 6 separately
    } else {
      footer.append(section);
    }

    // Check if this is the Subscribe section
    if (sectionIndex === 5) {
      addEmailSubscription(section);
    }

    sectionIndex++;
  }

  block.append(footer);

  // Append footer-section-6 at the bottom separately
  if (footerSection6) {
    footerSection6.classList.add('footer-section-6');
    
    // Ensure elements (image, text, links) are in one line
    const wrapper = footerSection6.querySelector('.default-content-wrapper');
    if (wrapper) {
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'center';
      wrapper.style.justifyContent = 'space-between';
      wrapper.style.flexWrap = 'wrap';
    }

    block.append(footerSection6);
  }
}

/**
 * Adds an email input and validation to the subscribe section
 * @param {Element} section The subscribe section element
 */
function addEmailSubscription(section) {
  const subscribeWrapper = section.querySelector('.default-content-wrapper');

  if (subscribeWrapper) {
    // Create input field
    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.classList.add("email-input");

    // Create submit button
    const submitButton = document.createElement("button");
    submitButton.textContent = "Subscribe";
    submitButton.classList.add("subscribe-button");

    // Create error message
    const errorMessage = document.createElement("p");
    errorMessage.classList.add("error-message");

    // Append elements
    subscribeWrapper.append(emailInput, submitButton, errorMessage);

    // Validate email on button click
    submitButton.addEventListener("click", function () {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
        alert("Subscription successful!");
        errorMessage.style.display = "none";
      } else {
        errorMessage.textContent = "Invalid email!";
        errorMessage.style.display = "block";
      }
    });
  }
}
