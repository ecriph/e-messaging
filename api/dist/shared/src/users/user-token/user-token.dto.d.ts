export declare class UserTokenDTO {
    id: string;
    role: string;
}
export declare class UserAuthTokenDTO {
    refreshToken: string;
}
export declare class UserAuthResponseDTO {
    access_token: string;
}
export declare class UserTokenStatus {
    success: boolean;
    message: string;
    user: UserTokenDTO;
}
export declare class JwtDTO extends UserTokenDTO {
    iat: number;
    exp: number;
}
