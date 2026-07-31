# -*- coding: utf-8 -*-
"""Sync missing translation keys into public + src locale files."""
import json
from copy import deepcopy
from pathlib import Path

root = Path(__file__).resolve().parents[1]
src_en = json.loads((root / "src/locales/en/translation.json").read_text(encoding="utf-8"))
pub_en = json.loads((root / "public/locales/en/translation.json").read_text(encoding="utf-8"))
pub_hi = json.loads((root / "public/locales/hi/translation.json").read_text(encoding="utf-8"))

rr_en = {
    "findMyReceipt": "Find My Receipt",
    "thankYouPrefix": "Thank you for choosing",
    "thankYouHighlight": "kindness",
    "thankYouSubtitle": (
        "Your support helps us bring food, shelter and dignity to those who need it most."
    ),
    "trustBadge": (
        "Aadar Foundation is a registered NGO committed to transparency and accountability."
    ),
    "knowMore": "Know more about us",
    "impactTitle": "Your Impact in Action",
    "cardSubtitle": "Enter the email address or mobile number used during your donation.",
    "dataSafeNote": (
        "Your data is safe with us. We use it only to help you retrieve your receipt."
    ),
    "impact": {
        "lives": {"title": "Thousands", "subtitle": "Lives touched with care"},
        "meals": {"title": "Daily Meals", "subtitle": "Served with dignity"},
        "shelter": {
            "title": "Shelter & Support",
            "subtitle": "For the homeless & unclaimed",
        },
        "transparent": {
            "title": "100% Transparent",
            "subtitle": "Use of every donation",
        },
    },
}
rr_hi = {
    "findMyReceipt": "मेरी रसीद खोजें",
    "thankYouPrefix": "धन्यवाद कि आपने चुना",
    "thankYouHighlight": "दयालुता",
    "thankYouSubtitle": (
        "आपका सहयोग उन लोगों तक भोजन, आश्रय और गरिमा पहुँचाने में मदद करता है "
        "जिन्हें इसकी सबसे अधिक आवश्यकता है।"
    ),
    "trustBadge": (
        "आदर फाउंडेशन एक पंजीकृत एनजीओ है जो पारदर्शिता और जवाबदेही के लिए प्रतिबद्ध है।"
    ),
    "knowMore": "हमारे बारे में और जानें",
    "impactTitle": "आपके सहयोग का प्रभाव",
    "cardSubtitle": "दान करते समय उपयोग किया गया ईमेल पता या मोबाइल नंबर दर्ज करें।",
    "dataSafeNote": (
        "आपका डेटा हमारे पास सुरक्षित है। हम इसका उपयोग केवल आपकी रसीद प्राप्त करने "
        "में मदद के लिए करते हैं।"
    ),
    "impact": {
        "lives": {"title": "हज़ारों", "subtitle": "देखभाल से छुए गए जीवन"},
        "meals": {"title": "दैनिक भोजन", "subtitle": "गरिमा के साथ परोसा गया"},
        "shelter": {
            "title": "आश्रय और सहायता",
            "subtitle": "बेघर और अनाथों के लिए",
        },
        "transparent": {
            "title": "100% पारदर्शी",
            "subtitle": "हर दान का उपयोग",
        },
    },
}

dp_m_en = src_en["donatePage"]["membership"]
df_m_en = src_en["donationForm"]["membership"]
dp_m_hi = {
    "chooseTitle": "अपनी सदस्यता चुनें",
    "toggleOneTime": "एक बार",
    "toggleMonthly": "मासिक",
    "toggleYearly": "वार्षिक",
    "recurringNotice": "आवर्ती सदस्यता Razorpay के माध्यम से स्वतः बिल होती है — कभी भी रद्द करें।",
    "becomeMember": "सदस्य बनें",
    "becomeMemberAriaLabel": "₹{{amount}}/{{period}} के लिए सदस्य बनें",
    "tiers": {"supporter": "सपोर्टर", "sustainer": "सस्टेनर", "patron": "पैट्रन"},
    "perMonthShort": "महीना",
    "perYearShort": "वर्ष",
}
df_m_hi = {
    "titleSuffix": "{{tier}} सदस्यता",
    "billedMonthly": "मासिक बिल — कभी भी रद्द करें",
    "billedYearly": "वार्षिक बिल — कभी भी रद्द करें",
    "perMonthShort": "माह",
    "perYearShort": "वर्ष",
}

dr_extra_en = {
    "pleaseWait": "Please wait",
    "lookupWhereTitle": "Where to find Payment ID?",
    "lookupWhereUpiTitle": "UPI App",
    "lookupWhereUpiBody": "Check your UPI payment history.",
    "lookupWhereSmsTitle": "Bank SMS",
    "lookupWhereSmsBody": "Look for Razorpay payment SMS.",
    "lookupWhereRzpTitle": "Razorpay Message",
    "lookupWhereRzpBody": "Open the confirmation message from Razorpay.",
    "lookupWhereStmtTitle": "Bank Statement",
    "lookupWhereStmtBody": "Check your account statement.",
    "lookupNotFoundTitle": "We couldn't find a matching donation",
    "lookupHelpTitle": "Need assistance?",
    "lookupHelpBody": "We're here to help you.",
    "lookupSupportAgainTitle": "Want to support again?",
    "lookupFooter": "Thank you for supporting Aadar Foundation.",
}
dr_extra_hi = {
    "pleaseWait": "कृपया प्रतीक्षा करें",
    "lookupWhereTitle": "Payment ID कहाँ मिलेगा?",
    "lookupWhereUpiTitle": "UPI ऐप",
    "lookupWhereUpiBody": "अपने UPI भुगतान इतिहास में देखें।",
    "lookupWhereSmsTitle": "बैंक SMS",
    "lookupWhereSmsBody": "Razorpay भुगतान SMS देखें।",
    "lookupWhereRzpTitle": "Razorpay संदेश",
    "lookupWhereRzpBody": "Razorpay से पुष्टि संदेश खोलें।",
    "lookupWhereStmtTitle": "बैंक स्टेटमेंट",
    "lookupWhereStmtBody": "अपने खाते के स्टेटमेंट में देखें।",
    "lookupNotFoundTitle": "मिलता-जुलता दान नहीं मिला",
    "lookupHelpTitle": "सहायता चाहिए?",
    "lookupHelpBody": "हम आपकी मदद के लिए यहाँ हैं।",
    "lookupSupportAgainTitle": "फिर से सहयोग करना चाहते हैं?",
    "lookupFooter": "आदर फाउंडेशन का समर्थन करने के लिए धन्यवाद।",
}

admin_en = {
    "portalTitle": "Admin Portal",
    "secureAccess": "Secure Admin Access",
    "secureAccessSubtitle": "Sign in to manage donation receipts",
    "welcomeBack": "Welcome Back",
    "enterCredentials": "Enter your admin credentials to continue.",
    "username": "Username",
    "password": "Password",
    "usernamePlaceholder": "Admin username",
    "passwordPlaceholder": "Password",
    "login": "Login",
    "checking": "Checking…",
    "logout": "Logout",
    "back": "Back",
    "adminTools": "Admin Tools",
    "chooseAction": "Choose what you want to do.",
    "retrieveReceipt": "Retrieve Receipt",
    "retrieveReceiptDesc": "Find donations by email or mobile and download receipts.",
    "createReceipt": "Create Receipt",
    "createReceiptDesc": "Issue a receipt for verified UPI / QR or bank transfer donations.",
    "issueTitle": "Issue donation receipt",
    "issueSubtitle": "For verified UPI / QR or bank transfer donations.",
    "retrieveTitle": "Retrieve donation receipt",
    "retrieveSubtitle": "Look up receipts by donor email or mobile.",
    "findDonations": "Find donations",
    "searching": "Searching…",
    "donationsFound": "Donations found",
    "viewReceipt": "View receipt",
    "downloadPdf": "Download PDF",
    "searchAgain": "Search again",
    "receiptLoaded": "Receipt loaded",
    "preparingPdf": "Preparing PDF…",
    "email": "Email",
    "mobile": "Mobile",
    "enterEmail": "Enter a valid email address.",
    "enterMobile": "Enter a valid 10-digit mobile number.",
    "enterUsername": "Enter the admin username.",
    "enterPassword": "Enter the admin password.",
    "invalidLogin": "Invalid username or password.",
    "noDonations": "No donations found for this email or mobile.",
    "receiptNotFound": "Receipt not found.",
    "lookupFailed": "Could not look up donations right now. Please try again.",
    "createBusy": "Creating…",
    "createButton": "Create receipt & email donor",
    "createSuccess": "Receipt created and emailed to the donor.",
    "createFailed": "Could not create receipt. Please check details and try again.",
    "amount": "Amount (₹)",
    "utr": "UPI / Bank transaction reference (UTR)",
    "paidAt": "Payment date",
    "name": "Full name",
    "fatherHusband": "Father / husband name",
    "pan": "PAN",
    "address": "Address",
    "state": "State",
    "city": "City",
    "pin": "PIN",
    "purpose": "Purpose (optional)",
    "programLabel": "Program label (optional)",
    "paymentMethod": "Payment method",
    "methodUpi": "UPI / QR",
    "methodBank": "Bank transfer",
    "validationAmount": "Enter a valid donation amount in whole rupees.",
    "validationUtr": "UPI transaction reference (UTR) is required.",
    "validationName": "Donor name is required.",
    "validationFather": "Father's / husband's name is required.",
    "validationEmail": "Enter a valid email address.",
    "validationMobile": "Enter a valid 10-digit mobile number.",
    "validationPan": "Enter a valid PAN.",
    "validationAddress": "Address is required.",
    "validationState": "State is required.",
    "validationCity": "City is required.",
    "validationPin": "Enter a valid 6-digit PIN.",
}
admin_hi = {
    "portalTitle": "एडमिन पोर्टल",
    "secureAccess": "सुरक्षित एडमिन पहुँच",
    "secureAccessSubtitle": "दान रसीदें प्रबंधित करने के लिए साइन इन करें",
    "welcomeBack": "फिर से स्वागत है",
    "enterCredentials": "जारी रखने के लिए अपने एडमिन क्रेडेंशियल दर्ज करें।",
    "username": "उपयोगकर्ता नाम",
    "password": "पासवर्ड",
    "usernamePlaceholder": "एडमिन उपयोगकर्ता नाम",
    "passwordPlaceholder": "पासवर्ड",
    "login": "लॉगिन",
    "checking": "जाँच हो रही है…",
    "logout": "लॉगआउट",
    "back": "वापस",
    "adminTools": "एडमिन टूल",
    "chooseAction": "चुनें कि आप क्या करना चाहते हैं।",
    "retrieveReceipt": "रसीद प्राप्त करें",
    "retrieveReceiptDesc": "ईमेल या मोबाइल से दान खोजें और रसीद डाउनलोड करें।",
    "createReceipt": "रसीद बनाएँ",
    "createReceiptDesc": "सत्यापित UPI / QR या बैंक ट्रांसफर दान के लिए रसीद जारी करें।",
    "issueTitle": "दान रसीद जारी करें",
    "issueSubtitle": "सत्यापित UPI / QR या बैंक ट्रांसफर दान के लिए।",
    "retrieveTitle": "दान रसीद प्राप्त करें",
    "retrieveSubtitle": "दाता के ईमेल या मोबाइल से रसीद खोजें।",
    "findDonations": "दान खोजें",
    "searching": "खोज हो रही है…",
    "donationsFound": "दान मिले",
    "viewReceipt": "रसीद देखें",
    "downloadPdf": "PDF डाउनलोड करें",
    "searchAgain": "फिर से खोजें",
    "receiptLoaded": "रसीद लोड हो गई",
    "preparingPdf": "PDF तैयार हो रहा है…",
    "email": "ईमेल",
    "mobile": "मोबाइल",
    "enterEmail": "सही ईमेल पता दर्ज करें।",
    "enterMobile": "सही 10-अंकीय मोबाइल नंबर दर्ज करें।",
    "enterUsername": "एडमिन उपयोगकर्ता नाम दर्ज करें।",
    "enterPassword": "एडमिन पासवर्ड दर्ज करें।",
    "invalidLogin": "गलत उपयोगकर्ता नाम या पासवर्ड।",
    "noDonations": "इस ईमेल या मोबाइल के लिए कोई दान नहीं मिला।",
    "receiptNotFound": "रसीद नहीं मिली।",
    "lookupFailed": "अभी दान खोज नहीं सके। कृपया फिर से प्रयास करें।",
    "createBusy": "बनाई जा रही है…",
    "createButton": "रसीद बनाएँ और दाता को ईमेल करें",
    "createSuccess": "रसीद बनाई गई और दाता को ईमेल कर दी गई।",
    "createFailed": "रसीद नहीं बन सकी। कृपया विवरण जाँचें और फिर प्रयास करें।",
    "amount": "राशि (₹)",
    "utr": "UPI / बैंक लेनदेन संदर्भ (UTR)",
    "paidAt": "भुगतान की तारीख",
    "name": "पूरा नाम",
    "fatherHusband": "पिता / पति का नाम",
    "pan": "PAN",
    "address": "पता",
    "state": "राज्य",
    "city": "शहर",
    "pin": "PIN",
    "purpose": "उद्देश्य (वैकल्पिक)",
    "programLabel": "कार्यक्रम लेबल (वैकल्पिक)",
    "paymentMethod": "भुगतान विधि",
    "methodUpi": "UPI / QR",
    "methodBank": "बैंक ट्रांसफर",
    "validationAmount": "पूरे रुपये में सही दान राशि दर्ज करें।",
    "validationUtr": "UPI लेनदेन संदर्भ (UTR) आवश्यक है।",
    "validationName": "दाता का नाम आवश्यक है।",
    "validationFather": "पिता / पति का नाम आवश्यक है।",
    "validationEmail": "सही ईमेल पता दर्ज करें।",
    "validationMobile": "सही 10-अंकीय मोबाइल नंबर दर्ज करें।",
    "validationPan": "सही PAN दर्ज करें।",
    "validationAddress": "पता आवश्यक है।",
    "validationState": "राज्य आवश्यक है।",
    "validationCity": "शहर आवश्यक है।",
    "validationPin": "सही 6-अंकीय PIN दर्ज करें।",
}


def apply(en, hi):
    en.setdefault("receiptRetrieve", {}).update(rr_en)
    hi.setdefault("receiptRetrieve", {}).update(rr_hi)
    en.setdefault("donatePage", {})["membership"] = deepcopy(dp_m_en)
    hi.setdefault("donatePage", {})["membership"] = deepcopy(dp_m_hi)
    en.setdefault("donationForm", {})["membership"] = deepcopy(df_m_en)
    hi.setdefault("donationForm", {})["membership"] = deepcopy(df_m_hi)
    en.setdefault("donationResult", {}).update(dr_extra_en)
    hi.setdefault("donationResult", {}).update(dr_extra_hi)
    en["adminPortal"] = deepcopy(admin_en)
    hi["adminPortal"] = deepcopy(admin_hi)


apply(pub_en, pub_hi)

src_hi_path = root / "src/locales/hi/translation.json"
src_hi = (
    json.loads(src_hi_path.read_text(encoding="utf-8"))
    if src_hi_path.exists()
    else deepcopy(pub_hi)
)
apply(src_en, src_hi)

# Keep receiptRetrieve / donationResult / admin aligned with public after merge
src_en["receiptRetrieve"] = deepcopy(pub_en["receiptRetrieve"])
src_hi["receiptRetrieve"] = deepcopy(pub_hi["receiptRetrieve"])
src_en.setdefault("donationResult", {}).update(pub_en["donationResult"])
src_hi["donationResult"] = deepcopy(pub_hi["donationResult"])
src_en["adminPortal"] = deepcopy(pub_en["adminPortal"])
src_hi["adminPortal"] = deepcopy(pub_hi["adminPortal"])

for path, data in [
    (root / "public/locales/en/translation.json", pub_en),
    (root / "public/locales/hi/translation.json", pub_hi),
    (root / "src/locales/en/translation.json", src_en),
    (root / "src/locales/hi/translation.json", src_hi),
]:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("wrote", path)
print("done")
