// const fs = require('fs');

// // Get the JSON string from environment variable
// const serviceAccountJson = process.env.SERVICE_ACCOUNT;

// if (!serviceAccountJson) {
//     console.error('SERVICE_ACCOUNT environment variable is not set');
//     process.exit(1);
// }

// try {
//     // Parse it to make sure it's valid JSON and write it formatted
//     const serviceAccount = JSON.parse(serviceAccountJson);
//     fs.writeFileSync('./service-account.json', JSON.stringify(serviceAccount, null, 2));
//     console.log('Successfully generated service-account.json');
// } catch (error) {
//     console.error('Error generating service-account.json:', error);
//     process.exit(1);
// }
