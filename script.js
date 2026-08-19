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
const historySearchInput = document.getElementById('history-search');
const historyList = document.getElementById('history-list');
const historyEmpty = document.getElementById('history-empty');
const exportButton = document.getElementById('export-button');
const clearHistoryButton = document.getElementById('clear-history-button');

const DEFAULT_RESULT_TEXT = 'Your campaign URL will appear here.';
const STORAGE_KEY = 'utmCampaignHistory';

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

function getCampaigns() {
  try {
    const storedCampaigns = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(storedCampaigns) ? storedCampaigns : [];
  } catch (error) {
    return [];
  }
}

function saveCampaign(campaign) {
  const campaigns = getCampaigns();

  if (campaigns.some((savedCampaign) => savedCampaign.generatedUrl === campaign.generatedUrl)) {
    return false;
  }

  campaigns.unshift(campaign);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
  renderHistory();
  return true;
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.textContent = text;
  return element;
}

function renderHistory() {
  const searchTerm = historySearchInput.value.trim().toLowerCase();
  const campaigns = getCampaigns();
  const filteredCampaigns = campaigns.filter((campaign) =>
    [campaign.campaignName, campaign.source, campaign.medium]
      .some((value) => value.toLowerCase().includes(searchTerm))
  );

  historyList.replaceChildren();
  historyEmpty.hidden = filteredCampaigns.length > 0;
  historyEmpty.textContent = campaigns.length === 0
    ? 'No saved campaigns yet.'
    : 'No campaigns match your search.';
  exportButton.disabled = campaigns.length === 0;
  clearHistoryButton.disabled = campaigns.length === 0;

  filteredCampaigns.forEach((campaign) => {
    const card = document.createElement('article');
    card.className = 'history-card';

    const header = document.createElement('div');
    header.className = 'history-card-header';
    header.append(
      createTextElement('h3', '', campaign.campaignName),
      createTextElement('time', 'history-date', new Date(campaign.createdAt).toLocaleString())
    );

    const details = createTextElement(
      'p',
      'history-details',
      `Website: ${campaign.websiteUrl} | Source: ${campaign.source} | Medium: ${campaign.medium} | Term: ${campaign.term || 'None'} | Content: ${campaign.content || 'None'}`
    );
    const url = createTextElement('span', 'history-url', campaign.generatedUrl);
    const actions = document.createElement('div');
    actions.className = 'history-card-actions';

    const copy = createTextElement('button', 'secondary-btn', 'Copy');
    copy.type = 'button';
    copy.dataset.action = 'copy';
    copy.dataset.url = campaign.generatedUrl;
    copy.setAttribute('aria-label', `Copy URL for ${campaign.campaignName}`);

    const remove = createTextElement('button', 'danger-btn', 'Delete');
    remove.type = 'button';
    remove.dataset.action = 'delete';
    remove.dataset.id = campaign.id;
    remove.setAttribute('aria-label', `Delete ${campaign.campaignName}`);

    actions.append(copy, remove);
    card.append(header, details, url, actions);
    historyList.appendChild(card);
  });
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
  const wasSaved = saveCampaign({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    websiteUrl,
    source: utmSource,
    medium: utmMedium,
    campaignName: utmCampaign,
    term: utmTerm,
    content: utmContent,
    generatedUrl: baseUrl.toString(),
    createdAt: new Date().toISOString()
  });
  showMessage(
    wasSaved ? 'UTM campaign link generated and saved.' : 'UTM campaign link generated. This URL is already in history.',
    'success'
  );
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

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const helper = document.createElement('textarea');
    helper.value = text;
    helper.setAttribute('readonly', '');
    helper.style.position = 'fixed';
    helper.style.opacity = '0';
    document.body.appendChild(helper);
    helper.select();
    document.execCommand('copy');
    helper.remove();
  }
}

async function handleHistoryAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  if (button.dataset.action === 'copy') {
    try {
      await copyText(button.dataset.url);
      showMessage('Saved campaign URL copied to clipboard.', 'success');
    } catch (error) {
      showMessage('Copy failed. Please select the URL manually to copy it.', 'error');
    }
  }

  if (button.dataset.action === 'delete') {
    const campaigns = getCampaigns().filter((campaign) => campaign.id !== button.dataset.id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
    renderHistory();
    showMessage('Campaign deleted from history.', 'success');
  }
}

function escapeCsvValue(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

function exportCsv() {
  const campaigns = getCampaigns();
  const headers = ['Website URL', 'Campaign Source', 'Campaign Medium', 'Campaign Name', 'Campaign Term', 'Campaign Content', 'Generated URL', 'Creation Date and Time'];
  const rows = campaigns.map((campaign) => [
    campaign.websiteUrl, campaign.source, campaign.medium, campaign.campaignName,
    campaign.term, campaign.content, campaign.generatedUrl, campaign.createdAt
  ]);
  const csv = [headers, ...rows].map((row) => row.map(escapeCsvValue).join(',')).join('\r\n');
  const downloadUrl = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'utm-campaign-history.csv';
  link.click();
  URL.revokeObjectURL(downloadUrl);
}

function clearHistory() {
  if (!window.confirm('Clear all saved campaign history? This cannot be undone.')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
  showMessage('Campaign history cleared.', 'success');
}

form.addEventListener('submit', generateLink);
copyButton.addEventListener('click', copyGeneratedLink);
resetButton.addEventListener('click', resetForm);
historySearchInput.addEventListener('input', renderHistory);
historyList.addEventListener('click', handleHistoryAction);
exportButton.addEventListener('click', exportCsv);
clearHistoryButton.addEventListener('click', clearHistory);

renderHistory();
