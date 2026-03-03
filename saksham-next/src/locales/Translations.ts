export type TranslationKey =
  | "appName"
  | "tagline"
  | "landing_hero"
  | "landing_cta"
  | "landing_feature1_title"
  | "landing_feature1_desc"
  | "landing_feature2_title"
  | "landing_feature2_desc"
  | "landing_feature3_title"
  | "landing_feature3_desc"
  | "landing_feature4_title"
  | "landing_feature4_desc"
  | "onboarding_title"
  | "onboarding_subtitle"
  | "guide_step1_title"
  | "guide_step1_desc"
  | "guide_step2_title"
  | "guide_step2_desc"
  | "guide_step3_title"
  | "guide_step3_desc"
  | "mic_idle"
  | "mic_recording"
  | "mic_thinking"
  | "mic_speaking"
  | "courses_title"
  | "jobs_title"
  | "schemes_title"
  | "profile_title"
  | "profile_incomplete"
  | "signIn"
  | "getStarted"
  | "chooseCareer"
  | "recordBackground"
  | "exploreResources"
  | "autoListen"
  | "noSessions";

type Translations = Record<string, Record<TranslationKey, string>>;

export const translations: Translations = {
  hindi: {
    appName: "सक्षम",
    tagline: "आपकी आवाज़, आपका करियर",
    landing_hero:
      "अपनी पृष्ठभूमि बताइए, AI आपके लिए करियर, कोर्स और नौकरी खोजेगा",
    landing_cta: "शुरू करें",
    landing_feature1_title: "आवाज़ से बातचीत",
    landing_feature1_desc: "बोलकर अपना बैकग्राउंड बताएं, टाइप करने की ज़रूरत नहीं",
    landing_feature2_title: "AI करियर गाइड",
    landing_feature2_desc: "स्मार्ट AI आपके लिए सही करियर पाथ सुझाएगा",
    landing_feature3_title: "कोर्स और नौकरी",
    landing_feature3_desc: "आपकी पढ़ाई के हिसाब से कोर्स और जॉब प्लेटफॉर्म",
    landing_feature4_title: "सरकारी योजनाएं",
    landing_feature4_desc: "करियर से जुड़ी सरकारी योजनाओं की जानकारी",
    onboarding_title: "आइए आपसे कुछ जानते हैं",
    onboarding_subtitle: "माइक बटन दबाकर जवाब दें",
    guide_step1_title: "अपना बैकग्राउंड बताएं",
    guide_step1_desc: "माइक दबाएं और अपने बारे में बताएं",
    guide_step2_title: "करियर चुनें",
    guide_step2_desc: "AI के सुझावों में से अपना करियर चुनें",
    guide_step3_title: "कोर्स और जॉब देखें",
    guide_step3_desc: "AI से बात करें, कोर्स और जॉब पाएं",
    mic_idle: "बोलने के लिए दबाएं",
    mic_recording: "सुन रहा है...",
    mic_thinking: "सोच रहा है...",
    mic_speaking: "बोल रहा है...",
    courses_title: "कोर्स",
    jobs_title: "नौकरियां",
    schemes_title: "सरकारी योजनाएं",
    profile_title: "प्रोफाइल",
    profile_incomplete: "प्रोफाइल अधूरी है। कृपया ऑनबोर्डिंग पूरी करें।",
    signIn: "साइन इन",
    getStarted: "शुरू करें",
    chooseCareer: "करियर चुनें",
    recordBackground: "बैकग्राउंड रिकॉर्ड करें",
    exploreResources: "संसाधन देखें",
    autoListen: "ऑटो सुनें",
    noSessions: "कोई पिछला सेशन नहीं",
  },
  tamil: {
    appName: "சக்ஷம்",
    tagline: "உங்கள் குரல், உங்கள் தொழில்",
    landing_hero:
      "உங்கள் பின்னணியைப் பேசுங்கள், AI உங்களுக்கான தொழில், பாடங்கள் மற்றும் வேலைகளைக் கண்டறியும்",
    landing_cta: "தொடங்குங்கள்",
    landing_feature1_title: "குரல் உரையாடல்",
    landing_feature1_desc: "பேசி உங்கள் பின்னணியைச் சொல்லுங்கள்",
    landing_feature2_title: "AI தொழில் வழிகாட்டி",
    landing_feature2_desc: "AI உங்களுக்கான சரியான தொழில் பாதையை பரிந்துரைக்கும்",
    landing_feature3_title: "பாடங்கள் மற்றும் வேலை",
    landing_feature3_desc: "உங்கள் கல்வி நிலைக்கு ஏற்ற பாடங்கள் மற்றும் வேலைகள்",
    landing_feature4_title: "அரசு திட்டங்கள்",
    landing_feature4_desc: "தொழில் சார்ந்த அரசு திட்டங்களின் தகவல்",
    onboarding_title: "உங்களைப் பற்றி தெரிந்துகொள்வோம்",
    onboarding_subtitle: "மைக் பட்டனை அழுத்தி பதிலளியுங்கள்",
    guide_step1_title: "உங்கள் பின்னணியைப் பேசுங்கள்",
    guide_step1_desc: "மைக் அழுத்தி உங்களைப் பற்றி சொல்லுங்கள்",
    guide_step2_title: "தொழிலைத் தேர்வு செய்யுங்கள்",
    guide_step2_desc: "AI பரிந்துரைகளிலிருந்து தேர்வு செய்யுங்கள்",
    guide_step3_title: "பாடங்கள் மற்றும் வேலைகளைப் பாருங்கள்",
    guide_step3_desc: "AI உடன் பேசி பாடங்களையும் வேலைகளையும் பெறுங்கள்",
    mic_idle: "பேச அழுத்துங்கள்",
    mic_recording: "கேட்கிறது...",
    mic_thinking: "யோசிக்கிறது...",
    mic_speaking: "பேசுகிறது...",
    courses_title: "பாடங்கள்",
    jobs_title: "வேலைகள்",
    schemes_title: "அரசு திட்டங்கள்",
    profile_title: "சுயவிவரம்",
    profile_incomplete: "சுயவிவரம் முழுமையடையவில்லை",
    signIn: "உள்நுழைக",
    getStarted: "தொடங்குங்கள்",
    chooseCareer: "தொழிலைத் தேர்வு செய்",
    recordBackground: "பின்னணியை பதிவு செய்",
    exploreResources: "வளங்களைப் பாருங்கள்",
    autoListen: "தானியங்கி கேட்பு",
    noSessions: "முந்தைய அமர்வுகள் இல்லை",
  },
  telugu: {
    appName: "సక్షమ్",
    tagline: "మీ గొంతు, మీ కెరీర్",
    landing_hero:
      "మీ నేపథ్యాన్ని చెప్పండి, AI మీ కోసం కెరీర్, కోర్సులు మరియు ఉద్యోగాలు కనుగొంటుంది",
    landing_cta: "ప్రారంభించండి",
    landing_feature1_title: "వాయిస్ సంభాషణ",
    landing_feature1_desc: "మాట్లాడి మీ నేపథ్యం చెప్పండి",
    landing_feature2_title: "AI కెరీర్ గైడ్",
    landing_feature2_desc: "AI మీకు సరైన కెరీర్ మార్గాన్ని సూచిస్తుంది",
    landing_feature3_title: "కోర్సులు మరియు ఉద్యోగాలు",
    landing_feature3_desc: "మీ చదువుకు తగిన కోర్సులు మరియు ఉద్యోగాలు",
    landing_feature4_title: "ప్రభుత్వ పథకాలు",
    landing_feature4_desc: "కెరీర్ సంబంధిత ప్రభుత్వ పథకాల సమాచారం",
    onboarding_title: "మీ గురించి తెలుసుకుందాం",
    onboarding_subtitle: "మైక్ బటన్ నొక్కి సమాధానం ఇవ్వండి",
    guide_step1_title: "మీ నేపథ్యం చెప్పండి",
    guide_step1_desc: "మైక్ నొక్కి మీ గురించి చెప్పండి",
    guide_step2_title: "కెరీర్ ఎంచుకోండి",
    guide_step2_desc: "AI సూచనల నుండి ఎంచుకోండి",
    guide_step3_title: "కోర్సులు మరియు ఉద్యోగాలు చూడండి",
    guide_step3_desc: "AI తో మాట్లాడి కోర్సులు మరియు ఉద్యోగాలు పొందండి",
    mic_idle: "మాట్లాడటానికి నొక్కండి",
    mic_recording: "వింటోంది...",
    mic_thinking: "ఆలోచిస్తోంది...",
    mic_speaking: "మాట్లాడుతోంది...",
    courses_title: "కోర్సులు",
    jobs_title: "ఉద్యోగాలు",
    schemes_title: "ప్రభుత్వ పథకాలు",
    profile_title: "ప్రొఫైల్",
    profile_incomplete: "ప్రొఫైల్ పూర్తి కాలేదు",
    signIn: "సైన్ ఇన్",
    getStarted: "ప్రారంభించండి",
    chooseCareer: "కెరీర్ ఎంచుకోండి",
    recordBackground: "నేపథ్యం రికార్డ్ చేయండి",
    exploreResources: "వనరులు చూడండి",
    autoListen: "ఆటో లిజన్",
    noSessions: "మునుపటి సెషన్లు లేవు",
  },
  marathi: {
    appName: "सक्षम",
    tagline: "तुमचा आवाज, तुमचं करिअर",
    landing_hero:
      "तुमची पार्श्वभूमी सांगा, AI तुमच्यासाठी करिअर, कोर्स आणि नोकरी शोधेल",
    landing_cta: "सुरू करा",
    landing_feature1_title: "आवाजाने संवाद",
    landing_feature1_desc: "बोलून तुमची पार्श्वभूमी सांगा",
    landing_feature2_title: "AI करिअर मार्गदर्शक",
    landing_feature2_desc: "AI तुमच्यासाठी योग्य करिअर मार्ग सुचवेल",
    landing_feature3_title: "कोर्स आणि नोकरी",
    landing_feature3_desc: "तुमच्या शिक्षणानुसार कोर्स आणि नोकरी",
    landing_feature4_title: "सरकारी योजना",
    landing_feature4_desc: "करिअरशी संबंधित सरकारी योजनांची माहिती",
    onboarding_title: "तुमच्याबद्दल जाणून घेऊया",
    onboarding_subtitle: "माइक बटण दाबून उत्तर द्या",
    guide_step1_title: "तुमची पार्श्वभूमी सांगा",
    guide_step1_desc: "माइक दाबा आणि तुमच्याबद्दल सांगा",
    guide_step2_title: "करिअर निवडा",
    guide_step2_desc: "AI च्या सूचनांमधून निवडा",
    guide_step3_title: "कोर्स आणि नोकरी पहा",
    guide_step3_desc: "AI शी बोला, कोर्स आणि नोकरी मिळवा",
    mic_idle: "बोलण्यासाठी दाबा",
    mic_recording: "ऐकतोय...",
    mic_thinking: "विचार करतोय...",
    mic_speaking: "बोलतोय...",
    courses_title: "कोर्स",
    jobs_title: "नोकऱ्या",
    schemes_title: "सरकारी योजना",
    profile_title: "प्रोफाइल",
    profile_incomplete: "प्रोफाइल अपूर्ण आहे",
    signIn: "साइन इन",
    getStarted: "सुरू करा",
    chooseCareer: "करिअर निवडा",
    recordBackground: "पार्श्वभूमी रेकॉर्ड करा",
    exploreResources: "संसाधने पहा",
    autoListen: "ऑटो ऐका",
    noSessions: "मागील सत्र नाहीत",
  },
};