// src/lib/apiClient.ts
/**
 * Makes an API call with retry logic for tools that return empty data when DB queries are still processing.
 * @param baseUrl The base URL of the external API.
 * @param endpoint The specific path for the external API.
 * @param payload The JSON payload to send in the request body.
 * @param method The HTTP method to use for the request.
 * @param maxRetries Maximum number of retries (default 3).
 * @param backoffSeconds Seconds to wait between retries (default 5).
 * @returns The JSON response from the API, or null if an error occurs.
 */
export async function makeApiCallWithRetry(baseUrl, endpoint, payload, method = "POST", maxRetries = 3, backoffSeconds = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const response = await makeApiCall(baseUrl, endpoint, payload, method);
        if (response === null) {
            return null; // API call failed completely
        }
        // Check if this is an empty data response that might need retry
        const isEmptyDataResponse = (response.status === true && Array.isArray(response.data) && response.data.length === 0) ||
            (response.success === true && Array.isArray(response.message) && response.message.length === 0);
        // If it's not an empty data response, or we're on the last attempt, return the response
        if (!isEmptyDataResponse || attempt === maxRetries) {
            return response;
        }
        // Log retry attempt
        console.error(`[API Client] Empty data response on attempt ${attempt}/${maxRetries}. Retrying in ${backoffSeconds} seconds...`);
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, backoffSeconds * 1000));
    }
    return null;
}
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
