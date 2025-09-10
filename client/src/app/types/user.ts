export type User = {
    id: string;
    displayName: string;
    email: string;
    token: string;
    imageUrl?: string;
}



export type LoginCreds = {
    email: string;
    password: string;   
}

export type RegisterCreds = {
    email: string;
    displayName: string;
    password: string;
    //ConfirmPassword : string;
    gender: string;
    dateOfBirth: string;
    city : string;
    country : string;
}