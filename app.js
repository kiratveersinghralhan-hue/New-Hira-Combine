const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const CONTACT_PHONE = '919216107700';
const API_BASE = String(window.NEW_HIRA_API_BASE || '').replace(/\/$/, '');
const API_ROOT = API_BASE + '/api';
const SESSION_KEY = 'new_hira_session_v18';
const LEAD_GATE_KEY = 'new_hira_lead_gate_v18';
const PENDING_BOOKINGS_KEY = 'new_hira_pending_bookings_v18';
const ADMIN_TOKEN_KEY = 'new_hira_admin_session_v18';
const LANGUAGE_KEY = 'new_hira_language_v18';
const ONBOARDING_KEY = 'new_hira_onboarding_v18';

let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || 'en';

const TRANSLATIONS = {
  en: {
    introTitle: 'The season waits<br />for <em>no one.</em>',
    introCopy: 'Step into the New Hira harvest experience.',
    enterField: 'Enter the field', skipIntro: 'Skip introduction',
    navMachines: 'Machines', navTechnology: 'Technology', navField: 'In the field', navBooking: 'Book harvest', navOwner: 'Owner desk', reserveMachine: 'Reserve a machine',
    heroEyebrow: 'INDIAN HARVEST ENGINEERING / NABHA', heroTitle: 'Every field deserves<br /><em>a decisive finish.</em>', heroCopy: 'Put brochure-verified New Hira power behind your harvest. Choose the machine, share the field and reserve the working window with Ram Chand & Sons.',
    reserveWindow: 'Reserve your window', exploreFleet: 'Explore the fleet', heroProofOne: 'Self-propelled multicrop', heroProofTwo: 'Direct booking desk',
    operationArea: 'OPERATION AREA', machineClass: 'MACHINE CLASS', machineClassValue: 'Self-propelled multicrop', bookingDesk: 'BOOKING DESK', takingRequests: 'Taking requests', scrollField: 'Scroll into the field',
    startField: 'Start with your field.', matchMachine: 'We will match the machine and route.', name: 'Name', namePlaceholder: 'Farmer / family name', villageDistrict: 'Village or district', locationPlaceholder: 'e.g. Nabha, Patiala', crop: 'Crop', selectCrop: 'Select crop', planHarvest: 'Plan my harvest',
    builtSeason: 'BUILT AROUND THE SEASON', campaignTitle: 'Industrial capacity.<br /><em>Local coordination.</em>', campaignCopy: 'A serious harvest needs more than a machine. It needs timing, route planning and one booking desk that stays accountable from the first call to the final row.',
    statMachines: 'Brochure-documented machines', statMachinesCopy: 'Choose higher capacity or compact field agility.', statCrops: 'Core crop types', statCropsCopy: 'Wheat, paddy, sunflower, soyabean, gram and pulses.', statCutter: 'Largest brochure cutter bar', statTank: 'Maximum wheat grain tank',
    flowTitle: 'One continuous move.<br /><em>Four decisive actions.</em>', flowCopy: 'The visual explains the working sequence: the header meets the crop, material moves through threshing and cleaning, and grain reaches the tank.',
    flowCut: 'CUT', flowCutCopy: 'Cutter bar meets the standing crop.', flowThresh: 'THRESH', flowThreshCopy: 'The drum separates grain from crop material.', flowClean: 'CLEAN', flowCleanCopy: 'Sieves and airflow refine the grain sample.', flowCollect: 'COLLECT', flowCollectCopy: 'Clean grain moves into the onboard tank.',
    fleetTitle: 'Choose your <em>edge.</em>', fleetCopy: 'Specifications below are taken from the supplied New Hira brochures. Switch between both machines to find the right fit for field size, access and crop.', highCapacity: 'High-capacity workhorse', agileFinisher: 'Agile field finisher', bookMachine: 'Book this machine', viewBrochure: 'View brochure proof',
    stageTitle: 'Every angle.<br /><em>One unmistakable machine.</em>', stageCopy: 'Swipe or drag the stage. The active machine moves forward while the adjacent views remain visible in true perspective.', fieldTitle: 'Proof in <em>motion.</em>', fieldCopy: 'Your supplied New Hira 985 photographs are shown uncropped, with cinematic side previews for the next and previous field moments.',
    reservationDesk: 'RESERVATION DESK / 06', bookingTitle: 'Lock the day.<br /><em>Move the harvest.</em>', bookingCopy: 'Send the field details once. The request reaches the booking desk, receives a reference number and stays available in the private operations panel.',
    shareField: 'Share the field', shareFieldCopy: 'Village, crop and acreage', confirmFit: 'Confirm the fit', confirmFitCopy: 'Machine, access and timing', lockWindow: 'Lock the window', lockWindowCopy: 'Direct follow-up on WhatsApp', preferCall: 'Prefer to call?',
    contactLocation: 'CONTACT & LOCATION', coordinateWith: 'Who should we coordinate with?', farmerName: 'Farmer / family name *', whatsappNumber: 'WhatsApp number *', fullName: 'Full name', mobilePlaceholder: '10-digit mobile', village: 'Village *', villagePlaceholder: 'Village name', districtTown: 'District / nearby town *', requiredFields: 'Fields marked * are required', cropDetails: 'Crop details',
    fieldTiming: 'FIELD & TIMING', readyCut: 'Tell us what is ready to cut.', cropRequired: 'Crop *', acreage: 'Approx. acreage *', preferredDate: 'Preferred date *', dateFlexibility: 'Date flexibility', fieldAccess: 'Field access', back: 'Back', machineFit: 'Machine fit',
    machineConfirmation: 'MACHINE & CONFIRMATION', chooseMachine: 'Choose your preferred machine.', helpChoose: 'HELP ME CHOOSE', matchField: 'We will match it to your field', operatorKnow: 'Anything the operator should know?', bookingConsent: 'I agree to be contacted about this booking by phone or WhatsApp.', sendReservation: 'Send reservation',
    processTitle: 'Clear at every <em>turn.</em>', requestLogged: 'Request logged', requestLoggedCopy: 'Your contact, field and crop enter the booking board with a unique reference.', routeConfirmed: 'Route confirmed', routeConfirmedCopy: 'The desk checks machine fit, timing and travel between nearby harvests.', windowReserved: 'Window reserved', windowReservedCopy: 'You receive direct confirmation and the operator gets the complete field brief.', footerCopy: 'Practical harvest coordination for fields around Nabha, Patiala and beyond.',
    leadVisualTitle: 'Make your first move<br /><em>before the crop is ready.</em>', quickRegistration: 'QUICK REGISTRATION', leadTitle: 'Tell us where the<br /><em>season is moving.</em>', leadCopy: 'Leave a number for a callback or continue directly to the experience. Only details you submit become visible to the private booking desk.', yourName: 'Your name *', fieldLocationPlaceholder: 'Where is the field?', interestedIn: 'Interested in', leadConsent: 'I agree to receive a call or WhatsApp message about harvest booking.', registerInterest: 'Register my interest', continueWithout: 'Continue without registering'
  },
  hi: {
    introTitle: 'मौसम किसी का<br /><em>इंतज़ार नहीं करता।</em>', introCopy: 'न्यू हीरा हार्वेस्ट अनुभव में आपका स्वागत है।', enterField: 'खेत में प्रवेश करें', skipIntro: 'परिचय छोड़ें',
    navMachines: 'मशीनें', navTechnology: 'तकनीक', navField: 'खेत में', navBooking: 'कटाई बुक करें', navOwner: 'मालिक डेस्क', reserveMachine: 'मशीन बुक करें',
    heroEyebrow: 'भारतीय हार्वेस्ट इंजीनियरिंग / नाभा', heroTitle: 'हर खेत को चाहिए<br /><em>निर्णायक फिनिश।</em>', heroCopy: 'ब्रॉशर से सत्यापित न्यू हीरा शक्ति को अपनी फसल के साथ लगाएँ। मशीन चुनें, खेत की जानकारी दें और राम चंद एंड संस के साथ कटाई का समय सुरक्षित करें।', reserveWindow: 'अपना समय सुरक्षित करें', exploreFleet: 'मशीनें देखें', heroProofOne: 'सेल्फ-प्रोपेल्ड मल्टीक्रॉप', heroProofTwo: 'सीधा बुकिंग डेस्क',
    operationArea: 'सेवा क्षेत्र', machineClass: 'मशीन श्रेणी', machineClassValue: 'सेल्फ-प्रोपेल्ड मल्टीक्रॉप', bookingDesk: 'बुकिंग डेस्क', takingRequests: 'बुकिंग जारी है', scrollField: 'खेत की ओर स्क्रॉल करें',
    startField: 'अपने खेत से शुरुआत करें।', matchMachine: 'हम सही मशीन और रूट तय करेंगे।', name: 'नाम', namePlaceholder: 'किसान / परिवार का नाम', villageDistrict: 'गाँव या ज़िला', locationPlaceholder: 'जैसे नाभा, पटियाला', crop: 'फसल', selectCrop: 'फसल चुनें', planHarvest: 'कटाई की योजना बनाएँ',
    builtSeason: 'मौसम के अनुसार निर्मित', campaignTitle: 'औद्योगिक क्षमता।<br /><em>स्थानीय तालमेल।</em>', campaignCopy: 'गंभीर कटाई के लिए केवल मशीन नहीं, सही समय, रूट योजना और एक जवाबदेह बुकिंग डेस्क चाहिए।', statMachines: 'ब्रॉशर में दर्ज मशीनें', statMachinesCopy: 'अधिक क्षमता या कॉम्पैक्ट फील्ड चपलता चुनें।', statCrops: 'मुख्य फसलें', statCropsCopy: 'गेहूँ, धान, सूरजमुखी, सोयाबीन, चना और दालें।', statCutter: 'सबसे बड़ी ब्रॉशर कटर बार', statTank: 'अधिकतम गेहूँ ग्रेन टैंक',
    flowTitle: 'एक सतत चाल।<br /><em>चार निर्णायक काम।</em>', flowCopy: 'हेडर फसल काटता है, सामग्री थ्रेशिंग और सफाई से गुजरती है और साफ अनाज टैंक में पहुँचता है।', flowCut: 'कटाई', flowCutCopy: 'कटर बार खड़ी फसल से मिलता है।', flowThresh: 'थ्रेशिंग', flowThreshCopy: 'ड्रम अनाज को फसल सामग्री से अलग करता है।', flowClean: 'सफाई', flowCleanCopy: 'छलनियाँ और हवा अनाज साफ करती हैं।', flowCollect: 'संग्रह', flowCollectCopy: 'साफ अनाज मशीन के टैंक में पहुँचता है।',
    fleetTitle: 'अपनी <em>ताकत चुनें।</em>', fleetCopy: 'नीचे दिए सभी स्पेसिफिकेशन आपके भेजे न्यू हीरा ब्रॉशर से लिए गए हैं। खेत, पहुँच और फसल के अनुसार 985 या 785 चुनें।', highCapacity: 'उच्च क्षमता वाली मशीन', agileFinisher: 'चुस्त फील्ड फिनिशर', bookMachine: 'यह मशीन बुक करें', viewBrochure: 'ब्रॉशर प्रमाण देखें',
    stageTitle: 'हर कोण।<br /><em>एक अलग पहचान।</em>', stageCopy: 'स्टेज को स्वाइप या ड्रैग करें। सक्रिय मशीन आगे आती है और अगली-पिछली मशीनें 3D में दिखाई देती हैं।', fieldTitle: 'काम का <em>असली प्रमाण।</em>', fieldCopy: 'आपके भेजे न्यू हीरा 985 फोटो बिना क्रॉप किए दिखाए गए हैं, दोनों ओर सिनेमैटिक प्रीव्यू के साथ।',
    reservationDesk: 'आरक्षण डेस्क / 06', bookingTitle: 'दिन तय करें।<br /><em>कटाई आगे बढ़ाएँ।</em>', bookingCopy: 'खेत की जानकारी एक बार भेजें। अनुरोध को रेफरेंस नंबर मिलेगा और वह निजी ऑपरेशन पैनल में सुरक्षित रहेगा।', shareField: 'खेत की जानकारी', shareFieldCopy: 'गाँव, फसल और एकड़', confirmFit: 'सही मशीन', confirmFitCopy: 'मशीन, पहुँच और समय', lockWindow: 'समय सुरक्षित करें', lockWindowCopy: 'WhatsApp पर सीधा संपर्क', preferCall: 'फ़ोन करना चाहेंगे?',
    contactLocation: 'संपर्क और स्थान', coordinateWith: 'हम किससे तालमेल करें?', farmerName: 'किसान / परिवार का नाम *', whatsappNumber: 'WhatsApp नंबर *', fullName: 'पूरा नाम', mobilePlaceholder: '10 अंकों का मोबाइल', village: 'गाँव *', villagePlaceholder: 'गाँव का नाम', districtTown: 'ज़िला / नज़दीकी शहर *', requiredFields: '* वाले फ़ील्ड आवश्यक हैं', cropDetails: 'फसल विवरण', fieldTiming: 'खेत और समय', readyCut: 'बताएँ कौन-सी फसल तैयार है।', cropRequired: 'फसल *', acreage: 'अनुमानित एकड़ *', preferredDate: 'पसंदीदा तारीख *', dateFlexibility: 'तारीख में लचीलापन', fieldAccess: 'खेत तक पहुँच', back: 'वापस', machineFit: 'मशीन चुनें', machineConfirmation: 'मशीन और पुष्टि', chooseMachine: 'अपनी पसंद की मशीन चुनें।', helpChoose: 'चुनने में मदद करें', matchField: 'हम खेत के अनुसार मशीन तय करेंगे', operatorKnow: 'ऑपरेटर को और क्या जानना चाहिए?', bookingConsent: 'मैं फ़ोन या WhatsApp द्वारा इस बुकिंग के लिए संपर्क की अनुमति देता/देती हूँ।', sendReservation: 'अनुरोध भेजें',
    processTitle: 'हर चरण में <em>स्पष्टता।</em>', requestLogged: 'अनुरोध दर्ज', requestLoggedCopy: 'संपर्क, खेत और फसल को एक यूनिक रेफरेंस मिलता है।', routeConfirmed: 'रूट की पुष्टि', routeConfirmedCopy: 'डेस्क मशीन, समय और पास के खेतों का रूट जाँचता है।', windowReserved: 'समय आरक्षित', windowReservedCopy: 'आपको सीधी पुष्टि मिलती है और ऑपरेटर को पूरा फील्ड ब्रीफ मिलता है।', footerCopy: 'नाभा, पटियाला और आसपास के खेतों के लिए व्यावहारिक कटाई समन्वय।',
    leadVisualTitle: 'फसल तैयार होने से पहले<br /><em>पहला कदम उठाएँ।</em>', quickRegistration: 'त्वरित पंजीकरण', leadTitle: 'बताइए मौसम<br /><em>किधर बढ़ रहा है।</em>', leadCopy: 'कॉल बैक के लिए नंबर दें या सीधे वेबसाइट पर जाएँ। केवल आपके द्वारा दी गई जानकारी निजी बुकिंग डेस्क को दिखेगी।', yourName: 'आपका नाम *', fieldLocationPlaceholder: 'खेत कहाँ है?', interestedIn: 'रुचि', leadConsent: 'मैं कटाई बुकिंग के लिए फ़ोन या WhatsApp संदेश की अनुमति देता/देती हूँ।', registerInterest: 'रुचि दर्ज करें', continueWithout: 'बिना पंजीकरण जारी रखें'
  },
  pa: {
    introTitle: 'ਮੌਸਮ ਕਿਸੇ ਦੀ<br /><em>ਉਡੀਕ ਨਹੀਂ ਕਰਦਾ।</em>', introCopy: 'ਨਿਊ ਹੀਰਾ ਹਾਰਵੈਸਟ ਅਨੁਭਵ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ।', enterField: 'ਖੇਤ ਵਿੱਚ ਦਾਖਲ ਹੋਵੋ', skipIntro: 'ਪਰਿਚਯ ਛੱਡੋ',
    navMachines: 'ਮਸ਼ੀਨਾਂ', navTechnology: 'ਤਕਨੀਕ', navField: 'ਖੇਤ ਵਿੱਚ', navBooking: 'ਵਾਢੀ ਬੁੱਕ ਕਰੋ', navOwner: 'ਮਾਲਕ ਡੈਸਕ', reserveMachine: 'ਮਸ਼ੀਨ ਬੁੱਕ ਕਰੋ',
    heroEyebrow: 'ਭਾਰਤੀ ਹਾਰਵੈਸਟ ਇੰਜੀਨੀਅਰਿੰਗ / ਨਾਭਾ', heroTitle: 'ਹਰ ਖੇਤ ਹੱਕਦਾਰ ਹੈ<br /><em>ਪੱਕੇ ਅੰਤ ਦਾ।</em>', heroCopy: 'ਬਰੋਸ਼ਰ-ਪ੍ਰਮਾਣਿਤ ਨਿਊ ਹੀਰਾ ਤਾਕਤ ਨੂੰ ਆਪਣੀ ਫਸਲ ਨਾਲ ਜੋੜੋ। ਮਸ਼ੀਨ ਚੁਣੋ, ਖੇਤ ਦੀ ਜਾਣਕਾਰੀ ਦਿਓ ਅਤੇ ਰਾਮ ਚੰਦ ਐਂਡ ਸੰਜ਼ ਨਾਲ ਵਾਢੀ ਦਾ ਸਮਾਂ ਰਿਜ਼ਰਵ ਕਰੋ।', reserveWindow: 'ਆਪਣਾ ਸਮਾਂ ਰਿਜ਼ਰਵ ਕਰੋ', exploreFleet: 'ਮਸ਼ੀਨਾਂ ਵੇਖੋ', heroProofOne: 'ਸੈਲਫ-ਪ੍ਰੋਪੈਲਡ ਮਲਟੀਕ੍ਰਾਪ', heroProofTwo: 'ਸਿੱਧਾ ਬੁਕਿੰਗ ਡੈਸਕ',
    operationArea: 'ਸੇਵਾ ਖੇਤਰ', machineClass: 'ਮਸ਼ੀਨ ਸ਼੍ਰੇਣੀ', machineClassValue: 'ਸੈਲਫ-ਪ੍ਰੋਪੈਲਡ ਮਲਟੀਕ੍ਰਾਪ', bookingDesk: 'ਬੁਕਿੰਗ ਡੈਸਕ', takingRequests: 'ਬੁਕਿੰਗ ਜਾਰੀ ਹੈ', scrollField: 'ਖੇਤ ਵੱਲ ਸਕ੍ਰੋਲ ਕਰੋ',
    startField: 'ਆਪਣੇ ਖੇਤ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ।', matchMachine: 'ਅਸੀਂ ਸਹੀ ਮਸ਼ੀਨ ਅਤੇ ਰੂਟ ਮਿਲਾਵਾਂਗੇ।', name: 'ਨਾਮ', namePlaceholder: 'ਕਿਸਾਨ / ਪਰਿਵਾਰ ਦਾ ਨਾਮ', villageDistrict: 'ਪਿੰਡ ਜਾਂ ਜ਼ਿਲ੍ਹਾ', locationPlaceholder: 'ਜਿਵੇਂ ਨਾਭਾ, ਪਟਿਆਲਾ', crop: 'ਫਸਲ', selectCrop: 'ਫਸਲ ਚੁਣੋ', planHarvest: 'ਵਾਢੀ ਦੀ ਯੋਜਨਾ ਬਣਾਓ',
    builtSeason: 'ਮੌਸਮ ਦੇ ਅਨੁਸਾਰ ਤਿਆਰ', campaignTitle: 'ਉਦਯੋਗਿਕ ਸਮਰੱਥਾ।<br /><em>ਸਥਾਨਕ ਤਾਲਮੇਲ।</em>', campaignCopy: 'ਗੰਭੀਰ ਵਾਢੀ ਲਈ ਮਸ਼ੀਨ ਦੇ ਨਾਲ ਸਹੀ ਸਮਾਂ, ਰੂਟ ਯੋਜਨਾ ਅਤੇ ਜ਼ਿੰਮੇਵਾਰ ਬੁਕਿੰਗ ਡੈਸਕ ਚਾਹੀਦਾ ਹੈ।', statMachines: 'ਬਰੋਸ਼ਰ ਵਿੱਚ ਦਰਜ ਮਸ਼ੀਨਾਂ', statMachinesCopy: 'ਵੱਧ ਸਮਰੱਥਾ ਜਾਂ ਕੰਪੈਕਟ ਫੀਲਡ ਚੁਸਤੀ ਚੁਣੋ।', statCrops: 'ਮੁੱਖ ਫਸਲਾਂ', statCropsCopy: 'ਕਣਕ, ਝੋਨਾ, ਸੂਰਜਮੁਖੀ, ਸੋਇਆਬੀਨ, ਛੋਲੇ ਅਤੇ ਦਾਲਾਂ।', statCutter: 'ਸਭ ਤੋਂ ਵੱਡੀ ਬਰੋਸ਼ਰ ਕਟਰ ਬਾਰ', statTank: 'ਵੱਧ ਤੋਂ ਵੱਧ ਕਣਕ ਗ੍ਰੇਨ ਟੈਂਕ',
    flowTitle: 'ਇੱਕ ਲਗਾਤਾਰ ਚਾਲ।<br /><em>ਚਾਰ ਪੱਕੇ ਕੰਮ।</em>', flowCopy: 'ਹੈਡਰ ਫਸਲ ਕੱਟਦਾ ਹੈ, ਸਮੱਗਰੀ ਥ੍ਰੈਸ਼ਿੰਗ ਅਤੇ ਸਫਾਈ ਵਿੱਚੋਂ ਲੰਘਦੀ ਹੈ ਅਤੇ ਸਾਫ਼ ਅਨਾਜ ਟੈਂਕ ਵਿੱਚ ਪਹੁੰਚਦਾ ਹੈ।', flowCut: 'ਕਟਾਈ', flowCutCopy: 'ਕਟਰ ਬਾਰ ਖੜ੍ਹੀ ਫਸਲ ਨੂੰ ਕੱਟਦੀ ਹੈ।', flowThresh: 'ਥ੍ਰੈਸ਼ਿੰਗ', flowThreshCopy: 'ਡਰੰਮ ਦਾਣਾ ਫਸਲ ਤੋਂ ਵੱਖ ਕਰਦਾ ਹੈ।', flowClean: 'ਸਫਾਈ', flowCleanCopy: 'ਛਾਣਣੀਆਂ ਅਤੇ ਹਵਾ ਦਾਣਾ ਸਾਫ਼ ਕਰਦੀਆਂ ਹਨ।', flowCollect: 'ਇਕੱਠਾ', flowCollectCopy: 'ਸਾਫ਼ ਅਨਾਜ ਮਸ਼ੀਨ ਦੇ ਟੈਂਕ ਵਿੱਚ ਜਾਂਦਾ ਹੈ।',
    fleetTitle: 'ਆਪਣੀ <em>ਤਾਕਤ ਚੁਣੋ।</em>', fleetCopy: 'ਹੇਠਾਂ ਦਿੱਤੀਆਂ ਸਾਰੀਆਂ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਤੁਹਾਡੇ ਭੇਜੇ ਨਿਊ ਹੀਰਾ ਬਰੋਸ਼ਰ ਤੋਂ ਹਨ। ਖੇਤ, ਰਸਤੇ ਅਤੇ ਫਸਲ ਮੁਤਾਬਕ 985 ਜਾਂ 785 ਚੁਣੋ।', highCapacity: 'ਵੱਧ ਸਮਰੱਥਾ ਵਾਲੀ ਮਸ਼ੀਨ', agileFinisher: 'ਚੁਸਤ ਫੀਲਡ ਫਿਨਿਸ਼ਰ', bookMachine: 'ਇਹ ਮਸ਼ੀਨ ਬੁੱਕ ਕਰੋ', viewBrochure: 'ਬਰੋਸ਼ਰ ਸਬੂਤ ਵੇਖੋ',
    stageTitle: 'ਹਰ ਕੋਣ।<br /><em>ਇੱਕ ਵੱਖਰੀ ਪਛਾਣ।</em>', stageCopy: 'ਸਟੇਜ ਨੂੰ ਸਵਾਈਪ ਜਾਂ ਡ੍ਰੈਗ ਕਰੋ। ਸਰਗਰਮ ਮਸ਼ੀਨ ਅੱਗੇ ਅਤੇ ਅਗਲੀ-ਪਿਛਲੀ ਮਸ਼ੀਨਾਂ 3D ਵਿੱਚ ਦਿਖਦੀਆਂ ਹਨ।', fieldTitle: 'ਕੰਮ ਦਾ <em>ਅਸਲੀ ਸਬੂਤ।</em>', fieldCopy: 'ਤੁਹਾਡੇ ਭੇਜੇ ਨਿਊ ਹੀਰਾ 985 ਫੋਟੋ ਬਿਨਾਂ ਕ੍ਰਾਪ ਕੀਤੇ ਦਿਖਾਏ ਗਏ ਹਨ, ਦੋਵੇਂ ਪਾਸੇ ਸਿਨੇਮੈਟਿਕ ਪ੍ਰੀਵਿਊ ਨਾਲ।',
    reservationDesk: 'ਰਿਜ਼ਰਵੇਸ਼ਨ ਡੈਸਕ / 06', bookingTitle: 'ਦਿਨ ਪੱਕਾ ਕਰੋ।<br /><em>ਵਾਢੀ ਅੱਗੇ ਵਧਾਓ।</em>', bookingCopy: 'ਖੇਤ ਦੀ ਜਾਣਕਾਰੀ ਇੱਕ ਵਾਰ ਭੇਜੋ। ਬੇਨਤੀ ਨੂੰ ਰੈਫਰੈਂਸ ਨੰਬਰ ਮਿਲੇਗਾ ਅਤੇ ਇਹ ਨਿੱਜੀ ਆਪਰੇਸ਼ਨ ਪੈਨਲ ਵਿੱਚ ਰਹੇਗੀ।', shareField: 'ਖੇਤ ਦੀ ਜਾਣਕਾਰੀ', shareFieldCopy: 'ਪਿੰਡ, ਫਸਲ ਅਤੇ ਏਕੜ', confirmFit: 'ਸਹੀ ਮਸ਼ੀਨ', confirmFitCopy: 'ਮਸ਼ੀਨ, ਰਸਤਾ ਅਤੇ ਸਮਾਂ', lockWindow: 'ਸਮਾਂ ਰਿਜ਼ਰਵ ਕਰੋ', lockWindowCopy: 'WhatsApp ਉੱਤੇ ਸਿੱਧਾ ਸੰਪਰਕ', preferCall: 'ਫੋਨ ਕਰਨਾ ਚਾਹੋਗੇ?',
    contactLocation: 'ਸੰਪਰਕ ਅਤੇ ਥਾਂ', coordinateWith: 'ਅਸੀਂ ਕਿਸ ਨਾਲ ਤਾਲਮੇਲ ਕਰੀਏ?', farmerName: 'ਕਿਸਾਨ / ਪਰਿਵਾਰ ਦਾ ਨਾਮ *', whatsappNumber: 'WhatsApp ਨੰਬਰ *', fullName: 'ਪੂਰਾ ਨਾਮ', mobilePlaceholder: '10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ', village: 'ਪਿੰਡ *', villagePlaceholder: 'ਪਿੰਡ ਦਾ ਨਾਮ', districtTown: 'ਜ਼ਿਲ੍ਹਾ / ਨੇੜਲਾ ਸ਼ਹਿਰ *', requiredFields: '* ਵਾਲੇ ਖੇਤਰ ਲਾਜ਼ਮੀ ਹਨ', cropDetails: 'ਫਸਲ ਵੇਰਵਾ', fieldTiming: 'ਖੇਤ ਅਤੇ ਸਮਾਂ', readyCut: 'ਦੱਸੋ ਕਿਹੜੀ ਫਸਲ ਤਿਆਰ ਹੈ।', cropRequired: 'ਫਸਲ *', acreage: 'ਅੰਦਾਜ਼ਨ ਏਕੜ *', preferredDate: 'ਪਸੰਦੀਦਾ ਤਾਰੀਖ *', dateFlexibility: 'ਤਾਰੀਖ ਵਿੱਚ ਲਚਕ', fieldAccess: 'ਖੇਤ ਦਾ ਰਸਤਾ', back: 'ਪਿੱਛੇ', machineFit: 'ਮਸ਼ੀਨ ਚੁਣੋ', machineConfirmation: 'ਮਸ਼ੀਨ ਅਤੇ ਪੁਸ਼ਟੀ', chooseMachine: 'ਆਪਣੀ ਪਸੰਦ ਦੀ ਮਸ਼ੀਨ ਚੁਣੋ।', helpChoose: 'ਚੋਣ ਵਿੱਚ ਮਦਦ ਕਰੋ', matchField: 'ਅਸੀਂ ਖੇਤ ਮੁਤਾਬਕ ਮਸ਼ੀਨ ਚੁਣਾਂਗੇ', operatorKnow: 'ਆਪਰੇਟਰ ਨੂੰ ਹੋਰ ਕੀ ਪਤਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ?', bookingConsent: 'ਮੈਂ ਇਸ ਬੁਕਿੰਗ ਲਈ ਫੋਨ ਜਾਂ WhatsApp ਰਾਹੀਂ ਸੰਪਰਕ ਲਈ ਸਹਿਮਤ ਹਾਂ।', sendReservation: 'ਬੇਨਤੀ ਭੇਜੋ',
    processTitle: 'ਹਰ ਪੜਾਅ ਵਿੱਚ <em>ਸਪਸ਼ਟਤਾ।</em>', requestLogged: 'ਬੇਨਤੀ ਦਰਜ', requestLoggedCopy: 'ਸੰਪਰਕ, ਖੇਤ ਅਤੇ ਫਸਲ ਨੂੰ ਇਕ ਵੱਖਰਾ ਰੈਫਰੈਂਸ ਮਿਲਦਾ ਹੈ।', routeConfirmed: 'ਰੂਟ ਦੀ ਪੁਸ਼ਟੀ', routeConfirmedCopy: 'ਡੈਸਕ ਮਸ਼ੀਨ, ਸਮਾਂ ਅਤੇ ਨੇੜਲੇ ਖੇਤਾਂ ਦਾ ਰੂਟ ਜਾਂਚਦਾ ਹੈ।', windowReserved: 'ਸਮਾਂ ਰਿਜ਼ਰਵ', windowReservedCopy: 'ਤੁਹਾਨੂੰ ਸਿੱਧੀ ਪੁਸ਼ਟੀ ਅਤੇ ਆਪਰੇਟਰ ਨੂੰ ਪੂਰਾ ਫੀਲਡ ਵੇਰਵਾ ਮਿਲਦਾ ਹੈ।', footerCopy: 'ਨਾਭਾ, ਪਟਿਆਲਾ ਅਤੇ ਆਲੇ-ਦੁਆਲੇ ਦੇ ਖੇਤਾਂ ਲਈ ਵਰਤੋਂਯੋਗ ਵਾਢੀ ਤਾਲਮੇਲ।',
    leadVisualTitle: 'ਫਸਲ ਤਿਆਰ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ<br /><em>ਪਹਿਲਾ ਕਦਮ ਚੁੱਕੋ।</em>', quickRegistration: 'ਤੁਰੰਤ ਰਜਿਸਟ੍ਰੇਸ਼ਨ', leadTitle: 'ਦੱਸੋ ਮੌਸਮ<br /><em>ਕਿੱਧਰ ਵਧ ਰਿਹਾ ਹੈ।</em>', leadCopy: 'ਕਾਲ ਬੈਕ ਲਈ ਨੰਬਰ ਦਿਓ ਜਾਂ ਸਿੱਧੇ ਵੈੱਬਸਾਈਟ ਉੱਤੇ ਜਾਓ। ਸਿਰਫ਼ ਤੁਹਾਡੇ ਦਿੱਤੇ ਵੇਰਵੇ ਨਿੱਜੀ ਬੁਕਿੰਗ ਡੈਸਕ ਨੂੰ ਦਿਸਣਗੇ।', yourName: 'ਤੁਹਾਡਾ ਨਾਮ *', fieldLocationPlaceholder: 'ਖੇਤ ਕਿੱਥੇ ਹੈ?', interestedIn: 'ਦਿਲਚਸਪੀ', leadConsent: 'ਮੈਂ ਵਾਢੀ ਬੁਕਿੰਗ ਲਈ ਫੋਨ ਜਾਂ WhatsApp ਸੁਨੇਹੇ ਲਈ ਸਹਿਮਤ ਹਾਂ।', registerInterest: 'ਦਿਲਚਸਪੀ ਦਰਜ ਕਰੋ', continueWithout: 'ਬਿਨਾਂ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਜਾਰੀ ਰੱਖੋ'
  }
};

const CROP_LABELS = {
  en: { wheat: 'WHEAT', paddy: 'PADDY', sunflower: 'SUNFLOWER', soyabean: 'SOYABEAN', gram: 'GRAM', pulses: 'PULSES', Other: 'Other' },
  hi: { wheat: 'गेहूँ', paddy: 'धान', sunflower: 'सूरजमुखी', soyabean: 'सोयाबीन', gram: 'चना', pulses: 'दालें', Other: 'अन्य' },
  pa: { wheat: 'ਕਣਕ', paddy: 'ਝੋਨਾ', sunflower: 'ਸੂਰਜਮੁਖੀ', soyabean: 'ਸੋਇਆਬੀਨ', gram: 'ਛੋਲੇ', pulses: 'ਦਾਲਾਂ', Other: 'ਹੋਰ' }
};

const MODEL_TRANSLATIONS = {
  hi: {
    '985': { eyebrow: 'उच्च क्षमता वाला वर्कहॉर्स', description: 'कम समय में अधिक उपज—चौड़ी कटर बार, पाँच स्ट्रॉ वॉकर और 1,800 किग्रा गेहूँ ग्रेन टैंक के साथ।', specs: ['प्रभावी कटर', 'थ्रेशिंग ड्रम', 'वर्किंग चौड़ाई', 'फ्यूल टैंक', 'ग्राउंड क्लियरेंस', 'व्हील बेस'] },
    '785': { eyebrow: 'चुस्त फील्ड फिनिशर', description: 'सुगम खेत पहुँच, कम टर्निंग रेडियस और बदलती परिस्थितियों में भरोसेमंद काम के लिए कॉम्पैक्ट मल्टीक्रॉप कंबाइन।', specs: ['प्रभावी कटर', 'थ्रेशिंग ड्रम', 'वर्किंग चौड़ाई', 'फ्यूल टैंक', 'ग्राउंड क्लियरेंस', 'व्हील बेस'] }
  },
  pa: {
    '985': { eyebrow: 'ਵੱਧ ਸਮਰੱਥਾ ਵਾਲਾ ਵਰਕਹੌਰਸ', description: 'ਘੱਟ ਸਮੇਂ ਵਿੱਚ ਵੱਧ ਪੈਦਾਵਾਰ—ਚੌੜੀ ਕਟਰ ਬਾਰ, ਪੰਜ ਸਟਰਾਅ ਵਾਕਰ ਅਤੇ 1,800 ਕਿਲੋ ਕਣਕ ਗ੍ਰੇਨ ਟੈਂਕ ਨਾਲ।', specs: ['ਪ੍ਰਭਾਵੀ ਕਟਰ', 'ਥ੍ਰੈਸ਼ਿੰਗ ਡਰੰਮ', 'ਵਰਕਿੰਗ ਚੌੜਾਈ', 'ਫਿਊਲ ਟੈਂਕ', 'ਗ੍ਰਾਊਂਡ ਕਲੀਅਰੈਂਸ', 'ਵ੍ਹੀਲ ਬੇਸ'] },
    '785': { eyebrow: 'ਚੁਸਤ ਫੀਲਡ ਫਿਨਿਸ਼ਰ', description: 'ਸੌਖੀ ਖੇਤ ਪਹੁੰਚ, ਛੋਟੇ ਟਰਨਿੰਗ ਰੇਡੀਅਸ ਅਤੇ ਬਦਲਦੇ ਹਾਲਾਤਾਂ ਵਿੱਚ ਭਰੋਸੇਯੋਗ ਕੰਮ ਲਈ ਕੰਪੈਕਟ ਮਲਟੀਕ੍ਰਾਪ ਕੰਬਾਈਨ।', specs: ['ਪ੍ਰਭਾਵੀ ਕਟਰ', 'ਥ੍ਰੈਸ਼ਿੰਗ ਡਰੰਮ', 'ਵਰਕਿੰਗ ਚੌੜਾਈ', 'ਫਿਊਲ ਟੈਂਕ', 'ਗ੍ਰਾਊਂਡ ਕਲੀਅਰੈਂਸ', 'ਵ੍ਹੀਲ ਬੇਸ'] }
  }
};

const MODELS = {
  '985': {
    name: '985',
    image: 'assets/cutout-985-three-quarter.png',
    eyebrow: 'THE HIGH-CAPACITY WORKHORSE',
    description: 'Maximum yield in the shortest time, with a larger cutter bar, five straw walkers and an 1,800 kg wheat grain tank.',
    width: '4.4',
    tank: '1,800',
    walkers: '5',
    brochure: 'assets/brochure-985-specs.jpg',
    specs: [
      ['Effective cutter', '4.28 m'],
      ['Threshing drum', '1,258 mm'],
      ['Working width', '5,900 mm'],
      ['Fuel tank', '350 litre'],
      ['Ground clearance', '250 mm'],
      ['Wheel base', '3,600 mm']
    ]
  },
  '785': {
    name: '785',
    image: 'assets/cutout-785-brochure-model.png',
    eyebrow: 'THE AGILE FIELD FINISHER',
    description: 'A compact multicrop combine for smooth field access, small turning radius and dependable work across changing field conditions.',
    width: '3.7',
    tank: '1,600',
    walkers: '4',
    brochure: 'assets/brochure-785-specs.jpg',
    specs: [
      ['Effective cutter', '3.6 m'],
      ['Threshing drum', '1,015 mm'],
      ['Working width', '5,290 mm'],
      ['Fuel tank', '350 litre'],
      ['Ground clearance', '250 mm'],
      ['Wheel base', '3,600 mm']
    ]
  }
};

const OPTION_LABELS = {
  hi: {
    Wheat: 'गेहूँ', Paddy: 'धान', Sunflower: 'सूरजमुखी', Soyabean: 'सोयाबीन', Gram: 'चना', Pulses: 'दालें', Other: 'अन्य',
    'Exact date preferred': 'सटीक तारीख पसंद है', '1-2 days flexible': '1-2 दिन लचीला', '3-5 days flexible': '3-5 दिन लचीला', 'Call to discuss': 'फ़ोन पर बात करें',
    'Normal tractor access': 'सामान्य ट्रैक्टर रास्ता', 'Narrow village road': 'संकरी गाँव की सड़क', 'Soft / wet approach': 'नरम / गीला रास्ता', 'Unsure - please call': 'पता नहीं - कृपया फ़ोन करें',
    'Harvest booking': 'कटाई बुकिंग', 'Call me back': 'मुझे फ़ोन करें'
  },
  pa: {
    Wheat: 'ਕਣਕ', Paddy: 'ਝੋਨਾ', Sunflower: 'ਸੂਰਜਮੁਖੀ', Soyabean: 'ਸੋਇਆਬੀਨ', Gram: 'ਛੋਲੇ', Pulses: 'ਦਾਲਾਂ', Other: 'ਹੋਰ',
    'Exact date preferred': 'ਪੱਕੀ ਤਾਰੀਖ ਚਾਹੀਦੀ ਹੈ', '1-2 days flexible': '1-2 ਦਿਨ ਲਚਕ', '3-5 days flexible': '3-5 ਦਿਨ ਲਚਕ', 'Call to discuss': 'ਫੋਨ ਉੱਤੇ ਗੱਲ ਕਰੋ',
    'Normal tractor access': 'ਆਮ ਟਰੈਕਟਰ ਰਸਤਾ', 'Narrow village road': 'ਤੰਗ ਪਿੰਡ ਦੀ ਸੜਕ', 'Soft / wet approach': 'ਨਰਮ / ਗਿੱਲਾ ਰਸਤਾ', 'Unsure - please call': 'ਪਤਾ ਨਹੀਂ - ਕਿਰਪਾ ਕਰਕੇ ਫੋਨ ਕਰੋ',
    'Harvest booking': 'ਵਾਢੀ ਬੁਕਿੰਗ', 'Call me back': 'ਮੈਨੂੰ ਫੋਨ ਕਰੋ'
  }
};

function localizedModel(model) {
  const base = MODELS[model];
  const local = MODEL_TRANSLATIONS[currentLanguage]?.[model];
  if (!local) return base;
  return {
    ...base,
    eyebrow: local.eyebrow,
    description: local.description,
    specs: base.specs.map((spec, index) => [local.specs[index] || spec[0], spec[1]])
  };
}

function applyLanguage(language, track = false) {
  const next = ['en', 'hi', 'pa'].includes(language) ? language : 'en';
  currentLanguage = next;
  localStorage.setItem(LANGUAGE_KEY, next);
  document.documentElement.lang = next;
  const dictionary = TRANSLATIONS[next] || TRANSLATIONS.en;
  $$('select option').forEach((option) => {
    if (!option.dataset.originalLabel) option.dataset.originalLabel = option.textContent.trim();
  });
  $$('[data-i18n]').forEach((element) => {
    const value = dictionary[element.dataset.i18n];
    if (value != null) element.innerHTML = value;
  });
  $$('[data-i18n-placeholder]').forEach((element) => {
    const value = dictionary[element.dataset.i18nPlaceholder];
    if (value != null) element.placeholder = value.replace(/<[^>]+>/g, '');
  });
  $$('[data-crop]').forEach((element) => {
    const label = CROP_LABELS[next]?.[element.dataset.crop];
    if (label) element.textContent = label;
  });
  $$('select option').forEach((option) => {
    const original = option.dataset.originalLabel;
    if (next === 'en') option.textContent = original;
    else if (OPTION_LABELS[next]?.[option.value]) option.textContent = OPTION_LABELS[next][option.value];
    else if (OPTION_LABELS[next]?.[original]) option.textContent = OPTION_LABELS[next][original];
  });
  const languageCode = $('#languageToggle span');
  if (languageCode) languageCode.textContent = next === 'en' ? 'EN' : next === 'hi' ? 'हि' : 'ਪੰ';
  const activeModel = $('#fleetStage')?.dataset.model || '985';
  if ($('#fleetStage')) updateFleet(activeModel, false);
  showBookingStep(bookingStep, false);
  if (track) trackEvent('language_changed', { language: next });
}

const adminState = {
  token: sessionStorage.getItem(ADMIN_TOKEN_KEY) || '',
  bookings: [],
  leads: [],
  media: [],
  page: 1,
  totalPages: 1,
  activeView: 'overview'
};

function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function cleanPhone(value) {
  return String(value || '').replace(/\D/g, '').slice(-10);
}

function dateLabel(value) {
  if (!value) return 'Date not set';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function timeLabel(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(date);
}

function showToast(message, duration = 3600) {
  const toast = $('#toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), duration);
}

function setModalState(open) {
  document.body.classList.toggle('modal-open', Boolean(open));
}

function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = 'SESSION-' + Date.now().toString(36).toUpperCase() + '-' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

async function api(path, options = {}, admin = false) {
  const requestOptions = { ...options };
  requestOptions.headers = { ...(options.headers || {}) };
  if (admin && adminState.token) requestOptions.headers.Authorization = 'Bearer ' + adminState.token;
  if (options.body && !(options.body instanceof FormData) && typeof options.body !== 'string') {
    requestOptions.headers['Content-Type'] = 'application/json';
    requestOptions.body = JSON.stringify(options.body);
  }
  const response = await fetch(API_ROOT + path, requestOptions);
  const payload = await response.json().catch(() => ({ ok: false, error: 'The service returned an unreadable response.' }));
  if (!response.ok || payload.ok === false) {
    const error = new Error(payload.error || 'Request failed.');
    error.status = response.status;
    throw error;
  }
  return payload;
}

function deviceType() {
  const width = window.innerWidth;
  if (width < 680) return 'mobile';
  if (width < 1100) return 'tablet';
  return 'desktop';
}

function trackEvent(name, metadata = {}) {
  const payload = {
    eventName: name,
    sessionId: getSessionId(),
    path: location.pathname,
    referrer: document.referrer || '',
    device: deviceType(),
    metadata
  };
  fetch(API_ROOT + '/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true
  }).catch(() => {});
}

function setupLoader() {
  const count = $('#loaderCount');
  let value = 0;
  const timer = window.setInterval(() => {
    value = Math.min(99, value + Math.ceil((100 - value) / 9));
    if (count) count.textContent = String(value).padStart(2, '0');
  }, 90);
  const finish = () => {
    window.clearInterval(timer);
    if (count) count.textContent = '100';
    window.setTimeout(() => {
      $('#siteLoader')?.classList.add('is-hidden');
      document.body.classList.add('is-ready');
      document.dispatchEvent(new Event('newhira:ready'));
    }, 220);
  };
  if (document.readyState === 'complete') window.setTimeout(finish, 950);
  else window.addEventListener('load', () => window.setTimeout(finish, 950), { once: true });
  window.setTimeout(finish, 2400);
}

function setupOnboarding() {
  const loader = $('#siteLoader');
  const count = $('#loaderCount');
  const languageGate = $('#languageGate');
  const leadModal = $('#leadModal');
  const intro = $('#brandIntro');
  let value = 0;
  let finishedLoading = false;
  let introTimer = 0;
  let introStarted = false;
  let onboardingComplete = false;

  applyLanguage(currentLanguage, false);

  const countTimer = window.setInterval(() => {
    value = Math.min(98, value + Math.max(1, Math.ceil((100 - value) / 8)));
    if (count) count.textContent = String(value).padStart(2, '0');
  }, 75);

  const completeExperience = () => {
    if (onboardingComplete) return;
    onboardingComplete = true;
    window.clearTimeout(introTimer);
    intro?.classList.add('is-leaving');
    window.setTimeout(() => {
      if (intro) intro.hidden = true;
      document.body.classList.remove('onboarding-active', 'modal-open');
      document.body.classList.add('is-ready');
      sessionStorage.setItem(ONBOARDING_KEY, String(Date.now()));
      document.dispatchEvent(new Event('newhira:ready'));
      trackEvent('intro_completed', { language: currentLanguage });
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 520 : 950);
  };

  const startIntro = () => {
    if (introStarted) return;
    introStarted = true;
    if (leadModal) leadModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (!intro) return completeExperience();
    intro.hidden = false;
    requestAnimationFrame(() => intro.classList.add('is-playing'));
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 3600 : 5200;
    introTimer = window.setTimeout(completeExperience, duration);
    trackEvent('intro_started', { language: currentLanguage });
  };

  const closeLead = (reason) => {
    localStorage.setItem(LEAD_GATE_KEY, String(Date.now()));
    if (reason) trackEvent(reason, { language: currentLanguage });
    startIntro();
  };

  const openLead = () => {
    if (!leadModal) return startIntro();
    leadModal.hidden = false;
    document.body.classList.add('modal-open');
    trackEvent('lead_gate_shown', { language: currentLanguage, onboarding: true });
    window.setTimeout(() => $('#leadForm input[name="name"]')?.focus({ preventScroll: true }), 320);
  };

  const leaveLanguageGate = () => {
    if (!languageGate) return openLead();
    languageGate.classList.add('is-leaving');
    window.setTimeout(() => {
      languageGate.hidden = true;
      languageGate.classList.remove('is-leaving');
      openLead();
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 320 : 720);
  };

  $$('[data-select-language]', languageGate || document).forEach((button) => {
    button.addEventListener('click', () => {
      applyLanguage(button.dataset.selectLanguage, true);
      leaveLanguageGate();
    });
  });

  $('#leadClose')?.addEventListener('click', () => closeLead('lead_gate_closed'));
  $('#leadSkip')?.addEventListener('click', () => closeLead('lead_gate_skipped'));
  leadModal?.addEventListener('click', (event) => {
    if (event.target === leadModal) closeLead('lead_gate_closed');
  });

  $('#leadForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    values.phone = cleanPhone(values.phone);
    values.source = 'welcome_registration_' + currentLanguage;
    if (values.phone.length !== 10) {
      form.elements.phone.setCustomValidity(currentLanguage === 'hi' ? 'सही 10 अंकों का मोबाइल नंबर दर्ज करें।' : currentLanguage === 'pa' ? 'ਸਹੀ 10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਰਜ ਕਰੋ।' : 'Enter a valid 10-digit mobile number.');
      form.elements.phone.reportValidity();
      form.elements.phone.addEventListener('input', () => form.elements.phone.setCustomValidity(''), { once: true });
      return;
    }
    const button = $('button[type="submit"]', form);
    button.disabled = true;
    const original = button.innerHTML;
    button.textContent = currentLanguage === 'hi' ? 'पंजीकरण हो रहा है...' : currentLanguage === 'pa' ? 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਹੋ ਰਹੀ ਹੈ...' : 'Registering...';
    try {
      await api('/leads', { method: 'POST', body: values });
      showToast(currentLanguage === 'hi' ? 'पंजीकरण सेव हो गया।' : currentLanguage === 'pa' ? 'ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸੇਵ ਹੋ ਗਈ।' : 'Registration saved. The booking desk can now contact you.');
    } catch (error) {
      showToast(currentLanguage === 'hi' ? 'ऑनलाइन सेवा अभी जुड़ी नहीं है; आप बुकिंग या WhatsApp जारी रख सकते हैं।' : currentLanguage === 'pa' ? 'ਆਨਲਾਈਨ ਸੇਵਾ ਹਾਲੇ ਨਹੀਂ ਜੁੜੀ; ਤੁਸੀਂ ਬੁਕਿੰਗ ਜਾਂ WhatsApp ਜਾਰੀ ਰੱਖ ਸਕਦੇ ਹੋ।' : 'Registration service is not connected yet. You can continue to booking or WhatsApp.');
    }
    trackEvent('lead_submitted', { interest: values.interest, language: currentLanguage });
    button.disabled = false;
    button.innerHTML = original;
    closeLead();
  });

  $('#introEnter')?.addEventListener('click', completeExperience);
  $('#introSkip')?.addEventListener('click', completeExperience);

  const finishLoader = () => {
    if (finishedLoading) return;
    finishedLoading = true;
    window.clearInterval(countTimer);
    if (count) count.textContent = '100';
    window.setTimeout(() => {
      loader?.classList.add('is-hidden');
      if (languageGate) {
        languageGate.hidden = false;
        languageGate.classList.add('is-entering');
        window.setTimeout(() => languageGate.classList.remove('is-entering'), 900);
      } else {
        openLead();
      }
    }, 210);
  };

  if (document.readyState === 'complete') window.setTimeout(finishLoader, 700);
  else window.addEventListener('load', () => window.setTimeout(finishLoader, 700), { once: true });
  window.setTimeout(finishLoader, 2100);
}

function setupLanguageMenu() {
  const toggle = $('#languageToggle');
  const panel = $('#languagePanel');
  const close = () => {
    if (!panel || !toggle) return;
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  };
  toggle?.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });
  $$('.nav-language [data-select-language], .nav-mobile-languages [data-select-language]').forEach((button) => button.addEventListener('click', () => {
    applyLanguage(button.dataset.selectLanguage, true);
    close();
  }));
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-language')) close();
  });
}

function setupHeroCinema() {
  const slides = $$('#heroField figure');
  if (slides.length < 2) return;
  let active = 0;
  const index = $('#heroSlideIndex');
  const go = (next) => {
    active = (next + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle('is-active', slideIndex === active));
    if (index) index.textContent = String(active + 1).padStart(2, '0');
  };
  const timer = window.setInterval(() => go(active + 1), 6500);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) window.clearInterval(timer);
  }, { once: true });
}

function setupCounters() {
  const counters = $$('[data-counter]');
  const animate = (element) => {
    if (element.dataset.counted === '1') return;
    element.dataset.counted = '1';
    const target = Number(element.dataset.counter || 0);
    const decimal = Number(element.dataset.decimal || 0);
    const pad = Number(element.dataset.pad || 0);
    const suffix = $('small', element)?.outerHTML || '';
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 950 : 1450;
    const started = performance.now();
    const frame = (now) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - progress, 4);
      const raw = Math.round(target * eased);
      let label;
      if (decimal) label = (raw / Math.pow(10, decimal)).toFixed(decimal);
      else label = Math.round(raw).toLocaleString('en-IN');
      if (pad && !decimal) label = label.padStart(pad, '0');
      element.innerHTML = label + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };
  if (!('IntersectionObserver' in window)) return counters.forEach(animate);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animate(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: .35 });
  counters.forEach((counter) => observer.observe(counter));
}

function setupNavigation() {
  const toggle = $('#menuToggle');
  const nav = $('#siteNav');
  const scrim = $('#navScrim');
  const close = () => {
    toggle?.classList.remove('is-open');
    nav?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    if (scrim) scrim.hidden = true;
    document.body.classList.remove('nav-open');
  };
  toggle?.addEventListener('click', () => {
    const open = !nav.classList.contains('is-open');
    toggle.classList.toggle('is-open', open);
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (scrim) scrim.hidden = !open;
    document.body.classList.toggle('nav-open', open);
  });
  scrim?.addEventListener('click', close);
  $$('#siteNav a, #siteNav button').forEach((item) => item.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

function setupScrollEffects() {
  const root = document.documentElement;
  let frame = 0;
  const update = () => {
    const max = Math.max(1, root.scrollHeight - window.innerHeight);
    root.style.setProperty('--scroll-progress', Math.min(100, (window.scrollY / max) * 100) + '%');
    document.body.classList.toggle('is-scrolled', window.scrollY > 30);
    const field = $('.hero-field');
    if (field && window.innerWidth > 680) field.style.setProperty('--hero-shift', Math.min(70, window.scrollY * .12) + 'px');
    frame = 0;
  };
  const requestUpdate = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate, { passive: true });
  update();
}

function setupReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: .08, rootMargin: '4% 0px -7% 0px' });
  items.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', Math.min(index % 4, 3) * 80 + 'ms');
    observer.observe(item);
  });
  window.setTimeout(() => {
    items.filter((item) => item.getBoundingClientRect().top < window.innerHeight).forEach((item) => item.classList.add('is-visible'));
  }, 1600);
}

function setupSectionAnalytics() {
  if (!('IntersectionObserver' in window)) return;
  const seen = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || seen.has(entry.target.id)) return;
      seen.add(entry.target.id);
      trackEvent('section_view', { section: entry.target.id });
    });
  }, { threshold: .42 });
  $$('main section[id]').forEach((section) => observer.observe(section));
}

function updateHero(model) {
  const data = localizedModel(model);
  const product = $('#heroProduct');
  if (!data || !product) return;
  product.classList.add('is-changing');
  window.setTimeout(() => {
    $('#heroMachine').src = data.image;
    $('#heroMachine').alt = 'New Hira ' + data.name + ' combine harvester';
    $('.hero-model-code').textContent = data.name;
    $('#heroWidth').textContent = data.width + ' M';
    $('#heroTank').textContent = data.tank + ' KG';
    $$('[data-hero-model]').forEach((button) => {
      const active = button.dataset.heroModel === model;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    product.classList.remove('is-changing');
  }, 260);
  trackEvent('hero_model_change', { model });
}

function setupHero() {
  $$('[data-hero-model]').forEach((button) => button.addEventListener('click', () => updateHero(button.dataset.heroModel)));
  const product = $('#heroProduct');
  if (!product) return;
  product.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = product.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    product.style.setProperty('--hero-x', x * 10 + 'px');
    product.style.setProperty('--hero-y', y * 8 + 'px');
    product.style.setProperty('--hero-ry', x * 5 - 3 + 'deg');
  });
  product.addEventListener('pointerleave', () => {
    product.style.setProperty('--hero-x', '0px');
    product.style.setProperty('--hero-y', '0px');
    product.style.setProperty('--hero-ry', '-3deg');
  });
}

function updateFleet(model, track = true) {
  const data = localizedModel(model);
  const stage = $('#fleetStage');
  if (!data || !stage) return;
  stage.classList.add('is-changing');
  window.setTimeout(() => {
    $('#fleetImage').src = data.image;
    $('#fleetImage').alt = 'New Hira ' + data.name + ' combine harvester cutout';
    $('#fleetGiant').textContent = data.name;
    $('#fleetEyebrow').textContent = data.eyebrow;
    $('#fleetName').textContent = data.name;
    $('#fleetDescription').textContent = data.description;
    $('#fleetWidth').innerHTML = escapeHtml(data.width) + '<small>m</small>';
    $('#fleetTank').innerHTML = escapeHtml(data.tank) + '<small>kg</small>';
    $('#fleetWalkers').textContent = data.walkers;
    $('#fleetSpecList').innerHTML = data.specs.map((spec) => '<div><span>' + escapeHtml(spec[0]) + '</span><b>' + escapeHtml(spec[1]) + '</b></div>').join('');
    $('#fleetBook').dataset.machine = 'New Hira ' + data.name;
    $$('[data-model]').forEach((button) => {
      const active = button.dataset.model === model;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-selected', String(active));
    });
    stage.dataset.model = model;
    stage.classList.remove('is-changing');
  }, 290);
  if (track) trackEvent('fleet_model_change', { model });
}

function setupFleet() {
  updateFleet('985', false);
  $$('[data-model]').forEach((button) => button.addEventListener('click', () => updateFleet(button.dataset.model)));
  $('#fleetBook')?.addEventListener('click', (event) => {
    const value = event.currentTarget.dataset.machine || 'New Hira 985';
    const radio = $('#bookingForm input[name="machine"][value="' + value + '"]');
    if (radio) radio.checked = true;
  });
  $('#viewBrochure')?.addEventListener('click', () => {
    const model = $('#fleetStage')?.dataset.model || '985';
    openBrochure(model);
  });
}

function openBrochure(model) {
  const data = MODELS[model] || MODELS['985'];
  $('#brochureImage').src = data.brochure;
  $('#brochureImage').alt = 'New Hira ' + data.name + ' technical brochure';
  $$('[data-brochure-model]').forEach((button) => button.classList.toggle('is-active', button.dataset.brochureModel === model));
  $('#brochureModal').hidden = false;
  setModalState(true);
}

function setupBrochure() {
  $$('[data-brochure-model]').forEach((button) => button.addEventListener('click', () => openBrochure(button.dataset.brochureModel)));
  const close = () => {
    $('#brochureModal').hidden = true;
    setModalState(false);
  };
  $('#brochureClose')?.addEventListener('click', close);
  $('#brochureModal')?.addEventListener('click', (event) => {
    if (event.target === $('#brochureModal')) close();
  });
}

function createPerspectiveCarousel(options) {
  const root = $(options.root);
  if (!root) return null;
  let items = $$(options.item, root);
  let active = 0;
  let timer = 0;
  let startX = 0;
  let deltaX = 0;
  let dragging = false;
  const getItems = () => {
    items = $$(options.item, root);
    return items;
  };
  const classes = ['is-active', 'is-prev', 'is-next', 'is-far-prev', 'is-far-next', 'is-hidden'];
  const update = (next, user = false) => {
    getItems();
    const length = items.length;
    if (!length) return;
    active = (next + length) % length;
    items.forEach((item, index) => {
      classes.forEach((className) => item.classList.remove(className));
      const offset = (index - active + length) % length;
      if (offset === 0) item.classList.add('is-active');
      else if (offset === 1) item.classList.add('is-next');
      else if (offset === length - 1) item.classList.add('is-prev');
      else if (offset === 2) item.classList.add('is-far-next');
      else if (offset === length - 2) item.classList.add('is-far-prev');
      else item.classList.add('is-hidden');
      item.setAttribute('aria-hidden', String(offset !== 0));
    });
    const counter = $(options.counter);
    if (counter) counter.textContent = String(active + 1).padStart(2, '0') + ' / ' + String(length).padStart(2, '0');
    if (options.dots) {
      const dots = $(options.dots);
      if (dots && dots.children.length !== length) {
        dots.innerHTML = items.map((item, index) => '<button type="button" data-carousel-dot="' + index + '" aria-label="Show item ' + (index + 1) + '"></button>').join('');
        $$('[data-carousel-dot]', dots).forEach((dot) => dot.addEventListener('click', () => go(Number(dot.dataset.carouselDot), true)));
      }
      $$('[data-carousel-dot]', dots).forEach((dot, index) => dot.classList.toggle('is-active', index === active));
    }
    if (options.progress) {
      const progress = $(options.progress);
      if (progress) {
        progress.style.animation = 'none';
        progress.offsetHeight;
        progress.style.animation = 'carousel-progress ' + (options.interval / 1000) + 's linear forwards';
      }
    }
    if (user) trackEvent(options.eventName || 'carousel_change', { index: active + 1 });
  };
  const stop = () => window.clearInterval(timer);
  const start = () => {
    stop();
    timer = window.setInterval(() => update(active + 1), options.interval);
  };
  const go = (index, user = false) => {
    update(index, user);
    start();
  };
  $(options.prev, root)?.addEventListener('click', () => go(active - 1, true));
  $(options.next, root)?.addEventListener('click', () => go(active + 1, true));
  root.addEventListener('click', (event) => {
    const item = event.target.closest(options.item);
    if (!item || item.classList.contains('is-active')) return;
    const index = getItems().indexOf(item);
    if (index >= 0) go(index, true);
  });
  root.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    deltaX = 0;
    root.classList.add('is-dragging');
    root.setPointerCapture?.(event.pointerId);
    stop();
  });
  root.addEventListener('pointermove', (event) => {
    if (dragging) deltaX = event.clientX - startX;
  });
  const finish = (event) => {
    if (!dragging) return;
    dragging = false;
    root.classList.remove('is-dragging');
    root.releasePointerCapture?.(event.pointerId);
    if (Math.abs(deltaX) > 45) go(active + (deltaX < 0 ? 1 : -1), true);
    else start();
  };
  root.addEventListener('pointerup', finish);
  root.addEventListener('pointercancel', finish);
  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(active - 1, true);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(active + 1, true);
    }
  });
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget)) start();
  });
  update(0);
  start();
  return { update, refresh: () => update(active), destroy: stop };
}

async function loadPublicMedia() {
  try {
    const data = await api('/media?active=1');
    const media = data.media || [];
    const hero = media.find((item) => item.slot === 'hero' && item.kind === 'image');
    const booking = media.find((item) => item.slot === 'booking' && item.kind === 'image');
    if (hero) {
      $('.hero-field').style.backgroundImage = 'linear-gradient(90deg, rgba(7,14,10,.95), rgba(7,14,10,.3)), url("' + hero.url.replaceAll('"', '') + '")';
    }
    if (booking) {
      $('#bookingBackdrop').style.backgroundImage = 'linear-gradient(90deg, rgba(6,13,9,.96), rgba(6,13,9,.55)), url("' + booking.url.replaceAll('"', '') + '")';
    }
    const gallery = media.filter((item) => item.slot === 'gallery').slice(0, 8);
    const stage = $('.field-reel-stage');
    gallery.forEach((item, offset) => {
      const figure = document.createElement('figure');
      figure.className = 'field-frame is-hidden';
      figure.dataset.fieldIndex = String($$('.field-frame', stage).length);
      const visual = item.kind === 'video' ? document.createElement('video') : document.createElement('img');
      visual.src = item.url;
      if (item.kind === 'video') {
        visual.muted = true;
        visual.loop = true;
        visual.playsInline = true;
        visual.autoplay = true;
      } else {
        visual.alt = item.alt || item.title || 'New Hira campaign image';
      }
      const caption = document.createElement('figcaption');
      caption.innerHTML = '<span>CAMPAIGN / ' + String(offset + 1).padStart(2, '0') + '</span><b>' + escapeHtml(item.title || 'Field update') + '</b>';
      figure.append(visual, caption);
      stage.appendChild(figure);
    });
  } catch (error) {
    /* Static GitHub preview: built-in imagery remains available. */
  }
}

function setupCarousels() {
  createPerspectiveCarousel({
    root: '#depthCarousel',
    item: '.depth-card',
    prev: '[data-depth-prev]',
    next: '[data-depth-next]',
    counter: '#depthCounter',
    progress: '#depthProgress',
    interval: 5600,
    eventName: 'product_carousel_change'
  });
  createPerspectiveCarousel({
    root: '#fieldReel',
    item: '.field-frame',
    prev: '[data-field-prev]',
    next: '[data-field-next]',
    counter: '#fieldCounter',
    dots: '#fieldDots',
    interval: 6200,
    eventName: 'field_carousel_change'
  });
}

let bookingStep = 0;

function showBookingStep(index, track = true) {
  const steps = $$('.booking-step');
  bookingStep = Math.max(0, Math.min(steps.length - 1, index));
  steps.forEach((step, stepIndex) => {
    const active = stepIndex === bookingStep;
    step.hidden = !active;
    step.classList.toggle('is-active', active);
  });
  $$('.booking-stepper i').forEach((item, itemIndex) => item.classList.toggle('is-active', itemIndex <= bookingStep));
  const stepWord = currentLanguage === 'hi' ? 'चरण' : currentLanguage === 'pa' ? 'ਪੜਾਅ' : 'STEP';
  const ofWord = currentLanguage === 'hi' ? 'में से' : currentLanguage === 'pa' ? 'ਵਿੱਚੋਂ' : 'OF';
  $('#bookingStepLabel').textContent = stepWord + ' ' + String(bookingStep + 1).padStart(2, '0') + ' ' + ofWord + ' 03';
  if (track) trackEvent('booking_step_view', { step: bookingStep + 1, language: currentLanguage });
}

function validateStep(step) {
  const fields = $$('input, select, textarea', step).filter((field) => !field.disabled);
  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      field.focus();
      return false;
    }
    if (field.name === 'phone' && cleanPhone(field.value).length !== 10) {
      field.setCustomValidity('Enter a valid 10-digit mobile number.');
      field.reportValidity();
      field.addEventListener('input', () => field.setCustomValidity(''), { once: true });
      return false;
    }
  }
  return true;
}

function bookingMessage(booking) {
  return [
    'NEW HIRA HARVEST BOOKING',
    '',
    'Reference: ' + booking.reference,
    'Name: ' + booking.name,
    'Phone: ' + booking.phone,
    'Village: ' + booking.village,
    'District / town: ' + booking.location,
    'Crop: ' + booking.crop,
    'Approx. acreage: ' + booking.acreage,
    'Preferred date: ' + dateLabel(booking.date),
    'Date flexibility: ' + booking.flexibility,
    'Field access: ' + booking.access,
    'Machine: ' + booking.machine,
    booking.notes ? 'Notes: ' + booking.notes : '',
    '',
    'Please confirm machine availability and the harvest window.'
  ].filter(Boolean).join('\n');
}

function savePendingBooking(booking) {
  const current = JSON.parse(localStorage.getItem(PENDING_BOOKINGS_KEY) || '[]');
  current.unshift(booking);
  localStorage.setItem(PENDING_BOOKINGS_KEY, JSON.stringify(current.slice(0, 20)));
}

async function submitBooking(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const finalStep = $('.booking-step[data-booking-step="2"]');
  if (!validateStep(finalStep)) return;
  const submit = $('#bookingSubmit');
  submit.disabled = true;
  submit.textContent = currentLanguage === 'hi' ? 'अनुरोध भेजा जा रहा है...' : currentLanguage === 'pa' ? 'ਬੇਨਤੀ ਭੇਜੀ ਜਾ ਰਹੀ ਹੈ...' : 'Sending reservation...';
  const values = Object.fromEntries(new FormData(form).entries());
  values.phone = cleanPhone(values.phone);
  values.source = 'website';
  let booking;
  let shared = true;
  try {
    const response = await api('/bookings', { method: 'POST', body: values });
    booking = response.booking;
  } catch (error) {
    shared = false;
    booking = {
      ...values,
      id: 'LOCAL-' + Date.now().toString(36).toUpperCase(),
      reference: 'NH-' + new Date().toISOString().slice(2, 10).replaceAll('-', '') + '-' + String(Date.now()).slice(-4),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    savePendingBooking(booking);
  }
  $('#bookingForm').hidden = true;
  $('#bookingSuccess').hidden = false;
  $('#bookingReference').textContent = booking.reference;
  $('#bookingSuccessCopy').textContent = shared
    ? (currentLanguage === 'hi' ? 'अनुरोध निजी बुकिंग डेस्क में सेव है। उसी बातचीत में जवाब पाने के लिए WhatsApp पर एक बार पुष्टि करें।' : currentLanguage === 'pa' ? 'ਬੇਨਤੀ ਨਿੱਜੀ ਬੁਕਿੰਗ ਡੈਸਕ ਵਿੱਚ ਸੇਵ ਹੈ। ਉਸੇ ਗੱਲਬਾਤ ਵਿੱਚ ਜਵਾਬ ਲਈ WhatsApp ਉੱਤੇ ਇੱਕ ਵਾਰ ਪੁਸ਼ਟੀ ਕਰੋ।' : 'The request is saved in the private booking desk. Confirm once on WhatsApp so the team can reply in the same conversation.')
    : (currentLanguage === 'hi' ? 'इस होस्ट पर Cloudflare बुकिंग सेवा अभी नहीं जुड़ी। अनुरोध तैयार है; डेस्क तक पहुँचाने के लिए WhatsApp पर भेजें।' : currentLanguage === 'pa' ? 'ਇਸ ਹੋਸਟ ਉੱਤੇ Cloudflare ਬੁਕਿੰਗ ਸੇਵਾ ਹਾਲੇ ਨਹੀਂ ਜੁੜੀ। ਬੇਨਤੀ ਤਿਆਰ ਹੈ; ਡੈਸਕ ਤੱਕ ਭੇਜਣ ਲਈ WhatsApp ਵਰਤੋ।' : 'The Cloudflare booking service is not connected on this host yet. Your request is prepared locally; send it on WhatsApp to reach the desk now.');
  $('#bookingWhatsApp').href = 'https://wa.me/' + CONTACT_PHONE + '?text=' + encodeURIComponent(bookingMessage(booking));
  trackEvent('booking_submitted', { crop: booking.crop, machine: booking.machine, shared });
  showToast(shared ? 'Reservation saved. Reference ' + booking.reference : 'Reservation prepared. Please finish on WhatsApp.');
  submit.disabled = false;
  submit.innerHTML = '<span data-i18n="sendReservation">' + (TRANSLATIONS[currentLanguage]?.sendReservation || TRANSLATIONS.en.sendReservation) + '</span> <b>&nearr;</b>';
}

function setupBooking() {
  const form = $('#bookingForm');
  if (!form) return;
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const dateField = form.elements.date;
  if (dateField) dateField.min = today.toISOString().slice(0, 10);
  $$('[data-booking-next]').forEach((button) => button.addEventListener('click', () => {
    const step = button.closest('.booking-step');
    if (!validateStep(step)) return;
    showBookingStep(bookingStep + 1);
  }));
  $$('[data-booking-prev]').forEach((button) => button.addEventListener('click', () => showBookingStep(bookingStep - 1)));
  form.addEventListener('submit', submitBooking);
  $('#newBookingButton')?.addEventListener('click', () => {
    form.reset();
    $('#bookingSuccess').hidden = true;
    form.hidden = false;
    showBookingStep(0);
  });
  $('#quickBookingForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    form.elements.name.value = values.name || '';
    form.elements.location.value = values.location || '';
    form.elements.crop.value = values.crop || '';
    showBookingStep(0);
    $('#booking').scrollIntoView({ behavior: 'smooth' });
    trackEvent('quick_booking_started', { crop: values.crop });
  });
  showBookingStep(0);
}

function setupLeadGate() {
  const modal = $('#leadModal');
  if (!modal) return;
  const close = (reason) => {
    modal.hidden = true;
    setModalState(false);
    localStorage.setItem(LEAD_GATE_KEY, String(Date.now()));
    if (reason) trackEvent(reason);
  };
  const lastSeen = Number(localStorage.getItem(LEAD_GATE_KEY) || 0);
  const shouldShow = !lastSeen || Date.now() - lastSeen > 7 * 24 * 60 * 60 * 1000;
  if (shouldShow) {
    window.setTimeout(() => {
      if (document.body.classList.contains('modal-open')) return;
      modal.hidden = false;
      setModalState(true);
      trackEvent('lead_gate_shown');
    }, 5200);
  }
  $('#leadClose')?.addEventListener('click', () => close('lead_gate_closed'));
  $('#leadSkip')?.addEventListener('click', () => close('lead_gate_skipped'));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) close('lead_gate_closed');
  });
  $('#leadForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    values.phone = cleanPhone(values.phone);
    values.source = 'welcome_registration';
    if (values.phone.length !== 10) {
      form.elements.phone.setCustomValidity('Enter a valid 10-digit mobile number.');
      form.elements.phone.reportValidity();
      form.elements.phone.addEventListener('input', () => form.elements.phone.setCustomValidity(''), { once: true });
      return;
    }
    const button = $('button[type="submit"]', form);
    button.disabled = true;
    button.textContent = 'Registering...';
    try {
      await api('/leads', { method: 'POST', body: values });
      showToast('Registration saved. The booking desk can now contact you.');
    } catch (error) {
      showToast('Registration service is not connected yet. Please use the booking form or WhatsApp.');
    }
    trackEvent('lead_submitted', { interest: values.interest });
    button.disabled = false;
    button.innerHTML = 'Register my interest <span>&nearr;</span>';
    close();
  });
}

function openDesk() {
  $('#deskModal').hidden = false;
  setModalState(true);
  checkBackend();
  if (adminState.token) enterDesk();
}

function closeDesk() {
  $('#deskModal').hidden = true;
  setModalState(false);
}

async function checkBackend() {
  const status = $('#deskBackendStatus');
  if (!status) return;
  try {
    await api('/health');
    status.textContent = 'Secure Cloudflare service online.';
  } catch (error) {
    status.textContent = 'Cloudflare backend not connected on this preview. Follow the included deployment guide to activate the owner desk.';
  }
}

async function adminApi(path, options = {}) {
  try {
    return await api(path, options, true);
  } catch (error) {
    if (error.status === 401) {
      adminState.token = '';
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      $('#deskGate').hidden = false;
      $('#deskApp').hidden = true;
      showToast('Owner session expired. Enter the PIN again.');
    }
    throw error;
  }
}

async function enterDesk() {
  $('#deskGate').hidden = true;
  $('#deskApp').hidden = false;
  $('#deskToday').textContent = new Intl.DateTimeFormat('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date()).toUpperCase();
  switchAdminView(adminState.activeView);
}

async function loginDesk(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = $('button[type="submit"]', form);
  button.disabled = true;
  button.textContent = 'Verifying...';
  try {
    const response = await api('/admin/login', { method: 'POST', body: { pin: $('#deskPin').value } });
    adminState.token = response.token;
    sessionStorage.setItem(ADMIN_TOKEN_KEY, response.token);
    form.reset();
    await enterDesk();
    showToast('Owner desk unlocked.');
  } catch (error) {
    showToast(error.message || 'Owner authentication failed.');
    $('#deskPin').focus();
  } finally {
    button.disabled = false;
    button.innerHTML = 'Open operations <span>&nearr;</span>';
  }
}

function switchAdminView(view) {
  adminState.activeView = view;
  $$('[data-admin-tab]').forEach((button) => button.classList.toggle('is-active', button.dataset.adminTab === view));
  $$('[data-admin-view]').forEach((section) => {
    const active = section.dataset.adminView === view;
    section.hidden = !active;
    section.classList.toggle('is-active', active);
  });
  if (view === 'overview') loadOverview();
  if (view === 'bookings') loadBookings();
  if (view === 'leads') loadLeads();
  if (view === 'media') loadMedia();
}

function renderOverview(data) {
  const summary = data.summary || {};
  $('#metricBookings').textContent = summary.bookings || 0;
  $('#metricToday').textContent = (summary.todayBookings || 0) + ' today';
  $('#metricNew').textContent = summary.newBookings || 0;
  $('#metricLeads').textContent = summary.leads || 0;
  $('#metricVisits').textContent = summary.visits7d || 0;
  $('#sidebarBookingCount').textContent = summary.newBookings || 0;
  $('#sidebarLeadCount').textContent = summary.leads || 0;

  const activity = data.activity || [];
  const max = Math.max(1, ...activity.map((item) => Math.max(item.visits || 0, item.bookingStarts || 0)));
  $('#activityChart').innerHTML = activity.map((item) => {
    const visits = Math.max(2, ((item.visits || 0) / max) * 100);
    const starts = Math.max(2, ((item.bookingStarts || 0) / max) * 100);
    return '<div class="activity-day"><div class="activity-bars"><i style="height:' + visits + '%" title="' + escapeHtml(item.visits) + ' visits"></i><i style="height:' + starts + '%" title="' + escapeHtml(item.bookingStarts) + ' booking starts"></i></div><span>' + escapeHtml(item.label) + '</span></div>';
  }).join('');

  const crops = data.topCrops || [];
  const cropMax = Math.max(1, ...crops.map((item) => item.count || 0));
  $('#cropRank').innerHTML = crops.length ? crops.map((item) => '<div class="rank-item"><span>' + escapeHtml(item.crop) + '</span><b>' + escapeHtml(item.count) + '</b><i style="--rank-width:' + ((item.count / cropMax) * 100) + '%"></i></div>').join('') : '<div class="board-empty">Crop demand will appear after bookings arrive.</div>';

  const devices = data.devices || [];
  const totalDevices = Math.max(1, devices.reduce((total, item) => total + Number(item.count || 0), 0));
  const mobileCount = devices.filter((item) => item.device === 'mobile').reduce((total, item) => total + Number(item.count || 0), 0);
  const mobilePercent = Math.round((mobileCount / totalDevices) * 100);
  $('#deviceMix').innerHTML = '<div class="device-ring" style="--mobile:' + mobilePercent + '%"><b>' + mobilePercent + '%</b><span>MOBILE</span></div>';

  const recent = data.recentBookings || [];
  $('#recentBookings').innerHTML = recent.length ? recent.map((booking) => '<article class="recent-row"><div><b>' + escapeHtml(booking.name) + '</b><small>' + escapeHtml(booking.phone) + '</small></div><div><b>' + escapeHtml(booking.village || booking.location) + '</b><small>' + escapeHtml(booking.crop) + ' / ' + escapeHtml(booking.acreage || '-') + ' acres</small></div><div><span class="status-pill status-' + escapeHtml(booking.status) + '">' + escapeHtml(booking.status) + '</span></div><small>' + escapeHtml(timeLabel(booking.createdAt)) + '</small></article>').join('') : '<div class="board-empty">New booking requests will appear here.</div>';
}

async function loadOverview() {
  try {
    const data = await adminApi('/admin/overview');
    renderOverview(data);
  } catch (error) {
    if (error.status !== 401) showToast('Could not load overview: ' + error.message);
  }
}

function renderBookings(bookings) {
  const board = $('#bookingBoard');
  if (!bookings.length) {
    board.innerHTML = '<div class="board-empty">No bookings match this filter.</div>';
    return;
  }
  board.innerHTML = bookings.map((booking) => {
    const phone = cleanPhone(booking.phone);
    return '<article class="booking-row" data-booking-id="' + escapeHtml(booking.id) + '"><div><b>' + escapeHtml(booking.name) + '</b><small>' + escapeHtml(booking.reference) + ' / ' + escapeHtml(booking.phone) + '</small></div><div><b>' + escapeHtml(booking.village || '-') + ', ' + escapeHtml(booking.location || '-') + '</b><small>' + escapeHtml(booking.crop) + ' / ' + escapeHtml(booking.acreage || '-') + ' acres / ' + escapeHtml(dateLabel(booking.date)) + '</small></div><div><b>' + escapeHtml(booking.machine || 'Help me choose') + '</b><small>' + escapeHtml(booking.source || 'website') + '</small></div><div><select data-booking-status aria-label="Booking status"><option value="new"' + (booking.status === 'new' ? ' selected' : '') + '>New</option><option value="contacted"' + (booking.status === 'contacted' ? ' selected' : '') + '>Contacted</option><option value="confirmed"' + (booking.status === 'confirmed' ? ' selected' : '') + '>Confirmed</option><option value="completed"' + (booking.status === 'completed' ? ' selected' : '') + '>Completed</option><option value="cancelled"' + (booking.status === 'cancelled' ? ' selected' : '') + '>Cancelled</option></select><small>' + escapeHtml(timeLabel(booking.createdAt)) + '</small></div><div class="row-actions"><a href="https://wa.me/91' + escapeHtml(phone) + '" target="_blank" rel="noopener" title="WhatsApp">W</a><button type="button" data-delete-booking title="Delete booking">&times;</button></div></article>';
  }).join('');
}

async function loadBookings() {
  const status = $('#bookingFilter')?.value || 'all';
  const query = $('#bookingSearch')?.value || '';
  const params = new URLSearchParams({ page: String(adminState.page), limit: '30' });
  if (status !== 'all') params.set('status', status);
  if (query) params.set('q', query);
  try {
    const data = await adminApi('/admin/bookings?' + params.toString());
    adminState.bookings = data.bookings || [];
    adminState.totalPages = data.totalPages || 1;
    renderBookings(adminState.bookings);
    $('#bookingsPage').textContent = 'Page ' + adminState.page + ' of ' + adminState.totalPages;
    $('#bookingsPrev').disabled = adminState.page <= 1;
    $('#bookingsNext').disabled = adminState.page >= adminState.totalPages;
  } catch (error) {
    if (error.status !== 401) showToast('Could not load bookings: ' + error.message);
  }
}

async function updateBookingStatus(id, status) {
  try {
    await adminApi('/admin/bookings/' + encodeURIComponent(id), { method: 'PATCH', body: { status } });
    showToast('Booking moved to ' + status + '.');
    loadBookings();
    loadOverview();
  } catch (error) {
    showToast('Status update failed: ' + error.message);
  }
}

async function deleteBooking(id) {
  if (!window.confirm('Delete this booking permanently?')) return;
  try {
    await adminApi('/admin/bookings/' + encodeURIComponent(id), { method: 'DELETE' });
    showToast('Booking deleted.');
    loadBookings();
    loadOverview();
  } catch (error) {
    showToast('Delete failed: ' + error.message);
  }
}

async function loadLeads() {
  try {
    const data = await adminApi('/admin/leads?limit=200');
    adminState.leads = data.leads || [];
    const board = $('#leadBoard');
    board.innerHTML = adminState.leads.length ? adminState.leads.map((lead) => {
      const phone = cleanPhone(lead.phone);
      return '<article class="lead-row"><span class="lead-avatar">' + escapeHtml((lead.name || 'L').slice(0, 1).toUpperCase()) + '</span><div><b>' + escapeHtml(lead.name) + '</b><small>' + escapeHtml(lead.phone) + ' / ' + escapeHtml(lead.location || 'Location not shared') + '</small></div><div><b>' + escapeHtml(lead.interest || 'Harvest booking') + '</b><small>' + escapeHtml(lead.source || 'website') + '</small></div><div><b>' + escapeHtml(lead.status || 'new') + '</b><small>' + escapeHtml(timeLabel(lead.createdAt)) + '</small></div><a href="https://wa.me/91' + escapeHtml(phone) + '" target="_blank" rel="noopener">WHATSAPP &nearr;</a></article>';
    }).join('') : '<div class="board-empty">No visitor has registered contact details yet.</div>';
    $('#sidebarLeadCount').textContent = adminState.leads.length;
  } catch (error) {
    if (error.status !== 401) showToast('Could not load leads: ' + error.message);
  }
}

function mediaVisual(item) {
  if (item.kind === 'video') return '<video src="' + escapeHtml(item.url) + '" muted playsinline></video>';
  return '<img src="' + escapeHtml(item.url) + '" alt="' + escapeHtml(item.alt || item.title) + '" />';
}

function renderMedia() {
  const library = $('#mediaLibrary');
  library.innerHTML = adminState.media.length ? adminState.media.map((item) => '<article class="media-card" data-media-id="' + escapeHtml(item.id) + '"><figure>' + mediaVisual(item) + '<span>' + escapeHtml(item.slot) + '</span></figure><div><b>' + escapeHtml(item.title) + '</b><small>' + escapeHtml(item.kind) + ' / ' + (item.active ? 'published' : 'hidden') + '</small><div class="media-actions"><button type="button" data-edit-media>Edit</button><button type="button" data-toggle-media="' + (item.active ? '0' : '1') + '">' + (item.active ? 'Hide' : 'Publish') + '</button><button type="button" data-delete-media>Delete</button></div><div class="media-editor" hidden><input data-media-title value="' + escapeHtml(item.title) + '" maxlength="100" aria-label="Media title" /><input data-media-alt value="' + escapeHtml(item.alt || '') + '" maxlength="180" aria-label="Media description" placeholder="Description / alt text" /><select data-media-slot aria-label="Media placement"><option value="gallery"' + (item.slot === 'gallery' ? ' selected' : '') + '>Campaign gallery</option><option value="hero"' + (item.slot === 'hero' ? ' selected' : '') + '>Hero background</option><option value="booking"' + (item.slot === 'booking' ? ' selected' : '') + '>Booking backdrop</option></select><button type="button" data-save-media>Save changes</button></div></div></article>').join('') : '<div class="board-empty">No uploaded campaign media yet. Built-in website assets remain active.</div>';
}

async function loadMedia() {
  try {
    const data = await adminApi('/admin/media');
    adminState.media = data.media || [];
    renderMedia();
  } catch (error) {
    if (error.status !== 401) showToast('Could not load media: ' + error.message);
  }
}

async function uploadMedia(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = $('button[type="submit"]', form);
  const file = form.elements.file.files[0];
  if (!file) return;
  if (file.size > 20 * 1024 * 1024) {
    showToast('Please choose a file smaller than 20 MB.');
    return;
  }
  const body = new FormData(form);
  body.set('active', form.elements.active.checked ? '1' : '0');
  button.disabled = true;
  button.textContent = 'Uploading...';
  try {
    await adminApi('/admin/media', { method: 'POST', body });
    form.reset();
    form.elements.active.checked = true;
    showToast('Campaign asset uploaded.');
    loadMedia();
  } catch (error) {
    showToast('Upload failed: ' + error.message);
  } finally {
    button.disabled = false;
    button.innerHTML = 'Upload to library <span>&uarr;</span>';
  }
}

async function toggleMedia(id, active) {
  try {
    await adminApi('/admin/media/' + encodeURIComponent(id), { method: 'PATCH', body: { active } });
    showToast(active ? 'Asset published.' : 'Asset hidden.');
    loadMedia();
  } catch (error) {
    showToast('Media update failed: ' + error.message);
  }
}

async function updateMediaDetails(card) {
  const id = card.dataset.mediaId;
  const body = {
    title: $('[data-media-title]', card).value,
    alt: $('[data-media-alt]', card).value,
    slot: $('[data-media-slot]', card).value
  };
  if (!body.title.trim()) {
    showToast('Media title cannot be empty.');
    return;
  }
  try {
    await adminApi('/admin/media/' + encodeURIComponent(id), { method: 'PATCH', body });
    showToast('Media details updated.');
    loadMedia();
  } catch (error) {
    showToast('Media edit failed: ' + error.message);
  }
}

async function deleteMedia(id) {
  if (!window.confirm('Delete this media file from Cloudflare storage?')) return;
  try {
    await adminApi('/admin/media/' + encodeURIComponent(id), { method: 'DELETE' });
    showToast('Media file deleted.');
    loadMedia();
  } catch (error) {
    showToast('Media delete failed: ' + error.message);
  }
}

async function createAdminBooking(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form).entries());
  values.phone = cleanPhone(values.phone);
  values.source = 'owner_desk';
  try {
    await adminApi('/admin/bookings', { method: 'POST', body: values });
    form.reset();
    $('#adminAddPanel').hidden = true;
    showToast('Booking added to the shared board.');
    loadBookings();
    loadOverview();
  } catch (error) {
    showToast('Could not add booking: ' + error.message);
  }
}

async function exportBookings() {
  try {
    const data = await adminApi('/admin/bookings?limit=1000&page=1');
    const rows = data.bookings || [];
    const columns = ['reference', 'createdAt', 'status', 'name', 'phone', 'village', 'location', 'crop', 'acreage', 'date', 'machine', 'source', 'notes'];
    const quote = (value) => '"' + String(value == null ? '' : value).replaceAll('"', '""') + '"';
    const csv = [columns.join(',')].concat(rows.map((row) => columns.map((column) => quote(row[column])).join(','))).join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    link.download = 'new-hira-bookings-' + new Date().toISOString().slice(0, 10) + '.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  } catch (error) {
    showToast('Export failed: ' + error.message);
  }
}

function setupDesk() {
  $$('[data-open-desk]').forEach((button) => button.addEventListener('click', openDesk));
  $('#deskClose')?.addEventListener('click', closeDesk);
  $('#deskModal')?.addEventListener('click', (event) => {
    if (event.target === $('#deskModal')) closeDesk();
  });
  $('#deskLoginForm')?.addEventListener('submit', loginDesk);
  $('#deskLogout')?.addEventListener('click', () => {
    adminState.token = '';
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    $('#deskApp').hidden = true;
    $('#deskGate').hidden = false;
    showToast('Signed out of owner desk.');
  });
  $$('[data-admin-tab]').forEach((button) => button.addEventListener('click', () => switchAdminView(button.dataset.adminTab)));
  $$('[data-jump-admin]').forEach((button) => button.addEventListener('click', () => switchAdminView(button.dataset.jumpAdmin)));
  $$('[data-admin-refresh]').forEach((button) => button.addEventListener('click', () => switchAdminView(adminState.activeView)));
  $('#adminAddToggle')?.addEventListener('click', () => {
    switchAdminView('bookings');
    $('#adminAddPanel').hidden = !$('#adminAddPanel').hidden;
  });
  $('#adminBookingForm')?.addEventListener('submit', createAdminBooking);
  $('#bookingFilter')?.addEventListener('change', () => {
    adminState.page = 1;
    loadBookings();
  });
  let searchTimer = 0;
  $('#bookingSearch')?.addEventListener('input', () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      adminState.page = 1;
      loadBookings();
    }, 350);
  });
  $('#bookingsPrev')?.addEventListener('click', () => {
    if (adminState.page > 1) {
      adminState.page -= 1;
      loadBookings();
    }
  });
  $('#bookingsNext')?.addEventListener('click', () => {
    if (adminState.page < adminState.totalPages) {
      adminState.page += 1;
      loadBookings();
    }
  });
  $('#bookingBoard')?.addEventListener('change', (event) => {
    const select = event.target.closest('[data-booking-status]');
    if (!select) return;
    const row = select.closest('[data-booking-id]');
    updateBookingStatus(row.dataset.bookingId, select.value);
  });
  $('#bookingBoard')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-delete-booking]');
    if (!button) return;
    deleteBooking(button.closest('[data-booking-id]').dataset.bookingId);
  });
  $('#exportBookings')?.addEventListener('click', exportBookings);
  $('#mediaForm')?.addEventListener('submit', uploadMedia);
  $('#mediaLibrary')?.addEventListener('click', (event) => {
    const card = event.target.closest('[data-media-id]');
    if (!card) return;
    const edit = event.target.closest('[data-edit-media]');
    const save = event.target.closest('[data-save-media]');
    const toggle = event.target.closest('[data-toggle-media]');
    const remove = event.target.closest('[data-delete-media]');
    if (edit) {
      const editor = $('.media-editor', card);
      editor.hidden = !editor.hidden;
    }
    if (save) updateMediaDetails(card);
    if (toggle) toggleMedia(card.dataset.mediaId, toggle.dataset.toggleMedia === '1');
    if (remove) deleteMedia(card.dataset.mediaId);
  });
}

function setupGlobalEscape() {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!$('#brochureModal').hidden) {
      $('#brochureModal').hidden = true;
      setModalState(false);
    } else if (!$('#leadModal').hidden) {
      $('#leadSkip')?.click();
    } else if (!$('#deskModal').hidden) {
      closeDesk();
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  setupOnboarding();
  $('#year').textContent = new Date().getFullYear();
  setupNavigation();
  setupLanguageMenu();
  setupScrollEffects();
  setupReveal();
  setupSectionAnalytics();
  setupHero();
  setupHeroCinema();
  setupCounters();
  setupFleet();
  setupBrochure();
  setupBooking();
  setupDesk();
  setupGlobalEscape();
  await loadPublicMedia();
  setupCarousels();
  trackEvent('page_view', { title: document.title });
});
