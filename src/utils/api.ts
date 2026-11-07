
const API_BASE_URL = "http://localhost:3000/api";

export async function createRepairRequest(request: {
    item : string;
    category : string;
    problem : string;
    providerName : string;
    contact : string;
    preferredDate? : string;
    notes?: string;
}){
    const response = await fetch(
        `${API_BASE_URL}/repair-requests`,
        {
            method : "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        }
    );

    const result = await response.json();

    if(!response.ok){
        throw new Error(
            result.message || "Failed to create repair requests"
        );
    }

    return result;
}

export async function getRepairRequests(){
    const response = await fetch(
        `${API_BASE_URL}/repair-requests`
    );

    const result = await response.json();

    if(!response.ok){
        throw new Error(
            result.message || "Failed to fetch repair requests"
        );
    }
    return result;
}