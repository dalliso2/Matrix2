export const TEXT = "TEXT";
export const MULTILINE_TEXT = "MULTILINE_TEXT";
export const PROFILE_IMAGE = "PROFILE_IMAGE";
export const IMAGE_ARRAY = "IMAGE_ARRAY";
export const DATE = "DATE";
export const DATE_RANGE = "DATE_RANGE";
export const DATE_TIME = "DATE_TIME";
export const DATE_TIME_RANGE = "DATE_TIME_RANGE";
export const SELECT = "SELECT";
export const SELECT_MULTIPLE = "SELECT_MULTIPLE";
export const HIDDEN = "HIDDEN";
export const PASSWORD = "PASSWORD";
export const CHECKBOX = "CHECKBOX";
export const SWITCH = "SWITCH";

export const typeDescriptionsMap = new Map([  [TEXT,'Text'],
                                            [MULTILINE_TEXT, 'Multi-line Text'],
                                            [PROFILE_IMAGE,'Profile Image'], 
                                            [IMAGE_ARRAY,'Image Array'],
                                            [DATE,'Date'], 
                                            [DATE_RANGE,'Date Range'], 
                                            [DATE_TIME,'Date/Time'], 
                                            [DATE_TIME_RANGE,'Date/Time Range'],
                                            [SELECT, 'Select'],
                                            [SELECT_MULTIPLE, 'Select Multiple'],
                                            [HIDDEN, 'Hidden'],
                                            [PASSWORD, 'Password'],
                                            [CHECKBOX, 'Checkbox'],
                                            [SWITCH, 'Switch'],
                                        ]);

export const typeDescriptionsObjectArray = [
    { id: TEXT, name: "Text"},
    { id: MULTILINE_TEXT, name: 'Multi-line Text'},
    { id: PROFILE_IMAGE, name: 'Profile Image'},
    { id: IMAGE_ARRAY, name: 'Image Array'},
    { id: DATE, name: 'Date'},
    { id: DATE_RANGE, name: 'Date Range'},
    { id: DATE_TIME, name: 'Date/Time'},
    { id: DATE_TIME_RANGE, name: 'Date/Time Range'},
    { id: SELECT, name: 'Select'},
    { id: SELECT_MULTIPLE, name: 'Select Multiple'},
]