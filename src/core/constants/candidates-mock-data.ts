export const genderDistributionMockData = [
    { name: 'पुरुष', value: 0, color: '#003da5' },
    { name: 'महिला', value: 0, color: '#c41e3a' },
    { name: 'अन्य', value: 0, color: '#2d8659' },
];

export const partyWiseCandidatesMockData = [
    { party: 'ने.का.', candidates: 0, color: '#c41e3a' },
    { party: 'एमाले', candidates: 0, color: '#003da5' },
    { party: 'माओवादी', candidates: 0, color: '#d4a574' },
    { party: 'रास्वपा', candidates: 0, color: '#6b5b4a' },
    { party: 'जसपा', candidates: 0, color: '#8b6f47' },
    { party: 'स्वतन्त्र', candidates: 0, color: '#2d8659' },
];

export const ageDistributionMockData = [
    { group: '२१-३०', count: 0 },
    { group: '३१-४०', count: 0 },
    { group: '४१-५०', count: 0 },
    { group: '५१-६०', count: 0 },
    { group: '६०+', count: 0 },
];

export const educationDistributionMockData = [
    { name: 'स्नातकोत्तर+', value: 0, color: '#003da5' },
    { name: 'स्नातक', value: 0, color: '#c41e3a' },
    { name: 'SLC/SEE', value: 0, color: '#d4a574' },
    { name: 'अन्य', value: 0, color: '#8b6f47' },
];

/* ─── Province / District / Constituency Data ─── */
export const provincesMockData = [
    { value: 'all', label: 'सबै प्रदेश' },
    { value: 'koshi', label: 'कोशी प्रदेश' },
    { value: 'madhesh', label: 'मधेश प्रदेश' },
    { value: 'bagmati', label: 'बागमती प्रदेश' },
    { value: 'gandaki', label: 'गण्डकी प्रदेश' },
    { value: 'lumbini', label: 'लुम्बिनी प्रदेश' },
    { value: 'karnali', label: 'कर्णाली प्रदेश' },
    { value: 'sudurpaschim', label: 'सुदूरपश्चिम प्रदेश' },
];

export const districtsByProvinceMockData: Record<string, { value: string; label: string }[]> = {
    all: [{ value: 'all', label: 'सबै जिल्ला' }],
    koshi: [
        { value: 'all', label: 'सबै जिल्ला' },
        { value: 'morang', label: 'मोरङ' },
        { value: 'sunsari', label: 'सुनसरी' },
        { value: 'jhapa', label: 'झापा' },
    ],
    madhesh: [
        { value: 'all', label: 'सबै जिल्ला' },
        { value: 'dhanusha', label: 'धनुषा' },
        { value: 'siraha', label: 'सिराहा' },
        { value: 'saptari', label: 'सप्तरी' },
    ],
    bagmati: [
        { value: 'all', label: 'सबै जिल्ला' },
        { value: 'kathmandu', label: 'काठमाडौं' },
        { value: 'lalitpur', label: 'ललितपुर' },
        { value: 'bhaktapur', label: 'भक्तपुर' },
    ],
    gandaki: [
        { value: 'all', label: 'सबै जिल्ला' },
        { value: 'kaski', label: 'कास्की' },
        { value: 'tanahun', label: 'तनहुँ' },
    ],
    lumbini: [
        { value: 'all', label: 'सबै जिल्ला' },
        { value: 'rupandehi', label: 'रुपन्देही' },
        { value: 'kapilvastu', label: 'कपिलवस्तु' },
    ],
    karnali: [
        { value: 'all', label: 'सबै जिल्ला' },
        { value: 'surkhet', label: 'सुर्खेत' },
        { value: 'dailekh', label: 'दैलेख' },
    ],
    sudurpaschim: [
        { value: 'all', label: 'सबै जिल्ला' },
        { value: 'kailali', label: 'कैलाली' },
        { value: 'kanchanpur', label: 'कञ्चनपुर' },
    ],
};

export const constituenciesByDistrictMockData: Record<string, { value: string; label: string }[]> = {
    all: [{ value: 'all', label: 'सबै निर्वाचन क्षेत्र' }],
    kathmandu: [
        { value: 'all', label: 'सबै निर्वाचन क्षेत्र' },
        { value: 'ktm-1', label: 'काठमाडौं-१' },
        { value: 'ktm-2', label: 'काठमाडौं-२' },
        { value: 'ktm-3', label: 'काठमाडौं-३' },
    ],
    lalitpur: [
        { value: 'all', label: 'सबै निर्वाचन क्षेत्र' },
        { value: 'ltp-1', label: 'ललितपुर-१' },
        { value: 'ltp-2', label: 'ललितपुर-२' },
    ],
    bhaktapur: [
        { value: 'all', label: 'सबै निर्वाचन क्षेत्र' },
        { value: 'bkt-1', label: 'भक्तपुर-१' },
        { value: 'bkt-2', label: 'भक्तपुर-२' },
    ],
    morang: [
        { value: 'all', label: 'सबै निर्वाचन क्षेत्र' },
        { value: 'mor-1', label: 'मोरङ-१' },
        { value: 'mor-2', label: 'मोरङ-२' },
    ],
    jhapa: [
        { value: 'all', label: 'सबै निर्वाचन क्षेत्र' },
        { value: 'jha-1', label: 'झापा-१' },
        { value: 'jha-2', label: 'झापा-२' },
    ],
    kaski: [
        { value: 'all', label: 'सबै निर्वाचन क्षेत्र' },
        { value: 'kas-1', label: 'कास्की-१' },
        { value: 'kas-2', label: 'कास्की-२' },
    ],
    rupandehi: [
        { value: 'all', label: 'सबै निर्वाचन क्षेत्र' },
        { value: 'rup-1', label: 'रुपन्देही-१' },
        { value: 'rup-2', label: 'रुपन्देही-२' },
    ],
};

export const partiesMockData = [
    { value: 'all', label: 'सबै दल' },
    { value: 'congress', label: 'नेपाली काँग्रेस' },
    { value: 'uml', label: 'नेकपा एमाले' },
    { value: 'maoist', label: 'नेकपा माओवादी केन्द्र' },
    { value: 'raswapa', label: 'राष्ट्रिय स्वतन्त्र पार्टी' },
    { value: 'jasapa', label: 'जनता समाजवादी पार्टी' },
    { value: 'independent', label: 'स्वतन्त्र' },
];
