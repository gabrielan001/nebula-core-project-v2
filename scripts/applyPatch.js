#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the JSON patch from stdin
let data = '';
process.stdin.on('data', chunk => {
  data += chunk;
});

process.stdin.on('end', () => {
  try {
    const patch = JSON.parse(data);
    
    if (!patch.files || !Array.isArray(patch.files)) {
      console.error('Invalid patch format: expected { files: [...] }');
      process.exit(1);
    }

    patch.files.forEach(file => {
      if (!file.path) {
        console.error('Missing file path in patch');
        return;
      }

      const filePath = path.join(process.cwd(), file.path);
      const dirPath = path.dirname(filePath);

      // Create directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Write the file content
      fs.writeFileSync(filePath, file.content);
      console.log(`Applied patch to ${file.path}`);
    });
    
  } catch (error) {
    console.error('Error applying patch:', error.message);
    process.exit(1);
  }
});
