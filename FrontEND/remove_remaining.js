const fs = require('fs');
const path = require('path');

// Additional replacements for remaining translations
const additionalReplacements = {
  // Dashboard
  "'DASHBOARD.NO_TRANSACTIONS' | translate": "No transactions yet",
  
  // Transactions
  "'TRANSACTIONS.TOTAL_DEPOSITS' | translate": "Total Deposits",
  "'TRANSACTIONS.TOTAL_WITHDRAWALS' | translate": "Total Withdrawals",
  "'TRANSACTIONS.TOTAL_TRANSFERS' | translate": "Total Transfers",
  "'TRANSACTIONS.ADJUST_SEARCH' | translate": "Try adjusting your search or filter",
  "'TRANSACTIONS.ID' | translate": "ID",
  "'TRANSACTIONS.TO_ACCOUNT' | translate": "To Account",
  "'TRANSACTIONS.DATE_TIME' | translate": "Date & Time",
  
  // Profile
  "'PROFILE.BACK_TO_DASHBOARD' | translate": "Back to Dashboard",
  "'PROFILE.ADMINISTRATOR' | translate": "Administrator",
  "'PROFILE.USER' | translate": "User",
  "'PROFILE.QUICK_STATS' | translate": "Quick Stats",
  "'PROFILE.DOB' | translate": "Date of Birth",
  "'PROFILE.MY_ACCOUNTS' | translate": "My Accounts",
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceTranslations(content) {
  let updated = content;
  
  for (const [oldText, newText] of Object.entries(additionalReplacements)) {
    // Match {{ 'KEY' | translate }} with flexible whitespace
    const pattern1 = new RegExp('\\{\\{\\s*' + escapeRegExp(oldText) + '\\s*\\}\\}', 'g');
    updated = updated.replace(pattern1, newText);
    
    // Match ternary expressions: ('KEY' | translate)
    const pattern2 = new RegExp('\\(' + escapeRegExp(oldText) + '\\)', 'g');
    updated = updated.replace(pattern2, `'${newText}'`);
  }
  
  return updated;
}

// Files to process
const files = [
  'src/app/components/dashboard/dashboard.html',
  'src/app/components/transactions/transactions.html',
  'src/app/components/profile/profile.html',
];

console.log('Processing remaining translations...\n');

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (fs.existsSync(fullPath)) {
    console.log(`Processing ${filePath}...`);
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const updated = replaceTranslations(content);
    fs.writeFileSync(fullPath, updated, 'utf8');
    
    console.log(`✓ Updated ${filePath}`);
  } else {
    console.log(`✗ File not found: ${filePath}`);
  }
});

console.log('\n✅ Remaining translations removed!');
