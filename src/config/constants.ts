import { localizePopup, localizationMap } from './localization';

export const RJ_REGEX = new RegExp("(R[JE][0-9]{8})|(R[JE][0-9]{6})|([VB]J[0-9]{8})|([VB]J[0-9]{6})", "gi");
export const URL_REGEX = new RegExp("dlsite.com/.*/product_id/((R[JE][0-9]{8})|(R[JE][0-9]{6})|([VB]J[0-9]{8})|([VB]J[0-9]{6}))", "g");
export const VOICELINK_CLASS = 'voicelink-' + Math.random().toString(36).slice(2);
export const VOICELINK_IGNORED_CLASS = `${VOICELINK_CLASS}_ignored`;
export const RJCODE_ATTRIBUTE = 'rjcode';

export const LANG_MAP = {
    JPN: localizePopup(localizationMap.language_japanese),
    ENG: localizePopup(localizationMap.language_english),
    CHI_HANS: localizePopup(localizationMap.language_simplified_chinese),
    CHI_HANT: localizePopup(localizationMap.language_traditional_chinese),
    KO_KR: localizePopup(localizationMap.language_korean),
    SPA: localizePopup(localizationMap.language_spanish),
    FRE: localizePopup(localizationMap.language_french),
    RUS: localizePopup(localizationMap.language_russian),
    THA: localizePopup(localizationMap.language_thai),
    GER: localizePopup(localizationMap.language_german),
    FIN: localizePopup(localizationMap.language_finnish),
    POR: localizePopup(localizationMap.language_portuguese),
    VIE: localizePopup(localizationMap.language_vietnamese),
    ITA: localizePopup(localizationMap.language_italian),
    ARA: localizePopup(localizationMap.language_arabic),
    POL: localizePopup(localizationMap.language_polish),
};

export const LANG_MAP_ABBR = {
    JPN: localizePopup(localizationMap.language_japanese_abbr),
    ENG: localizePopup(localizationMap.language_english_abbr),
    CHI_HANS: localizePopup(localizationMap.language_simplified_chinese_abbr),
    CHI_HANT: localizePopup(localizationMap.language_traditional_chinese_abbr),
    KO_KR: localizePopup(localizationMap.language_korean_abbr),
    SPA: localizePopup(localizationMap.language_spanish_abbr),
    FRE: localizePopup(localizationMap.language_french_abbr),
    THA: localizePopup(localizationMap.language_thai_abbr),
    GER: localizePopup(localizationMap.language_german_abbr),
    POR: localizePopup(localizationMap.language_portuguese_abbr),
    VIE: localizePopup(localizationMap.language_vietnamese_abbr),
    ITA: localizePopup(localizationMap.language_italian_abbr),
};

export const POPUP_CSS = ``;