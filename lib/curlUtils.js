// Utility functions for curl generation and parsing

/**
 * Generate a curl command from request data
 * @param {Object} requestData - The request data object
 * @returns {string} - The generated curl command
 */
export function generateCurl(requestData) {
  const { method, url, headers, body } = requestData;
  
  if (!url) return '';
  
  let curlCommand = `curl -X ${method.toUpperCase()}`;
  
  // Add URL (with proper escaping)
  curlCommand += ` '${url}'`;
  
  // Add headers
  if (headers && headers.length > 0) {
    headers.forEach(header => {
      if (header.key && header.value) {
        curlCommand += ` \\\n  -H '${header.key}: ${header.value}'`;
      }
    });
  }
  
  // Add body for non-GET requests
  if (method.toUpperCase() !== 'GET' && body && body.trim()) {
    // Try to format JSON body
    let formattedBody = body;
    try {
      const parsed = JSON.parse(body);
      formattedBody = JSON.stringify(parsed);
    } catch (e) {
      // Keep original body if not JSON
    }
    curlCommand += ` \\\n  -d '${formattedBody}'`;
  }
  
  return curlCommand;
}

/**
 * Parse a curl command and extract request data
 * @param {string} curlCommand - The curl command string
 * @returns {Object} - Parsed request data
 */
export function parseCurl(curlCommand) {
  if (!curlCommand || typeof curlCommand !== 'string') {
    return null;
  }
  
  // Clean up the curl command
  let cleanCurl = curlCommand.trim();
  
  // Remove 'curl' from the beginning if present
  cleanCurl = cleanCurl.replace(/^curl\s+/i, '');
  
  // Initialize result object
  const result = {
    method: 'GET',
    url: '',
    headers: [],
    body: ''
  };
  
  // Extract method using -X flag
  const methodMatch = cleanCurl.match(/-X\s+([A-Z]+)/i);
  if (methodMatch) {
    result.method = methodMatch[1].toUpperCase();
    cleanCurl = cleanCurl.replace(/-X\s+[A-Z]+/i, '');
  }
  
  // Extract headers using -H flag (improved pattern matching)
  const headerMatches = cleanCurl.matchAll(/-H\s+['"](.*?)['"]/g);
  for (const match of headerMatches) {
    const headerString = match[1];
    const colonIndex = headerString.indexOf(':');
    if (colonIndex > 0) {
      const key = headerString.substring(0, colonIndex).trim();
      const value = headerString.substring(colonIndex + 1).trim();
      result.headers.push({ key, value });
    }
  }
  
  // Also try --header format
  const longHeaderMatches = cleanCurl.matchAll(/--header\s+['"](.*?)['"]/g);
  for (const match of longHeaderMatches) {
    const headerString = match[1];
    const colonIndex = headerString.indexOf(':');
    if (colonIndex > 0) {
      const key = headerString.substring(0, colonIndex).trim();
      const value = headerString.substring(colonIndex + 1).trim();
      result.headers.push({ key, value });
    }
  }
  
  // Remove headers from curl command
  cleanCurl = cleanCurl.replace(/-H\s+['"](.*?)['"]/g, '');
  cleanCurl = cleanCurl.replace(/--header\s+['"](.*?)['"]/g, '');
  cleanCurl = cleanCurl.replace(/-H\s+([^-\s][^\s]*)/g, '');
  cleanCurl = cleanCurl.replace(/--header\s+([^-\s][^\s]*)/g, '');
  
  // Extract body using -d flag - find the data flag and extract everything until next flag or end
  let bodyMatch = null;
  
  // Find -d or --data flag position
  const dataFlagMatch = cleanCurl.match(/-d\s+|--data(?:-raw|-binary)?\s+/);
  if (dataFlagMatch) {
    const flagStart = cleanCurl.indexOf(dataFlagMatch[0]);
    const afterFlag = cleanCurl.substring(flagStart + dataFlagMatch[0].length);
    
    // Check if it starts with a quote
    if (afterFlag.startsWith("'")) {
      // Extract content between single quotes
      const endQuoteIndex = afterFlag.indexOf("'", 1);
      if (endQuoteIndex > 0) {
        bodyMatch = [null, afterFlag.substring(1, endQuoteIndex)];
      }
    } else if (afterFlag.startsWith('"')) {
      // Extract content between double quotes  
      const endQuoteIndex = afterFlag.indexOf('"', 1);
      if (endQuoteIndex > 0) {
        bodyMatch = [null, afterFlag.substring(1, endQuoteIndex)];
      }
    } else {
      // No quotes - extract until next space or flag
      const nextSpaceOrFlag = afterFlag.match(/^([^\s-]+)/);
      if (nextSpaceOrFlag) {
        bodyMatch = [null, nextSpaceOrFlag[1]];
      }
    }
  }
  
  if (bodyMatch) {
    result.body = bodyMatch[1];
    // Remove the data flag and its content
    cleanCurl = cleanCurl.replace(/-d\s+'[^']*'/g, '');
    cleanCurl = cleanCurl.replace(/-d\s+"[^"]*"/g, '');
    cleanCurl = cleanCurl.replace(/--data(?:-raw|-binary)?\s+'[^']*'/g, '');
    cleanCurl = cleanCurl.replace(/--data(?:-raw|-binary)?\s+"[^"]*"/g, '');
    cleanCurl = cleanCurl.replace(/-d\s+[^\s-]+/g, '');
    cleanCurl = cleanCurl.replace(/--data(?:-raw|-binary)?\s+[^\s-]+/g, '');
  }
  
  // Extract URL (remaining part after cleaning)
  cleanCurl = cleanCurl.replace(/\\\s*\n/g, ' ').trim();
  const urlMatch = cleanCurl.match(/['"](https?:\/\/[^'"]+)['"]/);
  if (urlMatch) {
    result.url = urlMatch[1];
  } else {
    // Try to find URL without quotes
    const simpleUrlMatch = cleanCurl.match(/(https?:\/\/[^\s]+)/);
    if (simpleUrlMatch) {
      result.url = simpleUrlMatch[1];
    }
  }
  
  // Ensure at least one header exists
  if (result.headers.length === 0) {
    result.headers = [{ key: '', value: '' }];
  }
  
  return result;
}

/**
 * Validate if a string looks like a curl command
 * @param {string} input - The input string to validate
 * @returns {boolean} - Whether it looks like a curl command
 */
export function isCurlCommand(input) {
  if (!input || typeof input !== 'string') return false;
  
  const trimmed = input.trim().toLowerCase();
  return trimmed.startsWith('curl ') || trimmed.startsWith('curl\n');
}

/**
 * Format curl command for better readability
 * @param {string} curlCommand - The curl command to format
 * @returns {string} - Formatted curl command
 */
export function formatCurl(curlCommand) {
  if (!curlCommand) return '';
  
  return curlCommand
    .replace(/\s+-/g, ' \\\n  -') // Add line breaks before flags
    .replace(/^curl/, 'curl') // Ensure curl starts at beginning
    .trim();
}