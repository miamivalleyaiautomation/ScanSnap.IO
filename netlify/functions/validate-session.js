// netlify/functions/validate-session.js

exports.handler = async (event, context) => {
    console.log('validate-session function called');
    console.log('Method:', event.httpMethod);
    console.log('Headers:', JSON.stringify(event.headers));
    console.log('Body:', event.body);

    // Add CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS request for CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only accept POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ 
                error: 'Method not allowed',
                method: event.httpMethod 
            })
        };
    }

    try {
        // Parse the request body
        let requestData;
        try {
            requestData = JSON.parse(event.body);
            console.log('Parsed request data:', requestData);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid JSON in request body',
                    details: parseError.message
                })
            };
        }

        const { session } = requestData;

        // Validate that session was provided
        if (!session) {
            console.log('No session token provided');
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Session token is required',
                    valid: false
                })
            };
        }

        console.log('Validating session:', session);

        // Clean the session token
        const cleanSession = session.trim();

        // Here you would normally validate the session with your database
        // For now, let's add some debugging and mock validation
        
        // Example validation logic (replace with your actual implementation):
        // Option 1: Check against a database
        // Option 2: Decode and verify a JWT
        // Option 3: Check against Square API
        
        // For debugging, let's check if the session follows expected format
        const sessionPattern = /^session_\d+$/;
        
        if (!sessionPattern.test(cleanSession)) {
            console.log('Session token format invalid:', cleanSession);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    valid: false,
                    error: 'Invalid session format',
                    receivedToken: cleanSession
                })
            };
        }

        // TODO: Replace this with your actual validation logic
        // For example, if you're using Square:
        /*
        const squareClient = new Client({
            accessToken: process.env.SQUARE_ACCESS_TOKEN,
            environment: Environment.Production
        });
        
        try {
            // Validate with Square API
            const response = await squareClient.checkoutApi.retrievePaymentLink(cleanSession);
            
            if (response.result.paymentLink) {
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        valid: true,
                        session: cleanSession,
                        paymentLink: response.result.paymentLink
                    })
                };
            }
        } catch (squareError) {
            console.error('Square API error:', squareError);
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    valid: false,
                    error: 'Session not found in Square',
                    details: squareError.message
                })
            };
        }
        */

        // Temporary mock validation for testing
        // Remove this and uncomment the actual validation above
        console.log('Mock validation - accepting session for testing');
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                valid: true,
                session: cleanSession,
                message: 'Session validated successfully (mock)'
            })
        };

    } catch (error) {
        console.error('Unexpected error in validate-session:', error);
        console.error('Error stack:', error.stack);
        
        // Return a proper error response
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                message: error.message,
                // Only include stack in development
                ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
            })
        };
    }
};