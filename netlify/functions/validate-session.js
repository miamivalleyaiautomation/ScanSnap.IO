// netlify/functions/validate-session.js
const { createClient } = require('@supabase/supabase-js'); // Or your DB client

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
    
    // CONNECT TO YOUR REAL DATABASE HERE
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
    
    // LOOK UP THE REAL SESSION
    const { data: session, error } = await supabase
      .from('sessions')  // Your sessions table
      .select(`
        *,
        users (
          id,
          email,
          first_name,
          last_name,
          subscription_type
        )
      `)
      .eq('token', sessionToken)
      .single();
    
    if (error || !session) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ success: false, error: 'Invalid session' })
      };
    }
    
    // RETURN THE REAL USER DATA
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        session: {
          userId: session.users.id,
          email: session.users.email,
          firstName: session.users.first_name,
          lastName: session.users.last_name,
          subscription: session.users.subscription_type,
          dashboardUrl: "https://scansnap.io/dashboard",
          expiresAt: session.expires_at
        }
      })
    };
    
  } catch (error) {
    console.error('Session validation error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: 'Server error' })
    };
  }
};