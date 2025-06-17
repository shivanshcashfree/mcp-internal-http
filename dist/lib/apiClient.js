// src/lib/apiClient.ts
/**
 * Makes an authenticated POST request to a given API endpoint.
 * @param baseUrl The base URL of the external API (e.g., "https://merchant.cashfree.com").
 * @param endpoint The specific path for the external API (e.g., "/api/path").
 * @param payload The JSON payload to send in the request body.
 * @param method The HTTP method to use for the request (default is "POST").
 * @returns The JSON response from the API, or null if an error occurs.
 */
export async function makeApiCall(baseUrl, endpoint, payload, method = "POST") {
    let fullUrl = `${baseUrl}${endpoint}`;
    let fetchOptions = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
    };
    if (method === "GET") {
        // Append params to URL for GET
        const params = new URLSearchParams(payload).toString();
        fullUrl += `?${params}`;
    }
    else {
        fetchOptions.body = JSON.stringify(payload, null, 2);
    }
    console.error(`\n--- API Call Details ---`);
    console.error(`[API Client] Calling API: ${fullUrl}`);
    console.error(`[API Client] Method: ${method}`);
    console.error(`[API Client] Headers:`);
    console.error(`    Content-Type: application/json`);
    if (method !== "GET") {
        console.error(`[API Client] Request Body:\n${fetchOptions.body}`);
    }
    console.error(`------------------------\n`);
    try {
        const res = await fetch(fullUrl, fetchOptions);
        const responseText = await res.text();
        console.error(`\n--- API Response Details ---`);
        console.error(`[API Client] Response Status: ${res.status} ${res.statusText}`);
        console.error(`[API Client] Raw Response Body:\n${responseText}`);
        console.error(`---------------------------\n`);
        if (!res.ok) {
            console.error(`[API Client] API call failed: ${res.status} - ${responseText}`);
            throw new Error(`API error ${res.status}: ${responseText}`);
        }
        try {
            const jsonResponse = JSON.parse(responseText);
            console.error(`[API Client] Successfully parsed JSON response.`);
            return jsonResponse;
        }
        catch (parseError) {
            console.error(`[API Client] Error parsing JSON response:`, parseError);
            console.error(`[API Client] Raw response was: ${responseText}`);
            throw new Error(`Failed to parse JSON response: ${responseText}`);
        }
    }
    catch (err) {
        console.error(`[API Client] Fatal error during API call to ${fullUrl}:`, err);
        return null;
    }
}
