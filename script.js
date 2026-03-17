// Global variables
let dncNumbers = [];
let cleanNumbers = [];
let isProcessing = false;

// DOM Elements
const fileInput = document.getElementById('fileInput');
const fileUploadArea = document.getElementById('fileUploadArea');
const selectedFile = document.getElementById('selectedFile');
const phoneInput = document.getElementById('phoneInput');
const checkBtn = document.getElementById('checkBtn');
const resetBtn = document.getElementById('resetBtn');
const progressSection = document.getElementById('progressSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const statsSection = document.getElementById('statsSection');
const resultsSection = document.getElementById('resultsSection');
const dncList = document.getElementById('dncList');
const cleanList = document.getElementById('cleanList');
const totalCount = document.getElementById('totalCount');
const dncCount = document.getElementById('dncCount');
const cleanCount = document.getElementById('cleanCount');
const inputCount = document.getElementById('inputCount');

// Event Listeners
fileUploadArea.addEventListener('click', () => fileInput.click());
fileUploadArea.addEventListener('dragover', handleDragOver);
fileUploadArea.addEventListener('dragleave', handleDragLeave);
fileUploadArea.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
phoneInput.addEventListener('input', updateInputCount);

// File Upload Handlers
function handleDragOver(e) {
    e.preventDefault();
    fileUploadArea.style.background = '#f0f3ff';
    fileUploadArea.style.borderColor = '#764ba2';
}

function handleDragLeave(e) {
    e.preventDefault();
    fileUploadArea.style.background = 'white';
    fileUploadArea.style.borderColor = '#667eea';
}

function handleDrop(e) {
    e.preventDefault();
    fileUploadArea.style.background = 'white';
    fileUploadArea.style.borderColor = '#667eea';
    
    const file = e.dataTransfer.files[0];
    if (file) {
        processFile(file);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

function processFile(file) {
    // Validate file type
    if (!file.name.match(/\.(txt|csv)$/)) {
        showError('Please upload only .txt or .csv files');
        return;
    }
    
    // Update UI
    selectedFile.innerHTML = `<i class="fas fa-file-alt"></i> ${file.name}`;
    
    // Read file
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const numbers = extractNumbers(content);
        phoneInput.value = numbers.join('\n');
        updateInputCount();
    };
    reader.readAsText(file);
}

// Number extraction and validation
function extractNumbers(text) {
    return text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .map(num => num.replace(/\D/g, ''))
        .filter(num => num.length >= 10 && num.length <= 11);
}

function updateInputCount() {
    const numbers = extractNumbers(phoneInput.value);
    inputCount.textContent = `${numbers.length} numbers`;
}

function clearInput() {
    phoneInput.value = '';
    selectedFile.innerHTML = '<i class="fas fa-file-alt"></i> No file selected';
    fileInput.value = '';
    updateInputCount();
}

// Main check function
async function checkNumbers() {
    if (isProcessing) return;
    
    const numbers = extractNumbers(phoneInput.value);
    
    if (numbers.length === 0) {
        showError('Please enter some numbers or upload a file');
        return;
    }
    
    if (numbers.length > 100) {
        showError('Maximum 100 numbers can be checked at once');
        return;
    }
    
    // Reset previous results
    resetResults();
    
    // Show progress
    isProcessing = true;
    checkBtn.disabled = true;
    resetBtn.disabled = true;
    progressSection.style.display = 'block';
    errorMessage.style.display = 'none';
    
    // Initialize
    dncNumbers = [];
    cleanNumbers = [];
    let completed = 0;
    
    // Process each number
    for (const number of numbers) {
        try {
            const result = await checkSingleNumber(number);
            
            if (result.listed === 'Yes' || result.ndnc === 'Yes' || result.sdnc === 'Yes') {
                dncNumbers.push(number);
            } else {
                cleanNumbers.push(number);
            }
        } catch (error) {
            console.error('Error checking number:', number, error);
            cleanNumbers.push(number); // On error, consider as clean
        }
        
        // Update progress
        completed++;
        const percentage = (completed / numbers.length) * 100;
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `Processing: ${completed}/${numbers.length} numbers`;
        
        // Small delay to prevent API rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Display results
    displayResults();
    
    // Reset processing state
    isProcessing = false;
    checkBtn.disabled = false;
    resetBtn.disabled = false;
}

// API call function
async function checkSingleNumber(phone) {
    try {
        const response = await fetch(`https://api.uspeoplesearch.site/tcpa/v1?x=${phone}`);
        
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API call failed:', error);
        // Return default response on error
        return {
            status: 'error',
            phone: phone,
            listed: 'No',
            ndnc: 'No',
            sdnc: 'No'
        };
    }
}

// Display results
function displayResults() {
    // Update statistics
    totalCount.textContent = dncNumbers.length + cleanNumbers.length;
    dncCount.textContent = dncNumbers.length;
    cleanCount.textContent = cleanNumbers.length;
    statsSection.style.display = 'flex';
    
    // Display DNC numbers
    dncList.innerHTML = '';
    if (dncNumbers.length > 0) {
        dncNumbers.forEach(num => {
            const div = document.createElement('div');
            div.className = 'number-item';
            div.textContent = num;
            dncList.appendChild(div);
        });
    } else {
        dncList.innerHTML = '<p class="empty-message">No DNC numbers found</p>';
    }
    
    // Display Clean numbers
    cleanList.innerHTML = '';
    if (cleanNumbers.length > 0) {
        cleanNumbers.forEach(num => {
            const div = document.createElement('div');
            div.className = 'number-item';
            div.textContent = num;
            cleanList.appendChild(div);
        });
    } else {
        cleanList.innerHTML = '<p class="empty-message">No clean numbers found</p>';
    }
    
    // Show results
    resultsSection.style.display = 'flex';
    progressSection.style.display = 'none';
}

// Copy results to clipboard
async function copyResults(type) {
    const numbers = type === 'dnc' ? dncNumbers : cleanNumbers;
    const text = numbers.join('\n');
    
    if (numbers.length === 0) {
        showError(`No ${type === 'dnc' ? 'DNC' : 'clean'} numbers to copy`);
        return;
    }
    
    try {
        await navigator.clipboard.writeText(text);
        showSuccess(`${type === 'dnc' ? 'DNC' : 'Clean'} numbers copied to clipboard!`);
    } catch (err) {
        showError('Failed to copy numbers');
    }
}

// Reset all
function resetAll() {
    clearInput();
    resetResults();
    progressSection.style.display = 'none';
    errorMessage.style.display = 'none';
}

function resetResults() {
    dncNumbers = [];
    cleanNumbers = [];
    statsSection.style.display = 'none';
    resultsSection.style.display = 'none';
    progressFill.style.width = '0%';
}

// Error handling
function showError(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    errorMessage.style.background = '#f8d7da';
    errorMessage.style.color = '#721c24';
    
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

function showSuccess(message) {
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    errorMessage.style.background = '#d4edda';
    errorMessage.style.color = '#155724';
    
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

// Initialize
updateInputCount();
