export interface AuthRequest {
    email: string;
    password: string;
}

export interface CreateReservationRequest {
    email: string;
    carModelId: string;
    pickUpLocationId: string;
    dropOffLocationId: string;
    from: string;
    to: string;
    totalCost: number;
    createAccount?: boolean;
    password?: string;
}