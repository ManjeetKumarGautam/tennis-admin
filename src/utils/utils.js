export const phoneToIso = {
    381: 'rs', // Serbia
    34: 'es',  // Spain
    7: 'ru',   // Russia
    39: 'it',  // Italy
    49: 'de',  // Germany
    30: 'gr',  // Greece
    45: 'dk',  // Denmark
    47: 'no',  // Norway
    1: 'us',   // USA / Canada (Defaulting to US based on player list)
    61: 'au',  // Australia
    48: 'pl',  // Poland
    359: 'bg', // Bulgaria
};

export const getCountryCode = (phoneCode) => {
    return phoneToIso[phoneCode] || 'us';
};