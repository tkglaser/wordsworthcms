module pfb.Models {
    export interface IRequest {
        requestId: string;
        number?: number;
        startName?: string;
        startCountry?: string;
        startLat?: number;
        startLon?: number;
        targetName?: string;
        targetCountry?: string;
        targetLat?: number;
        targetLon?: number;
        name?: string;
        phone?: string;
        email?: string;
        address?: string;
        town?: string;
        postcode?: string;
        organisation?: string;
        productDescription?: string;
        safeProductDescription?: string;
        specialRequests?: string;
        hasSpecialRequests?: boolean;
        isOfferExpired?: boolean;
        distance?: number;
        duration?: number;
        startDate?: any;
        returnDate?: any;
        startTimeArrive?: string;
        startTimeDepart?: string;
        returnTimeArrive?: string;
        returnTimeDepart?: string;
        startTimeMode?: string;
        returnTimeMode?: string;
        busShouldStay?: boolean;
        tripType?: string;
        passengers?: number;
        isLocked?: boolean;
    }
}