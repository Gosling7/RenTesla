export interface ApiResult<TDataType> {
    isSuccess: boolean;
    data: TDataType;
    errors: string[];
};

export interface ReservationDto {
    id: string;
    carModelName: string;
    pickUpLocationName: string;
    dropOffLocationName: string;
    from: string;
    to: string;
    totalCost: number;
    status: ReservationStatus;
    reservationCode: string;
};

export interface AvailableModelDto {
    id: string;
    name: string;
    dailyRate: number;
    availableCount: number;
};

export interface LocationDto {
    id: string;
    name: string;
};

export interface CarModelDto {
    id: string;
    name: string;
    baseDailyRate: number;
}

export interface UserInfoDto {
    email: string;
    roles: string[];
}

export enum ReservationStatus {
    Active,
    PendingReturn,
    Completed,
    Cancelled
}