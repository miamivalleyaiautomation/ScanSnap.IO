// netlify/functions/validate-session.js
exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://app.scansnap.io',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { sessionToken } = JSON.parse(event.body || '{}');
    
    // TODO: Validate sessionToken against your database
    // For now, parse the token to extract user info
    // Example: session_1758740487283_yfgah
    
    // This is where you'd check your database
    // const session = await validateTokenInDatabase(sessionToken);
    
    // Mock response for now
    const session = {
      userId: "user_" + sessionToken.split('_')[1],
      email: "user@example.com", // Get from your DB
      firstName: "User",
      lastName: "Name",
      subscription: "plus", // Get from your DB
      dashboardUrl: "https://scansnap.io/dashboard",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, session })
    };
    
  } catch (error) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ success: false, error: 'Invalid session' })
    };
  }
};