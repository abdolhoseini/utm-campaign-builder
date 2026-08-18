const form = document.getElementById('utm-form');
const websiteUrlInput = document.getElementById('website-url');
const sourceInput = document.getElementById('utm-source');
const mediumInput = document.getElementById('utm-medium');
const campaignInput = document.getElementById('utm-campaign');
const termInput = document.getElementById('utm-term');
const contentInput = document.getElementById('utm-content');
const generatedUrlOutput = document.getElementById('generated-url');
const messageBox = document.getElementById('message');
const copyButton = document.getElementById('copy-button');
const resetButton = document.getElementById('reset-button');

const DEFAULT_RESULT_TEXT = 'Your campaign URL will appear here.';

function showMessage(text, type) {
  messageBox.textContent = text;
  messageBox.className = `message ${type}`;
}

function clearMessage() {
  messageBox.textContent = '';
  messageBox.className = 'message';
}

function isValidUrl(value) {
  try {
    const parsedUrl = new URL(value);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch (error) {
    return false;
  }
}

function generateLink(event) {
  event.preventDefault();

  const websiteUrl = websiteUrlInput.value.trim();
  const utmSource = sourceInput.value.trim();
  const utmMedium = mediumInput.value.trim();
  const utmCampaign = campaignInput.value.trim();
  const utmTerm = termInput.value.trim();
  const utmContent = contentInput.value.trim();

  const requiredFields = [
    { value: websiteUrl, label: 'Website URL', field: websiteUrlInput },
    { value: utmSource, label: 'Campaign Source', field: sourceInput },
    { value: utmMedium, label: 'Campaign Medium', field: mediumInput },
    { value: utmCampaign, label: 'Campaign Name', field: campaignInput }
  ];

  for (const field of requiredFields) {
    if (!field.value) {
      showMessage(`${field.label} is required.`, 'error');
      field.field.focus();
      return;
    }
  }

  if (!isValidUrl(websiteUrl)) {
    showMessage('Please enter a valid website URL starting with http:// or https://.', 'error');
    websiteUrlInput.focus();
    return;
  }

  const baseUrl = new URL(websiteUrl);
  const searchParams = new URLSearchParams(baseUrl.search);

  searchParams.set('utm_source', utmSource);
  searchParams.set('utm_medium', utmMedium);
  searchParams.set('utm_campaign', utmCampaign);

  if (utmTerm) {
    searchParams.set('utm_term', utmTerm);
  }

  if (utmContent) {
    searchParams.set('utm_content', utmContent);
  }

  baseUrl.search = searchParams.toString();

  generatedUrlOutput.textContent = baseUrl.toString();
  copyButton.disabled = false;
  showMessage('UTM campaign link generated successfully.', 'success');
}

async function copyGeneratedLink() {
  const generatedUrl = generatedUrlOutput.textContent.trim();

  if (!generatedUrl || generatedUrl === DEFAULT_RESULT_TEXT) {
    showMessage('Generate a link before copying it.', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(generatedUrl);
    showMessage('Link copied to clipboard.', 'success');
  } catch (error) {
    const helper = document.createElement('textarea');
    helper.value = generatedUrl;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();

    try {
      document.execCommand('copy');
      showMessage('Link copied to clipboard.', 'success');
    } catch (copyError) {
      showMessage('Copy failed. Please select the URL manually to copy it.', 'error');
    } finally {
      document.body.removeChild(helper);
    }
  }
}

function resetForm() {
  form.reset();
  generatedUrlOutput.textContent = DEFAULT_RESULT_TEXT;
  clearMessage();
  copyButton.disabled = true;
  websiteUrlInput.focus();
}

form.addEventListener('submit', generateLink);
copyButton.addEventListener('click', copyGeneratedLink);
resetButton.addEventListener('click', resetForm);
