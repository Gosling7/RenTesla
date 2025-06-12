export interface ProblemDetails {
    type: string;
    title: string;
    status: number;
    instance: string;
    traceId?: string;
    errors?: Record<string, string[]>;
};