import { Handler } from '@netlint/functions';

export const handler: Handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    };
  }

  if (!event.body) {
    return {
      statusCode: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Missing request body' }),
    };
  }

  try {
    const { imageUrl, config } = JSON.parse(event.body);
    const apiKey = process.env.VITE_RUNWAY_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'API key not configured' }),
      };
    }

    const response = await fetch('https://api.dev.runwayml.com/v1/image_to_video', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'X-Runway-Version': '2024-11-06'
      },
      body: JSON.stringify({
        promptImage: imageUrl,
        seed: Math.floor(Math.random() * 4294967295),
        model: 'gen3a_turbo',
        promptText: 'Generate a video',
        watermark: false,
        duration: config.duration,
        ratio: config.aspectRatio === '16:9' ? '1280:768' : '768:1280'
      }),
    });

    const data = await response.text(); // First get response as text
    let jsonData;
    
    try {
      jsonData = JSON.parse(data); // Try to parse as JSON
    } catch (e) {
      console.error('Invalid JSON response:', data);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid response from Runway API' }),
      };
    }

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: jsonData.message || 'Failed to generate video' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(jsonData),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to generate video' 
      }),
    };
  }
};
