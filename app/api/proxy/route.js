import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { url, method, headers, body } = await request.json();

    // Validate required fields
    if (!url || !method) {
      return NextResponse.json(
        { error: 'URL and method are required' },
        { status: 400 }
      );
    }

    // Prepare fetch options
    const fetchOptions = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    // Add body for non-GET requests
    if (method.toUpperCase() !== 'GET' && body) {
      fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    // Record start time for response time tracking
    const startTime = Date.now();

    // Make the actual API request
    const response = await fetch(url, fetchOptions);
    
    // Calculate response time
    const responseTime = Date.now() - startTime;

    // Get response content type
    const contentType = response.headers.get('content-type');
    let data;

    // Parse response based on content type
    if (contentType?.includes('application/json')) {
      try {
        data = await response.json();
      } catch {
        data = await response.text();
      }
    } else {
      data = await response.text();
    }

    // Convert headers to plain object
    const responseHeaders = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data,
      responseTime,
      url: response.url, // Final URL after redirects
    });

  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        error: error.message,
        details: 'Failed to execute request'
      },
      { status: 500 }
    );
  }
}