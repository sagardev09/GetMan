// HTTP Method Colors
export const METHOD_COLORS = {
  GET: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  POST: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  PUT: 'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
  PATCH: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  DELETE: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  HEAD: 'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
  OPTIONS: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
};

// Common HTTP Headers for autocomplete
export const COMMON_HEADERS = [
  'Accept',
  'Accept-Encoding',
  'Accept-Language',
  'Authorization',
  'Cache-Control',
  'Content-Type',
  'Content-Length',
  'Content-Encoding',
  'Cookie',
  'Host',
  'Origin',
  'Referer',
  'User-Agent',
  'X-API-Key',
  'X-Auth-Token',
  'X-Forwarded-For',
  'X-Requested-With',
  'Access-Control-Allow-Origin',
  'Access-Control-Allow-Methods',
  'Access-Control-Allow-Headers',
  'If-Modified-Since',
  'If-None-Match',
  'Last-Modified',
  'ETag',
  'Location',
  'Set-Cookie',
  'WWW-Authenticate',
  'X-Rate-Limit-Limit',
  'X-Rate-Limit-Remaining',
  'X-Rate-Limit-Reset'
];

// Default headers that should be prefilled
export const DEFAULT_HEADERS = [
  { key: 'Content-Type', value: 'application/json' },
  { key: 'Accept', value: 'application/json' },
  { key: '', value: '' }
];

// Utility function to get method color classes
export const getMethodColor = (method) => {
  return METHOD_COLORS[method?.toUpperCase()] || METHOD_COLORS.GET;
};