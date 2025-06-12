import { GetCarModels } from "../types/ApiRequests";
import { ProblemDetails } from "../types/ProblemDetails";

export const extractErrorsFromProblemDetails = (
    fieldName: keyof GetCarModels,
    problemDetails: ProblemDetails | null
): string => {
    if (!problemDetails) {
        return "";
    }

    if (!problemDetails.errors) {
        return problemDetails.title || "An unknown error occurred";
    }
    
    const field = convertCamelToPascal(fieldName);
    const messages = problemDetails.errors[field];
    if (!messages || messages.length === 0) {
        return "";
    }

    return messages.join(", ");
};

const convertCamelToPascal = (string: string) => 
    string.charAt(0).toUpperCase() + string.slice(1);