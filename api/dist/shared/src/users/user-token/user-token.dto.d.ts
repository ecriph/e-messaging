export declare class UserTokenDTO {
    id: string;
    role: string;
}
export declare class UserAuthTokenDTO {
    refreshToken: string;
}
export declare class UserTokenStatus {
    success: boolean;
    message: string;
    user: UserTokenDTO;
}
