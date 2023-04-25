export interface RegistrationTokenEntity {
    userId: string;
    registrationToken: string;
    tokenExpiresOn: Date;
}