export const phoneToIso = {
    1: "us",      // USA / Canada (default)
    7: "ru",      // Russia
    20: "eg",     // Egypt
    27: "za",     // South Africa
    30: "gr",     // Greece
    31: "nl",     // Netherlands
    32: "be",     // Belgium
    33: "fr",     // France
    34: "es",     // Spain
    36: "hu",     // Hungary
    39: "it",     // Italy
    40: "ro",     // Romania
    41: "ch",     // Switzerland
    43: "at",     // Austria
    44: "gb",     // United Kingdom
    45: "dk",     // Denmark
    46: "se",     // Sweden
    47: "no",     // Norway
    48: "pl",     // Poland
    49: "de",     // Germany
    51: "pe",     // Peru
    52: "mx",     // Mexico
    53: "cu",     // Cuba
    54: "ar",     // Argentina
    55: "br",     // Brazil
    56: "cl",     // Chile
    57: "co",     // Colombia
    58: "ve",     // Venezuela
    60: "my",     // Malaysia
    61: "au",     // Australia
    62: "id",     // Indonesia
    63: "ph",     // Philippines
    64: "nz",     // New Zealand
    65: "sg",     // Singapore
    66: "th",     // Thailand
    81: "jp",     // Japan
    82: "kr",     // South Korea
    84: "vn",     // Vietnam
    86: "cn",     // China
    90: "tr",     // Turkey
    91: "in",     // India
    92: "pk",     // Pakistan
    93: "af",     // Afghanistan
    94: "lk",     // Sri Lanka
    95: "mm",     // Myanmar
    98: "ir",     // Iran
    211: "ss",    // South Sudan
    212: "ma",    // Morocco
    213: "dz",    // Algeria
    216: "tn",    // Tunisia
    218: "ly",    // Libya
    220: "gm",    // Gambia
    221: "sn",    // Senegal
    222: "mr",    // Mauritania
    223: "ml",    // Mali
    224: "gn",    // Guinea
    225: "ci",    // Ivory Coast
    226: "bf",    // Burkina Faso
    381: 'rs',
    216: 'tn', // Tunisia
    972: 'il', // Israel
    380: 'ua', // Ukraine
    375: 'by', // Belarus
    371: 'lv', // Latvia
    372: 'ee', // Estonia
    370: 'lt', // Lithuania
    421: 'sk', // Slovakia
    386: 'si', // Slovenia
    358: 'fi', // Finland
    420: 'cz', // Czech Republic
    385: 'hr', // Croatia
};

export const getCountryCode = (phoneCode) => {
    return phoneToIso[phoneCode] || 'us';
};