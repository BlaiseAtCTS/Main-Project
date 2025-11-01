const fs = require('fs');
const path = require('path');

// Define all translation replacements
const replacements = {
  // Dashboard translations
  "'DASHBOARD.WELCOME_BACK' | translate": "Welcome Back",
  "'DASHBOARD.FINANCIAL_OVERVIEW' | translate": "Here's your financial overview",
  "'DASHBOARD.LOADING_DASHBOARD' | translate": "Loading dashboard...",
  "'DASHBOARD.LOAD_ERROR' | translate": "Failed to load dashboard data",
  "'DASHBOARD.TOTAL_BALANCE' | translate": "Total Balance",
  "'DASHBOARD.ACTIVE_ACCOUNTS' | translate": "Active Accounts",
  "'DASHBOARD.RECENT_TRANSACTIONS' | translate": "Recent Transactions",
  "'DASHBOARD.QUICK_ACTIONS' | translate": "Quick Actions",
  "'DASHBOARD.CREATE_ACCOUNT' | translate": "Create Account",
  "'DASHBOARD.DEPOSIT_MONEY' | translate": "Deposit Money",
  "'DASHBOARD.WITHDRAW_MONEY' | translate": "Withdraw Money",
  "'DASHBOARD.TRANSFER_MONEY' | translate": "Transfer Money",
  "'DASHBOARD.MY_ACCOUNTS' | translate": "My Accounts",
  "'DASHBOARD.VIEW_ALL' | translate": "View All",
  "'DASHBOARD.NO_ACCOUNTS' | translate": "You don't have any accounts yet",
  "'DASHBOARD.CREATE_FIRST_ACCOUNT' | translate": "Create Your First Account",
  "'DASHBOARD.LOW_BALANCE' | translate": "Low Balance",
  "'DASHBOARD.TRANSACTION_HISTORY' | translate": "Transaction History",
  "'DASHBOARD.FILTER_BY_ACCOUNT' | translate": "Filter by Account",
  "'DASHBOARD.BALANCE' | translate": "Balance",
  
  // Accounts translations
  "'ACCOUNTS.TITLE' | translate": "My Accounts",
  "'ACCOUNTS.OVERVIEW' | translate": "Manage your bank accounts",
  "'ACCOUNTS.TOTAL_BALANCE' | translate": "Total Balance",
  "'ACCOUNTS.CREATE_NEW' | translate": "Create New Account",
  "'ACCOUNTS.DEPOSIT' | translate": "Deposit",
  "'ACCOUNTS.WITHDRAW' | translate": "Withdraw",
  "'ACCOUNTS.TRANSFER' | translate": "Transfer",
  "'ACCOUNTS.DELETE' | translate": "Delete Account",
  "'ACCOUNTS.NO_ACCOUNTS' | translate": "No Accounts Yet",
  "'ACCOUNTS.GET_STARTED' | translate": "Get started by creating your first account",
  "'ACCOUNTS.ACCOUNT_NUMBER' | translate": "Account Number",
  "'ACCOUNTS.BALANCE' | translate": "Balance",
  "'ACCOUNTS.LOW_BALANCE_WARNING' | translate": "Low Balance Warning",
  "'ACCOUNTS.VIEW_HISTORY' | translate": "View History",
  "'ACCOUNTS.TYPE' | translate": "Type",
  
  // Transactions translations
  "'TRANSACTIONS.TITLE' | translate": "Transactions",
  "'TRANSACTIONS.TRANSFER_MONEY' | translate": "Transfer Money",
  "'TRANSACTIONS.TRANSACTION_HISTORY' | translate": "Transaction History",
  "'TRANSACTIONS.NO_ACCOUNTS_AVAILABLE' | translate": "No accounts available for transfer",
  "'TRANSACTIONS.GO_TO_ACCOUNTS' | translate": "Go to Accounts",
  "'TRANSACTIONS.FROM_ACCOUNT' | translate": "From Account",
  "'TRANSACTIONS.AVAILABLE_BALANCE' | translate": "Available Balance",
  "'TRANSACTIONS.ACCOUNT_TYPE' | translate": "Account Type",
  "'TRANSACTIONS.DESTINATION_ACCOUNT' | translate": "Destination Account Number",
  "'TRANSACTIONS.ENTER_DESTINATION' | translate": "Enter destination account number",
  "'TRANSACTIONS.AMOUNT' | translate": "Amount",
  "'TRANSACTIONS.PROCESSING' | translate": "Processing...",
  "'TRANSACTIONS.TRANSFER' | translate": "Transfer",
  "'TRANSACTIONS.ACCOUNT' | translate": "Account",
  "'TRANSACTIONS.SEARCH' | translate": "Search",
  "'TRANSACTIONS.SEARCH_TRANSACTIONS' | translate": "Search by amount, type, or description",
  "'TRANSACTIONS.NO_TRANSACTIONS' | translate": "No transactions found",
  "'TRANSACTIONS.START_USING' | translate": "Start using your account to see transactions here",
  "'TRANSACTIONS.TYPE' | translate": "Type",
  "'TRANSACTIONS.DESCRIPTION' | translate": "Description",
  "'TRANSACTIONS.DATE' | translate": "Date",
  "'TRANSACTIONS.DEBIT' | translate": "Debit",
  "'TRANSACTIONS.CREDIT' | translate": "Credit",
  
  // Profile translations
  "'PROFILE.TITLE' | translate": "My Profile",
  "'PROFILE.SUBTITLE' | translate": "Manage your account information",
  "'PROFILE.PERSONAL_INFO' | translate": "Personal Information",
  "'PROFILE.FULL_NAME' | translate": "Full Name",
  "'PROFILE.USERNAME' | translate": "Username",
  "'PROFILE.EMAIL' | translate": "Email Address",
  "'PROFILE.PHONE' | translate": "Phone Number",
  "'PROFILE.ADDRESS' | translate": "Address",
  "'PROFILE.ACCOUNT_SETTINGS' | translate": "Account Settings",
  "'PROFILE.JOINED_DATE' | translate": "Member Since",
  "'PROFILE.ACCOUNT_STATUS' | translate": "Account Status",
  "'PROFILE.ACTIVE' | translate": "Active",
  "'PROFILE.ACTIONS' | translate": "Actions",
  "'PROFILE.EDIT_PROFILE' | translate": "Edit Profile",
  "'PROFILE.CHANGE_PASSWORD' | translate": "Change Password",
  "'PROFILE.ACCOUNT_SUMMARY' | translate": "Account Summary",
  "'PROFILE.TOTAL_ACCOUNTS' | translate": "Total Accounts",
  "'PROFILE.TOTAL_BALANCE' | translate": "Total Balance",
  "'PROFILE.LIFETIME_TRANSACTIONS' | translate": "Lifetime Transactions",
  
  // Common translations
  "'COMMON.LOADING' | translate": "Loading...",
  "'MESSAGES.LOAD_ERROR' | translate": "Failed to load data",
};

// Files to process
const files = [
  'src/app/components/dashboard/dashboard.html',
  'src/app/components/accounts/accounts.html',
  'src/app/components/transactions/transactions.html',
  'src/app/components/profile/profile.html',
];

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceTranslations(content) {
  let updated = content;
  
  for (const [oldText, newText] of Object.entries(replacements)) {
    // Match {{ 'KEY' | translate }} with flexible whitespace
    const pattern1 = new RegExp('\\{\\{\\s*' + escapeRegExp(oldText) + '\\s*\\}\\}', 'g');
    updated = updated.replace(pattern1, newText);
    
    // Match placeholders [placeholder]="'KEY' | translate"
    const pattern2 = new RegExp('\\[placeholder\\]="' + escapeRegExp(oldText) + '"', 'g');
    updated = updated.replace(pattern2, `placeholder="${newText}"`);
  }
  
  return updated;
}

// Process each file
console.log('Starting translation removal...\n');

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

console.log('\n✅ Translation removal complete!');
