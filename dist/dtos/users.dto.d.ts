export declare class CreateUserDto {
    name: string;
    role: string;
    email: string;
    mobile: string;
    password: string;
    gender: string;
    dob: string;
    profileImage: string;
    bgImage: string;
    address: string;
    location: {
        type: string;
        coordinates: [];
    };
    categories: [];
    description: any;
    speciality: [];
    hourlyRate: number;
    experienceYear: number;
    documents: {
        certificate: string;
        address: string;
        identity: string;
    };
    goals: [];
    height: string;
    weight: number;
    device: {
        id: string;
        token: string;
    };
    social: {
        type: string;
        token: string;
    };
    otpId: string;
    resetToken: string;
}
