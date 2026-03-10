/**
 * Queries the Google Places API to extract the business's local reputation footprint based on their Name and Location.
 * Required: GOOGLE_CLOUD_API_KEY with the "Places API (New)" enabled in Google Cloud Console.
 */
export async function getGooglePlacesMetrics(businessName, location) {
    if (!process.env.GOOGLE_CLOUD_API_KEY || !businessName || !location) {
        return null;
    }

    try {
        const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
        // Construct a highly-targeted search query (e.g., "Acme Plumbing in Austin, TX")
        const query = `${businessName} in ${location}`;

        // Step 1: Text Search to find the Place ID
        const searchEndpoint = `https://places.googleapis.com/v1/places:searchText`;

        const searchResponse = await fetch(searchEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': apiKey,
                // We only need the place id to minimize payload and cost
                'X-Goog-FieldMask': 'places.id'
            },
            body: JSON.stringify({
                textQuery: query
            }),
            // Timeout to prevent hanging the entire generation process
            signal: AbortSignal.timeout(5000)
        });

        if (!searchResponse.ok) {
            console.warn(`Google Places Text Search failed: ${searchResponse.status}`);
            return null;
        }

        const searchData = await searchResponse.json();
        const place = searchData?.places?.[0];

        if (!place?.id) {
            // Not found on Google Maps
            return {
                status: 'NOT_FOUND',
                error: 'Could not locate a verified Google Business Profile for this exact name and location.'
            };
        }

        // Step 2: Fetch detailed place metrics using the Place ID
        const detailsEndpoint = `https://places.googleapis.com/v1/places/${place.id}`;

        const detailsResponse = await fetch(detailsEndpoint, {
            method: 'GET',
            headers: {
                'X-Goog-Api-Key': apiKey,
                // Requesting rating, review count, business status, primary type, and whether it's claimed/serves area
                'X-Goog-FieldMask': 'rating,userRatingCount,businessStatus,primaryType,regularOpeningHours,formattedAddress'
            },
            signal: AbortSignal.timeout(5000)
        });

        if (!detailsResponse.ok) {
            console.warn(`Google Places Details failed: ${detailsResponse.status}`);
            return null;
        }

        const detailsData = await detailsResponse.json();

        return {
            status: 'FOUND',
            rating: detailsData.rating || 0,
            reviewCount: detailsData.userRatingCount || 0,
            business_status: detailsData.businessStatus || 'UNKNOWN',
            has_hours_listed: !!detailsData.regularOpeningHours,
            primary_category: detailsData.primaryType || 'Unknown',
            formatted_address: detailsData.formattedAddress || 'Unknown'
        };

    } catch (error) {
        console.warn(`Failed to execute Google Places Search for ${businessName}:`, error.message);
        return null; // Fail gracefully so the audit can still proceed without local data
    }
}
