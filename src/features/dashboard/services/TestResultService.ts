import { API_BASE_URL } from "../../common/config/apiConfig";
import type { TestStatusCount } from "../types/TestStatusCount";

export async function getLatestTestStatusCounts(): Promise<TestStatusCount[]> {

    const response = await fetch(
        `${API_BASE_URL}/testresults/latest`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch test results");
    }
    return response.json();
}