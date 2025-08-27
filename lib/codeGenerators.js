// Utility functions for generating code snippets in various languages and frameworks

/**
 * Generate JavaScript fetch API code
 * @param {Object} requestData - The request data object
 * @returns {string} - The generated fetch code
 */
export function generateFetch(requestData) {
  const { method, url, headers, body } = requestData;
  
  if (!url) return '';
  
  let code = `fetch('${url}', {\n  method: '${method.toUpperCase()}'`;
  
  // Add headers
  if (headers && headers.length > 0) {
    const headersObj = headers
      .filter(h => h.key && h.value)
      .map(h => `    '${h.key}': '${h.value}'`)
      .join(',\n');
    
    if (headersObj) {
      code += `,\n  headers: {\n${headersObj}\n  }`;
    }
  }
  
  // Add body for non-GET requests
  if (method.toUpperCase() !== 'GET' && body && body.trim()) {
    code += `,\n  body: ${formatJsonForJs(body)}`;
  }
  
  code += `\n})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));`;
  
  return code;
}

/**
 * Generate Axios code
 * @param {Object} requestData - The request data object
 * @returns {string} - The generated Axios code
 */
export function generateAxios(requestData) {
  const { method, url, headers, body } = requestData;
  
  if (!url) return '';
  
  let code = `const axios = require('axios');\n\n`;
  
  // Build config object
  let config = `{\n  method: '${method.toLowerCase()}',\n  url: '${url}'`;
  
  // Add headers
  if (headers && headers.length > 0) {
    const headersObj = headers
      .filter(h => h.key && h.value)
      .map(h => `    '${h.key}': '${h.value}'`)
      .join(',\n');
    
    if (headersObj) {
      config += `,\n  headers: {\n${headersObj}\n  }`;
    }
  }
  
  // Add data for non-GET requests
  if (method.toUpperCase() !== 'GET' && body && body.trim()) {
    config += `,\n  data: ${formatJsonForJs(body)}`;
  }
  
  config += `\n}`;
  
  code += `axios(${config})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error:', error);
});`;
  
  return code;
}

/**
 * Generate Python requests code
 * @param {Object} requestData - The request data object
 * @returns {string} - The generated Python code
 */
export function generatePython(requestData) {
  const { method, url, headers, body } = requestData;
  
  if (!url) return '';
  
  let code = `import requests\nimport json\n\n`;
  
  code += `url = "${url}"\n`;
  
  // Add headers
  if (headers && headers.length > 0) {
    const headersObj = headers
      .filter(h => h.key && h.value)
      .map(h => `    "${h.key}": "${h.value}"`)
      .join(',\n');
    
    if (headersObj) {
      code += `headers = {\n${headersObj}\n}\n\n`;
    } else {
      code += `headers = {}\n\n`;
    }
  } else {
    code += `headers = {}\n\n`;
  }
  
  // Add body for non-GET requests
  if (method.toUpperCase() !== 'GET' && body && body.trim()) {
    code += `data = ${formatJsonForPython(body)}\n\n`;
    code += `response = requests.${method.toLowerCase()}(url, headers=headers, json=data)\n`;
  } else {
    code += `response = requests.${method.toLowerCase()}(url, headers=headers)\n`;
  }
  
  code += `\nprint("Status Code:", response.status_code)
print("Response:", response.json())`;
  
  return code;
}

/**
 * Generate Go HTTP client code
 * @param {Object} requestData - The request data object
 * @returns {string} - The generated Go code
 */
export function generateGo(requestData) {
  const { method, url, headers, body } = requestData;
  
  if (!url) return '';
  
  let code = `package main\n\nimport (
\t"bytes"
\t"encoding/json"
\t"fmt"
\t"io"
\t"net/http"
)\n\n`;
  
  code += `func main() {\n`;
  code += `\turl := "${url}"\n`;
  
  // Add body for non-GET requests
  if (method.toUpperCase() !== 'GET' && body && body.trim()) {
    code += `\tpayload := ${formatJsonForGo(body)}\n`;
    code += `\tjsonData, _ := json.Marshal(payload)\n`;
    code += `\treq, _ := http.NewRequest("${method.toUpperCase()}", url, bytes.NewBuffer(jsonData))\n`;
  } else {
    code += `\treq, _ := http.NewRequest("${method.toUpperCase()}", url, nil)\n`;
  }
  
  // Add headers
  if (headers && headers.length > 0) {
    headers.forEach(header => {
      if (header.key && header.value) {
        code += `\treq.Header.Set("${header.key}", "${header.value}")\n`;
      }
    });
  }
  
  code += `
\tclient := &http.Client{}
\tresp, err := client.Do(req)
\tif err != nil {
\t\tfmt.Println("Error:", err)
\t\treturn
\t}
\tdefer resp.Body.Close()

\tbody, _ := io.ReadAll(resp.Body)
\tfmt.Println("Status:", resp.Status)
\tfmt.Println("Response:", string(body))
}`;
  
  return code;
}

/**
 * Generate Node.js native code
 * @param {Object} requestData - The request data object
 * @returns {string} - The generated Node.js code
 */
export function generateNodeJs(requestData) {
  const { method, url, headers, body } = requestData;
  
  if (!url) return '';
  
  let code = `const https = require('https');
const http = require('http');
const { URL } = require('url');

const urlObj = new URL('${url}');
const client = urlObj.protocol === 'https:' ? https : http;

`;
  
  // Build options object
  code += `const options = {
  hostname: urlObj.hostname,
  port: urlObj.port,
  path: urlObj.pathname + urlObj.search,
  method: '${method.toUpperCase()}'`;
  
  // Add headers
  if (headers && headers.length > 0) {
    const headersObj = headers
      .filter(h => h.key && h.value)
      .map(h => `    '${h.key}': '${h.value}'`)
      .join(',\n');
    
    if (headersObj) {
      code += `,\n  headers: {\n${headersObj}\n  }`;
    }
  }
  
  code += `\n};\n\n`;
  
  // Add request body
  if (method.toUpperCase() !== 'GET' && body && body.trim()) {
    code += `const postData = ${formatJsonForJs(body)};\n\n`;
  }
  
  code += `const req = client.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', JSON.parse(data));
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

`;
  
  if (method.toUpperCase() !== 'GET' && body && body.trim()) {
    code += `req.write(JSON.stringify(postData));
`;
  }
  
  code += `req.end();`;
  
  return code;
}

// Helper functions for formatting JSON in different languages
function formatJsonForJs(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    return `'${jsonString}'`;
  }
}

function formatJsonForPython(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2).replace(/"/g, '"');
  } catch (e) {
    return `"${jsonString}"`;
  }
}

function formatJsonForGo(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    // Convert to Go map format
    const goMap = convertToGoMap(parsed);
    return goMap;
  } catch (e) {
    return `"${jsonString}"`;
  }
}

function convertToGoMap(obj, indent = '') {
  if (typeof obj === 'string') {
    return `"${obj}"`;
  } else if (typeof obj === 'number' || typeof obj === 'boolean') {
    return obj.toString();
  } else if (Array.isArray(obj)) {
    const items = obj.map(item => convertToGoMap(item, indent + '\t')).join(', ');
    return `[]interface{}{${items}}`;
  } else if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj)
      .map(([key, value]) => `"${key}": ${convertToGoMap(value, indent + '\t')}`)
      .join(', ');
    return `map[string]interface{}{${entries}}`;
  }
  return 'nil';
}