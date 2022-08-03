import {
    types,
    Instance,
    flow

} from 'mobx-state-tree';
import { Alert, PermissionsAndroid, ToastAndroid } from 'react-native';
import { RealmController } from './../../database/RealmController';
import TaskSchema from './../../database/TaskSchema';
import LoginSchema from './../../database/LoginSchema';
import CheckListSchema from './../../database/CheckListSchema';
import AllEstablishmentSchema from './../../database/AllEstablishmentSchema';
import EstablishmentSchema from './../../database/EstablishmentSchema';
import checkListModel from './../checkList/checkListModel';
import { Context } from './../../utils/Context';
import NavigationService from './../../services/NavigationService';
export type MyTaskStoreModel = Instance<typeof MyTaskStore>
import {
    fetchGetCampaignChecklistApi, getAccountSyncService, LoginService, fetchSibleReport, getOPAResultApi, fetchNocChecklist, followUpMergeApi, callToVoilationAttachment, updateEstLocation, fetchGetQuestionarieAttachmentApi,
    fetchGetTaskApi, fetchGetChecklistApi, fetchGetBusinessActivity, fetchFoodDisposal, updateFoodAlert, InspectionSubmitService, fetchAcknowldgeApi, fetchGetQuestionarieApi, fetchSupervisoryEstDetails, fetchGetAssessmentAPI
} from './../../services/WebServices';
import FileViewer from 'react-native-file-viewer';
import { writeFile, appendFile, readFile, readFileAssets, DownloadDirectoryPath, mkdir, readDir } from 'react-native-fs';
import { isDev } from '../../config/config';
import submissionPayload, { submissionPayloadFollow } from '../../utils/payloads/ChecklistSubmitPayload';
let realm = RealmController.getRealmInstance();
let moment = require('moment');
let temp1 = RealmController.getAllEstablishments(realm, EstablishmentSchema.name);
let CovidChecklistArray = Array()

function getCovidChecklist(isArabic: boolean) {
    isArabic = true; // as pr said alok
    return ([
        {
            "parameter_score": [
                4,
                1,
                0
            ],
            "parameter_score_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_non_comp_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_reference": "3(1/3)",
            "parameter_EHS_Risk": "FALSE",
            // "parameter": isArabic ? `مخالفة التعليمات الخاصة باستمرار غلق أو أوقات فتح أي مؤسسة تعليمية أو دار من دور السينما والرياضة والملاهي أو المراكز التجارية ومراكز التسوق أو الأسواق المفتوحة أو المحال التجارية بكافة أنواعها وأشكالها أو الحدائق أو المنتزهات أو المقاهي أو المطاعم أو الشواطئ أو مراكز التدريب الرياضي والمسابح العامة ومسابح الفنادق أو ما في حكمها ، أو استقبال زائرين في أي منها بالمخالفة للتعليمات والضوابط المحددة بكل إمارة من إمارات الدولة.` : "Contrary to the instructions for the continued closure or opening times of any educational institution or house of cinemas, sports, amusement parks, shopping malls, open markets, shops of all kinds and forms, parks, cafes, restaurants, beaches, sports training centers, public swimming pools, hotel pools or what is in its ruling, or to receive visitors in any of them in violation of the instructions and controls specified in each emirate of the Uae",
            "parameter": `عدم مراعاة مسافات التباعد`,
            "parameter_weight_mobility": 1,
            "parameter_grace_maximum": 30,
            "MaxGracePeriod": 30,
            "MinGracePeriod": 0,
            "parameter_guidance_rules": `قانون رقم ( 7 )  لسنة 2019
            بإنشاء هيئة أبوظبي للزراعة والسلامة الغذائية  مادة  (4)
            •الهيئة هي السلطة المحلية المختصة بالزراعة والسلامة الغذائية والأمن الغذائي والأمن الحيوي في الإمارة، ((ادناه اهم الاختصاصات ذات العلاقة))
            5-الرقابة والتفتيش على المنشآت والمزارع والعزب في الإمارة وعلى مدخلات  الإنتاج الزراعي في كافة مراحل استخدامه وعلى المواد الغذائية والزراعية المستوردة أو المصدرة أو المنتجة داخل الدولة والمتداولة في الإمارة بما يتضمن الرقابة على متبقيات المبيدات والأدوية البيطرية وذلك وفق التشريعات السارية.
            10-وضع الخطط وبرامج الأمن الحيوي للمحافظة على الصحة الحيوانية والنباتية، والإشراف والرقابة على تنفيذها بالتنسيق مع الجهات المعنية.
            14 -التعاون والتنسيق مع الجهات المعنية بشأن إدراج متطلبات الأمن الغذائي والحيوي ضمن خططهم، وإعداد وتنفيذ الخطط اللازمة لإدارة الحوادث والأزمات والطوارئ المتعلقة باختصاصات الهيئة.      المادة (14) يحظر على أي شخص طبيعي او اعتباري القيام بالآتي: 2- ممارسة أي عمل يؤدي لانتشار الآفات والأوبئة والأمراض بما يخل بمنظومة الأمن الحيوي ويشكل ضرراً على صحة الإنسان أوالحيوان أو النبات `,
            "parameter_type": isArabic ? `مخالفة عدم التقيد بإغلاق المنشآت وإيقاف الرحلات البحرية السياحية` : "Non-compliance with the closure of facilities and the suspension of cruise cruises",
            "parameter_grace_minimum": 0,
            "parameter_subtype": "",
            "parameter_EFST": "",
            "parameter_EHS": "",
            "Answers": "",
            "FinalScore": "",
            "grace": "",
            "color": "#ffffff",
            "gracePeriod": "",
            "guidance": "",
            "Lang": "ENU",
            "covidQuestion": true,
            "parameter_reference_original": `قرار النائب العام (38) لسنة 2020`,
            "parameterno": "",
            "role": "",
            "score": "",
            "Score": "",
            "syncDate": "",
            "TotalscoreForQuestion": "",
            "NA": "N",
            "NAValue": false,
            "NI": "N",
            "NIValue": false,
            "comment": "",
            "Comments": "",
            // "DescriptionEnglish": "Contrary to the instructions for the continued closure or opening times of any educational institution or house of cinemas, sports, amusement parks, shopping malls, open markets, shops of all kinds and forms, parks, cafes, restaurants, beaches, sports training centers, public swimming pools, hotel pools or what is in its ruling, or to receive visitors in any of them in violation of the instructions and controls specified in each emirate of the Uae",
            "ParameterNumber": "3(1/3)",
            "QuestionNameArabic": `مخالفة عدم التقيد بإغلاق المنشآت وإيقاف الرحلات البحرية السياحية`,
            "QuestionNameEnglish": `مخالفة عدم التقيد بإغلاق المنشآت وإيقاف الرحلات البحرية السياحية`,
            // "QuestionNameEnglish": "Non-compliance with the closure of facilities and the suspension of cruise cruises",
            "Weightage": "1",
            "DescriptionArabic": `عدم مراعاة مسافات التباعد`,
            "DescriptionEnglish": `عدم مراعاة مسافات التباعد`,
            // "DescriptionArabic": `مخالفة التعليمات الخاصة باستمرار غلق أو أوقات فتح أي مؤسسة تعليمية أو دار من دور السينما والرياضة والملاهي أو المراكز التجارية ومراكز التسوق أو الأسواق المفتوحة أو المحال التجارية بكافة أنواعها وأشكالها أو الحدائق أو المنتزهات أو المقاهي أو المطاعم أو الشواطئ أو مراكز التدريب الرياضي والمسابح العامة ومسابح الفنادق أو ما في حكمها ، أو استقبال زائرين في أي منها بالمخالفة للتعليمات والضوابط المحددة بكل إمارة من إمارات الدولة.`,
            // "DescriptionEnglish": `مخالفة التعليمات الخاصة باستمرار غلق أو أوقات فتح أي مؤسسة تعليمية أو دار من دور السينما والرياضة والملاهي أو المراكز التجارية ومراكز التسوق أو الأسواق المفتوحة أو المحال التجارية بكافة أنواعها وأشكالها أو الحدائق أو المنتزهات أو المقاهي أو المطاعم أو الشواطئ أو مراكز التدريب الرياضي والمسابح العامة ومسابح الفنادق أو ما في حكمها ، أو استقبال زائرين في أي منها بالمخالفة للتعليمات والضوابط المحددة بكل إمارة من إمارات الدولة.`
        },
        {
            "parameter_score": [
                4,
                1,
                0
            ],
            "parameter_score_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_non_comp_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_reference": "3(2/3)",
            "parameter_EHS_Risk": "FALSE",
            // "parameter": isArabic ? `مخالفة عدم الإلتزام بوضع الكاميرات الحرارية أو إتخاذ أي من الإجراءات أو التدابير الإحترازية أو الضوابط الخاصة التي تقررها الجهات المختصة بكل إمارة من إمارات الدولة، عند فتح أي من المنشآت المذكورة بالبند السابق.` : "Violation of non-compliance with the status of thermal cameras or taking any of the precautionary measures or special controls decided by the competent authorities in each emirate of the Uae, when opening any of the facilities mentioned under the previous clause.",
            "parameter": `عدم الالتزام بالنسبة المحددة بالتعاميم الصادرة من الطاقة الاستيعابية لاستقبال الجمهور في المطاعم والمقاهي`,
            "parameter_weight_mobility": 1,
            "parameter_grace_maximum": 30,
            "MaxGracePeriod": 30,
            "MinGracePeriod": 0,
            "parameter_guidance_rules": `"قانون رقم ( 7 )  لسنة 2019
                بإنشاء هيئة أبوظبي للزراعة والسلامة الغذائية  مادة  (4)
                •الهيئة هي السلطة المحلية المختصة بالزراعة والسلامة الغذائية والأمن الغذائي والأمن الحيوي في الإمارة، ((ادناه اهم الاختصاصات ذات العلاقة))
                5-الرقابة والتفتيش على المنشآت والمزارع والعزب في الإمارة وعلى مدخلات  الإنتاج الزراعي في كافة مراحل استخدامه وعلى المواد الغذائية والزراعية المستوردة أو المصدرة أو المنتجة داخل الدولة والمتداولة في الإمارة بما يتضمن الرقابة على متبقيات المبيدات والأدوية البيطرية وذلك وفق التشريعات السارية.
                10-وضع الخطط وبرامج الأمن الحيوي للمحافظة على الصحة الحيوانية والنباتية، والإشراف والرقابة على تنفيذها بالتنسيق مع الجهات المعنية.
                14 -التعاون والتنسيق مع الجهات المعنية بشأن إدراج متطلبات الأمن الغذائي والحيوي ضمن خططهم، وإعداد وتنفيذ الخطط اللازمة لإدارة الحوادث والأزمات والطوارئ المتعلقة باختصاصات الهيئة.  المادة (14) يحظر على أي شخص طبيعي او اعتباري القيام بالآتي: 2- ممارسة أي عمل يؤدي لانتشار الآفات والأوبئة والأمراض بما يخل بمنظومة الأمن الحيوي ويشكل ضرراً على صحة الإنسان أوالحيوان أو النبات "
                `,
            "parameter_type": isArabic ? `مخالفة عدم التقيد بإغلاق المنشآت وإيقاف الرحلات البحرية السياحية` : "Non-compliance with the closure of facilities and the suspension of cruise cruises",
            "parameter_grace_minimum": 0,
            "parameter_subtype": "",
            "parameter_EFST": "",
            "parameter_EHS": "",
            "Answers": "",
            "FinalScore": "",
            "grace": "",
            "color": "#ffffff",
            "gracePeriod": "",
            "guidance": "",
            "Lang": "ENU",
            "covidQuestion": true,
            "parameter_reference_original": `قرار النائب العام (38) لسنة 2020`,
            "parameterno": "",
            "role": "",
            "score": "",
            "Score": "",
            "syncDate": "",
            "TotalscoreForQuestion": "",
            "NA": "N",
            "NAValue": false,
            "NI": "N",
            "NIValue": false,
            "comment": "",
            "Comments": "",
            // "DescriptionEnglish": "Violation of non-compliance with the status of thermal cameras or taking any of the precautionary measures or special controls decided by the competent authorities in each emirate of the Uae, when opening any of the facilities mentioned under the previous clause.",
            "ParameterNumber": "3(2/3)",
            "QuestionNameArabic": `مخالفة عدم التقيد بإغلاق المنشآت وإيقاف الرحلات البحرية السياحية`,
            "QuestionNameEnglish": `مخالفة عدم التقيد بإغلاق المنشآت وإيقاف الرحلات البحرية السياحية`,
            // "QuestionNameEnglish": "Non-compliance with the closure of facilities and the suspension of cruise cruises",
            "Weightage": "1",
            "DescriptionArabic": `عدم الالتزام بالنسبة المحددة بالتعاميم الصادرة من الطاقة الاستيعابية لاستقبال الجمهور في المطاعم والمقاهي`,
            "DescriptionEnglish": `عدم الالتزام بالنسبة المحددة بالتعاميم الصادرة من الطاقة الاستيعابية لاستقبال الجمهور في المطاعم والمقاهي`,
            // "DescriptionArabic": `مخالفة عدم الإلتزام بوضع الكاميرات الحرارية أو إتخاذ أي من الإجراءات أو التدابير الإحترازية أو الضوابط الخاصة التي تقررها الجهات المختصة بكل إمارة من إمارات الدولة، عند فتح أي من المنشآت المذكورة بالبند السابق.`,
            // "DescriptionEnglish": `مخالفة عدم الإلتزام بوضع الكاميرات الحرارية أو إتخاذ أي من الإجراءات أو التدابير الإحترازية أو الضوابط الخاصة التي تقررها الجهات المختصة بكل إمارة من إمارات الدولة، عند فتح أي من المنشآت المذكورة بالبند السابق.`
        },
        {
            "parameter_score": [
                4,
                1,
                0
            ],
            "parameter_score_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_non_comp_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_reference": "4(4)",
            "parameter_EHS_Risk": "FALSE",
            // "parameter": isArabic ? `مخالفة منع أو تقييد التجمعات أوالاجماعات أو أقامة الاحتفالات الخاصة والعامة أو التجمع أو التواجد في الأماكن العامة أو المزارع الخاصة أو العزب ` : "Violation of the prohibition or restriction of gatherings or gatherings or holding private and public celebrations or gathering or being in public places, private farms or estates.",
            "parameter": `عدم وضع علامات أرضية للالتزام بالتباعد الاجتماعي لتوفير المسافة الآمنة`,
            "parameter_weight_mobility": 1,
            "parameter_grace_maximum": 30,
            "MaxGracePeriod": 30,
            "MinGracePeriod": 0,
            "parameter_guidance_rules": `قانون رقم ( 7 )  لسنة 2019
                بإنشاء هيئة أبوظبي للزراعة والسلامة الغذائية  مادة  (4)
                •الهيئة هي السلطة المحلية المختصة بالزراعة والسلامة الغذائية والأمن الغذائي والأمن الحيوي في الإمارة، ((ادناه اهم الاختصاصات ذات العلاقة))
                5-الرقابة والتفتيش على المنشآت والمزارع والعزب في الإمارة وعلى مدخلات  الإنتاج الزراعي في كافة مراحل استخدامه وعلى المواد الغذائية والزراعية المستوردة أو المصدرة أو المنتجة داخل الدولة والمتداولة في الإمارة بما يتضمن الرقابة على متبقيات المبيدات والأدوية البيطرية وذلك وفق التشريعات السارية.
                10-وضع الخطط وبرامج الأمن الحيوي للمحافظة على الصحة الحيوانية والنباتية، والإشراف والرقابة على تنفيذها بالتنسيق مع الجهات المعنية.
                14 -التعاون والتنسيق مع الجهات المعنية بشأن إدراج متطلبات الأمن الغذائي والحيوي ضمن خططهم، وإعداد وتنفيذ الخطط اللازمة لإدارة الحوادث والأزمات والطوارئ المتعلقة باختصاصات الهيئة.       المادة (14) يحظر على أي شخص طبيعي او اعتباري القيام بالآتي: 2- ممارسة أي عمل يؤدي لانتشار الآفات والأوبئة والأمراض بما يخل بمنظومة الأمن الحيوي ويشكل ضرراً على صحة الإنسان أوالحيوان أو النبات `,
            "parameter_type": isArabic ? `مخالفة منع أو تقييد التجمعات أو الاجتماعات أو اقامة الاحتفالات` : "Violation of the prohibition or restriction of gatherings, meetings or celebrations",
            "parameter_grace_minimum": 0,
            "parameter_subtype": "",
            "parameter_EFST": "",
            "parameter_EHS": "",
            "Answers": "",
            "FinalScore": "",
            "grace": "",
            "color": "#ffffff",
            "gracePeriod": "",
            "guidance": "",
            "Lang": "ENU",
            "covidQuestion": true,
            "parameter_reference_original": `قرار النائب العام (38) لسنة 2020`,
            "parameterno": "",
            "role": "",
            "score": "",
            "Score": "",
            "syncDate": "",
            "TotalscoreForQuestion": "",
            "NA": "N",
            "NAValue": false,
            "NI": "N",
            "NIValue": false,
            "comment": "",
            "Comments": "",
            // "DescriptionEnglish": "Violation of the prohibition or restriction of gatherings or gatherings or holding private and public celebrations or gathering or being in public places, private farms or estates.",
            "ParameterNumber": "4(4)",
            "QuestionNameArabic": `مخالفة منع أو تقييد التجمعات أو الاجتماعات أو اقامة الاحتفالات`,
            "QuestionNameEnglish": `مخالفة منع أو تقييد التجمعات أو الاجتماعات أو اقامة الاحتفالات`,
            // "QuestionNameEnglish": "Violation of the prohibition or restriction of gatherings, meetings or celebrations",
            "Weightage": "1",
            "DescriptionEnglish": `عدم وضع علامات أرضية للالتزام بالتباعد الاجتماعي لتوفير المسافة الآمنة`,
            "DescriptionArabic": `عدم وضع علامات أرضية للالتزام بالتباعد الاجتماعي لتوفير المسافة الآمنة`,
            // "DescriptionArabic": `مخالفة عدم الإلتزام بوضع الكاميرات الحرارية أو إتخاذ أي من الإجراءات أو التدابير الإحترازية أو الضوابط الخاصة التي تقررها الجهات المختصة بكل إمارة من إمارات الدولة، عند فتح أي من المنشآت المذكورة بالبند السابق.`,
            // "DescriptionEnglish": `مخالفة عدم الإلتزام بوضع الكاميرات الحرارية أو إتخاذ أي من الإجراءات أو التدابير الإحترازية أو الضوابط الخاصة التي تقررها الجهات المختصة بكل إمارة من إمارات الدولة، عند فتح أي من المنشآت المذكورة بالبند السابق.`
        },
        {
            "parameter_score": [
                4,
                1,
                0
            ],
            "parameter_score_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_non_comp_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_reference": "6(1/6)",
            "parameter_EHS_Risk": "FALSE",
            // "parameter": isArabic ? `الإمتناع عن إتخاذ الإجراءات الصحية المناسبة بخصوص الأسواق المستثناة من الغلق المؤقت` : "الإمتناع عن إتخاذ الإجراءات الصحية المناسبة بخصوص الأسواق المستثناة من الغلق المؤقت.",
            "parameter": `عدم الالتزام بالملابس الواقية بما في ذلك أغطية الفم ( كمامات ) ، القفازات`,
            "parameter_weight_mobility": 1,
            "parameter_grace_maximum": 30,
            "MaxGracePeriod": 30,
            "MinGracePeriod": 0,
            "parameter_guidance_rules": `قانون رقم ( 7 )  لسنة 2019
                بإنشاء هيئة أبوظبي للزراعة والسلامة الغذائية  مادة  (4)
                •الهيئة هي السلطة المحلية المختصة بالزراعة والسلامة الغذائية والأمن الغذائي والأمن الحيوي في الإمارة، ((ادناه اهم الاختصاصات ذات العلاقة))
                5-الرقابة والتفتيش على المنشآت والمزارع والعزب في الإمارة وعلى مدخلات  الإنتاج الزراعي في كافة مراحل استخدامه وعلى المواد الغذائية والزراعية المستوردة أو المصدرة أو المنتجة داخل الدولة والمتداولة في الإمارة بما يتضمن الرقابة على متبقيات المبيدات والأدوية البيطرية وذلك وفق التشريعات السارية.
                10-وضع الخطط وبرامج الأمن الحيوي للمحافظة على الصحة الحيوانية والنباتية، والإشراف والرقابة على تنفيذها بالتنسيق مع الجهات المعنية.
                14 -التعاون والتنسيق مع الجهات المعنية بشأن إدراج متطلبات الأمن الغذائي والحيوي ضمن خططهم، وإعداد وتنفيذ الخطط اللازمة لإدارة الحوادث والأزمات والطوارئ المتعلقة باختصاصات الهيئة.     المادة (14) يحظر على أي شخص طبيعي او اعتباري القيام بالآتي: 2- ممارسة أي عمل يؤدي لانتشار الآفات والأوبئة والأمراض بما يخل بمنظومة الأمن الحيوي ويشكل ضرراً على صحة الإنسان أوالحيوان أو النبات `,
            "parameter_type": isArabic ? `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا` : `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "parameter_grace_minimum": 0,
            "parameter_subtype": "",
            "parameter_EFST": "",
            "parameter_EHS": "",
            "Answers": "",
            "FinalScore": "",
            "grace": "",
            "color": "#ffffff",
            "gracePeriod": "",
            "guidance": "",
            "Lang": "ENU",
            "covidQuestion": true,
            "parameter_reference_original": `قرار النائب العام (38) لسنة 2020`,
            "parameterno": "",
            "role": "",
            "score": "",
            "Score": "",
            "syncDate": "",
            "TotalscoreForQuestion": "",
            "NA": "N",
            "NAValue": false,
            "NI": "N",
            "NIValue": false,
            "comment": "",
            "Comments": "",
            // "DescriptionEnglish": `الإمتناع عن إتخاذ الإجراءات الصحية المناسبة بخصوص الأسواق المستثناة من الغلق المؤقت`,
            "ParameterNumber": "6(1/6)",
            "QuestionNameArabic": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "QuestionNameEnglish": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            // "QuestionNameEnglish": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "Weightage": "1",
            "DescriptionEnglish": `عدم الالتزام بالملابس الواقية بما في ذلك أغطية الفم ( كمامات ) ، القفازات`,
            "DescriptionArabic": `عدم الالتزام بالملابس الواقية بما في ذلك أغطية الفم ( كمامات ) ، القفازات`,
            // "DescriptionArabic": `الإمتناع عن إتخاذ الإجراءات الصحية المناسبة بخصوص الأسواق المستثناة من الغلق المؤقت`,
            // "DescriptionEnglish": `الإمتناع عن إتخاذ الإجراءات الصحية المناسبة بخصوص الأسواق المستثناة من الغلق المؤقت`,
        },
        {
            "parameter_score": [
                4,
                1,
                0
            ],
            "parameter_score_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_non_comp_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_reference": "6(2/6)",
            "parameter_EHS_Risk": "FALSE",
            // "parameter": isArabic ? `الامتناع عن تنفيذ امر إزالة أي بناء مؤقت أو اتلاف امتعة أو ملابس أو غيرها ثابت ثلوثها أو احتمال تلوثها بأي عامل ممرض دون امكان تطهيرها بالطرق المتبعة ` : `الامتناع عن تنفيذ امر إزالة أي بناء مؤقت أو اتلاف امتعة أو ملابس أو غيرها ثابت ثلوثها أو احتمال تلوثها بأي عامل ممرض دون امكان تطهيرها بالطرق المتبعة `,
            "parameter": `عدم توفير معقمات عند جميع مداخل المنشأة وعند عملية الدفع`,
            "parameter_weight_mobility": 1,
            "parameter_grace_maximum": 30,
            "MaxGracePeriod": 30,
            "MinGracePeriod": 0,
            "parameter_guidance_rules": `قانون رقم ( 7 )  لسنة 2019
                بإنشاء هيئة أبوظبي للزراعة والسلامة الغذائية  مادة  (4)
                •الهيئة هي السلطة المحلية المختصة بالزراعة والسلامة الغذائية والأمن الغذائي والأمن الحيوي في الإمارة، ((ادناه اهم الاختصاصات ذات العلاقة))
                5-الرقابة والتفتيش على المنشآت والمزارع والعزب في الإمارة وعلى مدخلات  الإنتاج الزراعي في كافة مراحل استخدامه وعلى المواد الغذائية والزراعية المستوردة أو المصدرة أو المنتجة داخل الدولة والمتداولة في الإمارة بما يتضمن الرقابة على متبقيات المبيدات والأدوية البيطرية وذلك وفق التشريعات السارية.
                10-وضع الخطط وبرامج الأمن الحيوي للمحافظة على الصحة الحيوانية والنباتية، والإشراف والرقابة على تنفيذها بالتنسيق مع الجهات المعنية.
                14 -التعاون والتنسيق مع الجهات المعنية بشأن إدراج متطلبات الأمن الغذائي والحيوي ضمن خططهم، وإعداد وتنفيذ الخطط اللازمة لإدارة الحوادث والأزمات والطوارئ المتعلقة باختصاصات الهيئة.    المادة (14) يحظر على أي شخص طبيعي او اعتباري القيام بالآتي: 2- ممارسة أي عمل يؤدي لانتشار الآفات والأوبئة والأمراض بما يخل بمنظومة الأمن الحيوي ويشكل ضرراً على صحة الإنسان أوالحيوان أو النبات `,
            "parameter_type": isArabic ? `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا` : `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "parameter_grace_minimum": 0,
            "parameter_subtype": "",
            "parameter_EFST": "",
            "parameter_EHS": "",
            "Answers": "",
            "FinalScore": "",
            "grace": "",
            "color": "#ffffff",
            "gracePeriod": "",
            "guidance": "",
            "Lang": "ENU",
            "parameter_reference_original": `قرار النائب العام (38) لسنة 2020`,
            "parameterno": "",
            "role": "",
            "score": "",
            "Score": "",
            "syncDate": "",
            "covidQuestion": true,
            "TotalscoreForQuestion": "",
            "NA": "N",
            "NAValue": false,
            "NI": "N",
            "NIValue": false,
            "comment": "",
            "Comments": "",
            // "DescriptionEnglish": `الامتناع عن تنفيذ امر إزالة أي بناء مؤقت أو اتلاف امتعة أو ملابس أو غيرها ثابت ثلوثها أو احتمال تلوثها بأي عامل ممرض دون امكان تطهيرها بالطرق المتبعة`,
            "ParameterNumber": "6(2/6)",
            "QuestionNameArabic": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "QuestionNameEnglish": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            // "QuestionNameEnglish": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "Weightage": "1",
            "DescriptionArabic": `عدم توفير معقمات عند جميع مداخل المنشأة وعند عملية الدفع`,
            "DescriptionEnglish": `عدم توفير معقمات عند جميع مداخل المنشأة وعند عملية الدفع`,
            // "DescriptionArabic": `الامتناع عن تنفيذ امر إزالة أي بناء مؤقت أو اتلاف امتعة أو ملابس أو غيرها ثابت ثلوثها أو احتمال تلوثها بأي عامل ممرض دون امكان تطهيرها بالطرق المتبعة`,
            // "DescriptionEnglish": `الامتناع عن تنفيذ امر إزالة أي بناء مؤقت أو اتلاف امتعة أو ملابس أو غيرها ثابت ثلوثها أو احتمال تلوثها بأي عامل ممرض دون امكان تطهيرها بالطرق المتبعة`,
        },
        {
            "parameter_score": [
                4,
                1,
                0
            ],
            "parameter_score_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_non_comp_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_reference": "6(4/6)",
            "parameter_EHS_Risk": "FALSE",
            // "parameter": isArabic ? `مخالفة التعليمات الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والخاصة بشروط التنظيف وتعقيم المعدات والأجهزة والآلآت داخل المنشآت ، أو المعدات والأدوات الملامسة للغذاء.` : `مخالفة التعليمات الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والخاصة بشروط التنظيف وتعقيم المعدات والأجهزة والآلآت داخل المنشآت ، أو المعدات والأدوات الملامسة للغذاء.`,
            "parameter": `عدم الالتزام بتنظيف وتعقيم عربات التسوق بشكل مستمر`,
            "parameter_weight_mobility": 1,
            "parameter_grace_maximum": 30,
            "MaxGracePeriod": 30,
            "MinGracePeriod": 0,
            "parameter_guidance_rules": `قانون رقم ( 7 )  لسنة 2019
                بإنشاء هيئة أبوظبي للزراعة والسلامة الغذائية  مادة  (4)
                •الهيئة هي السلطة المحلية المختصة بالزراعة والسلامة الغذائية والأمن الغذائي والأمن الحيوي في الإمارة، ((ادناه اهم الاختصاصات ذات العلاقة))
                5-الرقابة والتفتيش على المنشآت والمزارع والعزب في الإمارة وعلى مدخلات  الإنتاج الزراعي في كافة مراحل استخدامه وعلى المواد الغذائية والزراعية المستوردة أو المصدرة أو المنتجة داخل الدولة والمتداولة في الإمارة بما يتضمن الرقابة على متبقيات المبيدات والأدوية البيطرية وذلك وفق التشريعات السارية.
                10-وضع الخطط وبرامج الأمن الحيوي للمحافظة على الصحة الحيوانية والنباتية، والإشراف والرقابة على تنفيذها بالتنسيق مع الجهات المعنية.
                14 -التعاون والتنسيق مع الجهات المعنية بشأن إدراج متطلبات الأمن الغذائي والحيوي ضمن خططهم، وإعداد وتنفيذ الخطط اللازمة لإدارة الحوادث والأزمات والطوارئ المتعلقة باختصاصات الهيئة.    المادة (14) يحظر على أي شخص طبيعي او اعتباري القيام بالآتي: 2- ممارسة أي عمل يؤدي لانتشار الآفات والأوبئة والأمراض بما يخل بمنظومة الأمن الحيوي ويشكل ضرراً على صحة الإنسان أوالحيوان أو النبات `,
            "parameter_type": isArabic ? `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا` : `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "parameter_grace_minimum": 0,
            "parameter_subtype": "",
            "parameter_EFST": "",
            "parameter_EHS": "",
            "Answers": "",
            "FinalScore": "",
            "grace": "",
            "color": "#ffffff",
            "gracePeriod": "",
            "guidance": "",
            "Lang": "ENU",
            "parameter_reference_original": `قرار النائب العام (38) لسنة 2020`,
            "parameterno": "",
            "role": "",
            "score": "",
            "Score": "",
            "syncDate": "",
            "covidQuestion": true,
            "TotalscoreForQuestion": "",
            "NA": "N",
            "NAValue": false,
            "NI": "N",
            "NIValue": false,
            "comment": "",
            "Comments": "",
            // "DescriptionEnglish": `مخالفة التعليمات الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والخاصة بشروط التنظيف وتعقيم المعدات والأجهزة والآلآت داخل المنشآت ، أو المعدات والأدوات الملامسة للغذاء.`,
            "ParameterNumber": "6(4/6)",
            "QuestionNameArabic": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "QuestionNameEnglish": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "Weightage": "1",
            "DescriptionEnglish": `عدم الالتزام بتنظيف وتعقيم عربات التسوق بشكل مستمر`,
            "DescriptionArabic": `عدم الالتزام بتنظيف وتعقيم عربات التسوق بشكل مستمر`,
            // "DescriptionArabic": `مخالفة التعليمات الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والخاصة بشروط التنظيف وتعقيم المعدات والأجهزة والآلآت داخل المنشآت ، أو المعدات والأدوات الملامسة للغذاء.`,
        },
        {
            "parameter_score": [
                4,
                1,
                0
            ],
            "parameter_score_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_non_comp_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_reference": "6(5/6)",
            "parameter_EHS_Risk": "FALSE",
            // "parameter": isArabic ? `مخالفة التعليمات الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والمتعلقة بالممارسات الصحية والنظافة الشخصية للعاملين داخل المنشآت أو اماكن السكن المشترك للفئات العمالية` : `مخالفة التعليمات الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والمتعلقة بالممارسات الصحية والنظافة الشخصية للعاملين داخل المنشآت أو اماكن السكن المشترك للفئات العمالية.`,
            "parameter": `عدم الالتزام بفحص حرارة جميع الداخلين بما فيهم الموظفون والعمال عند دخول المنشأة الغذائية`,
            "parameter_weight_mobility": 1,
            "parameter_grace_maximum": 30,
            "MaxGracePeriod": 30,
            "MinGracePeriod": 0,
            "parameter_guidance_rules": `قانون رقم ( 7 )  لسنة 2019
                بإنشاء هيئة أبوظبي للزراعة والسلامة الغذائية  مادة  (4)
                •الهيئة هي السلطة المحلية المختصة بالزراعة والسلامة الغذائية والأمن الغذائي والأمن الحيوي في الإمارة، ((ادناه اهم الاختصاصات ذات العلاقة))
                5-الرقابة والتفتيش على المنشآت والمزارع والعزب في الإمارة وعلى مدخلات  الإنتاج الزراعي في كافة مراحل استخدامه وعلى المواد الغذائية والزراعية المستوردة أو المصدرة أو المنتجة داخل الدولة والمتداولة في الإمارة بما يتضمن الرقابة على متبقيات المبيدات والأدوية البيطرية وذلك وفق التشريعات السارية.
                10-وضع الخطط وبرامج الأمن الحيوي للمحافظة على الصحة الحيوانية والنباتية، والإشراف والرقابة على تنفيذها بالتنسيق مع الجهات المعنية.
                14 -التعاون والتنسيق مع الجهات المعنية بشأن إدراج متطلبات الأمن الغذائي والحيوي ضمن خططهم، وإعداد وتنفيذ الخطط اللازمة لإدارة الحوادث والأزمات والطوارئ المتعلقة باختصاصات الهيئة.   المادة (14) يحظر على أي شخص طبيعي او اعتباري القيام بالآتي: 2- ممارسة أي عمل يؤدي لانتشار الآفات والأوبئة والأمراض بما يخل بمنظومة الأمن الحيوي ويشكل ضرراً على صحة الإنسان أوالحيوان أو النبات `,
            "parameter_type": isArabic ? `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا` : `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "parameter_grace_minimum": 0,
            "parameter_subtype": "",
            "parameter_EFST": "",
            "parameter_EHS": "",
            "Answers": "",
            "FinalScore": "",
            "grace": "",
            "color": "#ffffff",
            "gracePeriod": "",
            "guidance": "",
            "Lang": "ENU",
            "parameter_reference_original": `قرار النائب العام (38) لسنة 2020`,
            "parameterno": "",
            "role": "",
            "score": "",
            "Score": "",
            "syncDate": "",
            "covidQuestion": true,
            "TotalscoreForQuestion": "",
            "NA": "N",
            "NAValue": false,
            "NI": "N",
            "NIValue": false,
            "comment": "",
            "Comments": "",
            // "DescriptionEnglish": `مخالفة التعليمات الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والمتعلقة بالممارسات الصحية والنظافة الشخصية للعاملين داخل المنشآت أو اماكن السكن المشترك للفئات العمالية.`,
            "ParameterNumber": "6(5/6)",
            "QuestionNameArabic": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "QuestionNameEnglish": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "Weightage": "1",
            "DescriptionEnglish": `عدم الالتزام بفحص حرارة جميع الداخلين بما فيهم الموظفون والعمال عند دخول المنشأة الغذائية`,
            "DescriptionArabic": `عدم الالتزام بفحص حرارة جميع الداخلين بما فيهم الموظفون والعمال عند دخول المنشأة الغذائية`,
            // "DescriptionArabic": `مخالفة التعليمات الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والمتعلقة بالممارسات الصحية والنظافة الشخصية للعاملين داخل المنشآت أو اماكن السكن المشترك للفئات العمالية.`,
        },
        {
            "parameter_score": [
                4,
                1,
                0
            ],
            "parameter_score_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_non_comp_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_reference": "6(6/6)",
            "parameter_EHS_Risk": "FALSE",
            // "parameter": isArabic ? `مخالفة التعليمات الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة  والخاصة بأستخدام المواد الكيميائية ( مواد التنظيف والتعقيم والتطهير والمبيدات ) أو نوعية المواد المستخدمة.` : `مخالفة التعليمات الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة  والخاصة بأستخدام المواد الكيميائية ( مواد التنظيف والتعقيم والتطهير والمبيدات ) أو نوعية المواد المستخدمة.`,
            "parameter": `عدم الالتزام بإجراء فحص طبي PCR بصفة أسبوعية، ويستثني من ذلك الحاصلين على التطعيم الطارئ والمتطوعين في التجارب السريرية ممن تظهر لديهم علامة النجمة أو حرف الE في تطبيق الحصن`,
            "parameter_weight_mobility": 1,
            "parameter_grace_maximum": 30,
            "MaxGracePeriod": 30,
            "MinGracePeriod": 0,
            "parameter_guidance_rules": `قانون رقم ( 7 )  لسنة 2019
                بإنشاء هيئة أبوظبي للزراعة والسلامة الغذائية  مادة  (4)
                •الهيئة هي السلطة المحلية المختصة بالزراعة والسلامة الغذائية والأمن الغذائي والأمن الحيوي في الإمارة، ((ادناه اهم الاختصاصات ذات العلاقة))
                5-الرقابة والتفتيش على المنشآت والمزارع والعزب في الإمارة وعلى مدخلات  الإنتاج الزراعي في كافة مراحل استخدامه وعلى المواد الغذائية والزراعية المستوردة أو المصدرة أو المنتجة داخل الدولة والمتداولة في الإمارة بما يتضمن الرقابة على متبقيات المبيدات والأدوية البيطرية وذلك وفق التشريعات السارية.
                10-وضع الخطط وبرامج الأمن الحيوي للمحافظة على الصحة الحيوانية والنباتية، والإشراف والرقابة على تنفيذها بالتنسيق مع الجهات المعنية.
                14 -التعاون والتنسيق مع الجهات المعنية بشأن إدراج متطلبات الأمن الغذائي والحيوي ضمن خططهم، وإعداد وتنفيذ الخطط اللازمة لإدارة الحوادث والأزمات والطوارئ المتعلقة باختصاصات الهيئة. المادة (14) يحظر على أي شخص طبيعي او اعتباري القيام بالآتي: 2- ممارسة أي عمل يؤدي لانتشار الآفات والأوبئة والأمراض بما يخل بمنظومة الأمن الحيوي ويشكل ضرراً على صحة الإنسان أوالحيوان أو النبات `,
            "parameter_type": isArabic ? `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا` : `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "parameter_grace_minimum": 0,
            "parameter_subtype": "",
            "parameter_EFST": "",
            "parameter_EHS": "",
            "Answers": "",
            "FinalScore": "",
            "grace": "",
            "color": "#ffffff",
            "gracePeriod": "",
            "guidance": "",
            "Lang": "ENU",
            "parameter_reference_original": `قرار النائب العام (38) لسنة 2020`,
            "parameterno": "",
            "role": "",
            "score": "",
            "Score": "",
            "syncDate": "",
            "covidQuestion": true,
            "TotalscoreForQuestion": "",
            "NA": "N",
            "NAValue": false,
            "NI": "N",
            "NIValue": false,
            "comment": "",
            "Comments": "",
            // "DescriptionEnglish": `مخالفة التعليمات الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة  والخاصة بأستخدام المواد الكيميائية ( مواد التنظيف والتعقيم والتطهير والمبيدات ) أو نوعية المواد المستخدمة`,
            "ParameterNumber": "6(6/6)",
            "QuestionNameArabic": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "QuestionNameEnglish": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "Weightage": "1",
            "DescriptionEnglish": `عدم الالتزام بإجراء فحص طبي PCR بصفة أسبوعية، ويستثني من ذلك الحاصلين على التطعيم الطارئ والمتطوعين في التجارب السريرية ممن تظهر لديهم علامة النجمة أو حرف الE في تطبيق الحصن`,
            "DescriptionArabic": `عدم الالتزام بإجراء فحص طبي PCR بصفة أسبوعية، ويستثني من ذلك الحاصلين على التطعيم الطارئ والمتطوعين في التجارب السريرية ممن تظهر لديهم علامة النجمة أو حرف الE في تطبيق الحصن`,
            // "DescriptionArabic": `مخالفة التعليمات الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة  والخاصة بأستخدام المواد الكيميائية ( مواد التنظيف والتعقيم والتطهير والمبيدات ) أو نوعية المواد المستخدمة`,
        },
        {
            "parameter_score": [
                4,
                1,
                0
            ],
            "parameter_score_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_non_comp_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_reference": "6(7/6)",
            "parameter_EHS_Risk": "FALSE",
            // "parameter": isArabic ? `مخالفة التعليمات الصحية أو الوقائية الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والخاصة بعرض أو نقل أو تخزين المواد الغذائية أو الصحية أو البيطرية أو الدوائية أو مواد التجميل أو المبيدات أوغيرها.` : `مخالفة التعليمات الصحية أو الوقائية الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والخاصة بعرض أو نقل أو تخزين المواد الغذائية أو الصحية أو البيطرية أو الدوائية أو مواد التجميل أو المبيدات أوغيرها.`,
            "parameter": `عدم الالتزام باستعمال  أدوات المائدة المصممة للاستخدام لمرة واحدة ، إلا في حال وجود أجهزة غسيل الصحون الحرارية`,
            "parameter_weight_mobility": 1,
            "parameter_grace_maximum": 30,
            "MaxGracePeriod": 30,
            "MinGracePeriod": 0,
            "parameter_guidance_rules": `قانون رقم ( 7 )  لسنة 2019
                بإنشاء هيئة أبوظبي للزراعة والسلامة الغذائية  مادة  (4)
                •الهيئة هي السلطة المحلية المختصة بالزراعة والسلامة الغذائية والأمن الغذائي والأمن الحيوي في الإمارة، ((ادناه اهم الاختصاصات ذات العلاقة))
                5-الرقابة والتفتيش على المنشآت والمزارع والعزب في الإمارة وعلى مدخلات  الإنتاج الزراعي في كافة مراحل استخدامه وعلى المواد الغذائية والزراعية المستوردة أو المصدرة أو المنتجة داخل الدولة والمتداولة في الإمارة بما يتضمن الرقابة على متبقيات المبيدات والأدوية البيطرية وذلك وفق التشريعات السارية.
                10-وضع الخطط وبرامج الأمن الحيوي للمحافظة على الصحة الحيوانية والنباتية، والإشراف والرقابة على تنفيذها بالتنسيق مع الجهات المعنية.
                14 -التعاون والتنسيق مع الجهات المعنية بشأن إدراج متطلبات الأمن الغذائي والحيوي ضمن خططهم، وإعداد وتنفيذ الخطط اللازمة لإدارة الحوادث والأزمات والطوارئ المتعلقة باختصاصات الهيئة.    المادة (14) يحظر على أي شخص طبيعي او اعتباري القيام بالآتي: 2- ممارسة أي عمل يؤدي لانتشار الآفات والأوبئة والأمراض بما يخل بمنظومة الأمن الحيوي ويشكل ضرراً على صحة الإنسان أوالحيوان أو النبات `,
            "parameter_type": isArabic ? `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا` : `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "parameter_grace_minimum": 0,
            "parameter_subtype": "",
            "parameter_EFST": "",
            "parameter_EHS": "",
            "Answers": "",
            "FinalScore": "",
            "grace": "",
            "color": "#ffffff",
            "gracePeriod": "",
            "guidance": "",
            "Lang": "ENU",
            "parameter_reference_original": `قرار النائب العام (38) لسنة 2020`,
            "parameterno": "",
            "role": "",
            "score": "",
            "Score": "",
            "syncDate": "",
            "covidQuestion": true,
            "TotalscoreForQuestion": "",
            "NA": "N",
            "NAValue": false,
            "NI": "N",
            "NIValue": false,
            "comment": "",
            "Comments": "",
            // "DescriptionEnglish": `خالفة التعليمات الصحية أو الوقائية الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والخاصة بعرض أو نقل أو تخزين المواد الغذائية أو الصحية أو البيطرية أو الدوائية أو مواد التجميل أو المبيدات أوغيرها`,
            "ParameterNumber": "6(7/6)",
            "QuestionNameArabic": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "QuestionNameEnglish": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "Weightage": "1",
            "DescriptionEnglish": `عدم الالتزام باستعمال  أدوات المائدة المصممة للاستخدام لمرة واحدة ، إلا في حال وجود أجهزة غسيل الصحون الحرارية`,
            "DescriptionArabic": `عدم الالتزام باستعمال  أدوات المائدة المصممة للاستخدام لمرة واحدة ، إلا في حال وجود أجهزة غسيل الصحون الحرارية`,
            // "DescriptionArabic": `خالفة التعليمات الصحية أو الوقائية الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والخاصة بعرض أو نقل أو تخزين المواد الغذائية أو الصحية أو البيطرية أو الدوائية أو مواد التجميل أو المبيدات أوغيرها`,
        },
        {
            "parameter_score": [
                4,
                1,
                0
            ],
            "parameter_score_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_non_comp_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_reference": "6(8/6)",
            "parameter_EHS_Risk": "FALSE",
            // "parameter": isArabic ? `مخالفة أي من القرارات أو التعليمات الصادرة  من الجهات المعنية بكل  إمارة من إمارات الدولة بالحفاظ على الصحة والسلامة والوقاية من انتشار الأمراض السارية.` : `مخالفة أي من القرارات أو التعليمات الصادرة  من الجهات المعنية بكل  إمارة من إمارات الدولة بالحفاظ على الصحة والسلامة والوقاية من انتشار الأمراض السارية.`,
            "parameter": `عدم التقيد بإغلاق المنشأة الغذائية `,
            "parameter_weight_mobility": 1,
            "parameter_grace_maximum": 30,
            "MaxGracePeriod": 30,
            "MinGracePeriod": 0,
            "parameter_guidance_rules": `قانون رقم ( 7 )  لسنة 2019 
                بإنشاء هيئة أبوظبي للزراعة والسلامة الغذائية  مادة  (4)
                •الهيئة هي السلطة المحلية المختصة بالزراعة والسلامة الغذائية والأمن الغذائي والأمن الحيوي في الإمارة، ((ادناه اهم الاختصاصات ذات العلاقة))
                5-الرقابة والتفتيش على المنشآت والمزارع والعزب في الإمارة وعلى مدخلات  الإنتاج الزراعي في كافة مراحل استخدامه وعلى المواد الغذائية والزراعية المستوردة أو المصدرة أو المنتجة داخل الدولة والمتداولة في الإمارة بما يتضمن الرقابة على متبقيات المبيدات والأدوية البيطرية وذلك وفق التشريعات السارية.
                10-وضع الخطط وبرامج الأمن الحيوي للمحافظة على الصحة الحيوانية والنباتية، والإشراف والرقابة على تنفيذها بالتنسيق مع الجهات المعنية.
                14 -التعاون والتنسيق مع الجهات المعنية بشأن إدراج متطلبات الأمن الغذائي والحيوي ضمن خططهم، وإعداد وتنفيذ الخطط اللازمة لإدارة الحوادث والأزمات والطوارئ المتعلقة باختصاصات الهيئة.    المادة (14) يحظر على أي شخص طبيعي او اعتباري القيام بالآتي: 2- ممارسة أي عمل يؤدي لانتشار الآفات والأوبئة والأمراض بما يخل بمنظومة الأمن الحيوي ويشكل ضرراً على صحة الإنسان أوالحيوان أو النبات `,
            "parameter_type": isArabic ? `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا` : `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "parameter_grace_minimum": 0,
            "parameter_subtype": "",
            "parameter_EFST": "",
            "parameter_EHS": "",
            "Answers": "",
            "FinalScore": "",
            "grace": "",
            "color": "#ffffff",
            "gracePeriod": "",
            "guidance": "",
            "Lang": "ENU",
            "parameter_reference_original": `قرار النائب العام (38) لسنة 2020`,
            "parameterno": "",
            "role": "",
            "score": "",
            "Score": "",
            "syncDate": "",
            "covidQuestion": true,
            "TotalscoreForQuestion": "",
            "NA": "N",
            "NAValue": false,
            "NI": "N",
            "NIValue": false,
            "comment": "",
            "Comments": "",
            // "DescriptionEnglish": `خالفة التعليمات الصحية أو الوقائية الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والخاصة بعرض أو نقل أو تخزين المواد الغذائية أو الصحية أو البيطرية أو الدوائية أو مواد التجميل أو المبيدات أوغيرها`,
            "ParameterNumber": "6(8/6)",
            "QuestionNameArabic": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "QuestionNameEnglish": `مخالفة الإمتناع عن إتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا`,
            "Weightage": "1",
            "DescriptionEnglish": `عدم التقيد بإغلاق المنشأة الغذائية `,
            "DescriptionArabic": `عدم التقيد بإغلاق المنشأة الغذائية `,
            // "DescriptionArabic": `خالفة التعليمات الصحية أو الوقائية الصادرة من الجهات المعنية بكل إمارة من إمارات الدولة والخاصة بعرض أو نقل أو تخزين المواد الغذائية أو الصحية أو البيطرية أو الدوائية أو مواد التجميل أو المبيدات أوغيرها`,
        },
        {
            "parameter_score": [
                4,
                1,
                0
            ],
            "parameter_score_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_non_comp_desc": [
                "Satisfactory",
                "Final Warning",
                "Violation"
            ],
            "parameter_reference": "11(3/11)",
            "parameter_EHS_Risk": "FALSE",
            // "parameter": isArabic ? `مخالفة عدم إتخاذ الإجراءات اللازمة لمراعاة مسافة التباعد أو السماح بالإكتظاظ والإزدحام داخل المراكز التجارية ومراكز التسوق أو المحال التجارية بكافة أنواعها وأشكالها أو المقاهي أو المطاعم أو الشواطئ أو مراكز التدريب الرياضي والمسابح العامة ومسابح الفنادق أو ما في حكمها.` : `مخالفة عدم إتخاذ الإجراءات اللازمة لمراعاة مسافة التباعد أو السماح بالإكتظاظ والإزدحام داخل المراكز التجارية ومراكز التسوق أو المحال التجارية بكافة أنواعها وأشكالها أو المقاهي أو المطاعم أو الشواطئ أو مراكز التدريب الرياضي والمسابح العامة ومسابح الفنادق أو ما في حكمها.`,
            "parameter": `الامتناع عن اتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا المستجد (كوفيد 19)`,
            "parameter_weight_mobility": 1,
            "parameter_grace_maximum": 30,
            "MaxGracePeriod": 30,
            "MinGracePeriod": 0,
            "parameter_guidance_rules": `قانون رقم ( 7 )  لسنة 2019
                بإنشاء هيئة أبوظبي للزراعة والسلامة الغذائية  مادة  (4)
                •الهيئة هي السلطة المحلية المختصة بالزراعة والسلامة الغذائية والأمن الغذائي والأمن الحيوي في الإمارة، ((ادناه اهم الاختصاصات ذات العلاقة))
                5-الرقابة والتفتيش على المنشآت والمزارع والعزب في الإمارة وعلى مدخلات  الإنتاج الزراعي في كافة مراحل استخدامه وعلى المواد الغذائية والزراعية المستوردة أو المصدرة أو المنتجة داخل الدولة والمتداولة في الإمارة بما يتضمن الرقابة على متبقيات المبيدات والأدوية البيطرية وذلك وفق التشريعات السارية.
                10-وضع الخطط وبرامج الأمن الحيوي للمحافظة على الصحة الحيوانية والنباتية، والإشراف والرقابة على تنفيذها بالتنسيق مع الجهات المعنية.
                14 -التعاون والتنسيق مع الجهات المعنية بشأن إدراج متطلبات الأمن الغذائي والحيوي ضمن خططهم، وإعداد وتنفيذ الخطط اللازمة لإدارة الحوادث والأزمات والطوارئ المتعلقة باختصاصات الهيئة.      المادة (14) يحظر على أي شخص طبيعي او اعتباري القيام بالآتي: 2- ممارسة أي عمل يؤدي لانتشار الآفات والأوبئة والأمراض بما يخل بمنظومة الأمن الحيوي ويشكل ضرراً على صحة الإنسان أوالحيوان أو النبات `,
            "parameter_type": isArabic ? `مخالفات عدم ارتداء الكمامات أو عدم مراعاة مسافات التباعد` : `مخالفات عدم ارتداء الكمامات أو عدم مراعاة مسافات التباعد`,
            "parameter_grace_minimum": 0,
            "parameter_subtype": "",
            "parameter_EFST": "",
            "parameter_EHS": "",
            "Answers": "",
            "FinalScore": "",
            "grace": "",
            "color": "#ffffff",
            "gracePeriod": "",
            "guidance": "",
            "Lang": "ENU",
            "parameter_reference_original": `قرار النائب العام (38) لسنة 2020`,
            "parameterno": "",
            "role": "",
            "score": "",
            "Score": "",
            "syncDate": "",
            "covidQuestion": true,
            "TotalscoreForQuestion": "",
            "NA": "N",
            "NAValue": false,
            "NI": "N",
            "NIValue": false,
            "comment": "",
            "Comments": "",
            // "DescriptionEnglish": `مخالفة عدم إتخاذ الإجراءات اللازمة لمراعاة مسافة التباعد أو السماح بالإكتظاظ والإزدحام داخل المراكز التجارية ومراكز التسوق أو المحال التجارية بكافة أنواعها وأشكالها أو المقاهي أو المطاعم أو الشواطئ أو مراكز التدريب الرياضي والمسابح العامة ومسابح الفنادق أو ما في حكمها`,
            "ParameterNumber": "11(3/11)",
            "QuestionNameArabic": `مخالفات عدم ارتداء الكمامات أو عدم مراعاة مسافات التباعد`,
            "QuestionNameEnglish": `مخالفات عدم ارتداء الكمامات أو عدم مراعاة مسافات التباعد`,
            "Weightage": "1",
            "DescriptionEnglish": `الامتناع عن اتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا المستجد (كوفيد 19)`,
            "DescriptionArabic": `الامتناع عن اتخاذ الإجراءات الصحية المناسبة للوقاية من فيروس كورونا المستجد (كوفيد 19)`,
            // "DescriptionArabic": `مخالفة عدم إتخاذ الإجراءات اللازمة لمراعاة مسافة التباعد أو السماح بالإكتظاظ والإزدحام داخل المراكز التجارية ومراكز التسوق أو المحال التجارية بكافة أنواعها وأشكالها أو المقاهي أو المطاعم أو الشواطئ أو مراكز التدريب الرياضي والمسابح العامة ومسابح الفنادق أو ما في حكمها`,
        }
    ]
    )
}

const MyTaskStore = types.model('MyTaskModel', {

    failedAttachmentArray: types.string,
    voilationFailedAttachmentArray: types.string,
    campaignMappingData: types.string,
    retryCount: types.string,
    taskSubmitted: types.boolean,
    createAdhoc: types.boolean,
    attachmentSubmittedFailed: types.boolean,
    foodalertSampling: types.boolean,
    isOnline: types.boolean,
    historyChecklist: types.boolean,
    alertObject: types.string,
    scoreFollow: types.string,
    myTaskResponse: types.string,
    selectedTask: types.string,
    checkListArray: types.string,
    noCheckList: types.string,
    count: types.string,
    isMyTaskClick: types.string,
    getTaskApiResponse: types.string,
    notCompletedTasksFormDb: types.string,
    getChecklistResponse: types.string,
    getBusinessActivityResponse: types.string,
    businessActivityArray: types.string,
    subBusinessActivityArray: types.string,
    getAcknowldgeResponse: types.string,
    getQuestionarieResponse: types.string,
    getCampaignChecklistResponse: types.string,
    campaignList: types.string,
    surveyList: types.string,
    NOCList: types.string,
    complaintAndFoodPosioningList: types.string,
    eventsList: types.string,
    farmTaskArray: types.string,
    directFarmArray: types.string,
    dataArray: types.string,
    dataArray1: types.string,
    campaignListPast: types.string,
    surveyListPast: types.string,
    NOCListPast: types.string,
    complaintAndFoodPosioningListPast: types.string,
    eventsListPast: types.string,
    farmTaskArrayPast: types.string,
    directFarmArrayPast: types.string,
    dataArrayPast: types.string,
    dataArray1Past: types.string,
    desc: types.string,
    contactName: types.string,
    mobileNumber: types.string,
    emiratesId: types.string,
    result: types.string,
    finalComment: types.string,
    taskId: types.string,
    campaignChecklistTaskId: types.string,
    isCompletedOfflineList: types.string,
    estListArray: types.string,
    myTaskCount: types.string,
    licenseCount: types.string,
    caseCount: types.string,
    campaignCount: types.string,
    tempPermit: types.string,
    evidanceAttachment1: types.string,
    evidanceAttachment2: types.string,
    licencesAttachment1: types.string,
    licencesAttachment2: types.string,
    EmiratesIdAttachment1: types.string,
    EmiratesIdAttachment2: types.string,
    evidanceAttachment1Url: types.string,
    evidanceAttachment2Url: types.string,
    licencesAttachment1Url: types.string,
    licencesAttachment2Url: types.string,
    EmiratesIdAttachment1Url: types.string,
    EmiratesIdAttachment2Url: types.string,
    latitude: types.string,
    longitude: types.string,
    isPostPoned: types.boolean,
    isSuccess: false,
    flashlightCBValue: types.boolean,
    dataLoggerCBValue: types.boolean,
    luxmeterCBValue: types.boolean,
    thermometerCBValue: types.boolean,
    UVlightCBValue: types.boolean,
    campaignTaskId: types.string,
    getSupervisoryEstResponse: types.string,
    visitType: types.string,
    scope: types.string,
    noOfVisits: types.string,
    isAlertApplicable: types.boolean,
    efstUpdate: types.boolean,
    isAlertApplicableNoToAll: types.boolean,
    otherValue: types.string,
    otherTextValue: types.string,
    totalScore: types.string,
    grade: types.string,
    nextVisit: types.string,
    percentage: types.string,
    maxscore: types.string,
    score: types.string,
    getChecklistAssessmentResponse: types.string,
    tableNameList: types.string,
    campaignSelectedEstIndex: types.string,
    rescheduledTaskList: types.string,
    acknowledgeState: types.enumeration("State", ["pending", "done", "error", 'acknowledgeSuccess']),
    state: types.enumeration("State", ["pending", "done", "error", "failedToSubmit", "navigate", "submitSuccess", 'getBASuccess', 'getChecklistSuccess', 'acknowledgeSuccess', 'submitInspection', 'getQuestionarieSuccess', 'getCampaignChecklistSuccess', 'getSupervisoryQuestionarieSuccess', 'getAssessmentSuccess']),
    mergeState: types.enumeration("State", ["", "pending", "done", "error", "navigate"]),
    bastate: types.enumeration("State", ["pending", "done", "error", 'getBASuccess']),
    checkliststate: types.enumeration("State", ["", "checklistLength", "checklistNoLength"]),
    loadingState: types.enumeration("loadingState", ['', 'Fetching Inspections Data', 'Merging Tasks', 'Fetching Tasks', 'Fetching Result from OPA', 'Fetching Missing EstblishmentDetails', 'Fetching BA', 'Fetching Checklist', 'Acknowledging Task', 'Stay on this page until submission is completed', 'Submitting Attachments', 'Getting Questionarie', 'Reporting Task', 'Getting Campaign Checklist', 'Getting Supervisory Questionarie', 'Fetching Contact List', 'Getting Bazar Checklist', 'Updating Establishment Location'])
}).actions(self => ({

    setCampaignSelectedEstIndex(campaignSelectedEstIndex: string) {
        self.campaignSelectedEstIndex = campaignSelectedEstIndex
    },
    setcheckliststate(data: string) {
        self.checkliststate = data;
    },
    setMergestate(data: string) {
        self.mergeState = data;
    },
    setFailedAttachmentArray(data: string) {
        self.failedAttachmentArray = data;
    },
    setVoilationFailedAttachmentArray(data: string) {
        self.voilationFailedAttachmentArray = data;
    },
    setCampaignMappingData(campaignMappingData: string) {
        self.campaignMappingData = campaignMappingData
    },
    setTaskSubmited(data: boolean) {
        self.taskSubmitted = data
    },
    setEfstUpdate(data: boolean) {
        self.efstUpdate = data
    },
    setAttachmentSubmittedFailed(data: boolean) {
        self.attachmentSubmittedFailed = data
    },
    setIsAlertApplicableToCurrentEst(isAlertApplicable: boolean) {
        self.isAlertApplicable = isAlertApplicable
    },
    setRetryCount(count: string) {
        self.retryCount = count
    },
    setTempPermitCount(count: string) {
        self.tempPermit = count
    },
    setBusinessActivityArray(data: string) {
        self.businessActivityArray = data
    },
    setIsAlertApplicableNoToCurrentEst(isAlertApplicableNoToAll: boolean) {
        self.isAlertApplicableNoToAll = isAlertApplicableNoToAll
    },
    setAcknowledgeState(state: string) {
        self.acknowledgeState = state
    },
    setNextVisit(nextVisit: string) {
        self.nextVisit = nextVisit
    },
    setHistoryChecklist(data: boolean) {
        self.historyChecklist = data
    },
    setMyTaskResponse(isAlertApplicable: string) {
        self.getTaskApiResponse = isAlertApplicable
    },
    setTotalScore(data: string) {
        self.totalScore = data
    },
    setMaxScore(data: string) {
        self.maxscore = data
    },
    setScore(data: string) {
        self.score = data
    },
    setCreateAdhoc(data: boolean) {
        self.createAdhoc = data
    },
    setGrade(data: string) {
        self.grade = data
    },
    setPercentage(data: string) {
        self.percentage = data
    },
    setAlertObject(data: string) {
        self.alertObject = data
    },
    setFlashlightValue(flashlightCBValue: boolean) {
        self.flashlightCBValue = flashlightCBValue
    },
    setFoodalertSampling(data: boolean) {
        self.foodalertSampling = data
    },
    setDataLoggerCBValue(dataLoggerCBValue: boolean) {
        self.dataLoggerCBValue = dataLoggerCBValue
    },
    setLuxmeterCBValue(luxmeterCBValue: boolean) {
        self.luxmeterCBValue = luxmeterCBValue
    },
    setThermometerCBValue(thermometerCBValue: boolean) {
        self.thermometerCBValue = thermometerCBValue
    },
    setUVlightCBValue(UVlightCBValue: boolean) {
        self.UVlightCBValue = UVlightCBValue
    },
    setLatitude(data: string) {
        self.latitude = data
    },
    setLongitude(data: string) {
        self.longitude = data
    },
    setDashboardClisk(data: string) {
        self.myTaskResponse = data
    },
    setSelectedTask(data: string) {
        self.selectedTask = data
    },
    setScoreFollow(data: string) {
        self.scoreFollow = data
    },
    setCount(count: string) {
        self.count = count
    },
    setState(state: string) {
        self.state = state
    },
    setBAState(state: string) {
        self.bastate = state
    },
    setIsMyTaskClick(isMyTaskClick: string) {
        self.isMyTaskClick = isMyTaskClick
    },
    setCampaignList(campaignList: string) {
        self.campaignList = campaignList
    },
    setCampaignCount(data: string) {
        self.campaignCount = data
    },
    setSurveyList(surveyList: string) {
        self.surveyList = surveyList
    },
    setCampaignListPast(campaignList: string) {
        self.campaignListPast = campaignList
    },
    setSurveyListPast(surveyList: string) {
        self.surveyListPast = surveyList
    },
    setNocList(nocList: string) {
        self.NOCList = nocList
    },
    setNocListPast(nocList: string) {
        self.NOCListPast = nocList
    },
    setMyTaskCount(myTaskCount: string) {
        self.myTaskCount = myTaskCount
    },
    setLicenseCount(licenseCount: string) {
        self.licenseCount = licenseCount
    },
    setCaseCount(caseCount: string) {
        self.caseCount = caseCount
    },
    setComplaintAndFoodPosioningList(complaintAndFoodPosioningList: string) {
        self.complaintAndFoodPosioningList = complaintAndFoodPosioningList
    },
    setEventsList(eventsList: string) {
        self.eventsList = eventsList
    },
    setFarmTaskArray(farmTaskArray: string) {
        self.farmTaskArray = farmTaskArray
    },
    setDirectFarmArray(directFarmArray: string) {
        self.directFarmArray = directFarmArray
    },
    setDataArray(dataArray: string) {
        self.dataArray = dataArray
    },
    setDataArray1(dataArray1: string) {
        self.dataArray1 = dataArray1
    },
    setComplaintAndFoodPosioningListPast(complaintAndFoodPosioningList: string) {
        self.complaintAndFoodPosioningListPast = complaintAndFoodPosioningList
    },
    setEventsListPast(eventsList: string) {
        self.eventsListPast = eventsList
    },
    setFarmTaskArrayPast(farmTaskArray: string) {
        self.farmTaskArrayPast = farmTaskArray
    },
    setDirectFarmArrayPast(directFarmArray: string) {
        self.directFarmArrayPast = directFarmArray
    },
    setDataArrayPast(dataArray: string) {
        self.dataArrayPast = dataArray
    },
    setDataArray1Past(dataArray1: string) {
        self.dataArray1Past = dataArray1
    },
    setDesc(desc: string) {
        self.desc = desc
    },
    setCheckListArray(checkListArray: string) {
        self.checkListArray = checkListArray;
    },
    setContactName(ContactName: string) {
        self.contactName = ContactName;
    },
    setMobileNumber(MobileNumber: string) {
        self.mobileNumber = MobileNumber;
    },
    setEmiratesId(EmiratesId: string) {
        self.emiratesId = EmiratesId;
    },
    setResult(result: string) {
        self.result = result;
    },
    setFinalComment(finalComment: string) {
        self.finalComment = finalComment;
    },
    setBusinessActivityResponse(getBusinessActivityResponse: string) {
        self.getBusinessActivityResponse = getBusinessActivityResponse
    },
    setTaskId(taskId: string) {
        self.taskId = taskId
    },
    setCampaignChecklistTaskId(taskId: string) {
        self.campaignChecklistTaskId = taskId
    },
    setIsCompletedOfflineList(isCompletedOfflineList: string) {
        self.isCompletedOfflineList = isCompletedOfflineList
    },
    setEstListArray(estListArray: string) {
        self.estListArray = estListArray
    },
    setEvidanceAttachment1(data: string) {
        self.evidanceAttachment1 = data
    },
    setEvidanceAttachment1Url(data: string) {
        self.evidanceAttachment1Url = data
    },
    setEvidanceAttachment2(data: string) {
        self.evidanceAttachment2 = data
    },
    setEvidanceAttachment2Url(data: string) {
        self.evidanceAttachment2Url = data
    },
    setLicencesAttachment1(data: string) {
        self.licencesAttachment1 = data
    },
    setLicencesAttachment1Url(data: string) {
        self.licencesAttachment1Url = data
    },
    setLicencesAttachment2(data: string) {
        self.licencesAttachment2 = data
    },
    setLicencesAttachment2Url(data: string) {
        self.licencesAttachment2Url = data
    },
    setEmiratesIdAttachment1(data: string) {
        self.EmiratesIdAttachment1 = data
    },
    setEmiratesIdAttachment1Url(data: string) {
        self.EmiratesIdAttachment1Url = data
    },
    setEmiratesIdAttachment2(data: string) {
        self.EmiratesIdAttachment2 = data
    },
    setEmiratesIdAttachment2Url(data: string) {
        self.EmiratesIdAttachment2Url = data
    },
    setNoCheckList(data: string) {
        self.noCheckList = data
    },
    setDataBlank() {
        self.contactName = '',
            self.mobileNumber = '',
            self.emiratesId = '',
            self.result = '',
            self.finalComment = ''
    },
    setIsPostPoned(isPostPoned: boolean) {
        self.isPostPoned = isPostPoned
    },
    setIsSuccess(isSuccess: boolean) {
        self.isSuccess = isSuccess
    },
    setCampaignTaskId(campaignTaskId: string) {
        self.campaignTaskId = campaignTaskId
    },
    setVisitType(visitType: string) {
        self.visitType = visitType
    },
    setScope(scope: string) {
        self.scope = scope
    },
    setNoOfVisits(noOfVisits: string) {
        self.noOfVisits = noOfVisits
    },
    setnotCompletedTasksFormDb(data: string) {
        self.notCompletedTasksFormDb = data
    },
    setOtherValue(otherValue: string) {
        self.otherValue = otherValue
    },
    setOtherTextValue(otherTextValue: string) {
        self.otherTextValue = otherTextValue
    },
    setLoadingState(loadingState: string) {
        self.loadingState = loadingState
    },
    setTableNameList(tableNameList: string) {
        self.tableNameList = tableNameList
    },
    callToLoginService: flow(function* (payload: any) {

        try {
            debugger;
            let auth = '';
            let username = payload.username, password = payload.password;

            let url = 'UserName=' + username + '&Password=' + escape(password) + '&Attrib5=1.5.4&timetemp=2500';
            let loginResponse: any = yield LoginService(url, auth);
            debugger;
            console.log("loginResponse.Status::" + loginResponse.Status)
            if (loginResponse && (loginResponse.Status == 'Success')) {
                self.isOnline = true;

            }
            // else {
            //     debugger;
            //     ToastAndroid.show(loginResponse && loginResponse.ErrorMessage ? loginResponse.ErrorMessage : ' Failed', 1000);
            //     self.state = "error";
            //     self.loadingState = '';
            // }

        } catch (error) {
            // alert((error))
            // ... including try/catch error handling
            // self.state = "error"
        }

    }),

    callToGetTaskApi: flow(function* (loginData, resyncNeed: boolean, isArabic: boolean) {

        try {
            debugger;

            self.state = "pending";
            self.loadingState = 'Fetching Tasks';

            let _MS_PER_DAY = 1000 * 60 * 60 * 24;

            function dateDiffInDays(a: any, b: any) {
                // Discard the time and time-zone information.
                let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

                return Math.floor((utc2 - utc1) / _MS_PER_DAY);
            }

            if (temp1['0']) {
                temp1 = Object.values(temp1)
            }
            else {
                temp1 = []
            }
            let getTaskApiResponse = yield fetchGetTaskApi(loginData, resyncNeed);
            debugger;
            if (getTaskApiResponse && (getTaskApiResponse.Status == "Success") && (getTaskApiResponse.GetTasklist && getTaskApiResponse.GetTasklist.Inspection && (getTaskApiResponse.GetTasklist.Inspection.length > 0))) {
                let dbFromTasks = RealmController.getTasks(realm, TaskSchema.name);

                let tempArray = Array(), responseArr = Array(), rescheduledTask = Array();
                let taskArrayComplaintAndFoodPosioningList = Array();
                let taskArrayEventsList = Array();
                let taskArrayFarm = Array();
                let taskArrayCampaignList = Array();
                let taskArrayDistributeAllTaskDetailsArray = Array();
                let taskArraydataArray1 = Array();
                let taskDataArrayDataArray = Array();
                let taskDataArray = Array();
                let taskArrayNOCList = Array();
                let taskArraySurveyList = Array();
                let taskArrayComplaintAndFoodPosioningListPast = Array();
                let taskArrayEventsListPast = Array();
                let taskArrayFarmPast = Array();
                let taskArrayCampaignListPast = Array();
                let taskArrayDistributeAllTaskDetailsArrayPast = Array();
                let taskArraydataArray1Past = Array();
                let taskDataArrayDataArrayPast = Array();
                let taskDataArrayPast = Array();
                let taskArrayNOCListPast = Array();
                let taskArraySurveyListPast = Array();
                let InspectionArray = Array();
                InspectionArray = getTaskApiResponse.GetTasklist.Inspection;
                // //console.log('length:' + getTaskApiResponse.GetTasklist.Inspection.length);
                if (dbFromTasks && dbFromTasks['0']) {
                    dbFromTasks = Object.values(dbFromTasks);
                    dbFromTasks = dbFromTasks.filter((i: any) => i.isCompleted == false);

                    let deleteTaskArray = Array();
                    // for (let index = 0; index < dbFromTasks.length; index++) {
                    //     const obj = dbFromTasks[index];
                    //     let flag =true
                    //     for (let index = 0; index < InspectionArray.length; index++) {
                    //         const objInspectionArray = InspectionArray[index];
                    //         if (objInspectionArray.TaskId == obj.TaskId) {
                    //             flag = false
                    //         }
                    //     }
                    //     if (flag) {
                    //         InspectionArray.push(obj)
                    //     }
                    // }

                    for (let index = 0; index < dbFromTasks.length; index++) {
                        const obj = dbFromTasks[index];
                        let flag = true
                        for (let index = 0; index < InspectionArray.length; index++) {
                            const objInspectionArray = InspectionArray[index];
                            if (objInspectionArray.TaskId == obj.TaskId) {
                                flag = false
                            }
                        }
                        if (flag) {
                            deleteTaskArray.push(obj)
                        }
                    }
                    for (let index = 0; index < dbFromTasks.length; index++) {
                        const obj = dbFromTasks[index];
                        if (obj.TaskStatus == 'Failed') {
                            obj.isCompleted = true;
                            RealmController.addTaskDetails(realm, obj, TaskSchema.name, () => {
                                //console.log('j::' + j)
                            });
                            InspectionArray = InspectionArray.filter((i: any) => i.TaskId != obj.TaskId);
                        }

                    }

                    if (deleteTaskArray.length) {
                        for (let indexDeleteTask = 0; indexDeleteTask < deleteTaskArray.length; indexDeleteTask++) {
                            const element = deleteTaskArray[indexDeleteTask];
                            RealmController.deleteTaskById(realm, element.TaskId, () => {

                            })
                        }
                    }
                }

                for (let index = 0; index < InspectionArray.length; index++) {

                    const obj = InspectionArray[index];
                    // if (!obj.Sector || (obj.Sector == "")) {
                    let estblishment = temp1.filter((e: any) => e.LicenseCode == obj.LicenseCode)
                    try {
                        let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, obj.EstablishmentId);
                        // console.log('callToEstablishmentDetails item ::' + JSON.stringify(temp))
                        if (temp[0]) {
                            obj.EstablishmentName = temp[0].EnglishName;
                            obj.EstablishmentNameAR = temp[0].ArabicName;
                            if ((temp[0].Sector == null) || (temp[0].Sector == undefined) || (temp[0].Sector == "undefined") || (temp[0].Sector == 'null')) {
                                obj.Sector = "";
                                // console.log(JSON.stringify(obj.Sector))
                            }
                            else {
                                obj.Sector = estblishment['0'].Sector ? estblishment['0'].Sector : "";
                                // console.log(JSON.stringify(obj.Sector))
                            }
                        }
                        else {
                            if (estblishment.length) {
                                obj.EstablishmentName = estblishment[0].EnglishName;
                                obj.EstablishmentNameAR = estblishment[0].ArabicName;
                                if ((estblishment[0].Sector == null) || (estblishment[0].Sector == undefined) || (estblishment[0].Sector == "undefined") || (estblishment[0].Sector == 'null')) {
                                    obj.Sector = "";
                                    console.log(JSON.stringify(obj.Sector))
                                }
                                else {
                                    obj.Sector = estblishment[0].Sector ? estblishment[0].Sector : "";
                                    console.log(JSON.stringify(obj.Sector))
                                }
                            }
                            else {
                                obj.Sector = ""
                            }
                        }

                    } catch (error) {
                        obj.Sector = ""
                        // console.log("error" + obj.Sector)
                    }
                    // console.log("obj.Sector::" + JSON.stringify(obj.Sector))

                    // }
                    let date = new Date();
                    let date2 = obj.CompletionDate ? new Date(obj.CompletionDate) : new Date();
                    let diff = dateDiffInDays(date, date2);
                    if (obj.CompletionDate == "") {
                        // obj.completionDateWithDayRemaining = obj.CompletionDate + '(0 days remaining)';
                        obj.completionDateWithDayRemaining = '(0 days remaining)';
                    }
                    else {

                        if (diff < 0) {
                            // obj.completionDateWithDayRemaining = obj.CompletionDate + '(' + Math.abs(diff) + ' days delayed)';
                            obj.completionDateWithDayRemaining = '(' + Math.abs(diff) + ' days delayed)';
                            obj.color = "Red";
                        }
                        else if (diff > 0) {
                            let s = obj.CompletionDate;
                            s = s.slice(0, 10);
                            //obj.CompletionDate = '';
                            // obj.completionDateWithDayRemaining = s + '(' + diff + ' days remaining)';
                            obj.completionDateWithDayRemaining = '(' + diff + ' days remaining)';
                        }
                        else {
                            // obj.completionDateWithDayRemaining = obj.CompletionDate + '(0 days remaining)';
                            obj.completionDateWithDayRemaining = '(0 days remaining)';
                        }
                    }

                    let taskFromDb = RealmController.getTaskDetails(realm, TaskSchema.name, obj.TaskId);

                    // Alert.alert('',JSON.stringify(taskFromDb));

                    if (taskFromDb && taskFromDb['0']) {
                        // if ( taskFromDb['0'].TaskStatus == 'InProgress') {
                        obj.TaskStatus = taskFromDb['0'].TaskStatus;
                        // }
                    }

                    if ((obj.TaskStatus == 'Acknowledged') || (obj.TaskStatus == 'InProgress')) {
                        obj.isAcknowledge = true;
                    }
                    else {
                        obj.isAcknowledge = false;
                    }

                    responseArr.push(obj);

                    if (obj.TaskType) {

                        if (obj.TaskType.toLowerCase() == 'campaign inspection') {
                            if ((obj.TaskStatus != 'Rescheduled') && (obj.TaskStatus != 'Failed')) {
                                if (diff > -30) {
                                    taskArrayCampaignList.push(obj);
                                }
                                else {
                                    taskArrayCampaignListPast.push(obj);
                                }
                            }
                        }
                        else if (obj.TaskType == 'تفتيش إستطلاع وبحث' || obj.TaskType.toLowerCase() == 'survey inspection') {
                            if ((obj.TaskStatus != 'Rescheduled') && (obj.TaskStatus != 'Failed')) {
                                if (diff > -30) {
                                    taskArraySurveyList.push(obj);
                                }
                                else {
                                    taskArraySurveyListPast.push(obj);
                                }
                            }
                        }
                        else if (obj.TaskType.toLowerCase() == "noc inspection_ara" || obj.TaskType.toLowerCase() == "noc inspection" || obj.TaskType.toLowerCase() == "temporary noc inspection" || obj.TaskType == 'تفتيش ترخيص' || obj.TaskType == 'تفتيش ترخيص مؤقت') {
                            if ((obj.TaskStatus != 'Rescheduled') && (obj.TaskStatus != 'Failed')) {
                                if (diff > -30) {
                                    taskArrayNOCList.push(obj);
                                }
                                else {
                                    taskArrayNOCListPast.push(obj);
                                }
                            }
                            // else {
                            //     rescheduledTask.push(obj);
                            // }
                        }
                        else if (obj.TaskType.toLowerCase() == "food poisoning" || obj.TaskType.toLowerCase() == "food poison" || obj.TaskType.toLowerCase() == "complaints" || obj.TaskType == 'شكاوي') {
                            if ((obj.TaskStatus != 'Rescheduled') && (obj.TaskStatus != 'Failed')) {
                                if (diff > -30) {
                                    taskArrayComplaintAndFoodPosioningList.push(obj);
                                }
                                else {
                                    taskArrayComplaintAndFoodPosioningListPast.push(obj);
                                }
                            }
                            // else {
                            //     rescheduledTask.push(obj);
                            // }
                        }
                        else if (obj.TaskType.toLowerCase() == "temporary routine inspection" || obj.TaskType == 'تفتيش روتيني مؤقت'
                            || (obj.TaskType.toLowerCase() == "follow-up" && obj.ActivitySRId != null)) {

                            if ((obj.TaskStatus != 'Rescheduled') && (obj.TaskStatus != 'Failed')) {
                                if (diff > -30) {
                                    taskArrayEventsList.push(obj);
                                    taskDataArray.push(obj);
                                }
                                else {
                                    taskArrayEventsListPast.push(obj);
                                    taskDataArrayPast.push(obj);
                                }
                            }
                            // else {
                            //     rescheduledTask.push(obj);
                            // }
                        }
                        else if (obj.TaskType == "Routine Farm Inspection" || obj.TaskType == "Direct Farm Inspection" || (obj.TaskType == "Appeal Inspection" && obj.SystemType == "AMSFarms")) {
                            if ((obj.TaskStatus != 'Rescheduled') && (obj.TaskStatus != 'Failed')) {
                                if (diff > -30) {
                                    taskArrayFarm.push(obj);
                                }
                                else {
                                    taskArrayFarmPast.push(obj);
                                }
                                // self.farmTaskArray.push(obj);
                            }
                            // else {
                            //     rescheduledTask.push(obj);
                            // }
                        }
                        else if (obj.TaskType == "Follow-Up" && obj.SystemType == "AMSFarms") {
                            if ((obj.TaskStatus != 'Rescheduled') && (obj.TaskStatus != 'Failed')) {
                                if (diff > -30) {
                                    taskArrayCampaignList.push(obj);
                                }
                                else {
                                    taskArrayCampaignListPast.push(obj);
                                }
                            }
                            // else {
                            //     rescheduledTask.push(obj);
                            // }
                        }
                        else if (obj.TaskType == "Farm Re Opening Inspection") {
                            if ((obj.TaskStatus != 'Rescheduled') && (obj.TaskStatus != 'Failed')) {
                                if (diff > -30) {
                                    taskArrayDistributeAllTaskDetailsArray.push(obj);
                                }
                                else {
                                    taskArrayDistributeAllTaskDetailsArrayPast.push(obj);
                                }
                            }
                            // else {
                            //     rescheduledTask.push(obj);
                            // }
                        }
                        //else if (obj.TaskType == "Routine Farm Inspection") {
                        //    myTaskDraft.directFarmArray.push(obj);
                        //}
                        else {
                            if (obj.TaskType.includes("Self Inspection")) {

                            }
                            else {
                                if ((obj.TaskStatus != 'Rescheduled') && (obj.TaskStatus != 'Failed')) {
                                    console.log(diff)
                                    if (diff > -30) {
                                        taskArraydataArray1.push(obj);
                                        taskDataArrayDataArray.push(obj);
                                    }
                                    else {
                                        taskArraydataArray1Past.push(obj);
                                        taskDataArrayDataArrayPast.push(obj);
                                    }
                                }
                                // else {
                                //     rescheduledTask.push(obj);
                                // }
                            }

                        }
                    }
                }

                self.myTaskCount = taskArraydataArray1.length.toString();
                self.licenseCount = taskArrayNOCList.length.toString();
                self.caseCount = taskArrayComplaintAndFoodPosioningList.length.toString();
                self.campaignCount = taskArrayCampaignList.length.toString();
                self.tempPermit = taskArrayEventsList.length.toString();
                self.surveyList = (JSON.stringify(taskArraySurveyList));
                self.NOCList = (JSON.stringify(taskArrayNOCList));
                self.complaintAndFoodPosioningList = (JSON.stringify(taskArrayComplaintAndFoodPosioningList));
                self.eventsList = (JSON.stringify(taskArrayEventsList));
                self.dataArray = (JSON.stringify(taskDataArray));
                self.farmTaskArray = (JSON.stringify(taskArrayFarm))
                self.campaignList = (JSON.stringify(taskArrayCampaignList))
                self.directFarmArray = (JSON.stringify(taskArrayDistributeAllTaskDetailsArray));
                self.dataArray1 = (JSON.stringify(taskArraydataArray1));
                self.dataArray = (JSON.stringify(taskDataArrayDataArray))
                // self.rescheduledTaskList = (JSON.stringify(rescheduledTask));
                self.surveyListPast = (JSON.stringify(taskArraySurveyListPast));
                self.NOCListPast = (JSON.stringify(taskArrayNOCListPast));
                self.complaintAndFoodPosioningListPast = (JSON.stringify(taskArrayComplaintAndFoodPosioningListPast));
                self.eventsListPast = (JSON.stringify(taskArrayEventsListPast));
                self.dataArrayPast = (JSON.stringify(taskDataArrayPast));
                self.farmTaskArrayPast = (JSON.stringify(taskArrayFarmPast))
                self.campaignListPast = (JSON.stringify(taskArrayCampaignListPast))
                self.directFarmArrayPast = (JSON.stringify(taskArrayDistributeAllTaskDetailsArrayPast));
                self.dataArray1Past = (JSON.stringify(taskArraydataArray1Past));
                self.dataArrayPast = (JSON.stringify(taskDataArrayDataArrayPast))
                self.getTaskApiResponse = JSON.stringify(responseArr);
                self.state = 'done';

                debugger

                for (let index = 0; index < getTaskApiResponse.GetTasklist.Inspection.length; index++) {
                    const obj = getTaskApiResponse.GetTasklist.Inspection[index];

                    if ((obj.TaskStatus != 'Rescheduled') && (obj.TaskStatus != 'Failed')) {
                        if (dbFromTasks && dbFromTasks['0']) {
                            let dbFromTasksArray = Array();
                            dbFromTasksArray = dbFromTasks;
                            // dbFromTasksArray = Object.values(dbFromTasks);
                            if (!(dbFromTasksArray.filter(e => e.TaskId == obj.TaskId).length)) {
                                tempArray.push(obj);
                            }
                        }
                        else {
                            tempArray.push(obj);
                        }
                    }
                }
                let loginInfo = RealmController.getLoginData(realm, LoginSchema.name);

                //console.log("tempArray.length::" + tempArray.length)
                for (let j = 0; j < tempArray.length; j++) {
                    const elementTempArr = tempArray[j];

                    if (elementTempArr.TaskType.toString().toLowerCase() == 'campaign inspection') {
                        elementTempArr.mappingData = []
                    }
                    else {
                        elementTempArr.mappingData = [
                            {
                                addressIDs: [
                                    {
                                        AddressLine1: "",
                                        AddressLine2: "",
                                        City: "",
                                        Country: "",
                                        lat: "",
                                        long: "",
                                        PostalCode: null
                                    }
                                ],
                                Area: "",
                                completionDate: elementTempArr.CompletionDate,
                                completionDateWithDayRemaining: elementTempArr.completionDateWithDayRemaining,//pending
                                condemnationReport: [],
                                samplingReport: [],
                                detentionReport: [],
                                ContactName: "",//signature page 
                                ContactNumber: "",
                                CustomerName: elementTempArr.EstablishmentName,//Establishment
                                CustomerNameEnglish: elementTempArr.EstablishmentName,
                                EFSTFlag: false,//false compalsary
                                EHSRiskClassification: "",//Establishment resp
                                EmiratesId: "",
                                EstablishmentClass: "",//Establishment resp
                                EstablishmentDetailsList: undefined,
                                EstablishmentId: elementTempArr.EstablishmentId,
                                EstablishmentType: "",
                                finalResult: "",//lowest score
                                Grade: null,
                                grade: null,
                                grade_percentage: "",
                                inspectionForm: [],
                                InspectortobeEvaluatedId: null,
                                InspFullName: " ",
                                isCompltedOffline: false,
                                isuploadedToserver: false,
                                isViolated: "false",//score 0 asal tar
                                LicenseCode: elementTempArr.LicenseCode,
                                LicenseNumber: elementTempArr.LicenseNumber,
                                LicenseSource: "",
                                ManagerID: null,//contact page
                                ManagerMobile: null,
                                ManagerName: null,
                                MobileNumber: "",//Establishment resp
                                next_visit_date: "",//calculate
                                NumOfEST: elementTempArr.NumOfEST,
                                onlineReq: '',
                                onlineRes: [],
                                overallComments: "",
                                PendingRequests: [],
                                PlanAbuDhabi: null,
                                PlanAlAin: null,
                                PlanAlGharbia: null,
                                PlanEndDate: null,
                                PlanId: null,
                                PlanName: null,
                                PlanNumber: null,
                                PlanStartDate: null,
                                PlanStatus: null,
                                printingelementect: {
                                    ActualInspectionDate: "",
                                    Address: "",
                                    BusinessActivity: elementTempArr.BusinessActivity,
                                    CertificateExpDate: "",//Establishment resp
                                    CertificateNo: elementTempArr.LicenseCode,//LicenseCode
                                    ClientName: '',//ContactName
                                    CustomerSignature: "",
                                    Duration: "",
                                    EquipmentsUsed: "",
                                    EstablishNameInArabic: "",
                                    IdentificationNumber: "",
                                    InspectionNearestGracePeriod: '',//finala grace peroid
                                    InspectionNo: elementTempArr.TaskId,//taskId
                                    InspectionOverallInspectionComment: "",
                                    InspectionResult: "",//final result
                                    InspectionUserID: loginInfo.username ? loginInfo.username : '',
                                    InspectorName: loginInfo.loginResponse && loginInfo.loginResponse.InspectorName,
                                    isSatisfactory: "",//depend on finalResult
                                    LicenseExpiryDate: "",
                                    MajorNonComplianceInspectionParameter: [],
                                    MinorNonComplianceInspectionParameter: [],
                                    ModerateNonComplianceInspectionParameter: [],
                                    OmittedInspectionParameter: [],
                                    PhoneNo: "",
                                    ScheduledInspectionDate: "",//completionDate0
                                    TypeofInspection: elementTempArr.TaskType
                                },
                                printingReport: [],
                                ResponseSubmitted: null,
                                SampleSize: null,
                                Scope: "",// resp
                                Sector: null,
                                signatureBase64: "",
                                taskId: elementTempArr.TaskId,
                                tempScore: '',//overall min score
                                TimeElapsed: "",//start checklist
                                timerStarted: "",
                                TimeStarted: "",//start checklist
                                total_score: '',
                                TradeExpiryDate: "",//Establishment resp
                                TradeLicenseCreatedDate: "",//Establishment resp
                                TradeLicenseNumber: "",// Establishment resp
                                dataLoggerCBValue: false,
                                luxmeterCBValue: false,
                                flashlightCBValue: false,//equipment page
                                thermometerCBValue: false,
                                UVlightCBValue: false,
                                Visittype: ""
                            }];
                    }

                    elementTempArr.isCompleted = false;

                    RealmController.addTaskDetails(realm, elementTempArr, TaskSchema.name, () => {
                        //console.log('j::' + j)
                    });

                }

                let dbTasks = RealmController.getTasks(realm, TaskSchema.name);
                let latestDbFromTasksArray = Array();
                latestDbFromTasksArray = Object.values(dbTasks);
                latestDbFromTasksArray = latestDbFromTasksArray.filter(i => i.isCompleted == false);

                self.notCompletedTasksFormDb = JSON.stringify(latestDbFromTasksArray);
                // //console.log('getTaskResponse' + self.getTaskApiResponse);
                self.loadingState = '';
                self.state = 'done';
            }
            else {
                self.state = "error";
            }

        }
        catch (error) {
            // ... including try/catch error handling
            console.log(error)
            debugger
            // alert(error)
            self.state = "error"
        }

    }),

    callToMergeTask: flow(function* (isArabic: boolean, isForOneTask: boolean) {
        // console.log('isArabic, isForOneTask>>' + isForOneTask)
        try {
            if (self.getTaskApiResponse != '') {
                let AckArray = Array()
                let loginData = RealmController.getLoginData(realm, LoginSchema.name);
                loginData = loginData['0'] ? loginData['0'] : {};

                let mergedFollowUpsArray = RealmController.getMergeTask(realm);
                mergedFollowUpsArray = mergedFollowUpsArray['0'] ? Object.values(mergedFollowUpsArray) : [];
                let mergedArr = Array()
                let mergingCounter = 0;
                let mergingArray = Array();
                let mergingTaskArray = Array();
                let followupTaskArray = Array();
                // console.log('mergeTask>>'+JSON.stringify(mergedFollowUpsArray))

                let dataArray = Array();
                let mergetTasks: any = Array();
                if (isForOneTask) {
                    let selectedTask = self.selectedTask != '' ? JSON.parse(self.selectedTask) : {}
                    dataArray = [selectedTask];
                }
                else {
                    dataArray = self.getTaskApiResponse != '' ? JSON.parse(self.getTaskApiResponse) : Array();
                }

                mergingCounter = 0;
                mergingArray = [];
                // mergingTaskArray = [];
                for (var i = 0; i < dataArray.length; i++) {

                    //App.dataArray[i].EstablishmentDetails.isScannedForMerging = false;         // Remove after testing
                    if (dataArray[i] && dataArray[i].TaskType) {
                        // console.log("dataArray[i].TaskId>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + JSON.stringify(dataArray[i]))
                        if ((dataArray[i].TaskType == 'Routine Inspection' || dataArray[i].TaskType == 'تفتيش روتيني' || dataArray[i].TaskType.toLowerCase() == "temporary routine inspection" || dataArray[i].TaskType == 'تفتيش روتيني مؤقت')) {
                            var flag = false;
                            mergingTaskArray.push(dataArray[i])
                            for (var j = 0; j < mergedArr.length; j++) {
                                if (dataArray[i].TaskId == mergedArr[j].TaskId) {
                                    flag = true;
                                }
                            }
                            if (flag) {

                            }
                            else {
                                var obj: any = new Object();
                                obj.BA = dataArray[i].BusinessActivity;
                                obj.CN = dataArray[i].EstablishmentName;
                                obj.counter = i;
                                mergingArray.push(obj);
                            }
                        }
                        else if (dataArray[i].TaskType == 'Follow-Up') {
                            followupTaskArray.push(dataArray[i])
                        }
                    }

                }

                let _MS_PER_DAY = 1000 * 600 * 60 * 24;

                function dateDiffInDays(a: any, b: any) {
                    // Discard the time and time-zone information.
                    let utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
                    let utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

                    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
                }

                if (mergingTaskArray.length) {
                    let removeFollowUpArray = Array();

                    yield Promise.all(mergingTaskArray.map(async (element, index) => {

                        let mergedTaskId = RealmController.getMergeTaskById(realm, element.TaskId);
                        // console.log('mergedRes>>>' + JSON.stringify(mergedTaskId) + "" + 'mergesddsdRes>>>' + JSON.stringify(element.TaskId))
                        if (mergedTaskId && mergedTaskId['0']) {

                        }
                        else {
                            if (element.BusinessActivity && element.Description && element.EstablishmentName) {
                                if (isForOneTask) {
                                    self.state = 'pending';
                                    self.loadingState = 'Merging Tasks';
                                }
                                let checklistSaveArr = Array();

                                let payload = {
                                    "InterfaceID": "ADFCA_CRM_SBL_072",
                                    "BusinessActivity": element.BusinessActivity,
                                    "LanguageType": "ENU",
                                    "InspectorName": "",
                                    "AccountName": element.EstablishmentName,
                                    "RequestType": "",
                                    "InspectorId": ""
                                }
                                let response = await followUpMergeApi(payload);
                                let followupId = response.FollowupTaskId && (response.FollowupTaskId.length > 0) ? response.FollowupTaskId : ''
                                // console.log('payload>>>' + JSON.stringify(payload) + ',mergedRes>>>' + JSON.stringify(response))
                                if (response.Status == "Success") {

                                    if (response.FollowupTaskId && (response.FollowupTaskId.length > 0)) {
                                        let checkListData = await RealmController.getCheckListForTaskId(realm, CheckListSchema.name, element.TaskId);
                                        let mergedFlag = false;

                                        if (checkListData && checkListData['0']) {

                                            checklistSaveArr = checkListData['0'].checkList != '' ? JSON.parse(checkListData['0'].checkList) : Array();

                                            let obj = {
                                                TaskId: element.TaskId,
                                                FollowupId: response.FollowupTaskId,
                                                userId: loginData.username
                                            }
                                            await RealmController.addMergeTask(realm, obj, () => {
                                                mergedFollowUpsArray.push(response.FollowupTaskId);
                                                mergedFlag = true
                                                // getSBLInspectionQuestionaireForMerging(response.FollowupTaskId, x);
                                            })

                                        }
                                        else {

                                            let getChecklistResponse = await fetchGetChecklistApi(element, [], isArabic, element.Description);

                                            if (getChecklistResponse && getChecklistResponse['global-instance']) {

                                                let checkListArray = [];

                                                let questionsArray = getChecklistResponse['global-instance'] ? getChecklistResponse['global-instance'].entity[1]["instance"] : [];

                                                if (questionsArray) {
                                                    for (let i = 0; i < questionsArray.length; i++) {
                                                        let questionaire = Object();
                                                        questionaire.parameter_score = Array(5);
                                                        questionaire.parameter_score_desc = Array(5);
                                                        questionaire.parameter_non_comp_desc = Array(5);
                                                        for (let j = 0; j < questionsArray[i]['attribute'].length; j++) {

                                                            switch (questionsArray[i]['attribute'][j]['@id']) {
                                                                case 'parameter':
                                                                    questionaire.parameter = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    break;
                                                                case 'parameter_weight_mobility':
                                                                    questionaire.parameter_weight_mobility = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                                    break;
                                                                case 'parameter_score_desc_2':
                                                                    debugger;
                                                                    questionaire.parameter_score_desc_2 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    questionaire.parameter_score_desc[2] = questionaire.parameter_score_desc_2;
                                                                    // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_2);
                                                                    break;
                                                                case 'parameter_EHS_Risk':
                                                                    questionaire.parameter_EHS_Risk = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    break;
                                                                case 'parameter_score_4':
                                                                    questionaire.parameter_score_4 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                                    questionaire.parameter_score[4] = questionaire.parameter_score_4;
                                                                    // questionaire.parameter_score.push(questionaire.parameter_score_4);
                                                                    break;
                                                                case 'parameter_score_desc_3':
                                                                    questionaire.parameter_score_desc_3 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    questionaire.parameter_score_desc[3] = questionaire.parameter_score_desc_3;
                                                                    // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_3);
                                                                    break;
                                                                case 'parameter_EHS':
                                                                    questionaire.parameter_EHS = questionsArray[i]['attribute'][j]['boolean-val'] ? questionsArray[i]['attribute'][j]['boolean-val'] : '';
                                                                    break;
                                                                case 'parameter_guidance_rules':
                                                                    questionaire.parameter_guidance_rules = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    break;
                                                                case 'parameter_grace_minimum':
                                                                    questionaire.parameter_grace_minimum = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                                    break;
                                                                case 'parameter_score_desc_1':
                                                                    questionaire.parameter_score_desc_1 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    questionaire.parameter_score_desc[1] = questionaire.parameter_score_desc_1;
                                                                    // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_1);
                                                                    break;
                                                                case 'parameter_reference':
                                                                    questionaire.parameter_reference = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    break;
                                                                case 'parameter_score_desc_4':
                                                                    questionaire.parameter_score_desc_4 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    questionaire.parameter_score_desc[4] = questionaire.parameter_score_desc_4;
                                                                    // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_4);
                                                                    break;
                                                                case 'parameter_non_comp_desc_4':
                                                                    questionaire.parameter_non_comp_desc_4 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    questionaire.parameter_non_comp_desc[4] = questionaire.parameter_non_comp_desc_4;
                                                                    // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_4);
                                                                    break;
                                                                case 'parameter_non_comp_desc_2':
                                                                    questionaire.parameter_non_comp_desc_2 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    questionaire.parameter_non_comp_desc[2] = questionaire.parameter_non_comp_desc_2;
                                                                    // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_2);
                                                                    break;
                                                                case 'parameter_non_comp_desc_3':
                                                                    questionaire.parameter_non_comp_desc_3 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    questionaire.parameter_non_comp_desc[3] = questionaire.parameter_non_comp_desc_3;
                                                                    // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_3);
                                                                    break;
                                                                case 'parameter_non_comp_desc_0':
                                                                    questionaire.parameter_non_comp_desc_0 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    questionaire.parameter_non_comp_desc[0] = questionaire.parameter_non_comp_desc_0;
                                                                    // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_0);
                                                                    break;
                                                                case 'parameter_non_comp_desc_1':
                                                                    questionaire.parameter_non_comp_desc_1 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    questionaire.parameter_non_comp_desc[1] = questionaire.parameter_non_comp_desc_1;
                                                                    // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_1);
                                                                    break;
                                                                case 'parameter_subtype':
                                                                    questionaire.parameter_subtype = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    break;
                                                                case 'parameter_reg_6':
                                                                    questionaire.parameter_reg_6 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    break;
                                                                case 'parameter_score_desc_0':
                                                                    questionaire.parameter_score_desc_0 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    questionaire.parameter_score_desc[0] = questionaire.parameter_score_desc_0;
                                                                    // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_0);
                                                                    break;
                                                                case 'parameter_score_1':
                                                                    questionaire.parameter_score_1 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                                    questionaire.parameter_score[1] = questionaire.parameter_score_1;
                                                                    // questionaire.parameter_score.push(questionaire.parameter_score_1);
                                                                    break;
                                                                case 'parameter_score_0':
                                                                    questionaire.parameter_score_0 = questionsArray[i]['attribute'][j]['number-val'] || (questionsArray[i]['attribute'][j]['number-val'] == 0) || (questionsArray[i]['attribute'][j]['number-val'] == 0.0) ? questionsArray[i]['attribute'][j]['number-val'] : ''
                                                                    questionaire.parameter_score[0] = questionaire.parameter_score_0;
                                                                    // questionaire.parameter_score.push(questionaire.parameter_score_0);
                                                                    break;
                                                                case 'parameter_score_3':
                                                                    questionaire.parameter_score_3 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                                    questionaire.parameter_score[3] = questionaire.parameter_score_3;
                                                                    // questionaire.parameter_score.push(questionaire.parameter_score_3);
                                                                    break;
                                                                case 'parameter_score_2':
                                                                    questionaire.parameter_score_2 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                                    questionaire.parameter_score[2] = questionaire.parameter_score_2;
                                                                    // questionaire.parameter_score.push(questionaire.parameter_score_2);
                                                                    break;
                                                                case 'parameter_reg_1':
                                                                    questionaire.parameter_reg_1 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    break;
                                                                case 'parameter_grace_maximum':
                                                                    questionaire.parameter_grace_maximum = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                                    break;
                                                                case 'parameter_type':
                                                                    questionaire.parameter_type = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                                    break;
                                                                case 'parameter_EFST':
                                                                    questionaire.parameter_EFST = questionsArray[i]['attribute'][j]['boolean-val'] ? questionsArray[i]['attribute'][j]['boolean-val'] : '';
                                                                    break;
                                                                default:
                                                                    break;
                                                            }

                                                        }

                                                        questionaire.parameter_score = questionaire.parameter_score.reverse();
                                                        questionaire.parameter_score_desc = questionaire.parameter_score_desc.reverse();
                                                        questionaire.parameter_non_comp_desc = questionaire.parameter_non_comp_desc.reverse();
                                                        questionaire.Answers = "";
                                                        questionaire.grace = "";
                                                        checkListArray.push(questionaire);
                                                    }


                                                    let obj: any = {};
                                                    let checkArr: any = [];
                                                    for (let index = 0; index < checkListArray.length; index++) {
                                                        const element = checkListArray[index];
                                                        let parameter_weight = element.parameter_weight_mobility != '' ? element.parameter_weight_mobility : 1;

                                                        element.Answers = '';
                                                        element.color = "#ffffff";
                                                        element.gracePeriod = "";
                                                        element.guidance = "";
                                                        element.Lang = isArabic ? "ARA" : "ENU";
                                                        element.parameter_reference_original = element.parameter_reference;
                                                        element.parameter_reference = element.parameter_reference;
                                                        element.parameter_score_desc = element.parameter_score_desc;
                                                        element.parameter_score = element.parameter_score;
                                                        element.parameter_non_comp_desc = element.parameter_non_comp_desc;
                                                        element.parameterno = index;
                                                        element.role = "";
                                                        element.score = "";
                                                        element.Score = "";
                                                        element.syncDate = moment().format('L');
                                                        element.TotalscoreForQuestion = "";
                                                        element.NA = "N";
                                                        element.NAValue = false;
                                                        element.NI = "N";
                                                        element.NIValue = false;
                                                        element.comment = (element.parameter_non_comp_desc[0] === 'uncertain') ? '-' : element.parameter_non_comp_desc[0];

                                                        if (element.parameter_type == 'uncertain') {
                                                            element.parameter_type = 'EHS';
                                                            element.parameter_EHS = true;
                                                        }
                                                        checkArr.push(element)

                                                    }
                                                    //covid checklist flag
                                                    if (true) {
                                                        CovidChecklistArray = getCovidChecklist(isArabic)
                                                    }


                                                    let checklistCovidSaveArr = Array();
                                                    for (let indexcovid = 0; indexcovid < CovidChecklistArray.length; indexcovid++) {
                                                        const element = CovidChecklistArray[indexcovid];

                                                        checklistCovidSaveArr.push(element)

                                                    }
                                                    checklistSaveArr = [...checklistCovidSaveArr, ...checkArr];

                                                    for (let indexChecklist = 0; indexChecklist < checklistSaveArr.length; indexChecklist++) {
                                                        const element = checklistSaveArr[indexChecklist];
                                                        element.parameterno = indexChecklist;
                                                    }

                                                    obj.checkList = JSON.stringify(checklistSaveArr);
                                                    obj.taskId = element.TaskId;
                                                    obj.timeElapsed = '';
                                                    obj.timeStarted = '';
                                                    debugger;

                                                    await RealmController.addCheckListInDB(realm, obj, () => {
                                                        // ToastAndroid.show('Task added to db successfully', 1000);
                                                    });


                                                }

                                                if (checklistSaveArr.length) {
                                                    mergedFlag = true;
                                                    let obj = {
                                                        TaskId: element.TaskId,
                                                        FollowupId: response.FollowupTaskId,
                                                        userId: loginData.username
                                                    }
                                                    await RealmController.addMergeTask(realm, obj, () => {
                                                        mergedFollowUpsArray.push(response.FollowupTaskId);
                                                        mergedFlag = true;
                                                        // getSBLInspectionQuestionaireForMerging(response.FollowupTaskId, x);
                                                    })
                                                }
                                                else {
                                                    mergedFlag = false;
                                                    let obj = {
                                                        TaskId: element.TaskId,
                                                        FollowupId: response.FollowupTaskId ? response.FollowupTaskId : '',
                                                        userId: loginData.username
                                                    }
                                                    await RealmController.addMergeTask(realm, obj, () => {
                                                    })
                                                }
                                            }
                                            else {
                                                let obj = {
                                                    TaskId: element.TaskId,
                                                    FollowupId: response.FollowupTaskId ? response.FollowupTaskId : '',
                                                    userId: loginData.username
                                                }
                                                await RealmController.addMergeTask(realm, obj, () => {
                                                })
                                            }
                                        }

                                        if (mergedFlag) {
                                            try {
                                                var SBLArr: any = {};
                                                let getQuestionarieResponse = await fetchGetQuestionarieApi(isArabic ? 'ARA' : 'ENU', followupId);
                                                let checkListArray = Array();
                                                debugger;
                                                if (getQuestionarieResponse && getQuestionarieResponse.Status == 'Success') {

                                                    debugger;
                                                    for (let index = 0; index < getQuestionarieResponse.InspectionCheckList.Inspection.length; index++) {
                                                        const elementFollow = getQuestionarieResponse.InspectionCheckList.Inspection[index];
                                                        let count = 1;
                                                        let questionaireList = Object();
                                                        questionaireList.TaskId = elementFollow.TaskId;
                                                        questionaireList.Thermometer = elementFollow.Thermometer;
                                                        questionaireList.Flashlight = elementFollow.Flashlight;
                                                        questionaireList.DataLogger = elementFollow.DataLogger;
                                                        questionaireList.LuxMeter = elementFollow.LuxMeter;
                                                        questionaireList.UVLight = elementFollow.UVLight;
                                                        let tempchecklist = elementFollow.ListOfFsExpenseItem && elementFollow.ListOfFsExpenseItem.Checklist ? elementFollow.ListOfFsExpenseItem.Checklist : []

                                                        for (let checkListIndex = 0; checkListIndex < tempchecklist.length; checkListIndex++) {
                                                            const checklistElement = tempchecklist[checkListIndex];
                                                            let checkListObj = Object();
                                                            checkListObj.Answers = checklistElement.Answers;
                                                            checkListObj.originalScore = parseInt(checklistElement.Answers);
                                                            checkListObj.DescriptionArabic = checklistElement.DescriptionArabic;
                                                            checkListObj.GracePeriod = checklistElement.GracePeriod;
                                                            checkListObj.QuestionNameArabic = checklistElement.QuestionNameArabic;
                                                            checkListObj.QuestionNameEnglish = checklistElement.QuestionNameEnglish;
                                                            checkListObj.Weightage = checklistElement.Weightage;
                                                            checkListObj.Score = parseInt(checklistElement.Answers) / parseInt(checklistElement.Weightage);

                                                            if (isNaN(parseInt(checkListObj.Weightage))) {
                                                                checkListObj.Weightage = 1;
                                                            }
                                                            if (checkListObj.Weightage.toString().length == 0) {
                                                                checkListObj.Weightage = 1;
                                                            }
                                                            if (parseInt(checkListObj.Weightage) == 0) {
                                                                checkListObj.Weightage = 1;
                                                            }
                                                            if (parseInt(checkListObj.Weightage) > 1)
                                                                checkListObj.color = '#ffff66';
                                                            else
                                                                checkListObj.color = '#ffffff';
                                                            checkListObj.NonComplianceEnglish = checklistElement.NonComplianceEnglish;
                                                            checkListObj.NonComplianceArabic = checklistElement.NonComplianceArabic;
                                                            checkListObj.GracePeriodDate = checklistElement.GracePeriodDate;
                                                            //  checkListObj.GracePeriodDate = "11 / 01 / 2015";
                                                            checkListObj.NA = checklistElement.NA;
                                                            checkListObj.EFSTFlag = checklistElement.EFSTFlag;
                                                            checkListObj.Action = checklistElement.Action;
                                                            checkListObj.NI = checklistElement.NI;
                                                            checkListObj.Comments = checklistElement.Comments;
                                                            checkListObj.MaxGracePeriod = checklistElement.MaxGracePeriod;
                                                            checkListObj.MinGracePeriod = checklistElement.MinGracePeriod;
                                                            checkListObj.DescriptionEnglish = checklistElement.DescriptionEnglish;
                                                            checkListObj.ParameterNumber = checklistElement.ParameterNumber;
                                                            checkListObj.Regulation = checklistElement.Regulation;
                                                            checkListObj.image1 = '';
                                                            checkListObj.image2 = '';

                                                            if (checkListObj.Answers == null) {
                                                                checkListObj.Answers = "";
                                                            }
                                                            checkListObj.image1Base64 = '';
                                                            checkListObj.image2Base64 = '';
                                                            checkListObj.Score = checklistElement.Score;
                                                            checkListObj.FinalScore = checkListObj.Answers;
                                                            if (isNaN(parseInt(checkListObj.Score)))
                                                                checkListObj.Score = checkListObj.Answers * checkListObj.Weightage;
                                                            if (checkListObj.Answers != null && checkListObj.Answers.length > 0) {
                                                                // checkListObj.Score = parseInt(checkListObj.Answers);
                                                                checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                                            }
                                                            else if (checkListObj.NI == 'Y' || checkListObj.NA == 'Y') {

                                                                if (checkListObj.NI == 'Y') {

                                                                    checkListObj.NI = true;

                                                                    if (checkListObj.Answers != '' && checkListObj.Answers != 5) {
                                                                        checkListObj.NI = false;
                                                                    }
                                                                    else {
                                                                        checkListObj.Score = "";
                                                                        checkListObj.Answers = "";
                                                                        checkListObj.originalScore = "";
                                                                        checkListObj.FinalScore == "";
                                                                    }
                                                                }
                                                            }
                                                            if (checkListObj.NA != 'Y') {  //   && checkListObj.NI != 'Y'

                                                                checkListObj.NA = false;
                                                                if (checkListObj.NI == 'Y') {
                                                                    checkListObj.NI = true;
                                                                    checkListObj.wasNIDuringSync = true;

                                                                    if (checkListObj.Answers != '' && checkListObj.Answers != 5) {
                                                                        checkListObj.NI = false;
                                                                    }
                                                                    else {
                                                                        checkListObj.Score = "";
                                                                        checkListObj.Answers = "";
                                                                        checkListObj.originalScore = "";
                                                                        checkListObj.FinalScore == "";
                                                                    }
                                                                }
                                                                else if (checkListObj.NI == 'N')
                                                                    checkListObj.NI = false;
                                                                // debugger;
                                                                if (!(checkListObj.NI == 'N' && checkListObj.Answers == null)) {
                                                                    if (checkListObj.Answers != null && checkListObj.Answers.toString().length) {
                                                                        checkListObj.parameterno = count++;
                                                                        checkListArray.push(checkListObj);
                                                                    }
                                                                    else {
                                                                        continue;
                                                                    }
                                                                }
                                                            }
                                                        }

                                                        questionaireList.questions = checkListArray;
                                                        SBLArr = questionaireList
                                                        // let obj: any = {};
                                                        // obj.checkList = JSON.stringify(checkListArray);
                                                        // obj.taskId = taskId;
                                                        // obj.timeElapsed = '';
                                                        // obj.timeStarted = '';

                                                        // RealmController.addCheckListInDB(realm, obj, () => {
                                                        //     //     ToastAndroid.show('Task added to db successfully', 1000);
                                                        // });

                                                    }
                                                    console.log("dataArray[x].TaskId>>>" + element.TaskId + ", SBLArr.TaskId>>>" + followupId)
                                                    debugger
                                                    if (element.TaskId == followupId) {



                                                    }
                                                    let mFlag = false;
                                                    if (element) {
                                                        // let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, element.TaskId);
                                                        // checkListData = checkListData['0'] && (checkListData['0'].checkList != '') ? JSON.parse(checkListData['0'].checkList) : [];
                                                        checkListData = [...checklistSaveArr]
                                                        // console.log('checkListDatalength>>>>' + checkListData.length)
                                                        if (checkListData.length > 0) {
                                                            debugger
                                                            for (var i = 0; i < SBLArr.questions.length; i++) { //SBLArr.questions == ListOfFsExpenseItem.Checklist
                                                                debugger
                                                                for (var j = 0; j < checkListData.length; j++) {
                                                                    let parameter_weight = SBLArr.questions[i].parameter_weight_mobility != '' ? SBLArr.questions[i].parameter_weight_mobility : 1
                                                                    if (SBLArr.questions[i].QuestionNameEnglish == "EHS") {
                                                                        if (((SBLArr.questions[i].ParameterNumber == checkListData[j].parameter_reference) || (SBLArr.questions[i].ParameterNumber == checkListData[j].parameter_reference_original)) && (SBLArr.questions[i].Comments != "Satisfactory")) {
                                                                            SBLArr.questions[i].color = 'orange';
                                                                            checkListData[j].score = JSON.stringify(SBLArr.questions[i].Answers);
                                                                            checkListData[j].Score = JSON.stringify(Math.round(parseInt(SBLArr.questions[i].Answers)) * parseInt(parameter_weight));
                                                                            checkListData[j].Answers = JSON.stringify(SBLArr.questions[i].Answers);
                                                                            checkListData[j].grace = JSON.stringify(SBLArr.questions[i].GracePeriod);
                                                                            SBLArr.questions[i].GracePeriod = -dateDiffInDays(new Date(SBLArr.questions[i].GracePeriodDate), new Date());
                                                                            checkListData[j].gracePeriod = SBLArr.questions[i].GracePeriod;
                                                                            SBLArr.questions[i].TotalScoreForQuestion = Math.round(parseInt(checkListData[j].score)) * parseInt(parameter_weight);

                                                                            if (SBLArr.questions[i].GracePeriod < 0 || SBLArr.questions[i].GracePeriod == null || isNaN(SBLArr.questions[i].GracePeriod)) {
                                                                                checkListData[j].grace = 0;
                                                                                SBLArr.questions[i].GracePeriod = 0;
                                                                            }
                                                                            if (parseInt(SBLArr.questions[i].GracePeriod) < 1) {
                                                                                checkListData[j].hasToBeAnswered = true;
                                                                            }
                                                                            checkListData[j].color = SBLArr.questions[i].color;
                                                                            checkListData[j].comment = SBLArr.questions[i].Comments;
                                                                            checkListData[j].NA = SBLArr.questions[i].NA;
                                                                            checkListData[j].NI = SBLArr.questions[i].NI;
                                                                            checkListData[j].mergedAnswer = true;
                                                                            checkListData[j].answered = false;
                                                                            checkListData[j].mergedAnswer = true;

                                                                            if (!SBLArr.EstablishmentDetails)
                                                                                SBLArr.EstablishmentDetails = [];
                                                                            SBLArr.EstablishmentDetails.isMerged = true;
                                                                            SBLArr.questions[i].mergedAnswer = true;
                                                                            mFlag = true;
                                                                        }
                                                                    }
                                                                    else {
                                                                        if (((SBLArr.questions[i].ParameterNumber == checkListData[j].parameter_reference) || (SBLArr.questions[i].ParameterNumber == checkListData[j].parameter_reference_original)) && (parseInt(SBLArr.questions[i].Answers) != 4) && !isNaN(parseInt(SBLArr.questions[i].Answers))) {
                                                                            SBLArr.questions[i].color = 'orange';
                                                                            checkListData[j].score = SBLArr.questions[i].Answers;
                                                                            checkListData[j].Score = JSON.stringify(Math.round(parseInt(SBLArr.questions[i].Answers)) * parseInt(parameter_weight));
                                                                            checkListData[j].Answers = SBLArr.questions[i].Answers;
                                                                            checkListData[j].grace = SBLArr.questions[i].GracePeriod;
                                                                            SBLArr.questions[i].GracePeriod = -dateDiffInDays(new Date(SBLArr.questions[i].GracePeriodDate), new Date());
                                                                            checkListData[j].gracePeriod = SBLArr.questions[i].GracePeriod;
                                                                            SBLArr.questions[i].TotalScoreForQuestion = Math.round(parseInt(checkListData[j].score)) * parseInt(parameter_weight);

                                                                            if (SBLArr.questions[i].GracePeriod < 0 || SBLArr.questions[i].GracePeriod == null || isNaN(SBLArr.questions[i].GracePeriod)) {
                                                                                checkListData[j].grace = 0;
                                                                                SBLArr.questions[i].GracePeriod = 0;
                                                                            }
                                                                            if (parseInt(SBLArr.questions[i].GracePeriod) < 1) {
                                                                                checkListData[j].hasToBeAnswered = true;
                                                                            }
                                                                            checkListData[j].color = SBLArr.questions[i].color;
                                                                            checkListData[j].comment = SBLArr.questions[i].Comments;
                                                                            checkListData[j].NA = SBLArr.questions[i].NA;
                                                                            checkListData[j].NI = SBLArr.questions[i].NI;
                                                                            checkListData[j].mergedAnswer = true;
                                                                            checkListData[j].answered = false;
                                                                            checkListData[j].mergedAnswer = true;

                                                                            if (!SBLArr.EstablishmentDetails)
                                                                                SBLArr.EstablishmentDetails = [];
                                                                            SBLArr.EstablishmentDetails.isMerged = true;
                                                                            SBLArr.questions[i].mergedAnswer = true;
                                                                            mFlag = true;
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            if (mFlag) {
                                                                debugger

                                                                let obj: any = {};
                                                                obj.checkList = JSON.stringify(checkListData);
                                                                obj.taskId = element.TaskId;
                                                                obj.timeElapsed = '';
                                                                obj.timeStarted = '';
                                                                RealmController.addCheckListInDB(realm, obj, () => {
                                                                    removeFollowUpArray.push(SBLArr.TaskId)
                                                                    // let newTaskArray = self.dataArray1 != '' ? JSON.parse(self.dataArray1) : [];
                                                                    // newTaskArray = newTaskArray.filter((i: any) => i.TaskId != SBLArr.TaskId);
                                                                    // self.dataArray1 = (JSON.stringify(newTaskArray));
                                                                    // self.myTaskCount = (newTaskArray.length.toString());

                                                                    // let newTaskArrayPast = self.dataArray1Past != '' ? JSON.parse(self.dataArray1Past) : [];
                                                                    // newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != SBLArr.TaskId);
                                                                    // self.dataArray1Past = (JSON.stringify(newTaskArrayPast));
                                                                    RealmController.deleteTaskById(realm, SBLArr.TaskId, () => {

                                                                    })
                                                                    //console.log("::taskId::" + taskId);
                                                                    //     ToastAndroid.show('Task added to db successfully', 1000);
                                                                });

                                                                RealmController.addTaskDetails(realm, element, TaskSchema.name, () => {
                                                                    // callMergingAcknowledgeAPI(SBLArr, element, x);
                                                                })
                                                            }

                                                            // //console.log('Merging Done!');
                                                            //update followup task
                                                            let objMerge = {
                                                                TaskId: element.TaskId,
                                                                FollowupId: followupId,
                                                                userId: loginData.username
                                                            }
                                                            RealmController.addMergeTask(realm, objMerge, () => {
                                                                removeFollowUpArray.push(SBLArr.TaskId);
                                                                // deleteTask(SBLArr);//delete followup task
                                                                // let newTaskArray = self.dataArray1 != '' ? JSON.parse(self.dataArray1) : [];
                                                                // newTaskArray = newTaskArray.filter((i: any) => i.TaskId != SBLArr.TaskId);
                                                                // self.dataArray1 = (JSON.stringify(newTaskArray));
                                                                // self.myTaskCount = (newTaskArray.length.toString());

                                                                // let newTaskArrayPast = self.dataArray1Past != '' ? JSON.parse(self.dataArray1Past) : [];
                                                                // newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != SBLArr.TaskId);
                                                                // self.dataArray1Past = (JSON.stringify(newTaskArrayPast));
                                                                RealmController.deleteTaskById(realm, SBLArr.TaskId, () => {

                                                                })
                                                            })
                                                        }
                                                    }
                                                }

                                                try {
                                                    let mergedFlagAck = false;
                                                    let payload = {
                                                        "InterfaceID": "ADFCA_CRM_SBL_068",
                                                        "Longitude": "",
                                                        "Latitude": "",
                                                        "DateTime": "",
                                                        "Comments": '',
                                                        "LanguageType": "ENU",
                                                        "InspectorName": "",
                                                        "RequestType": "",
                                                        "Reason": "",
                                                        "TaskStatus": "Acknowledged",
                                                        "TaskId": followupId,
                                                        "InspectorId": "",
                                                        "PreposedDateTime": ""
                                                    }

                                                    let payload1 = {
                                                        "InterfaceID": "ADFCA_CRM_SBL_068",
                                                        "Longitude": "",
                                                        "Latitude": "",
                                                        "DateTime": "",
                                                        "Comments": 'The task has been merged with Routine Task Number: ' + element.TaskId,
                                                        "LanguageType": "ENU",
                                                        "InspectorName": "",
                                                        "RequestType": "",
                                                        "Reason": "",
                                                        "TaskStatus": "Merged",
                                                        "TaskId": followupId,
                                                        "InspectorId": "",
                                                        "PreposedDateTime": ""
                                                    }

                                                    let getAcknowldgeResponse = await fetchAcknowldgeApi(payload);
                                                    console.log("getAcknowldgeRespoAcknowledgednse>><<<<<>" + JSON.stringify(getAcknowldgeResponse))
                                                    if (getAcknowldgeResponse && getAcknowldgeResponse.Status && (getAcknowldgeResponse.Status.toLowerCase() == 'success')) {

                                                        let getAcknowldgeResponse1 = await fetchAcknowldgeApi(payload1);
                                                        console.log("getAcknowldgeResponse>><<<<<>" + JSON.stringify(getAcknowldgeResponse1))

                                                    }
                                                    else {

                                                        let getAcknowldgeResponse1 = await fetchAcknowldgeApi(payload1);
                                                        console.log("getAcknowldgeResponse>><<<<<>" + JSON.stringify(getAcknowldgeResponse1))

                                                    }

                                                }
                                                catch (e) {

                                                }
                                            } catch (error) {

                                            }
                                        }
                                        else {
                                            let obj = {
                                                TaskId: element.TaskId,
                                                FollowupId: response.FollowupTaskId ? response.FollowupTaskId : '',
                                                userId: loginData.username
                                            }
                                            await RealmController.addMergeTask(realm, obj, () => {
                                            })
                                        }
                                    }
                                    else {
                                        let obj = {
                                            TaskId: element.TaskId,
                                            FollowupId: response.FollowupTaskId ? response.FollowupTaskId : '',
                                            userId: loginData.username
                                        }
                                        await RealmController.addMergeTask(realm, obj, () => {
                                        })
                                    }
                                }

                                if (isForOneTask) {
                                    self.state = 'done';
                                    self.loadingState = '';
                                }
                            }
                        }

                    }
                    )).then(results => {
                        self.mergeState = 'done';
                        if (isForOneTask) {
                            self.loadingState = '';
                        }
                        console.log("results>>" + results);
                    }).catch(err => {
                        self.mergeState = 'done';
                        if (isForOneTask) {
                            self.loadingState = '';
                        }
                        console.log("err?>>" + err);
                    });

                    for (let indexRemove = 0; indexRemove < removeFollowUpArray.length; indexRemove++) {
                        const elementRmv = removeFollowUpArray[indexRemove];
                        let newTaskArray = self.dataArray1 != '' ? JSON.parse(self.dataArray1) : [];
                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != elementRmv);
                        self.dataArray1 = (JSON.stringify(newTaskArray));
                        self.myTaskCount = (newTaskArray.length.toString());

                        let newTaskArrayPast = self.dataArray1Past != '' ? JSON.parse(self.dataArray1Past) : [];
                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != elementRmv);
                        self.dataArray1Past = (JSON.stringify(newTaskArrayPast));
                    }
                    self.mergeState = 'done';
                }
                else {
                    self.mergeState = 'done';
                    // self.loadingState = '';
                }
            }
        }
        catch (e) {
            // self.state = 'done';
            if (isForOneTask) {
                self.loadingState = '';
            }
        }
        // self.state = 'done';
    }),

    callToBackgroundGetChecklistApi: flow(function* () {
        // {
        debugger;
        try {
            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData['0'] ? loginData['0'] : {};

            let dbFromTasks = RealmController.getTasks(realm, TaskSchema.name);
            let tempDbFromTasksArray = Array();
            tempDbFromTasksArray = Object.values(dbFromTasks);
            tempDbFromTasksArray = tempDbFromTasksArray.filter(i => i.isCompleted == false);
            //console.log("tempDbFromTasksArrayLength::" + tempDbFromTasksArray.length)

            let i = 0; // Global Variableconst arrayLength = 100 // Replace 100 with the actual array's length (the array that contains all tasks , not just my tasks) here

            async function startSync(x: number) {

                if (i < tempDbFromTasksArray.length) {
                    const obj = tempDbFromTasksArray[x];
                    //console.log("tempDbFromTasksArrayindexSync::" + x)

                    let temp = await RealmController.getEstablishmentById(realm, EstablishmentSchema.name, obj.EstablishmentId);
                    let temp1 = await RealmController.getSingleXlsxEstablishmentById(realm, AllEstablishmentSchema.name, obj.EstablishmentId);

                    if (temp && temp[0]) {
                        //console.log('estData::' + "::" + x);//JSON.stringify((temp[0])) +

                    }
                    else if (temp1 && temp1[0]) {
                    }
                    else {
                        debugger;
                        if (obj.LicenseNumber) {
                            let url = `?Login=${loginData.username}&RecToDate=${moment().format('L')}&Start_spcRow=0&RecFromDate=${moment().format('L')}&Page_spcSize=3000&TransactionType=Record&Attrib5=1.5.4&AccountCategory=Food&tempflg=2507&LicenceNumber=${obj.LicenseNumber}`;
                            let response: any = await getAccountSyncService(url, '');
                            debugger;

                            if (response) {

                                let accountSyncAddressArray: any = [], accountSyncArray: any = [];
                                // //console.log("accountSyncAddressArray: ", JSON.stringify(response))
                                for (let i = 0; i < parseInt(response.NumOfRec); i++) {
                                    let adfcaAccountThinBcObj: any = {};
                                    let adfcaAccountThinBc = response.ListOfAdfcaAccountSyncIo.AdfcaAccountThinBc[i];
                                    adfcaAccountThinBcObj.Id = adfcaAccountThinBc.Id;
                                    adfcaAccountThinBcObj.ADCCNumber = adfcaAccountThinBc.ADCCNumber;
                                    adfcaAccountThinBcObj.ArabicName = adfcaAccountThinBc.ArabicName;
                                    adfcaAccountThinBcObj.ADFCAIntialTradeLicense = adfcaAccountThinBc.ADFCAIntialTradeLicense;
                                    adfcaAccountThinBcObj.Mobile = adfcaAccountThinBc.Mobile;
                                    adfcaAccountThinBcObj.PreferredLanguage = adfcaAccountThinBc.PreferredLanguage;
                                    adfcaAccountThinBcObj.LicenseExpiryDate = adfcaAccountThinBc.LicenseExpiryDate
                                    adfcaAccountThinBcObj.LicenseNumber = adfcaAccountThinBc.LicenseNumber;
                                    adfcaAccountThinBcObj.LicenseRegDate = adfcaAccountThinBc.LicenseRegDate;
                                    adfcaAccountThinBcObj.AccountNumber = adfcaAccountThinBc.AccountNumber;
                                    adfcaAccountThinBcObj.AccountRegion = adfcaAccountThinBc.AccountRegion;
                                    adfcaAccountThinBcObj.Status = adfcaAccountThinBc.Status;
                                    adfcaAccountThinBcObj.AccountClass = adfcaAccountThinBc.AccountClass;
                                    adfcaAccountThinBcObj.Alias = adfcaAccountThinBc.Alias;
                                    adfcaAccountThinBcObj.BankCode = adfcaAccountThinBc.BankCode;
                                    adfcaAccountThinBcObj.EHSRiskClassification = adfcaAccountThinBc.EHSRiskClassification;
                                    adfcaAccountThinBcObj.LicenseCode = adfcaAccountThinBc.LicenseCode;
                                    adfcaAccountThinBcObj.Sent = adfcaAccountThinBc.Sent;
                                    adfcaAccountThinBcObj.URL = adfcaAccountThinBc.URL;
                                    adfcaAccountThinBcObj.OnHold = adfcaAccountThinBc.OnHold;
                                    adfcaAccountThinBcObj.Reference = adfcaAccountThinBc.Reference;
                                    adfcaAccountThinBcObj.LegalStatus = adfcaAccountThinBc.LegalStatus;
                                    adfcaAccountThinBcObj.Site = adfcaAccountThinBc.Site;
                                    adfcaAccountThinBcObj.Email = adfcaAccountThinBc.Email;
                                    adfcaAccountThinBcObj.MainFaxNumber = adfcaAccountThinBc.MainFaxNumber;
                                    adfcaAccountThinBcObj.LandlineNumber = adfcaAccountThinBc.LandlineNumber;
                                    adfcaAccountThinBcObj.Area = adfcaAccountThinBc.Area;
                                    adfcaAccountThinBcObj.Sector = adfcaAccountThinBc.Sector;
                                    adfcaAccountThinBcObj.City = adfcaAccountThinBc.City;
                                    adfcaAccountThinBcObj.EnglishName = adfcaAccountThinBc.EnglishName;
                                    adfcaAccountThinBcObj.AccountCategory = adfcaAccountThinBc.AccountCategory;
                                    adfcaAccountThinBcObj.Parent = adfcaAccountThinBc.Parent;
                                    adfcaAccountThinBcObj.LicenseSource = adfcaAccountThinBc.LicenseSource;
                                    adfcaAccountThinBcObj.AccountType = adfcaAccountThinBc.AccountType;
                                    adfcaAccountThinBcObj.PrimaryAddressId = adfcaAccountThinBc.PrimaryAddressId;
                                    adfcaAccountThinBcObj.NumofWH = adfcaAccountThinBc.NumofWH;
                                    adfcaAccountThinBcObj.NumofSheds = adfcaAccountThinBc.NumofSheds;
                                    adfcaAccountThinBcObj.NumofFishPonds = adfcaAccountThinBc.NumofFishPonds;
                                    adfcaAccountThinBcObj.CapofWH = adfcaAccountThinBc.CapofWH;
                                    adfcaAccountThinBcObj.CapofSheds = adfcaAccountThinBc.CapofSheds;
                                    adfcaAccountThinBcObj.CapofFishPonds = adfcaAccountThinBc.CapofFishPonds;
                                    adfcaAccountThinBcObj.ADFCAAgrEstGrade = adfcaAccountThinBc.ADFCAAgrEstGrade;
                                    adfcaAccountThinBcObj.isUploaded = "false";

                                    obj.EstablishmentName = adfcaAccountThinBc.EnglishName;
                                    obj.EstablishmentNameAR = adfcaAccountThinBc.ArabicName;

                                    // // //console.log('adfcaAccountThinBcObj::'+JSON.stringify(adfcaAccountThinBcObj))
                                    let numOfAddress = 0;
                                    if (adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress) {

                                        // for (let j = 0; j < adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress[0].ADFCAAccountThinBC_BusinessAddress.length; j++)
                                        for (let j = 0; j < adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress.length; j++) {
                                            numOfAddress++;
                                            let adfcaBusinessAddress = adfcaAccountThinBc.ListOfADFCAAccountThinBC_BusinessAddress[j].ADFCAAccountThinBC_BusinessAddress;
                                            let addressObj: any = {};
                                            addressObj.Id = adfcaBusinessAddress.Id;
                                            addressObj.ADFCAId = adfcaBusinessAddress.ADFCAId;
                                            addressObj.IsPrimary = adfcaBusinessAddress.IsPrimary;
                                            addressObj.Updated = adfcaBusinessAddress.Updated;
                                            addressObj.City = adfcaBusinessAddress.City;
                                            addressObj.Country = adfcaBusinessAddress.Country;
                                            addressObj.POBox = adfcaBusinessAddress.POBox;
                                            addressObj.AddressLine1 = adfcaBusinessAddress.Address;
                                            addressObj.AddressLine2 = adfcaBusinessAddress.Address2;
                                            addressObj.EstabilishmentID = adfcaAccountThinBc.Id;
                                            accountSyncAddressArray.push(addressObj);
                                        }//end for loop j
                                    }

                                    adfcaAccountThinBcObj.mainAddresObj = numOfAddress;//escape(JSON.stringify(mainAddresObj));
                                    adfcaAccountThinBcObj.addressObj = JSON.stringify(accountSyncAddressArray)
                                    accountSyncArray.push(adfcaAccountThinBcObj);

                                }//end for loop i

                                // }
                                let responseObject: any = {};
                                responseObject.Error_spcMessage = response.Error_spcMessage;
                                responseObject.lastPageFlag = response.Last_spcPage;
                                responseObject.NumOfRec = parseInt(response.NumOfRec);
                                responseObject.Status = response.Status;

                                responseObject.accountSyncArray = accountSyncArray;
                                responseObject.accountSyncAddressArray = accountSyncAddressArray;
                                await RealmController.addEstablishmentDetails(realm, accountSyncArray, EstablishmentSchema.name, () => {
                                    //console.log('estDataaccountSyncArray::' + JSON.stringify(accountSyncArray));
                                });
                            }
                        }
                    }

                    //===================

                    let checkListData = await RealmController.getCheckListForTaskId(realm, CheckListSchema.name, obj.TaskId);

                    if ((obj.TaskType.toLowerCase() !== 'routine inspection') || (obj.TaskType.toLowerCase() !== 'direct inspection')) {            // Call sync here and after db insertion, in it's success callback, call the below function:           
                        // startSync(++i);
                        if (checkListData && checkListData['0'] && checkListData['0'].checkList && JSON.parse(checkListData[0].checkList).length) {
                            startSync(++i);
                        }
                        else {

                            if (obj.TaskType.toLowerCase() == "noc inspection_ara" || obj.TaskType.toLowerCase() == "noc inspection" || obj.TaskType.toLowerCase() == 'تفتيش ترخيص' || obj.TaskType.toLowerCase() == "temporary noc inspection" || obj.TaskType == "تفتيش ترخيص مؤقت" || obj.TaskType.toLowerCase() == "food poisoning" || obj.TaskType.toLowerCase() == "food poison") {

                                let inspectionType = ''
                                if (obj.TaskType.toLowerCase() == "noc inspection_ara" || obj.TaskType.toLowerCase() == "noc inspection" || obj.TaskType.toLowerCase() == 'تفتيش ترخيص') {
                                    inspectionType = 'No Objection Certificate';
                                }
                                else if (obj.TaskType.toLowerCase() == "temporary noc inspection" || obj.TaskType == "تفتيش ترخيص مؤقت") {
                                    inspectionType = 'Temporary NOC Inspection'
                                }
                                if (obj.TaskType.toLowerCase() == "food poisoning" || obj.TaskType.toLowerCase() == "food poison") {
                                    inspectionType = 'Suspected Food Poisoning Case(s)';
                                }

                                let payload = {
                                    "config": {},
                                    "global-instance": {
                                        "attribute": [
                                            {
                                                "@id": "inspection_language",
                                                "@type": "text",
                                                "text-val": "ENU"
                                            },
                                            {
                                                "@id": "service_name",
                                                "@type": "text",
                                                "text-val": inspectionType
                                            }
                                        ]
                                    }
                                }

                                let getChecklistResponse = await fetchNocChecklist(payload);
                                debugger;
                                if (getChecklistResponse) {
                                    debugger;
                                    let checkListArray = [];
                                    let NOCQuestions = [];

                                    if (obj.TaskType.toLowerCase() == "food poisoning" || obj.TaskType.toLowerCase() == "food poison") {
                                        checkListArray = getChecklistResponse["global-instance"] && getChecklistResponse["global-instance"].entity && getChecklistResponse["global-instance"].entity[2] ? getChecklistResponse["global-instance"].entity[2]['instance'] : [];
                                    }
                                    else if (obj.TaskType.toLowerCase() == "noc inspection_ara" || obj.TaskType.toLowerCase() == "noc inspection" || obj.TaskType.toLowerCase() == 'تفتيش ترخيص' || obj.TaskType.toLowerCase() == "temporary noc inspection" || obj.TaskType == "تفتيش ترخيص مؤقت") {
                                        checkListArray = getChecklistResponse["global-instance"] && getChecklistResponse["global-instance"].entity && getChecklistResponse["global-instance"].entity[0] ? getChecklistResponse["global-instance"].entity[0]['instance'] : [];
                                    }
                                    debugger;
                                    for (let i = 0; i < checkListArray.length; i++) {

                                        let NocObject = Object();

                                        for (let j = 0; j < checkListArray[i]['attribute'].length; j++) {

                                            if (obj.TaskType.toLowerCase() == "food poisoning" || obj.TaskType.toLowerCase() == "food poison") {
                                                let id = checkListArray[i]['attribute'][j]['@id'];
                                                switch (id) {
                                                    case 'food_poisoning_parameter_inspection_criteria':
                                                        NocObject.NOC_parameter_inspection_criteria = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                                        break;
                                                    case 'food_poisoning_parameter_regulation_article_no':
                                                        NocObject.NOC_parameter_regulation_article_no = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                                        break;
                                                    case 'food_poisoning_parameter_sl_no':
                                                        NocObject.NOC_parameter_sl_no = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                                        break;
                                                    case 'service_food_poisoning':
                                                        try {
                                                            NocObject.rev_noc_parameter_service = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                                        }
                                                        catch (e) {
                                                            NocObject.rev_noc_parameter_service = '';
                                                        }
                                                        break;
                                                    case 'food_poisoning_parameter_category':
                                                        NocObject.NOC_parameter_category = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                                        // NocObject.NOC_parameter_regulation_article_no = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                                        break;
                                                }
                                            }
                                            else if (obj.TaskType.toLowerCase() == "noc inspection_ara" || obj.TaskType.toLowerCase() == "noc inspection" || obj.TaskType.toLowerCase() == 'تفتيش ترخيص' || obj.TaskType.toLowerCase() == "temporary noc inspection" || obj.TaskType == "تفتيش ترخيص مؤقت") {

                                                let id = checkListArray[i]['attribute'][j]['@id'];

                                                switch (id) {

                                                    case 'NOC_parameter_inspection_criteria':
                                                        NocObject.NOC_parameter_inspection_criteria = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                                        break;
                                                    case 'NOC_parameter_regulation_article_no':
                                                        NocObject.NOC_parameter_regulation_article_no = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                                        break;
                                                    case 'NOC_parameter_sl_no':
                                                        NocObject.NOC_parameter_sl_no = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                                        break;
                                                    case 'rev_noc_parameter_service':
                                                        try {
                                                            NocObject.rev_noc_parameter_service = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                                        }
                                                        catch (e) {
                                                            NocObject.rev_noc_parameter_service = '';
                                                        }
                                                        break;
                                                    case 'NOC_parameter_category':
                                                        NocObject.NOC_parameter_category = checkListArray[i]['attribute'][j]['text-val'] ? checkListArray[i]['attribute'][j]['text-val'] : '';
                                                        break;
                                                }

                                            }
                                        }
                                        // }
                                        NocObject.comment = '';
                                        NocObject.attchment1 = '';
                                        NocObject.attachment2 = '';
                                        NocObject.Score = '';
                                        NocObject.NAValue = '';
                                        NocObject.EFSTFlag = false;
                                        if (obj.TaskType.toLowerCase() == "food poisoning" || obj.TaskType.toLowerCase() == "food poison") {
                                            NocObject.Score = 'Y';
                                            NocObject.NAValue = 'N';
                                            NocObject.NIValue = 'N';
                                        }
                                        NOCQuestions.push(NocObject)
                                    }

                                    let obj1: any = {};
                                    obj1.checkList = JSON.stringify(NOCQuestions);
                                    obj1.taskId = obj.TaskId;
                                    obj1.timeElapsed = '';
                                    obj1.timeStarted = '';

                                    await RealmController.addCheckListInDB(realm, obj1, () => {
                                        if (obj.mappingData && obj.mappingData[0]) {
                                            obj.mappingData[0].inspectionForm = obj1;
                                        }
                                        else {
                                            obj.mappingData = [{
                                                inspectionForm: obj1
                                            }]
                                        }
                                        RealmController.addTaskDetails(realm, obj, TaskSchema.name, () => {
                                            startSync(++i);
                                        })
                                    });
                                }
                                else {
                                    startSync(++i);
                                }
                            }
                            else if (obj.TaskType.toLowerCase() == 'follow-up') {

                                let getQuestionarieResponse = await fetchGetQuestionarieApi("ENU", obj.TaskId);
                                debugger;
                                if (getQuestionarieResponse && getQuestionarieResponse.Status == 'Success') {
                                    debugger;
                                    for (let index = 0; index < getQuestionarieResponse.InspectionCheckList.Inspection.length; index++) {
                                        const element = getQuestionarieResponse.InspectionCheckList.Inspection[index];
                                        let checkListArray = Array();
                                        let count = 1;
                                        let questionaireList = Object();
                                        questionaireList.TaskId = element.TaskId;
                                        questionaireList.Thermometer = element.Thermometer;
                                        questionaireList.Flashlight = element.Flashlight;
                                        questionaireList.DataLogger = element.DataLogger;
                                        questionaireList.LuxMeter = element.LuxMeter;
                                        questionaireList.UVLight = element.UVLight;
                                        let ListOfFsExpenseItemChecklist = element.ListOfFsExpenseItem && element.ListOfFsExpenseItem.Checklist ? element.ListOfFsExpenseItem.Checklist : []
                                        for (let checkListIndex = 0; checkListIndex < ListOfFsExpenseItemChecklist.length; checkListIndex++) {
                                            const checklistElement = ListOfFsExpenseItemChecklist[checkListIndex];
                                            let checkListObj = Object();
                                            checkListObj.Answers = checklistElement.Answers;
                                            checkListObj.originalScore = parseInt(checklistElement.Answers);
                                            checkListObj.DescriptionArabic = checklistElement.DescriptionArabic;
                                            checkListObj.GracePeriod = checklistElement.GracePeriod;
                                            checkListObj.QuestionNameArabic = checklistElement.QuestionNameArabic;
                                            checkListObj.QuestionNameEnglish = checklistElement.QuestionNameEnglish;
                                            checkListObj.Weightage = checklistElement.Weightage;
                                            if (isNaN(parseInt(checkListObj.Weightage))) {
                                                checkListObj.Weightage = 1;
                                            }
                                            if (checkListObj.Weightage.toString().length == 0) {
                                                checkListObj.Weightage = 1;
                                            }
                                            if (parseInt(checkListObj.Weightage) == 0) {
                                                checkListObj.Weightage = 1;
                                            }
                                            if (parseInt(checkListObj.Weightage) > 1)
                                                checkListObj.color = '#ffff66';
                                            else {
                                                checkListObj.color = '#ffffff';
                                            }
                                            checkListObj.NonComplianceEnglish = checklistElement.NonComplianceEnglish;
                                            checkListObj.NonComplianceArabic = checklistElement.NonComplianceArabic;
                                            checkListObj.GracePeriodDate = checklistElement.GracePeriodDate;
                                            //  checkListObj.GracePeriodDate = "11 / 01 / 2015";
                                            checkListObj.NA = checklistElement.NA;
                                            checkListObj.EFSTFlag = checklistElement.EFSTFlag;
                                            checkListObj.Action = checklistElement.Action;
                                            checkListObj.NI = checklistElement.NI;
                                            checkListObj.Comments = checklistElement.Comments;
                                            checkListObj.MaxGracePeriod = checklistElement.MaxGracePeriod ? checklistElement.MaxGracePeriod : 30;
                                            checkListObj.MinGracePeriod = checklistElement.MinGracePeriod ? checklistElement.MinGracePeriod : 0;
                                            checkListObj.DescriptionEnglish = checklistElement.DescriptionEnglish;
                                            checkListObj.ParameterNumber = checklistElement.ParameterNumber;
                                            checkListObj.Regulation = checklistElement.Regulation;
                                            checkListObj.image1 = '';
                                            checkListObj.image2 = '';

                                            if (checkListObj.Answers == null) {
                                                checkListObj.Answers = "";
                                            }
                                            checkListObj.image1Base64 = '';
                                            checkListObj.image2Base64 = '';
                                            checkListObj.Score = checklistElement.Score;
                                            checkListObj.FinalScore = checkListObj.Answers;
                                            if (isNaN(parseInt(checkListObj.Score)))
                                                checkListObj.Score = checkListObj.Answers * checkListObj.Weightage;
                                            if (checkListObj.Answers != null && checkListObj.Answers.length > 0) {
                                                // checkListObj.Score = parseInt(checkListObj.Answers);
                                                checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                            }
                                            else if (checkListObj.NI == 'Y' || checkListObj.NA == 'Y') {

                                                if (checkListObj.NI == 'Y') {

                                                    checkListObj.NI = true;

                                                    if (checkListObj.Answers != '' && checkListObj.Answers != 5) {
                                                        checkListObj.NI = false;
                                                    }
                                                    else {
                                                        checkListObj.Score = 5;
                                                        checkListObj.Answers = 5;
                                                        checkListObj.originalScore = 5;
                                                        checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                                    }
                                                }
                                            }
                                            if (checkListObj.NA != 'Y' && checkListObj.QuestionNameEnglish.toUpperCase() != 'EHS') {  //   && checkListObj.NI != 'Y'

                                                checkListObj.NA = false;
                                                if (checkListObj.NI == 'Y') {
                                                    checkListObj.NI = true;
                                                    checkListObj.wasNIDuringSync = true;

                                                    if (checkListObj.Answers != '' && checkListObj.Answers != 5) {
                                                        checkListObj.NI = false;
                                                    }
                                                    else {
                                                        checkListObj.Score = 5;
                                                        checkListObj.Answers = 5;
                                                        checkListObj.originalScore = parseInt(checkListObj.Answers);
                                                        checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                                    }
                                                }
                                                else if (checkListObj.NI == 'N')
                                                    checkListObj.NI = false;
                                                debugger;
                                                if (!(checkListObj.NI == 'N' && checkListObj.Answers == null)) {
                                                    if (checkListObj.Answers != null && checkListObj.Answers.toString().length) {
                                                        checkListObj.parameterno = count++;
                                                        checkListArray.push(checkListObj);
                                                    }
                                                    else {
                                                        continue;
                                                    }
                                                }
                                            }
                                        }
                                        questionaireList.questions = await checkListArray;

                                        let obj1: any = {};
                                        obj1.checkList = JSON.stringify(checkListArray);
                                        obj1.taskId = self.taskId;
                                        obj1.timeElapsed = '';
                                        obj1.timeStarted = '';

                                        await RealmController.addCheckListInDB(realm, obj1, () => {
                                            if (obj.mappingData && obj.mappingData[0]) {
                                                obj.mappingData[0].inspectionForm = obj1;
                                            }
                                            else {
                                                obj.mappingData = [{
                                                    inspectionForm: obj1
                                                }]
                                            }
                                            RealmController.addTaskDetails(realm, obj, TaskSchema.name, () => {
                                                startSync(++i);
                                            })
                                        });
                                    }
                                }
                                else {
                                    startSync(++i);
                                }
                            }
                            else {
                                startSync(++i);
                            }
                        }
                    }
                    else {

                        if (checkListData && checkListData['0'] && checkListData['0'].checkList && JSON.parse(checkListData[0].checkList).length) {
                            startSync(++i);
                        }
                        else {
                            // if (obj.Description && obj.Description != '') {
                            let getChecklistResponse = await fetchGetChecklistApi(obj, [], true, obj.Description);
                            debugger;
                            if (getChecklistResponse && getChecklistResponse['global-instance']) {

                                let checkListArray = [];
                                debugger;
                                let questionsArray = getChecklistResponse['global-instance'] ? getChecklistResponse['global-instance'].entity[1]["instance"] : [];
                                debugger;
                                if (questionsArray) {
                                    for (let i = 0; i < questionsArray.length; i++) {
                                        let questionaire = Object();
                                        questionaire.parameter_score = Array(5);
                                        questionaire.parameter_score_desc = Array(5);
                                        questionaire.parameter_non_comp_desc = Array(5);
                                        for (let j = 0; j < questionsArray[i]['attribute'].length; j++) {

                                            switch (questionsArray[i]['attribute'][j]['@id']) {
                                                case 'parameter':
                                                    questionaire.parameter = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    break;
                                                case 'parameter_weight_mobility':
                                                    questionaire.parameter_weight_mobility = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                    break;
                                                case 'parameter_score_desc_2':
                                                    debugger;
                                                    questionaire.parameter_score_desc_2 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    questionaire.parameter_score_desc[2] = questionaire.parameter_score_desc_2;
                                                    // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_2);
                                                    break;
                                                case 'parameter_EHS_Risk':
                                                    questionaire.parameter_EHS_Risk = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    break;
                                                case 'parameter_score_4':
                                                    questionaire.parameter_score_4 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                    questionaire.parameter_score[4] = questionaire.parameter_score_4;
                                                    // questionaire.parameter_score.push(questionaire.parameter_score_4);
                                                    break;
                                                case 'parameter_score_desc_3':
                                                    questionaire.parameter_score_desc_3 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    questionaire.parameter_score_desc[3] = questionaire.parameter_score_desc_3;
                                                    // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_3);
                                                    break;
                                                case 'parameter_EHS':
                                                    questionaire.parameter_EHS = questionsArray[i]['attribute'][j]['boolean-val'] ? questionsArray[i]['attribute'][j]['boolean-val'] : '';
                                                    break;
                                                case 'parameter_guidance_rules':
                                                    questionaire.parameter_guidance_rules = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    break;
                                                case 'parameter_grace_minimum':
                                                    questionaire.parameter_grace_minimum = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                    break;
                                                case 'parameter_score_desc_1':
                                                    questionaire.parameter_score_desc_1 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    questionaire.parameter_score_desc[1] = questionaire.parameter_score_desc_1;
                                                    // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_1);
                                                    break;
                                                case 'parameter_reference':
                                                    questionaire.parameter_reference = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    break;
                                                case 'parameter_score_desc_4':
                                                    questionaire.parameter_score_desc_4 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    questionaire.parameter_score_desc[4] = questionaire.parameter_score_desc_4;
                                                    // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_4);
                                                    break;
                                                case 'parameter_non_comp_desc_4':
                                                    questionaire.parameter_non_comp_desc_4 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    questionaire.parameter_non_comp_desc[4] = questionaire.parameter_non_comp_desc_4;
                                                    // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_4);
                                                    break;
                                                case 'parameter_non_comp_desc_2':
                                                    questionaire.parameter_non_comp_desc_2 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    questionaire.parameter_non_comp_desc[2] = questionaire.parameter_non_comp_desc_2;
                                                    // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_2);
                                                    break;
                                                case 'parameter_non_comp_desc_3':
                                                    questionaire.parameter_non_comp_desc_3 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    questionaire.parameter_non_comp_desc[3] = questionaire.parameter_non_comp_desc_3;
                                                    // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_3);
                                                    break;
                                                case 'parameter_non_comp_desc_0':
                                                    questionaire.parameter_non_comp_desc_0 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    questionaire.parameter_non_comp_desc[0] = questionaire.parameter_non_comp_desc_0;
                                                    // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_0);
                                                    break;
                                                case 'parameter_non_comp_desc_1':
                                                    questionaire.parameter_non_comp_desc_1 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    questionaire.parameter_non_comp_desc[1] = questionaire.parameter_non_comp_desc_1;
                                                    // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_1);
                                                    break;
                                                case 'parameter_subtype':
                                                    questionaire.parameter_subtype = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    break;
                                                case 'parameter_reg_6':
                                                    questionaire.parameter_reg_6 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    break;
                                                case 'parameter_score_desc_0':
                                                    questionaire.parameter_score_desc_0 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    questionaire.parameter_score_desc[0] = questionaire.parameter_score_desc_0;
                                                    // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_0);
                                                    break;
                                                case 'parameter_score_1':
                                                    questionaire.parameter_score_1 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                    questionaire.parameter_score[1] = questionaire.parameter_score_1;
                                                    // questionaire.parameter_score.push(questionaire.parameter_score_1);
                                                    break;
                                                case 'parameter_score_0':
                                                    questionaire.parameter_score_0 = questionsArray[i]['attribute'][j]['number-val'] || (questionsArray[i]['attribute'][j]['number-val'] == 0) || (questionsArray[i]['attribute'][j]['number-val'] == 0.0) ? questionsArray[i]['attribute'][j]['number-val'] : ''
                                                    questionaire.parameter_score[0] = questionaire.parameter_score_0;
                                                    // questionaire.parameter_score.push(questionaire.parameter_score_0);
                                                    break;
                                                case 'parameter_score_3':
                                                    questionaire.parameter_score_3 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                    questionaire.parameter_score[3] = questionaire.parameter_score_3;
                                                    // questionaire.parameter_score.push(questionaire.parameter_score_3);
                                                    break;
                                                case 'parameter_score_2':
                                                    questionaire.parameter_score_2 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                    questionaire.parameter_score[2] = questionaire.parameter_score_2;
                                                    // questionaire.parameter_score.push(questionaire.parameter_score_2);
                                                    break;
                                                case 'parameter_reg_1':
                                                    questionaire.parameter_reg_1 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    break;
                                                case 'parameter_grace_maximum':
                                                    questionaire.parameter_grace_maximum = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                                    break;
                                                case 'parameter_type':
                                                    questionaire.parameter_type = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                                    break;
                                                case 'parameter_EFST':
                                                    questionaire.parameter_EFST = questionsArray[i]['attribute'][j]['boolean-val'] ? questionsArray[i]['attribute'][j]['boolean-val'] : '';
                                                    break;
                                                default:
                                                    break;
                                            }

                                        }

                                        questionaire.parameter_score = questionaire.parameter_score.reverse();
                                        questionaire.parameter_score_desc = questionaire.parameter_score_desc.reverse();
                                        questionaire.parameter_non_comp_desc = questionaire.parameter_non_comp_desc.reverse();
                                        questionaire.Answers = "";
                                        questionaire.grace = "";
                                        checkListArray.push(questionaire);
                                    }
                                    debugger;

                                    if (checkListArray.length == 0) {
                                        self.noCheckList = 'NocheckListAvailable';
                                        ToastAndroid.show('No Checklist Available ', 1000);
                                    }
                                    else {

                                        let obj: any = {};
                                        let checkArr: any = [];
                                        for (let index = 0; index < checkListArray.length; index++) {
                                            const element = checkListArray[index];
                                            let parameter_weight = element.parameter_weight_mobility != '' ? element.parameter_weight_mobility : 1;

                                            element.Answers = (obj.TaskType.toLowerCase() == 'direct inspection') ? "4" : '';
                                            element.color = "#ffffff";
                                            element.gracePeriod = "";
                                            element.guidance = "";
                                            element.Lang = true ? "ARA" : "ENU";
                                            element.parameter_reference_original = element.parameter_reference;
                                            element.parameter_reference = element.parameter_reference;
                                            element.parameter_score_desc = element.parameter_score_desc;
                                            element.parameter_score = element.parameter_score;
                                            element.parameter_non_comp_desc = element.parameter_non_comp_desc;
                                            element.parameterno = index;
                                            element.role = "";
                                            element.score = (obj.TaskType.toLowerCase() == 'direct inspection' || obj.TaskType.toLowerCase() == 'complaints') ? (4 * parseInt(parameter_weight)) : "";
                                            element.Score = (obj.TaskType.toLowerCase() == 'direct inspection' || obj.TaskType.toLowerCase() == 'complaints') ? (4 * parseInt(parameter_weight)) : "";
                                            element.syncDate = moment().format('L');
                                            element.TotalscoreForQuestion = (obj.TaskType.toLowerCase() == 'direct inspection' || obj.TaskType.toLowerCase() == 'complaints') ? (4 * parseInt(parameter_weight)) : "";
                                            element.NA = "N";
                                            element.NAValue = false;
                                            element.NI = "N";
                                            element.NIValue = false;
                                            element.comment = (obj.TaskType.toLowerCase() == 'direct inspection') ? (element.parameter_non_comp_desc[0] ? (element.parameter_non_comp_desc[0] === 'uncertain') ? '-' : element.parameter_non_comp_desc[0] : '') : "";
                                            if (obj.TaskType.toLowerCase() == 'direct inspection' || obj.TaskType.toLowerCase() == 'complaints') {
                                                if (element.parameter_EHS == true || element.parameter_EHS == 'true' || element.parameter_type === 'uncertain') {
                                                }
                                                else {
                                                    checkArr.push(element)
                                                }
                                            }
                                            else {
                                                if (element.parameter_type == 'uncertain') {
                                                    element.parameter_type = 'EHS';
                                                    element.parameter_EHS = true;
                                                }
                                                checkArr.push(element)
                                            }
                                        }
                                        //covid checklist flag
                                        if (true) {
                                            CovidChecklistArray = getCovidChecklist(true)
                                        }

                                        let checklistSaveArr = Array();
                                        let checklistCovidSaveArr = Array();
                                        for (let indexcovid = 0; indexcovid < CovidChecklistArray.length; indexcovid++) {
                                            const element = CovidChecklistArray[indexcovid];
                                            let parameter_weight = element.parameter_weight_mobility != '' ? element.parameter_weight_mobility : 1;
                                            if (obj.TaskType.toLowerCase() == 'direct inspection' || (obj.TaskType.toLowerCase() == 'complaints')) {
                                                element.score = ((obj.TaskType.toLowerCase() == 'direct inspection') || (obj.TaskType.toLowerCase() == 'complaints')) ? (4 * parseInt(parameter_weight)) : "";
                                                element.Score = ((obj.TaskType.toLowerCase() == 'direct inspection') || (obj.TaskType.toLowerCase() == 'complaints')) ? (4 * parseInt(parameter_weight)) : "";
                                                element.Answers = ((obj.TaskType.toLowerCase() == 'direct inspection') || (obj.TaskType.toLowerCase() == 'complaints')) ? "4" : '';
                                                element.syncDate = moment().format('L');
                                                element.TotalscoreForQuestion = ((obj.TaskType.toLowerCase() == 'direct inspection') || (obj.TaskType.toLowerCase() == 'complaints')) ? (4 * parseInt(parameter_weight)) : "";
                                                element.comment = ((obj.TaskType.toLowerCase() == 'direct inspection') || (obj.TaskType.toLowerCase() == 'complaints')) ? (element.parameter_non_comp_desc[0] ? (element.parameter_non_comp_desc[0] === 'uncertain') ? '-' : element.parameter_non_comp_desc[0] : '') : "";
                                                if (obj.TaskType.toLowerCase() == 'direct inspection' || obj.TaskType.toLowerCase() == 'complaints') {
                                                    if (element.parameter_EHS == true || element.parameter_EHS == 'true' || element.parameter_type === 'uncertain') {
                                                    }
                                                    else {
                                                        checklistCovidSaveArr.push(element)
                                                    }
                                                }
                                                else {
                                                    checklistCovidSaveArr.push(element)
                                                }
                                            }
                                            else {
                                                checklistCovidSaveArr.push(element)
                                            }
                                        }
                                        checklistSaveArr = [...checklistCovidSaveArr, ...checkArr];

                                        for (let indexChecklist = 0; indexChecklist < checklistSaveArr.length; indexChecklist++) {
                                            const element = checklistSaveArr[indexChecklist];
                                            element.parameterno = indexChecklist;
                                        }

                                        obj.checkList = JSON.stringify(checklistSaveArr);
                                        obj.taskId = self.taskId;
                                        obj.timeElapsed = '';
                                        obj.timeStarted = '';
                                        debugger;

                                        RealmController.addCheckListInDB(realm, obj, () => {
                                            // ToastAndroid.show('Task added to db successfully', 1000);
                                        });

                                    }
                                }
                                else {
                                    self.noCheckList = 'NocheckListAvailable';
                                }
                            }
                            // }
                        }
                    }
                }

            }

            startSync(i);

        }
        catch (e) {
            //console.log('Exception My Task' + e);
            // //console.log('Exception My Task' + e);
        }

    }),

    callToSubmitTaskApi: flow(function* (payload: any, arr: any, flag: boolean, value: string, finalTime: string, rejectBtnClick: boolean) {

        self.state = "pending";
        self.loadingState = 'Stay on this page until submission is completed';
        self.isSuccess = false;
        self.createAdhoc = false;

        const granted = yield PermissionsAndroid.requestMultiple(
            [PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
            ]
        ).then(async (result) => {

            if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
                && result['android.permission.READ_EXTERNAL_STORAGE'] === 'granted') {

                readDir("/storage/emulated/0/Android/data/ae.adafsa.smartcontrol/files/")
                    .then((res: any) => {
                        console.log(">>" + res)
                    })
                    .catch((res: any) => {
                        console.log("error>" + res)
                    })
            }
            else if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'denied'
                || result['android.permission.READ_EXTERNAL_STORAGE']
                === 'denied') {
                debugger;

            }
            else if (result['android.permission.WRITE_EXTERNAL_STORAGE'] === 'never_ask_again'
                || result['android.permission.READ_EXTERNAL_STORAGE']
                === 'never_ask_again') {
                debugger;
            }
        });

        readDir("/storage/emulated/0/Android/data/com.starsin/files/attachments")
            .then((res: any) => {
                console.log(res)
            })
            .then((res: any) => {
                console.log(res)
            })

        const getPercentageDed = (data: string) => {
            switch (data) {
                case 'Violation':
                    return 20;
                case 'First Warning':
                    return 10;
                case 'Final Warning':
                    return 10;
                case 'Notice':
                    return 5;
                default:
                    return 0;
            }
        }

        const getGrade = (scorePercentage: any) => {
            let grade = 'Grade E';
            if (scorePercentage >= 90 && scorePercentage <= 100) {
                grade = 'Grade A';
            } else if (scorePercentage >= 75 && scorePercentage < 90) {
                grade = 'Grade B';
            } else if (scorePercentage >= 60 && scorePercentage < 75) {
                grade = 'Grade C';
            } else if (scorePercentage >= 45 && scorePercentage < 60) {
                grade = 'Grade D';
            } else if (scorePercentage < 45) {
                grade = 'Grade E';
            }
            return grade;
        }

        const getFollowupCheckList = (checklist: any) => {
            let Arr = [...checklist];
            let weightage = 1;
            for (let k = 0; k < Arr.length; k++) {

                if (Arr[k].Weightage == "" || Arr[k].Weightage == null) {
                    weightage = 1;
                } else {
                    weightage = parseInt(Arr[k].Weightage);
                }

                // if (Arr[k].score == 'Y') {
                //     Arr[k].FinalScore = 4;
                //     Arr[k].GracePeriod = 0;
                //     Arr[k].calculatedGracePeriod = 0;
                // }
                if (parseInt(Arr[k].score) == 4) {
                    // For Score == 4
                    //  Score Calculation
                    Arr[k].FinalScore = 4;
                    Arr[k].GracePeriod = 0;
                    Arr[k].calculatedGracePeriod = 0;

                }
                else {
                    // For score other than 4 , 
                    // If date is from future, do score and grace calculations
                    let date1 = new Date(Arr[k].GracePeriodDate);
                    let date2 = new Date();

                    if (date1 > date2) {
                        //Non Conformant Answered
                        if (Arr[k].score != '' && Arr[k].score != '-' && !Arr[k].NI) {
                            Arr[k].FinalScore = Arr[k].Answers;
                        }
                        else {
                            // Non Conformant not answered
                            try {
                                // console.log('date1 is greater than date2' + date1 + 'sssss' + date2);
                                if (Arr[k].Answers == Arr[k].originalScore) {
                                    Arr[k].isNotAnswered = true;
                                }
                                // if (!isNaN(parseInt(Arr[k].score))) {
                                //     Arr[k].FinalScore = Arr[k].score
                                // }
                                // else if (!isNaN(parseInt(Arr[k].Answers))) {
                                //     Arr[k].FinalScore = Arr[k].Answers
                                // }

                            }
                            catch (e) {

                            }
                        }

                    }
                    else {

                        if ((parseInt(Arr[k].Answers) > 0)) {
                            // if (!isNaN(parseInt(Arr[k].score))) {
                            //     Arr[k].FinalScore = Arr[k].score;

                            // }
                            // else if ((Arr[k].score == 'N') && Arr[k].originalScore > 0) {
                            Arr[k].FinalScore = Arr[k].originalScore - 1;
                            Arr[k].Answers = Arr[k].Answers;
                            // }
                        }
                        else if ((parseInt(Arr[k].Answers) == 0)) {
                            Arr[k].FinalScore = Arr[k].Answers;
                        }
                    }
                }
                if ((Arr[k].GracePeriod) < 0) {
                    Arr[k].GracePeriod = 0;
                    Arr[k].calculatedGracePeriod = 0;
                }

            }
            // Alert.alert(JSON.stringify(Arr.length))
            return Arr;
        }

        try {
            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData['0'] ? loginData['0'] : {};
            let loginInfo: any = (loginData && loginData.loginResponse && (loginData.loginResponse != '')) ? JSON.parse(loginData.loginResponse) : {}

            let taskType = self.selectedTask != '' ? JSON.parse(self.selectedTask).TaskType ? JSON.parse(self.selectedTask).TaskType : '' : ''
            let tempArray: any = [];

            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, (self.isMyTaskClick == 'campaign' ? self.campaignChecklistTaskId : self.taskId));
            let taskItem = RealmController.getTaskDetails(realm, TaskSchema.name, (self.isMyTaskClick == 'campaign' ? self.campaignChecklistTaskId : self.taskId));
            if (checkListData && checkListData['0']) {
                tempArray = (checkListData['0'].checkList != '') ? JSON.parse(checkListData['0'].checkList) : arr;
            }

            let taskDetails: any = self.selectedTask != '' ? JSON.parse(self.selectedTask) : taskItem['0'] ? taskItem['0'] : {};

            if (taskType.toLowerCase() == 'follow-up') {
                let followUpArray = getFollowupCheckList(tempArray)
                yield Promise.all(followUpArray = getFollowupCheckList(tempArray)).then(async (results) => {

                    // console.log("followupchecklist:::>>>" + JSON.stringify(followUpArray))
                    payload = await submissionPayloadFollow(followUpArray, taskDetails, followUpArray, taskDetails.TaskId, taskDetails, loginData.username, self.contactName, self.mobileNumber, self.emiratesId, finalTime, self.finalComment, self.result, self.flashlightCBValue, self.thermometerCBValue, self.dataLoggerCBValue, self.luxmeterCBValue, self.UVlightCBValue, self.latitude, self.longitude, self.nextVisit, self.grade, self.totalScore);
                    // console.log("results>>" + results);
                }).catch(err => {
                    // Alert.alert('', 'Failed To Upload Attachment');
                    // console.log("err?>>" + err);
                });

            }
            else {

                if (taskType.toLowerCase() == 'direct inspection' && value == 'withoutChecklist') {
                    tempArray = [];
                }
                payload = submissionPayload(taskType, tempArray, taskDetails.TaskId, taskDetails, loginData.username, self.contactName, self.mobileNumber, self.emiratesId, finalTime, self.finalComment, rejectBtnClick, self.flashlightCBValue, self.thermometerCBValue, self.dataLoggerCBValue, self.luxmeterCBValue, self.UVlightCBValue, self.latitude, self.longitude, '', self.result, taskDetails.SiebelTaskId, taskDetails.AssessmentScore, taskDetails.Description2, taskDetails.MaxScore, taskDetails.Name2, taskDetails.Percent, taskDetails.Template_Name, self.visitType, self.scope, self.noOfVisits, self.nextVisit, self.grade, self.totalScore, value);

            }
            try {

                if ((taskType.toLowerCase() == 'direct inspection') || (taskType.toLowerCase() == 'routine inspection')) {
                    if (self.percentage != '') {
                        payload.InspectionCheckList.Inspection.ScorePercent = (parseFloat(self.percentage) - getPercentageDed(self.result)).toFixed(2)
                        payload.InspectionCheckList.Inspection.Grade = getGrade((parseFloat(self.percentage) - getPercentageDed(self.result)).toFixed(2))
                        if (payload.InspectionCheckList.Inspection.ScorePercent < 0) {
                            payload.InspectionCheckList.Inspection.ScorePercent = 0;
                        }
                    }
                }

            } catch (error) {

            }

            try {

                let date = moment(new Date()).format("DD-MM-YYYY hh:mm:ss")
                let ViolationDateArr = date.split(" ");
                let vioDate = ViolationDateArr['0'];
                let vioTime = ViolationDateArr[1];

                if (taskType.toLowerCase().includes('noc') || taskType.toLowerCase().includes('food')) {

                    if (taskDetails && taskDetails.mappingData && payload.InspectionCheckList && payload.InspectionCheckList.Inspection) {
                        let tempdata = { ...taskDetails }
                        let tempObjct = tempdata.mappingData && (typeof (tempdata.mappingData) == 'string') ? JSON.parse(tempdata.mappingData) : tempdata.mappingData;
                        let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, tempdata.EstablishmentId);

                        tempObjct['0'].total_score = self.score != '' ? self.score : payload.InspectionCheckList.Inspection.Score;//payload.InspectionCheckList.Inspection.Score;
                        // tempObjct['0'].signatureBase64 = documantationDraft.fileBuffer;
                        tempObjct['0'].ContactName = self.contactName;
                        tempObjct['0'].ContactNumber = self.mobileNumber;
                        tempObjct['0'].EmiratesId = self.emiratesId;
                        tempObjct['0'].grade_percentage = self.percentage != '' ? self.percentage : payload.InspectionCheckList.Inspection.ScorePercent;//payload.InspectionCheckList.Inspection.ScorePercent;
                        tempObjct['0'].finalResult = payload.InspectionCheckList.Inspection.Action;
                        tempObjct['0'].next_visit_date = self.nextVisit != '' ? self.nextVisit : payload.InspectionCheckList.Inspection.NearestDate;//payload.InspectionCheckList.Inspection.NearestDate;
                        tempObjct['0'].TradeExpiryDate = temp[0].LicenseExpiryDate ? temp[0].LicenseExpiryDate : '';
                        tempObjct['0'].CustomerName = temp[0].EnglishName ? temp[0].EnglishName : '';
                        tempObjct['0'].CustomerNameEnglish = temp[0].EnglishName ? temp[0].EnglishName : '';
                        tempObjct['0'].flashlightCBValue = self.flashlightCBValue;
                        tempObjct['0'].thermometerCBValue = self.thermometerCBValue;
                        tempObjct['0'].luxmeterCBValue = self.luxmeterCBValue;
                        tempObjct['0'].dataLoggerCBValue = self.dataLoggerCBValue;
                        tempObjct['0'].UVlightCBValue = self.UVlightCBValue;
                        tempObjct['0'].UVlightCBValue = self.UVlightCBValue;
                        tempObjct['0'].overallComments = self.finalComment;
                        tempObjct['0'].ContactName = self.contactName;
                        tempObjct['0'].ContactNumber = self.mobileNumber;
                        tempObjct['0'].EmiratesId = self.emiratesId;
                        tempObjct['0'].ViolationDate = vioDate;
                        tempObjct['0'].ViolationTime = vioTime;
                        tempdata.mappingData = tempObjct;

                        RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                        });

                    }
                }
                else if (self.isMyTaskClick == 'campaign') {
                    if (taskDetails && taskDetails.mappingData && payload.InspectionCheckList && payload.InspectionCheckList.Inspection) {
                        let tempdata = { ...taskDetails }
                        let tempObjct = self.campaignMappingData != '' ? JSON.parse(self.campaignMappingData) : []
                        let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, tempdata.EstablishmentId);

                        tempObjct[parseInt(self.campaignSelectedEstIndex)].total_score = self.score != '' ? self.score : payload.InspectionCheckList.Inspection.Score;//payload.InspectionCheckList.Inspection.Score;
                        // tempObjct[parseInt(self.campaignSelectedEstIndex)].signatureBase64 = documantationDraft.fileBuffer;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].ContactName = self.contactName;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].finalResult = payload.InspectionCheckList.Inspection.Action;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].ContactNumber = self.mobileNumber;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].EmiratesId = self.emiratesId;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].grade_percentage = self.percentage != '' ? self.percentage : (payload.InspectionCheckList.Inspection && payload.InspectionCheckList.Inspection.ScorePercent) ? payload.InspectionCheckList.Inspection.ScorePercent : '';//payload.InspectionCheckList.Inspection.ScorePercent ? payload.InspectionCheckList.Inspection.ScorePercent.toFixed(2) : '';
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].TradeExpiryDate = temp[0].LicenseExpiryDate ? temp[0].LicenseExpiryDate : '';
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].CustomerName = temp[0].EnglishName;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].CustomerNameEnglish = temp[0].EnglishName;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].flashlightCBValue = self.flashlightCBValue;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].thermometerCBValue = self.thermometerCBValue;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].luxmeterCBValue = self.luxmeterCBValue;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].dataLoggerCBValue = self.dataLoggerCBValue;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].UVlightCBValue = self.UVlightCBValue;
                        // tempObjct[parseInt(self.campaignSelectedEstIndex)].condemnationReport = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];
                        // tempObjct[parseInt(self.campaignSelectedEstIndex)].detentionReport = detentionDraft.detentionArray != '' ? JSON.parse(detentionDraft.detentionArray) : [];
                        // tempObjct[parseInt(self.campaignSelectedEstIndex)].samplingReport = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].ViolationDate = vioDate;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].ViolationTime = vioTime;
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].GracePeriod = payload.InspectionCheckList.Inspection.GracePeriod ? payload.InspectionCheckList.Inspection.GracePeriod : '';
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].next_visit_date = payload.InspectionCheckList.Inspection.NearestDate ? payload.InspectionCheckList.Inspection.NearestDate : '';
                        tempObjct[parseInt(self.campaignSelectedEstIndex)].overallComments = self.finalComment;
                        tempdata.mappingData = tempObjct;
                        tempdata.samplingFlag = self.selectedTask != '' ? JSON.parse(self.selectedTask).samplingFlag : false;
                        tempdata.condemnationFlag = self.selectedTask != '' ? JSON.parse(self.selectedTask).condemnationFlag : false;
                        tempdata.detentionFlag = self.selectedTask != '' ? JSON.parse(self.selectedTask).detentionFlag : false;
                        RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                        });

                    }
                }
                else if (taskType.toLowerCase() == 'supervisory inspections' || taskType.toLowerCase() == 'monitor inspector performance') {
                    // mappingData[parseInt(self.campaignSelectedEstIndex)].inspectionForm = tempArray;
                    // taskDetails.mappingData[parseInt(self.campaignSelectedEstIndex)] = mappingData;
                    try {

                        payload.LoginId = loginInfo.UserId ? loginInfo.UserId : '';
                        if (taskType.toLowerCase() == 'supervisory inspections') {
                            payload.Attrib4 = taskDetails.PrimaryOwnerId ? taskDetails.PrimaryOwnerId : '';
                        }

                        if (taskDetails && taskDetails.mappingData) {
                            let tempdata = { ...taskDetails }
                            let tempObjct = tempdata.mappingData && (typeof (tempdata.mappingData) == 'string') ? JSON.parse(tempdata.mappingData) : tempdata.mappingData;
                            // let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]
                            let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, tempdata.EstablishmentId);

                            tempObjct[0].total_score = self.score;//payload.InspectionCheckList.Inspection.Score;
                            // tempObjct[0].signatureBase64 = documantationDraft.fileBuffer;
                            tempObjct[0].ContactName = self.contactName;
                            tempObjct[0].finalResult = self.result;
                            tempObjct[0].ContactNumber = self.mobileNumber;
                            tempObjct[0].EmiratesId = self.emiratesId;
                            tempObjct[0].grade_percentage = '';
                            tempObjct[0].TradeExpiryDate = temp[0] && temp[0].LicenseExpiryDate ? temp[0].LicenseExpiryDate : '';
                            tempObjct[0].CustomerName = temp[0] && temp[0].EnglishName ? temp[0].EnglishName : '';
                            tempObjct[0].CustomerNameEnglish = temp[0] && temp[0].EnglishName ? temp[0].EnglishName : '';
                            tempObjct[0].flashlightCBValue = self.flashlightCBValue;
                            tempObjct[0].thermometerCBValue = self.thermometerCBValue;
                            tempObjct[0].luxmeterCBValue = self.luxmeterCBValue;
                            tempObjct[0].dataLoggerCBValue = self.dataLoggerCBValue;
                            tempObjct[0].UVlightCBValue = self.UVlightCBValue;
                            // tempObjct[0].condemnationReport = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];
                            // tempObjct[0].detentionReport = detentionDraft.detentionArray != '' ? JSON.parse(detentionDraft.detentionArray) : [];
                            // tempObjct[0].samplingReport = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];
                            tempObjct[0].ViolationDate = vioDate;
                            tempObjct[0].ViolationTime = vioTime;
                            tempObjct[0].GracePeriod = '';
                            // delete tempdata.mappingData;
                            tempObjct[0].overallComments = self.finalComment;
                            tempdata.mappingData = tempObjct;
                            tempdata.samplingFlag = self.selectedTask != '' ? JSON.parse(self.selectedTask).samplingFlag : false;
                            tempdata.condemnationFlag = self.selectedTask != '' ? JSON.parse(self.selectedTask).condemnationFlag : false;
                            tempdata.detentionFlag = self.selectedTask != '' ? JSON.parse(self.selectedTask).detentionFlag : false;
                            RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                                // ToastAndroid.show('Task objct successfully ', 1000);
                            });

                        }
                    } catch (e) {
                        console.log('Exceptiom ::' + e)
                    }

                }
                else if (taskType.toLowerCase() == 'bazar inspection') {
                    payload = payload;
                }
                else {

                    if (taskDetails && taskDetails.mappingData && payload.InspectionCheckList && payload.InspectionCheckList.Inspection) {
                        let tempdata = { ...taskDetails }
                        // let tempObjct = tempdata.mappingData ? tempdata.mappingData : [{}]
                        let tempObjct = tempdata.mappingData && (typeof (tempdata.mappingData) == 'string') ? JSON.parse(tempdata.mappingData) : tempdata.mappingData;
                        let temp = RealmController.getEstablishmentById(realm, EstablishmentSchema.name, tempdata.EstablishmentId);

                        tempObjct[0].total_score = self.score != '' ? self.score : payload.InspectionCheckList.Inspection.Score;//payload.InspectionCheckList.Inspection.Score;
                        // tempObjct[0].signatureBase64 = documantationDraft.fileBuffer;
                        tempObjct[0].ContactName = self.contactName;
                        tempObjct[0].finalResult = payload.InspectionCheckList.Inspection.Action ? payload.InspectionCheckList.Inspection.Action : self.result;
                        tempObjct[0].ContactNumber = self.mobileNumber;
                        tempObjct[0].EmiratesId = self.emiratesId;
                        tempObjct[0].grade_percentage = self.percentage != '' ? self.percentage : payload.InspectionCheckList.Inspection.ScorePercent ? payload.InspectionCheckList.Inspection.ScorePercent : '';//payload.InspectionCheckList.Inspection.ScorePercent ? payload.InspectionCheckList.Inspection.ScorePercent.toFixed(2) : '';
                        tempObjct[0].TradeExpiryDate = temp[0].LicenseExpiryDate ? temp[0].LicenseExpiryDate : '';
                        tempObjct[0].CustomerName = temp[0].EnglishName;
                        tempObjct[0].CustomerNameEnglish = temp[0].EnglishName;
                        tempObjct[0].flashlightCBValue = self.flashlightCBValue;
                        tempObjct[0].thermometerCBValue = self.thermometerCBValue;
                        tempObjct[0].luxmeterCBValue = self.luxmeterCBValue;
                        tempObjct[0].dataLoggerCBValue = self.dataLoggerCBValue;
                        tempObjct[0].UVlightCBValue = self.UVlightCBValue;
                        // tempObjct[0].condemnationReport = condemnationDraft.condemnationArray != '' ? JSON.parse(condemnationDraft.condemnationArray) : [];
                        // tempObjct[0].detentionReport = detentionDraft.detentionArray != '' ? JSON.parse(detentionDraft.detentionArray) : [];
                        // tempObjct[0].samplingReport = samplingDraft.samplingArray != '' ? JSON.parse(samplingDraft.samplingArray) : [];
                        tempObjct[0].ViolationDate = vioDate;
                        tempObjct[0].ViolationTime = vioTime;
                        tempObjct[0].GracePeriod = payload.InspectionCheckList.Inspection.GracePeriod ? payload.InspectionCheckList.Inspection.GracePeriod : '';
                        tempObjct[0].next_visit_date = self.nextVisit;//payload.InspectionCheckList.Inspection.NearestDate ? payload.InspectionCheckList.Inspection.NearestDate : '';
                        // delete tempdata.mappingData;
                        tempObjct[0].overallComments = self.finalComment;
                        tempdata.mappingData = tempObjct;
                        tempdata.samplingFlag = self.selectedTask != '' ? JSON.parse(self.selectedTask).samplingFlag : false;
                        tempdata.condemnationFlag = self.selectedTask != '' ? JSON.parse(self.selectedTask).condemnationFlag : false;
                        tempdata.detentionFlag = self.selectedTask != '' ? JSON.parse(self.selectedTask).detentionFlag : false;
                        RealmController.addTaskDetails(realm, tempdata, TaskSchema.name, () => {
                            // ToastAndroid.show('Task objct successfully ', 1000);
                        });

                    }

                    if ((taskType.toLowerCase() == 'direct inspection') && (value == 'withoutChecklist')) {

                    }
                    else {
                        if (payload.InspectionCheckList.Inspection.Action == '') {
                            payload.InspectionCheckList.Inspection.Action = self.result
                        }
                    }
                }

            }
            catch (e) {
                // alert('exception' + e);
            }

            // console.log('payload' + JSON.stringify(payload))

            let TaskSubmitApiResponse: any;
            let submitWithoutchecklistFlag = false;
            if (flag && !self.taskSubmitted && value != 'withoutChecklist') {
                TaskSubmitApiResponse = yield InspectionSubmitService(payload, taskDetails.TaskType);
            }
            else if (value == 'withoutChecklist') {
                submitWithoutchecklistFlag = true;
            }
            else {
                TaskSubmitApiResponse = undefined;
            }
            debugger;
            let mappingData = taskDetails.mappingData ? typeof (taskDetails.mappingData) == 'string' ? JSON.parse(taskDetails.mappingData) : taskDetails.mappingData : [{}];

            mappingData[parseInt(self.campaignSelectedEstIndex)].isCompltedOffline = true;
            taskDetails.mappingData = mappingData;

            if (taskDetails.mappingData && payload.InspectionCheckList && payload.InspectionCheckList.Inspection) {
                taskDetails.mappingData[parseInt(self.campaignSelectedEstIndex)].GracePeriod = payload.InspectionCheckList.Inspection.GracePeriod;
                taskDetails.mappingData[parseInt(self.campaignSelectedEstIndex)].ScorePercent = payload.InspectionCheckList.Inspection.ScorePercent;
            }
            console.log("TaskSubmitApiResponse::" + JSON.stringify(TaskSubmitApiResponse))

            if (isDev) {
                let path = DownloadDirectoryPath + '/' + self.taskId + "_Payload.txt";
                writeFile(path, JSON.stringify({ payload, TaskSubmitApiResponse }), 'utf8')
                    .then(async (success) => {

                    })
                    .catch((err) => {
                        console.log(err.message);
                    });
            }


            if (submitWithoutchecklistFlag) {

                let attachmentTemp = Array();
                try {

                    let arrayTemp: any = RealmController.getbase64ListForTaskId(realm, self.taskId)
                    if (arrayTemp && arrayTemp['0']) {
                        let array = arrayTemp['0']
                        let arr = JSON.parse(array.base64List)

                        if (arr.length) {
                            attachmentTemp = arr;
                        }
                    }
                } catch (error) {
                    //console.log("attachmenterr:" + error)
                }

                if (self.isMyTaskClick == 'campaign') {
                    attachmentTemp.push({
                        uniqueQuestionId: 'signature',
                        buffer: taskDetails.mappingData[parseInt(self.campaignSelectedEstIndex)].signatureBase64
                    })
                }
                else {
                    attachmentTemp.push({
                        uniqueQuestionId: 'signature',
                        buffer: taskDetails.mappingData['0'].signatureBase64
                    })
                }

                if (self.evidanceAttachment1 != '') {
                    attachmentTemp.push({
                        uniqueQuestionId: 'evidence_1',
                        buffer: self.evidanceAttachment1
                    })
                }
                if (self.evidanceAttachment2 != '') {
                    attachmentTemp.push({
                        uniqueQuestionId: 'evidence_2',
                        buffer: self.evidanceAttachment2
                    })
                }
                if (self.licencesAttachment1 != '') {
                    attachmentTemp.push({
                        uniqueQuestionId: 'licences_1',
                        buffer: self.licencesAttachment1
                    })
                }
                if (self.licencesAttachment2 != '') {
                    attachmentTemp.push({
                        uniqueQuestionId: 'licences_2',
                        buffer: self.licencesAttachment2
                    })
                }
                if (self.EmiratesIdAttachment1 != '') {
                    attachmentTemp.push({
                        uniqueQuestionId: 'EmiratesId_1',
                        buffer: self.EmiratesIdAttachment1
                    })
                }
                if (self.EmiratesIdAttachment2 != '') {
                    attachmentTemp.push({
                        uniqueQuestionId: 'EmiratesId_2',
                        buffer: self.EmiratesIdAttachment2
                    })
                }


                let attachmentReqRes = Array();
                let attachmentFailedArray = Array();
                let submissionStatusFlag = true;

                yield Promise.all(attachmentTemp.map(async (element, index) => {
                    let getQuestionarieAttachmentResponse = Object();
                    let payloadAttachment = Object();

                    console.log("attachmentindex::" + JSON.stringify(index))
                    if (element && element.buffer != '') {

                        payloadAttachment = {
                            "InterfaceID": "ADFCA_CRM_SBL_039",
                            "LanguageType": "ENU",
                            "InspectorId": [
                                loginData.username
                            ],
                            "InspectorName": loginData.username,
                            "Checklistattachment": {
                                "Inspection": {
                                    "TaskId": self.isMyTaskClick == 'campaign' ? TaskSubmitApiResponse.IsReschedule : taskDetails.TaskId,
                                    "ListOfActionAttachment": {
                                        "QuestAttachment": {
                                            "FileExt": "jpg",
                                            "FileName": element.uniqueQuestionId + ((element.uniqueQuestionId == 'signature') ? '.png' : '.jpg'),
                                            "FileSize": "",
                                            "FileSrcPath": "",
                                            "FileSrcType": "",
                                            "Comment": "",
                                            "FileBuffer": element.buffer
                                        }
                                    }
                                }
                            }
                        }
                        getQuestionarieAttachmentResponse = await fetchGetQuestionarieAttachmentApi(payloadAttachment);

                        attachmentReqRes.push({ payloadAttachment, getQuestionarieAttachmentResponse });
                        if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                            // if (false) {
                        }
                        else {
                            // self.attachmentSubmittedFailed = true;
                            attachmentFailedArray.push(payloadAttachment)
                            submissionStatusFlag = false;
                            ToastAndroid.show(getQuestionarieAttachmentResponse.message ? getQuestionarieAttachmentResponse.message : 'Failed To Upload Attachment,ErrorMessage:' + getQuestionarieAttachmentResponse.ErrorMessage + 'ErrorCode:' + getQuestionarieAttachmentResponse.ErrorCode, 1000);
                        }
                    }
                }
                )).then(results => {
                    console.log("results>>" + JSON.stringify(results));
                }).catch(err => {
                    // Alert.alert('', 'Failed To Upload Attachment');
                    console.log("err?>>" + err);
                });

                if (attachmentFailedArray.length) {
                    self.attachmentSubmittedFailed = true;
                }

                self.failedAttachmentArray = attachmentFailedArray.length ? JSON.stringify(attachmentFailedArray) : '';

                const format1 = "lll";
                taskDetails.CompletionDate = moment().format(format1);
                self.taskSubmitted = true;
                if (flag && submissionStatusFlag) {
                    self.taskSubmitted = true;
                    taskDetails.isCompleted = true;
                    taskDetails.TaskStatus = 'Completed';

                    RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                        console.log("isCompleted>>" + taskDetails.isCompleted + ",taskDetails.TaskStatus>>" + taskDetails.TaskStatus)
                    });

                    if (self.isMyTaskClick === 'myTask') {
                        let newTaskArray = self.dataArray1 != '' ? JSON.parse(self.dataArray1) : [];
                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                        self.dataArray1 = (JSON.stringify(newTaskArray));
                        self.myTaskCount = (newTaskArray.length.toString());

                        let newTaskArrayPast = self.dataArray1Past != '' ? JSON.parse(self.dataArray1Past) : [];
                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                        self.dataArray1Past = (JSON.stringify(newTaskArrayPast));
                    }

                    self.contactName = '';
                    self.taskId = '';
                    self.checkliststate = '';
                    self.mobileNumber = '';
                    self.emiratesId = '';
                    self.evidanceAttachment1 = ''
                    self.evidanceAttachment1Url = ''
                    self.evidanceAttachment2 = ''
                    self.evidanceAttachment2Url = ''
                    self.licencesAttachment1 = ''
                    self.licencesAttachment1Url = '';
                    self.licencesAttachment2 = ''
                    self.licencesAttachment2Url = ''
                    self.EmiratesIdAttachment1 = ''
                    self.EmiratesIdAttachment1Url = ''
                    self.EmiratesIdAttachment2 = ''
                    self.EmiratesIdAttachment2Url = ''
                    self.noCheckList = ''
                    self.result = ''
                    self.finalComment = ''
                    self.flashlightCBValue = false
                    self.thermometerCBValue = false
                    self.dataLoggerCBValue = false
                    self.luxmeterCBValue = false
                    self.foodalertSampling = false
                    self.UVlightCBValue = false
                    self.latitude = ''
                    self.longitude = ''
                    self.percentage = ''
                    self.totalScore = ''
                    self.grade = ''
                    self.maxscore = ''
                    self.failedAttachmentArray = ''
                    self.voilationFailedAttachmentArray = ''
                    self.attachmentSubmittedFailed = false

                    self.loadingState = '';
                    self.state = 'navigate'
                    self.isSuccess = true;

                    NavigationService.navigate('Dashboard');
                }

                if (!submissionStatusFlag && flag) {

                    if (flag) {
                        self.loadingState = '';
                        self.state = self.retryCount == '1' ? 'navigate' : 'failedToSubmit'
                        if (self.retryCount == '1') {
                            taskDetails.isCompleted = true;
                            taskDetails.TaskStatus = 'Failed';
                            self.loadingState = '';
                            const format1 = "lll"
                            taskDetails.CompletionDate = moment().format(format1);

                            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {

                            });

                            if (flag) {

                                if (self.isMyTaskClick === 'myTask') {
                                    let newTaskArray = self.dataArray1 != '' ? JSON.parse(self.dataArray1) : [];
                                    newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                    self.dataArray1 = (JSON.stringify(newTaskArray));
                                    self.myTaskCount = (newTaskArray.length.toString());

                                    let newTaskArrayPast = self.dataArray1Past != '' ? JSON.parse(self.dataArray1Past) : [];
                                    newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                    self.dataArray1Past = (JSON.stringify(newTaskArrayPast));
                                }


                                self.contactName = '';
                                self.taskId = '';
                                self.checkliststate = '';
                                self.mobileNumber = '';
                                self.emiratesId = '';
                                self.evidanceAttachment1 = ''
                                self.evidanceAttachment1Url = ''
                                self.evidanceAttachment2 = ''
                                self.evidanceAttachment2Url = ''
                                self.licencesAttachment1 = ''
                                self.licencesAttachment1Url = '';
                                self.licencesAttachment2 = ''
                                self.licencesAttachment2Url = ''
                                self.EmiratesIdAttachment1 = ''
                                self.EmiratesIdAttachment1Url = ''
                                self.EmiratesIdAttachment2 = ''
                                self.EmiratesIdAttachment2Url = ''
                                self.noCheckList = ''
                                self.result = ''
                                self.finalComment = ''
                                self.flashlightCBValue = false
                                self.thermometerCBValue = false
                                self.dataLoggerCBValue = false
                                self.luxmeterCBValue = false
                                self.foodalertSampling = false
                                self.UVlightCBValue = false
                                self.latitude = ''
                                self.longitude = ''
                                self.percentage = ''
                                self.totalScore = ''
                                self.grade = ''
                                self.maxscore = ''
                                self.failedAttachmentArray = ''
                                self.voilationFailedAttachmentArray = ''
                                self.attachmentSubmittedFailed = false
                                NavigationService.navigate('Dashboard');
                            }
                            if (self.isMyTaskClick != 'campaign') {
                                RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                    // ToastAndroid.show('Task objct successfully ', 1000);
                                    NavigationService.navigate('Dashboard');
                                });
                            }
                        }
                    }
                    console.log("self.state?>>" + self.state);

                }
            }
            else {
                if (TaskSubmitApiResponse && TaskSubmitApiResponse.Status && (TaskSubmitApiResponse.Status == "Success") && !self.taskSubmitted) {
                    let reqResponseArr = Array()
                    reqResponseArr.push({ payload, TaskSubmitApiResponse })
                    taskDetails.mappingData[parseInt(self.campaignSelectedEstIndex)].reqResponseArr = JSON.stringify(reqResponseArr);

                    const format1 = "lll";

                    taskDetails.CompletionDate = moment().format(format1);
                    self.taskSubmitted = true;

                    if (self.selectedTask != '' && (JSON.parse(self.selectedTask).TaskType.toString().toLowerCase() == 'sampling' || JSON.parse(self.selectedTask).TaskType.toString().toLowerCase() == 'condemnation' || JSON.parse(self.selectedTask).TaskType.toString().toLowerCase() == 'detention')) {
                        let obj: any = {};
                        obj.checkList = '';
                        obj.taskId = self.taskId;
                        obj.timeElapsed = '';
                        obj.timeStarted = '';
                        obj.isCompleted = true;
                        debugger;
                        RealmController.addCheckListInDB(realm, obj, function dataWrite(params: any) {
                        });
                    }
                    // else {

                    //     obj.checkList = checkListData['0'].checkList;
                    //     obj.taskId = self.isMyTaskClick == 'campaign' ? self.campaignChecklistTaskId : self.taskId;
                    //     obj.timeElapsed = checkListData['0'].timeElapsed;
                    //     obj.timeStarted = checkListData['0'].timeStarted;
                    //     obj.isCompleted = true;
                    //     debugger;
                    // }

                    // self.setCheckListArray(JSON.stringify(modifiedCheckListData))


                    let attachmentTemp = Array()
                    // console.log("self.checkListData::" + JSON.stringify(checkListData))
                    if (self.isAlertApplicable) {
                        if (self.alertObject != '') {
                            let alertObject = JSON.parse(self.alertObject);
                            let AlertActionArr = Array()
                            let samplingReportLength = 0, detentionReportLength = 0, condemnationReportLength = 0;

                            if (alertObject.samplingArr && alertObject.samplingArr.length) {

                                let arr = alertObject.samplingArr;
                                let samplingArr = Array()
                                samplingReportLength = arr.length;
                                for (let index = 0; index < arr.length; index++) {
                                    const element = arr[index];

                                    let obj = {
                                        "NumberofItems": element.quantity,
                                        "Volume": element.netWeight,
                                        "DetetionAction": "",
                                        "ADFCAMark": "",
                                        "Package": element.package,
                                        "Age": "",
                                        "Contact": "",
                                        "IdNumber": "",
                                        "Occupation": "",
                                        "PhoneNumber": "",
                                        "Nationality": "",
                                        "Temperature": element.sampleTemperature,
                                        "ProductName": element.sampleName,
                                        "Analysis": "",
                                        "DetentionFlag": "",
                                        "Comment": "",
                                        "LoginName": loginData.username,
                                        "BrandName": element.brandName,
                                        "ProductionDate": element.productionDate,
                                        "ExpiryDate": element.expiryDate,
                                        "BusinessActivity": taskDetails.BusinessActivity,
                                        "CondemnationCode": "",
                                        "Containers": "",
                                        "DetentionReason": "",
                                        "IntegrationId": condemnationReportLength + detentionReportLength + parseInt(element.serialNumber),
                                        "BatchNumber": element.batchNumber,
                                        "CountryofOrigin": element.countryOfOrigin,
                                        "CondemnationReason": "",
                                        "Manufacturer": "",
                                        "CondemnationPlace": "",
                                        "IDType": "",
                                        "Remark": "",
                                        "Type": "Sampling",
                                        "UnitofMeasurement": element.unit
                                    }
                                    samplingArr.push(obj);

                                    let base64one = element.attachment1 != '' ? JSON.parse(element.attachment1).image1Base64 : '';
                                    let base64two = element.attachment2 != '' ? JSON.parse(element.attachment2).image2Base64 : '';

                                    if (base64one != '') {
                                        attachmentTemp.push({
                                            uniqueQuestionId: 'fd_image_' + self.taskId + '_' + index + '_' + 1,
                                            buffer: base64one
                                        })
                                    } else if (base64two != '') {
                                        attachmentTemp.push({
                                            uniqueQuestionId: 'fd_image_' + self.taskId + '_' + index + '_' + 2,
                                            buffer: base64two
                                        })
                                    }
                                }

                                AlertActionArr = [...AlertActionArr, ...samplingArr]
                            }

                            if (alertObject.condemnationArr && alertObject.condemnationArr.length) {
                                let arr = alertObject.condemnationArr;
                                let condemnationArr = Array()
                                condemnationReportLength = arr.length;

                                for (let index = 0; index < arr.length; index++) {

                                    const element = arr[index];
                                    let obj = {
                                        "NumberofItems": element.quantity,
                                        "Volume": element.netWeight,
                                        "DetetionAction": "",
                                        "ADFCAMark": "",
                                        "Package": element.package,
                                        "Age": "",
                                        "Contact": "",
                                        "IdNumber": "",
                                        "Occupation": "",
                                        "PhoneNumber": "",
                                        "Nationality": "",
                                        "Temperature": "",
                                        "ProductName": element.productName,
                                        "Analysis": "",
                                        "DetentionFlag": "",
                                        "Comment": "",
                                        "LoginName": loginData.username,
                                        "BrandName": element.brandName,
                                        "ProductionDate": "",
                                        "ExpiryDate": "",
                                        "BusinessActivity": taskDetails.BusinessActivity,
                                        "CondemnationCode": "",
                                        "Containers": "",
                                        "DetentionReason": "",
                                        "IntegrationId": samplingReportLength + detentionReportLength + parseInt(element.serialNumber),
                                        "BatchNumber": element.batchNumber,
                                        "CountryofOrigin": "",
                                        "CondemnationReason": "",
                                        "Manufacturer": "",
                                        "CondemnationPlace": element.place,
                                        "IDType": "",
                                        "Remark": "",
                                        "Type": "Condemnation",
                                        "UnitofMeasurement": ""
                                    }
                                    condemnationArr.push(obj);

                                    let base64one = element.attachment1 != '' ? JSON.parse(element.attachment1).image1Base64 : '';
                                    let base64two = element.attachment2 != '' ? JSON.parse(element.attachment2).image2Base64 : '';

                                    if (base64one != '') {
                                        attachmentTemp.push({
                                            uniqueQuestionId: 'fd_image_' + self.taskId + '_' + index + '_' + 1,
                                            buffer: base64one
                                        })
                                    } else if (base64two != '') {
                                        attachmentTemp.push({
                                            uniqueQuestionId: 'fd_image_' + self.taskId + '_' + index + '_' + 2,
                                            buffer: base64two
                                        })
                                    }
                                }
                                AlertActionArr = [...AlertActionArr, ...condemnationArr]
                            }

                            if (alertObject.detentionArr && alertObject.detentionArr.length) {
                                let arr = alertObject.detentionArr;
                                let detentionArr = Array()

                                for (let index = 0; index < arr.length; index++) {
                                    const element = arr[index];

                                    let obj = {
                                        "NumberofItems": element.quantity,
                                        "Volume": element.netWeight,
                                        "DetetionAction": "",
                                        "ADFCAMark": "",
                                        "Package": element.package,
                                        "Age": "",
                                        "Contact": "",
                                        "IdNumber": "",
                                        "Occupation": "",
                                        "PhoneNumber": "",
                                        "Nationality": "",
                                        "Temperature": "",
                                        "ProductName": element.productName,
                                        "Analysis": "",
                                        "DetentionFlag": "Y",
                                        "Comment": "",
                                        "LoginName": loginData.username,
                                        "BrandName": element.brandName,
                                        "ProductionDate": element.productionDate,
                                        "ExpiryDate": element.expiryDate,
                                        "BusinessActivity": taskDetails.BusinessActivity,
                                        "CondemnationCode": "",
                                        "Containers": "",
                                        "DetentionReason": element.reason,
                                        "IntegrationId": samplingReportLength + condemnationReportLength + parseInt(element.serialNumber),
                                        "BatchNumber": element.batchNumber,
                                        "CountryofOrigin": element.countryOfOrigin,
                                        "CondemnationReason": "",
                                        "Manufacturer": "",
                                        "CondemnationPlace": "",
                                        "IDType": "",
                                        "Remark": "",
                                        "Type": "Detention",
                                        "UnitofMeasurement": element.unit
                                    }

                                    let base64one = element.attachment1 != '' ? JSON.parse(element.attachment1).image1Base64 : '';
                                    let base64two = element.attachment2 != '' ? JSON.parse(element.attachment2).image2Base64 : '';

                                    if (base64one != '') {
                                        attachmentTemp.push({
                                            uniqueQuestionId: 'fd_image_' + self.taskId + '_' + index + '_' + 1,
                                            buffer: base64one
                                        })
                                    } else if (base64two != '') {
                                        attachmentTemp.push({
                                            uniqueQuestionId: 'fd_image_' + self.taskId + '_' + index + '_' + 2,
                                            buffer: base64two
                                        })
                                    }
                                    detentionArr.push(obj);
                                }

                                AlertActionArr = [...AlertActionArr, ...detentionArr]
                            }
                            let alertUpdatePayload = {
                                "InterfaceID": "ADFCA_CRM_SBL_074",
                                "LanguageType": "ENU",
                                "InspectorName": loginData.username,
                                "AccountName": taskDetails.EstablishmentName,
                                "FoodAlertSampling": {
                                    "FoodAlert": {
                                        "AlertNumber": alertObject.AlertNumber,
                                        "ListOfAction": {
                                            "AlertAction": AlertActionArr
                                        },
                                        "ListOfOpportunityAttachment": ""
                                    }
                                },
                                "InspectorId": loginData.username
                            }

                            // console.log("updateFoodAlertPayload::" + JSON.stringify(alertUpdatePayload))
                            let foodAlertResponse = yield updateFoodAlert(alertUpdatePayload);
                            // console.log("foodAlertResponse::" + JSON.stringify(foodAlertResponse))

                        }
                    }

                    ToastAndroid.show('Task submited successfully ', 1000);
                    let submissionStatusFlag = true;

                    try {

                        let arrayTemp: any = RealmController.getbase64ListForTaskId(realm, self.taskId)
                        if (arrayTemp && arrayTemp['0']) {
                            let array = arrayTemp['0']
                            let arr = JSON.parse(array.base64List)

                            if (arr.length) {
                                attachmentTemp = arr;
                            }
                        }
                    } catch (error) {
                        //console.log("attachmenterr:" + error)
                    }

                    if (self.isMyTaskClick == 'campaign') {
                        attachmentTemp.push({
                            uniqueQuestionId: 'signature',
                            buffer: taskDetails.mappingData[parseInt(self.campaignSelectedEstIndex)].signatureBase64
                        })
                    }
                    else {
                        attachmentTemp.push({
                            uniqueQuestionId: 'signature',
                            buffer: taskDetails.mappingData['0'].signatureBase64
                        })
                    }

                    if (self.evidanceAttachment1 != '') {
                        attachmentTemp.push({
                            uniqueQuestionId: 'evidence_1',
                            buffer: self.evidanceAttachment1
                        })
                    }
                    if (self.evidanceAttachment2 != '') {
                        attachmentTemp.push({
                            uniqueQuestionId: 'evidence_2',
                            buffer: self.evidanceAttachment2
                        })
                    }
                    if (self.licencesAttachment1 != '') {
                        attachmentTemp.push({
                            uniqueQuestionId: 'licences_1',
                            buffer: self.licencesAttachment1
                        })
                    }
                    if (self.licencesAttachment2 != '') {
                        attachmentTemp.push({
                            uniqueQuestionId: 'licences_2',
                            buffer: self.licencesAttachment2
                        })
                    }
                    if (self.EmiratesIdAttachment1 != '') {
                        attachmentTemp.push({
                            uniqueQuestionId: 'EmiratesId_1',
                            buffer: self.EmiratesIdAttachment1
                        })
                    }
                    if (self.EmiratesIdAttachment2 != '') {
                        attachmentTemp.push({
                            uniqueQuestionId: 'EmiratesId_2',
                            buffer: self.EmiratesIdAttachment2
                        })
                    }

                    // self.loadingState = '';

                    // self.loadingState = 'Submitting Attachments';
                    let attachmentReqRes = Array();
                    let attachmentFailedArray = Array();
                    let attachmentFailedArrayReqRes = Array();

                    yield Promise.all(attachmentTemp.map(async (element, index) => {
                        let getQuestionarieAttachmentResponse = Object();
                        let payloadAttachment = Object();

                        console.log("attachmentindex::" + JSON.stringify(index))
                        if (element && element.buffer != '') {

                            payloadAttachment = {
                                "InterfaceID": "ADFCA_CRM_SBL_039",
                                "LanguageType": "ENU",
                                "InspectorId": [
                                    loginData.username
                                ],
                                "InspectorName": loginData.username,
                                "Checklistattachment": {
                                    "Inspection": {
                                        "TaskId": self.isMyTaskClick == 'campaign' ? TaskSubmitApiResponse.IsReschedule : taskDetails.TaskId,
                                        "ListOfActionAttachment": {
                                            "QuestAttachment": {
                                                "FileExt": "jpg",
                                                "FileName": element.uniqueQuestionId + ((element.uniqueQuestionId == 'signature') ? '.png' : '.jpg'),
                                                "FileSize": "",
                                                "FileSrcPath": "",
                                                "FileSrcType": "",
                                                "Comment": "",
                                                "FileBuffer": element.buffer
                                            }
                                        }
                                    }
                                }
                            }
                            getQuestionarieAttachmentResponse = await fetchGetQuestionarieAttachmentApi(payloadAttachment);

                            attachmentReqRes.push({ payloadAttachment, getQuestionarieAttachmentResponse });
                            if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                                // if (false) {
                            }
                            else {
                                // self.attachmentSubmittedFailed = true;
                                attachmentFailedArray.push(payloadAttachment)
                                attachmentFailedArrayReqRes.push({ payloadAttachment, getQuestionarieAttachmentResponse })
                                submissionStatusFlag = false;
                                ToastAndroid.show(getQuestionarieAttachmentResponse.message ? getQuestionarieAttachmentResponse.message : 'Failed To Upload Attachment,ErrorMessage:' + getQuestionarieAttachmentResponse.ErrorMessage + 'ErrorCode:' + getQuestionarieAttachmentResponse.ErrorCode, 1000);
                            }
                        }
                    }
                    )).then(results => {
                        console.log("results>>" + JSON.stringify(results));
                    }).catch(err => {
                        // Alert.alert('', 'Failed To Upload Attachment');
                        console.log("err?>>" + err);
                    });

                    if (attachmentFailedArray.length) {
                        self.attachmentSubmittedFailed = true;
                    }
                    taskDetails.mappingData[parseInt(self.campaignSelectedEstIndex)].attachmentFailedArrayReqRes = attachmentFailedArrayReqRes;
                    self.failedAttachmentArray = attachmentFailedArray.length ? JSON.stringify(attachmentFailedArray) : '';


                    let voilationAttachment = Array();
                    let voilationAttachmentReqRes = Array();
                    let voilationAttachmentFailedArray = Array();
                    for (let indexattachmentTemp = 0; indexattachmentTemp < attachmentTemp.length; indexattachmentTemp++) {
                        let element = attachmentTemp[indexattachmentTemp]
                        for (let indexChecklist = 0; indexChecklist < arr.length; indexChecklist++) {
                            const elementChecklist = arr[indexChecklist];

                            if ((element.uniqueQuestionId == "Evidence_" + elementChecklist.parameterno) || (element.uniqueQuestionId == "Evidence_" + elementChecklist.parameterno + "_1") || (element.uniqueQuestionId == "Evidence_" + elementChecklist.parameterno + "_2") || (element.uniqueQuestionId == "Evidence_" + elementChecklist.ParameterNumber) || (element.uniqueQuestionId == "Evidence_" + elementChecklist.ParameterNumber + "_1") || (element.uniqueQuestionId == "Evidence_" + elementChecklist.ParameterNumber + "_2") || (element.uniqueQuestionId == elementChecklist.NOC_parameter_sl_no) || (element.uniqueQuestionId == elementChecklist.NOC_parameter_sl_no + "1") || (element.uniqueQuestionId == elementChecklist.NOC_parameter_sl_no + "_2")) {
                                if ((elementChecklist.Score.toString() === '0' && (elementChecklist.parameter_type != 'EHS'))) {
                                    voilationAttachment.push(element);
                                }
                            }
                        }
                    }

                    yield Promise.all(voilationAttachment.map(async (element, index) => {
                        let getQuestionarieAttachmentResponse = Object();
                        let payloadAttachment = Object();

                        console.log("voilationattachmentindex::" + JSON.stringify(index))
                        if (element && element.buffer != '') {

                            payloadAttachment = {
                                "InterfaceID": "ADFCA_CRM_SBL_080",
                                "LanguageType": "ENU",
                                "InspectorName": loginData.username,
                                "ListOfViolationAttachments": {
                                    "Violation": {
                                        "Id": "",
                                        "ViolationNumber": TaskSubmitApiResponse.ViolationNumber,
                                        "RowId": "",
                                        "ListOfAttachment": {
                                            "ViolationAttachment": [
                                                {
                                                    "Comment": "AGFC-1",
                                                    "FileAutoUpdFlg": "Y",
                                                    "FileDeferFlg": "R",
                                                    "FileDockReqFlg": "N",
                                                    "FileDockStatFlg": "E",
                                                    "FileExt": "jpeg",
                                                    "FileName": element.uniqueQuestionId + '.jpg',
                                                    "FileSrcPath": "",
                                                    "FileSrcType": "jpeg",
                                                    "OpptyName": TaskSubmitApiResponse.ViolationNumber,
                                                    "FileBuffer": element.buffer
                                                }
                                            ]
                                        }
                                    }
                                },
                                "InspectorId": loginData.username
                            }
                            getQuestionarieAttachmentResponse = await callToVoilationAttachment(payloadAttachment);

                            attachmentReqRes.push({ payloadAttachment, getQuestionarieAttachmentResponse });

                            if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                            }
                            else {
                                voilationAttachmentReqRes.push({ payloadAttachment, getQuestionarieAttachmentResponse })
                                voilationAttachmentFailedArray.push(payloadAttachment)
                                // self.attachmentSubmittedFailed = true;
                                submissionStatusFlag = false;
                                ToastAndroid.show(getQuestionarieAttachmentResponse.message ? getQuestionarieAttachmentResponse.message : 'Failed To Upload Attachment,ErrorMessage:' + getQuestionarieAttachmentResponse.ErrorMessage + 'ErrorCode:' + getQuestionarieAttachmentResponse.ErrorCode, 1000);
                            }
                        }
                    }
                    )).then(results => {
                        console.log("results>>" + results);
                    }).catch(err => {
                        // Alert.alert('', 'Failed To Upload Attachment');
                        console.log("err?>>" + err);
                    });
                    if (voilationAttachmentFailedArray.length) {
                        self.attachmentSubmittedFailed = true;
                    }
                    taskDetails.mappingData[parseInt(self.campaignSelectedEstIndex)].voilationAttachmentReqRes = voilationAttachmentReqRes;
                    self.voilationFailedAttachmentArray = voilationAttachmentFailedArray.length ? JSON.stringify(voilationAttachmentFailedArray) : '';

                    try {
                        let attachmentReqRespath = DownloadDirectoryPath + "/smartcontrol/attachments/" + self.taskId + "_AttachmentPayload.txt";
                        writeFile(attachmentReqRespath, JSON.stringify(attachmentReqRes), 'utf8')
                            .then(async (success) => {
                                console.log("attachmentssuccess>>" + success);

                            })
                            .catch((err) => {
                                console.log(err.message);
                            });

                    } catch (error) {

                    }


                    self.loadingState = '';
                    // let flag = false;
                    taskDetails.mappingData[parseInt(self.campaignSelectedEstIndex)].reqResponseArr = JSON.stringify(reqResponseArr);

                    console.log("submissionStatusFlag?>>" + submissionStatusFlag + ", Flag?>>" + flag + ", elf.attachmentSubmittedFailed?>>" + self.attachmentSubmittedFailed);
                    if (!submissionStatusFlag && flag) {

                        if (flag) {
                            self.loadingState = '';
                            self.state = self.retryCount == '1' ? 'navigate' : 'failedToSubmit'
                            if (self.retryCount == '1') {
                                taskDetails.isCompleted = true;
                                taskDetails.TaskStatus = 'Failed';
                                self.loadingState = '';
                                const format1 = "lll"
                                taskDetails.CompletionDate = moment().format(format1);

                                RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {

                                });

                                if (flag) {

                                    if (self.isMyTaskClick === 'myTask') {
                                        let newTaskArray = self.dataArray1 != '' ? JSON.parse(self.dataArray1) : [];
                                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                        self.dataArray1 = (JSON.stringify(newTaskArray));
                                        self.myTaskCount = (newTaskArray.length.toString());

                                        let newTaskArrayPast = self.dataArray1Past != '' ? JSON.parse(self.dataArray1Past) : [];
                                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                        self.dataArray1Past = (JSON.stringify(newTaskArrayPast));
                                    }
                                    else if (self.isMyTaskClick === 'license') {
                                        let newTaskArray = self.NOCList != '' ? JSON.parse(self.NOCList) : [];
                                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                        self.NOCList = (JSON.stringify(newTaskArray));
                                        self.licenseCount = (newTaskArray.length.toString());

                                        let newTaskArrayPast = self.NOCListPast != '' ? JSON.parse(self.NOCListPast) : [];
                                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                        self.NOCListPast = (JSON.stringify(newTaskArrayPast));
                                    }
                                    else if (self.isMyTaskClick === 'case') {
                                        let newTaskArray = self.complaintAndFoodPosioningList != '' ? JSON.parse(self.complaintAndFoodPosioningList) : [];
                                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                        self.complaintAndFoodPosioningList = (JSON.stringify(newTaskArray));
                                        self.caseCount = (newTaskArray.length.toString());

                                        let newTaskArrayPast = self.complaintAndFoodPosioningListPast != '' ? JSON.parse(self.complaintAndFoodPosioningListPast) : [];
                                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                        self.complaintAndFoodPosioningListPast = (JSON.stringify(newTaskArrayPast));
                                    }
                                    else if (self.isMyTaskClick === 'campaign') {
                                        let newTaskArray = self.campaignList != '' ? JSON.parse(self.campaignList) : [];
                                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.campaignTaskId);
                                        self.campaignList = (JSON.stringify(newTaskArray));
                                        // self.setCaseCount(newTaskArray.length.toString());

                                        let newTaskArrayPast = self.campaignListPast != '' ? JSON.parse(self.campaignListPast) : [];
                                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                        self.campaignListPast = (JSON.stringify(newTaskArrayPast));
                                    }
                                    else if (self.isMyTaskClick === 'tempPermit') {
                                        let newTaskArray = self.eventsList != '' ? JSON.parse(self.eventsList) : [];
                                        newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                        self.tempPermit = (newTaskArray.length.toString());
                                        self.eventsList = (JSON.stringify(newTaskArray));

                                        let newTaskArrayPast = self.eventsListPast != '' ? JSON.parse(self.eventsListPast) : [];
                                        newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                        self.eventsListPast = (JSON.stringify(newTaskArrayPast));
                                    }

                                    self.contactName = '';
                                    self.taskId = '';
                                    self.checkliststate = '';
                                    self.mobileNumber = '';
                                    self.emiratesId = '';
                                    self.evidanceAttachment1 = ''
                                    self.evidanceAttachment1Url = ''
                                    self.evidanceAttachment2 = ''
                                    self.evidanceAttachment2Url = ''
                                    self.licencesAttachment1 = ''
                                    self.licencesAttachment1Url = '';
                                    self.licencesAttachment2 = ''
                                    self.licencesAttachment2Url = ''
                                    self.EmiratesIdAttachment1 = ''
                                    self.EmiratesIdAttachment1Url = ''
                                    self.EmiratesIdAttachment2 = ''
                                    self.EmiratesIdAttachment2Url = ''
                                    self.noCheckList = ''
                                    self.result = ''
                                    self.finalComment = ''
                                    self.flashlightCBValue = false
                                    self.thermometerCBValue = false
                                    self.dataLoggerCBValue = false
                                    self.luxmeterCBValue = false
                                    self.foodalertSampling = false
                                    self.UVlightCBValue = false
                                    self.latitude = ''
                                    self.longitude = ''
                                    self.percentage = ''
                                    self.totalScore = ''
                                    self.grade = ''
                                    self.maxscore = ''
                                    self.failedAttachmentArray = ''
                                    self.voilationFailedAttachmentArray = ''
                                    self.attachmentSubmittedFailed = false
                                    NavigationService.navigate('Dashboard');
                                }
                                if (self.isMyTaskClick != 'campaign') {
                                    RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                        // ToastAndroid.show('Task objct successfully ', 1000);
                                        NavigationService.navigate('Dashboard');
                                    });
                                }
                            }
                        }
                        console.log("self.state?>>" + self.state);

                    }

                    if (self.isMyTaskClick != 'campaign') {
                        RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                            // ToastAndroid.show('Task objct successfully ', 1000);
                            // NavigationService.navigate('Dashboard');
                            // flag = true;
                        });
                    }
                    else {

                        let temp = self.estListArray != '' ? JSON.parse(self.estListArray) : [];
                        if (temp.length) {
                            let flag = false, cont = 0;
                            for (let indx = 0; indx < temp.length; indx++) {
                                const element = temp[indx];
                                let taskId = taskDetails.TaskId + "_" + element.Id + "_" + indx
                                let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, taskId);
                                if (checkListData && checkListData['0'] && checkListData['0'].isCompleted) {
                                    cont = cont + 1;
                                }
                            }
                            if (cont == temp.length) {
                                flag = true;
                            }
                        }
                        // self.taskId = TaskSubmitApiResponse.IsReschedule
                    }

                    console.log("submissionStatusFlag::" + submissionStatusFlag + "flag::" + flag)

                    if (flag && submissionStatusFlag) {
                        self.taskSubmitted = true;
                        taskDetails.isCompleted = true;
                        taskDetails.TaskStatus = 'Completed';

                        RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                            console.log("isCompleted>>" + taskDetails.isCompleted + ",taskDetails.TaskStatus>>" + taskDetails.TaskStatus)
                        });

                        if (self.isMyTaskClick === 'myTask') {
                            let newTaskArray = self.dataArray1 != '' ? JSON.parse(self.dataArray1) : [];
                            newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                            self.dataArray1 = (JSON.stringify(newTaskArray));
                            self.myTaskCount = (newTaskArray.length.toString());

                            let newTaskArrayPast = self.dataArray1Past != '' ? JSON.parse(self.dataArray1Past) : [];
                            newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                            self.dataArray1Past = (JSON.stringify(newTaskArrayPast));
                        }
                        else if (self.isMyTaskClick === 'license') {
                            let newTaskArray = self.NOCList != '' ? JSON.parse(self.NOCList) : [];
                            newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                            self.NOCList = (JSON.stringify(newTaskArray));
                            self.licenseCount = (newTaskArray.length.toString());

                            let newTaskArrayPast = self.NOCListPast != '' ? JSON.parse(self.NOCListPast) : [];
                            newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                            self.NOCListPast = (JSON.stringify(newTaskArrayPast));
                        }
                        else if (self.isMyTaskClick === 'case') {
                            let newTaskArray = self.complaintAndFoodPosioningList != '' ? JSON.parse(self.complaintAndFoodPosioningList) : [];
                            newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                            self.complaintAndFoodPosioningList = (JSON.stringify(newTaskArray));
                            self.caseCount = (newTaskArray.length.toString());

                            let newTaskArrayPast = self.complaintAndFoodPosioningListPast != '' ? JSON.parse(self.complaintAndFoodPosioningListPast) : [];
                            newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                            self.complaintAndFoodPosioningListPast = (JSON.stringify(newTaskArrayPast));
                        }
                        else if (self.isMyTaskClick === 'campaign') {
                            let newTaskArray = self.campaignList != '' ? JSON.parse(self.campaignList) : [];
                            newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.campaignTaskId);
                            self.campaignList = (JSON.stringify(newTaskArray));
                            // self.setCaseCount(newTaskArray.length.toString());

                            let newTaskArrayPast = self.campaignListPast != '' ? JSON.parse(self.campaignListPast) : [];
                            newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                            self.campaignListPast = (JSON.stringify(newTaskArrayPast));
                        }
                        else if (self.isMyTaskClick === 'tempPermit') {
                            let newTaskArray = self.eventsList != '' ? JSON.parse(self.eventsList) : [];
                            newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                            self.tempPermit = (newTaskArray.length.toString());
                            self.eventsList = (JSON.stringify(newTaskArray));

                            let newTaskArrayPast = self.eventsListPast != '' ? JSON.parse(self.eventsListPast) : [];
                            newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                            self.eventsListPast = (JSON.stringify(newTaskArrayPast));
                        }
                        self.contactName = '';
                        self.taskId = '';
                        self.checkliststate = '';
                        self.mobileNumber = '';
                        self.emiratesId = '';
                        self.evidanceAttachment1 = ''
                        self.evidanceAttachment1Url = ''
                        self.evidanceAttachment2 = ''
                        self.evidanceAttachment2Url = ''
                        self.licencesAttachment1 = ''
                        self.licencesAttachment1Url = '';
                        self.licencesAttachment2 = ''
                        self.licencesAttachment2Url = ''
                        self.EmiratesIdAttachment1 = ''
                        self.EmiratesIdAttachment1Url = ''
                        self.EmiratesIdAttachment2 = ''
                        self.EmiratesIdAttachment2Url = ''
                        self.noCheckList = ''
                        self.result = ''
                        self.finalComment = ''
                        self.flashlightCBValue = false
                        self.thermometerCBValue = false
                        self.dataLoggerCBValue = false
                        self.luxmeterCBValue = false
                        self.foodalertSampling = false
                        self.UVlightCBValue = false
                        self.latitude = ''
                        self.longitude = ''
                        self.percentage = ''
                        self.totalScore = ''
                        self.grade = ''
                        self.maxscore = ''
                        self.failedAttachmentArray = ''
                        self.voilationFailedAttachmentArray = ''
                        self.attachmentSubmittedFailed = false
                        if (self.isMyTaskClick == 'campaign') {
                            let mappingData = self.campaignMappingData != '' ? JSON.parse(self.campaignMappingData) : []
                            self.loadingState = '';
                            mappingData[parseInt(self.campaignSelectedEstIndex)].isCompltedOffline = true;
                            let taskDetal = JSON.parse(self.selectedTask);
                            taskDetal.mappingData = taskDetails.mappingData;
                            let flag = false, countOfCompleted = 0;
                            if (mappingData.length) {
                                for (let index = 0; index < mappingData.length; index++) {
                                    const element = mappingData[index];
                                    if (element.isCompltedOffline) {
                                        countOfCompleted = countOfCompleted + 1;
                                    }
                                }
                            }
                            if (countOfCompleted == mappingData.length) {
                                self.selectedTask = JSON.stringify(taskDetal);
                                self.state = 'navigate'

                            }
                            else {
                                self.selectedTask = JSON.stringify(taskDetal);
                                self.state = "submitSuccess"

                            }
                            self.campaignMappingData = JSON.stringify(mappingData)
                        }
                        else {
                            self.loadingState = '';
                            self.state = 'navigate'
                        }
                        self.isSuccess = true;

                        NavigationService.navigate('Dashboard');
                    }
                    console.log("self.state?>>" + self.state);

                }
                else if (self.taskSubmitted && self.attachmentSubmittedFailed) {

                    console.log("self.taskSubmitted>>" + JSON.stringify(self.taskSubmitted) + "self.attachmentSubmittedFailed>>" + JSON.stringify(self.attachmentSubmittedFailed));
                    let AttachmentArrayReqRes = Array()
                    let failedFlag = false;
                    if (self.failedAttachmentArray != '') {
                        let AttachmentArray = JSON.parse(self.failedAttachmentArray)
                        yield Promise.all(AttachmentArray.map(async (element: any, index: number) => {
                            let getQuestionarieAttachmentResponse = Object();
                            let payloadAttachment = Object();

                            console.log("attachmentindex::" + JSON.stringify(index))
                            if (element && element.buffer != '') {

                                payloadAttachment = element;
                                getQuestionarieAttachmentResponse = await fetchGetQuestionarieAttachmentApi(payloadAttachment);
                                AttachmentArrayReqRes.push({ payloadAttachment, getQuestionarieAttachmentResponse })
                                if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                                }
                                else {
                                    failedFlag = true;
                                    ToastAndroid.show(getQuestionarieAttachmentResponse.message ? getQuestionarieAttachmentResponse.message : 'Failed To Upload Attachment,ErrorMessage:' + getQuestionarieAttachmentResponse.ErrorMessage + 'ErrorCode:' + getQuestionarieAttachmentResponse.ErrorCode, 1000);
                                }
                            }
                        }
                        )).then(results => {
                            console.log("results>>" + results);
                        }).catch(err => {
                            // Alert.alert('', 'Failed To Upload Attachment');
                            console.log("err?>>" + err);
                        });
                    }

                    if (self.voilationFailedAttachmentArray != '') {
                        let AttachmentArray = JSON.parse(self.voilationFailedAttachmentArray)
                        yield Promise.all(AttachmentArray.map(async (element: any, index: number) => {
                            let getQuestionarieAttachmentResponse = Object();
                            let payloadAttachment = Object();

                            console.log("attachmentindex::" + JSON.stringify(index))
                            if (element && element.buffer != '') {

                                payloadAttachment = element;
                                getQuestionarieAttachmentResponse = await callToVoilationAttachment(payloadAttachment);
                                AttachmentArrayReqRes.push({ payloadAttachment, getQuestionarieAttachmentResponse })
                                // voilationAttachmentReqRes.push({ payloadAttachment, getQuestionarieAttachmentResponse })
                                if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                                }
                                else {
                                    failedFlag = true;
                                    ToastAndroid.show(getQuestionarieAttachmentResponse.message ? getQuestionarieAttachmentResponse.message : 'Failed To Upload Attachment,ErrorMessage:' + getQuestionarieAttachmentResponse.ErrorMessage + 'ErrorCode:' + getQuestionarieAttachmentResponse.ErrorCode, 1000);
                                }
                            }
                        }
                        )).then(results => {
                            console.log("results>>" + results);
                        }).catch(err => {
                            // Alert.alert('', 'Failed To Upload Attachment');
                            console.log("err?>>" + err);
                        });
                    }

                    try {
                        let attachmentReqRespath = DownloadDirectoryPath + "/smartcontrol/attachments/" + self.taskId + "_AttachmentPayload.txt";
                        appendFile(attachmentReqRespath, JSON.stringify(AttachmentArrayReqRes), 'utf8')
                            .then(async (success) => {
                                console.log("success>>" + success);

                            })
                            .catch((err) => {
                                console.log(err.message);
                            });

                    } catch (error) {

                    }

                    if (failedFlag) {
                        self.loadingState = '';
                        self.state = self.retryCount == '1' ? 'navigate' : 'failedToSubmit'
                        if (self.retryCount == '1') {
                            taskDetails.isCompleted = true;
                            taskDetails.TaskStatus = 'Failed';
                            self.loadingState = '';
                            const format1 = "lll"
                            taskDetails.CompletionDate = moment().format(format1);

                            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {

                            });

                            if (flag) {

                                if (self.isMyTaskClick === 'myTask') {
                                    let newTaskArray = self.dataArray1 != '' ? JSON.parse(self.dataArray1) : [];
                                    newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                    self.dataArray1 = (JSON.stringify(newTaskArray));
                                    self.myTaskCount = (newTaskArray.length.toString());

                                    let newTaskArrayPast = self.dataArray1Past != '' ? JSON.parse(self.dataArray1Past) : [];
                                    newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                    self.dataArray1Past = (JSON.stringify(newTaskArrayPast));
                                }
                                else if (self.isMyTaskClick === 'license') {
                                    let newTaskArray = self.NOCList != '' ? JSON.parse(self.NOCList) : [];
                                    newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                    self.NOCList = (JSON.stringify(newTaskArray));
                                    self.licenseCount = (newTaskArray.length.toString());

                                    let newTaskArrayPast = self.NOCListPast != '' ? JSON.parse(self.NOCListPast) : [];
                                    newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                    self.NOCListPast = (JSON.stringify(newTaskArrayPast));
                                }
                                else if (self.isMyTaskClick === 'case') {
                                    let newTaskArray = self.complaintAndFoodPosioningList != '' ? JSON.parse(self.complaintAndFoodPosioningList) : [];
                                    newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                    self.complaintAndFoodPosioningList = (JSON.stringify(newTaskArray));
                                    self.caseCount = (newTaskArray.length.toString());

                                    let newTaskArrayPast = self.complaintAndFoodPosioningListPast != '' ? JSON.parse(self.complaintAndFoodPosioningListPast) : [];
                                    newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                    self.complaintAndFoodPosioningListPast = (JSON.stringify(newTaskArrayPast));
                                }
                                else if (self.isMyTaskClick === 'campaign') {
                                    let newTaskArray = self.campaignList != '' ? JSON.parse(self.campaignList) : [];
                                    newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.campaignTaskId);
                                    self.campaignList = (JSON.stringify(newTaskArray));
                                    // self.setCaseCount(newTaskArray.length.toString());

                                    let newTaskArrayPast = self.campaignListPast != '' ? JSON.parse(self.campaignListPast) : [];
                                    newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                    self.campaignListPast = (JSON.stringify(newTaskArrayPast));
                                }
                                else if (self.isMyTaskClick === 'tempPermit') {
                                    let newTaskArray = self.eventsList != '' ? JSON.parse(self.eventsList) : [];
                                    newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                    self.tempPermit = (newTaskArray.length.toString());
                                    self.eventsList = (JSON.stringify(newTaskArray));

                                    let newTaskArrayPast = self.eventsListPast != '' ? JSON.parse(self.eventsListPast) : [];
                                    newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                    self.eventsListPast = (JSON.stringify(newTaskArrayPast));
                                }

                                self.contactName = '';
                                self.mobileNumber = '';
                                self.taskId = '';
                                self.checkliststate = '';
                                self.emiratesId = '';
                                self.evidanceAttachment1 = ''
                                self.evidanceAttachment1Url = ''
                                self.evidanceAttachment2 = ''
                                self.evidanceAttachment2Url = ''
                                self.licencesAttachment1 = ''
                                self.licencesAttachment1Url = '';
                                self.licencesAttachment2 = ''
                                self.licencesAttachment2Url = ''
                                self.EmiratesIdAttachment1 = ''
                                self.EmiratesIdAttachment1Url = ''
                                self.EmiratesIdAttachment2 = ''
                                self.EmiratesIdAttachment2Url = ''
                                self.noCheckList = ''
                                self.result = ''
                                self.finalComment = ''
                                self.flashlightCBValue = false
                                self.thermometerCBValue = false
                                self.dataLoggerCBValue = false
                                self.luxmeterCBValue = false
                                self.UVlightCBValue = false
                                self.foodalertSampling = false
                                self.latitude = ''
                                self.longitude = ''
                                self.percentage = ''
                                self.totalScore = ''
                                self.grade = ''
                                self.maxscore = ''
                                NavigationService.navigate('Dashboard');
                            }
                            if (self.isMyTaskClick != 'campaign') {
                                RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                    // ToastAndroid.show('Task objct successfully ', 1000);
                                    NavigationService.navigate('Dashboard');
                                });
                            }
                        }
                    }
                    else {

                        taskDetails.isCompleted = true;
                        taskDetails.TaskStatus = 'Completed';
                        self.loadingState = '';
                        const format1 = "lll"
                        taskDetails.CompletionDate = moment().format(format1);

                        RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {

                        });

                        if (flag) {

                            if (self.isMyTaskClick === 'myTask') {
                                let newTaskArray = self.dataArray1 != '' ? JSON.parse(self.dataArray1) : [];
                                newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                self.dataArray1 = (JSON.stringify(newTaskArray));
                                self.myTaskCount = (newTaskArray.length.toString());

                                let newTaskArrayPast = self.dataArray1Past != '' ? JSON.parse(self.dataArray1Past) : [];
                                newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                self.dataArray1Past = (JSON.stringify(newTaskArrayPast));
                            }
                            else if (self.isMyTaskClick === 'license') {
                                let newTaskArray = self.NOCList != '' ? JSON.parse(self.NOCList) : [];
                                newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                self.NOCList = (JSON.stringify(newTaskArray));
                                self.licenseCount = (newTaskArray.length.toString());

                                let newTaskArrayPast = self.NOCListPast != '' ? JSON.parse(self.NOCListPast) : [];
                                newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                self.NOCListPast = (JSON.stringify(newTaskArrayPast));
                            }
                            else if (self.isMyTaskClick === 'case') {
                                let newTaskArray = self.complaintAndFoodPosioningList != '' ? JSON.parse(self.complaintAndFoodPosioningList) : [];
                                newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                self.complaintAndFoodPosioningList = (JSON.stringify(newTaskArray));
                                self.caseCount = (newTaskArray.length.toString());

                                let newTaskArrayPast = self.complaintAndFoodPosioningListPast != '' ? JSON.parse(self.complaintAndFoodPosioningListPast) : [];
                                newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                self.complaintAndFoodPosioningListPast = (JSON.stringify(newTaskArrayPast));
                            }
                            else if (self.isMyTaskClick === 'campaign') {
                                let newTaskArray = self.campaignList != '' ? JSON.parse(self.campaignList) : [];
                                newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.campaignTaskId);
                                self.campaignList = (JSON.stringify(newTaskArray));
                                // self.setCaseCount(newTaskArray.length.toString());

                                let newTaskArrayPast = self.campaignListPast != '' ? JSON.parse(self.campaignListPast) : [];
                                newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                self.campaignListPast = (JSON.stringify(newTaskArrayPast));
                            }
                            else if (self.isMyTaskClick === 'tempPermit') {
                                let newTaskArray = self.eventsList != '' ? JSON.parse(self.eventsList) : [];
                                newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                self.tempPermit = (newTaskArray.length.toString());
                                self.eventsList = JSON.stringify(newTaskArray);

                                let newTaskArrayPast = self.eventsListPast != '' ? JSON.parse(self.eventsListPast) : [];
                                newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                self.eventsListPast = JSON.stringify(newTaskArrayPast);
                            }

                            self.contactName = '';
                            self.mobileNumber = '';
                            self.taskId = '';
                            self.checkliststate = '';
                            self.emiratesId = '';
                            self.evidanceAttachment1 = ''
                            self.evidanceAttachment1Url = ''
                            self.evidanceAttachment2 = ''
                            self.evidanceAttachment2Url = ''
                            self.licencesAttachment1 = ''
                            self.licencesAttachment1Url = '';
                            self.licencesAttachment2 = ''
                            self.licencesAttachment2Url = ''
                            self.EmiratesIdAttachment1 = ''
                            self.EmiratesIdAttachment1Url = ''
                            self.EmiratesIdAttachment2 = ''
                            self.EmiratesIdAttachment2Url = ''
                            self.noCheckList = ''
                            self.result = ''
                            self.finalComment = ''
                            self.flashlightCBValue = false
                            self.thermometerCBValue = false
                            self.dataLoggerCBValue = false
                            self.luxmeterCBValue = false
                            self.UVlightCBValue = false
                            self.foodalertSampling = false
                            self.latitude = ''
                            self.longitude = ''
                            self.percentage = ''
                            self.totalScore = ''
                            self.grade = ''
                            self.maxscore = ''
                            NavigationService.navigate('Dashboard');
                        }
                        if (self.isMyTaskClick != 'campaign') {
                            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                // ToastAndroid.show('Task objct successfully ', 1000);
                                NavigationService.navigate('Dashboard');
                            });
                        }
                    }
                }
                else {
                    let reqResponseArr = Array()
                    reqResponseArr.push({ payload, TaskSubmitApiResponse })
                    taskDetails.mappingData[parseInt(self.campaignSelectedEstIndex)].reqResponseArr = JSON.stringify(reqResponseArr);

                    ToastAndroid.show(TaskSubmitApiResponse.ErrorCode ? JSON.stringify(TaskSubmitApiResponse.ErrorMessage) + (TaskSubmitApiResponse.ErrorCode ? "," + "ErrorCode: " + (TaskSubmitApiResponse.ErrorCode) : "") : 'Failed to submit Task', 1000);
                    // taskDetails.isCompleted = true;
                    // taskDetails.TaskStatus = 'Failed';
                    self.loadingState = '';

                    const format1 = "lll"
                    // taskDetails.CompletionDate = moment().format(format1);

                    let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, self.taskId);
                    var path = DownloadDirectoryPath + '/' + self.taskId + "_TaskReport.txt";
                    writeFile(path, JSON.stringify({ payload, TaskSubmitApiResponse, taskDetails: objct['0'] }), 'utf8')
                        .then(async (success) => {
                            let payloadAttachment = {
                                "InterfaceID": "ADFCA_CRM_SBL_039",
                                "LanguageType": "ENU",
                                "InspectorId": [
                                    loginData.username
                                ],
                                "InspectorName": loginData.username,
                                "Checklistattachment": {
                                    "Inspection": {
                                        "TaskId": self.taskId,
                                        "ListOfActionAttachment": {
                                            "QuestAttachment": {
                                                "FileExt": "json",
                                                "FileName": 'ReportTask.json',
                                                "FileSize": "",
                                                "FileSrcPath": "",
                                                "FileSrcType": "",
                                                "Comment": "",
                                                "FileBuffer": success
                                            }
                                        }
                                    }
                                }
                            }

                            let getQuestionarieAttachmentResponse = await fetchGetQuestionarieAttachmentApi(payloadAttachment);

                            if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                                self.state = 'done';
                                ToastAndroid.show('Task Reported Successfully', 1000);
                            }
                            else {
                                self.state = 'done';
                                ToastAndroid.show(getQuestionarieAttachmentResponse.message ? getQuestionarieAttachmentResponse.message : 'Failed To Upload Report Task,ErrorMessage:' + getQuestionarieAttachmentResponse.ErrorMessage + 'ErrorCode:' + getQuestionarieAttachmentResponse.ErrorCode, 1000);
                            }
                        })
                        .catch((err) => {
                            console.log("Attachmenterr.message>>" + err.message);
                        });


                    // self.taskId = TaskSubmitApiResponse.IsReschedule

                    if (flag) {
                        self.loadingState = '';
                        self.state = self.retryCount == '1' ? 'navigate' : 'failedToSubmit'
                        if (self.retryCount == '1') {
                            taskDetails.isCompleted = true;
                            taskDetails.TaskStatus = 'Failed';
                            self.loadingState = '';
                            const format1 = "lll"
                            taskDetails.CompletionDate = moment().format(format1);

                            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {

                            });

                            if (flag) {

                                if (self.isMyTaskClick === 'myTask') {
                                    let newTaskArray = self.dataArray1 != '' ? JSON.parse(self.dataArray1) : [];
                                    newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                    self.dataArray1 = (JSON.stringify(newTaskArray));
                                    self.myTaskCount = (newTaskArray.length.toString());

                                    let newTaskArrayPast = self.dataArray1Past != '' ? JSON.parse(self.dataArray1Past) : [];
                                    newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                    self.dataArray1Past = (JSON.stringify(newTaskArrayPast));
                                }
                                else if (self.isMyTaskClick === 'license') {
                                    let newTaskArray = self.NOCList != '' ? JSON.parse(self.NOCList) : [];
                                    newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                    self.NOCList = (JSON.stringify(newTaskArray));
                                    self.licenseCount = (newTaskArray.length.toString());

                                    let newTaskArrayPast = self.NOCListPast != '' ? JSON.parse(self.NOCListPast) : [];
                                    newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                    self.NOCListPast = (JSON.stringify(newTaskArrayPast));
                                }
                                else if (self.isMyTaskClick === 'case') {
                                    let newTaskArray = self.complaintAndFoodPosioningList != '' ? JSON.parse(self.complaintAndFoodPosioningList) : [];
                                    newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                    self.complaintAndFoodPosioningList = (JSON.stringify(newTaskArray));
                                    self.caseCount = (newTaskArray.length.toString());

                                    let newTaskArrayPast = self.complaintAndFoodPosioningListPast != '' ? JSON.parse(self.complaintAndFoodPosioningListPast) : [];
                                    newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                    self.complaintAndFoodPosioningListPast = (JSON.stringify(newTaskArrayPast));
                                }
                                else if (self.isMyTaskClick === 'campaign') {
                                    let newTaskArray = self.campaignList != '' ? JSON.parse(self.campaignList) : [];
                                    newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.campaignTaskId);
                                    self.campaignList = (JSON.stringify(newTaskArray));
                                    // self.setCaseCount(newTaskArray.length.toString());

                                    let newTaskArrayPast = self.campaignListPast != '' ? JSON.parse(self.campaignListPast) : [];
                                    newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                    self.campaignListPast = (JSON.stringify(newTaskArrayPast));
                                }
                                else if (self.isMyTaskClick === 'tempPermit') {
                                    let newTaskArray = self.eventsList != '' ? JSON.parse(self.eventsList) : [];
                                    newTaskArray = newTaskArray.filter((i: any) => i.TaskId != self.taskId);
                                    self.tempPermit = (newTaskArray.length.toString());
                                    self.eventsList = (JSON.stringify(newTaskArray));

                                    let newTaskArrayPast = self.eventsListPast != '' ? JSON.parse(self.eventsListPast) : [];
                                    newTaskArrayPast = newTaskArrayPast.filter((i: any) => i.TaskId != self.taskId);
                                    self.eventsListPast = (JSON.stringify(newTaskArrayPast));
                                }

                                self.contactName = '';
                                self.mobileNumber = '';
                                self.taskId = '';
                                self.checkliststate = '';
                                self.emiratesId = '';
                                self.evidanceAttachment1 = ''
                                self.evidanceAttachment1Url = ''
                                self.evidanceAttachment2 = ''
                                self.evidanceAttachment2Url = ''
                                self.licencesAttachment1 = ''
                                self.licencesAttachment1Url = '';
                                self.licencesAttachment2 = ''
                                self.licencesAttachment2Url = ''
                                self.EmiratesIdAttachment1 = ''
                                self.EmiratesIdAttachment1Url = ''
                                self.EmiratesIdAttachment2 = ''
                                self.EmiratesIdAttachment2Url = ''
                                self.noCheckList = ''
                                self.result = ''
                                self.finalComment = ''
                                self.flashlightCBValue = false
                                self.thermometerCBValue = false
                                self.dataLoggerCBValue = false
                                self.luxmeterCBValue = false
                                self.UVlightCBValue = false
                                self.foodalertSampling = false
                                self.latitude = ''
                                self.longitude = ''
                                self.percentage = ''
                                self.totalScore = ''
                                self.grade = ''
                                self.maxscore = ''
                                NavigationService.navigate('Dashboard');
                            }
                            if (self.isMyTaskClick != 'campaign') {
                                RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                    // ToastAndroid.show('Task objct successfully ', 1000);
                                    NavigationService.navigate('Dashboard');
                                });
                            }
                        }
                    }
                    else {

                        if (self.isMyTaskClick == 'campaign') {
                            self.loadingState = '';
                            self.state = "submitSuccess";
                        }
                        else {
                            self.loadingState = '';
                            self.state = 'navigate'
                            NavigationService.navigate('Dashboard');

                        }
                    }
                }
            }

        }
        catch (error) {
            //console.log('Exception' + error);
            // ... including try/catch error handling
            self.state = "error"
        }

    }),

    callToGetBAApi: flow(function* (item: any, createAdhocFlag: boolean) {
        // self.state = "pending"
        try {

            self.businessActivityArray = '';
            let getBusinessActivityResponse = yield fetchGetBusinessActivity(item);
            // debugger;
            // console.log("baTempitem::" + JSON.stringify(getBusinessActivityResponse))

            let baArray = Array();
            if (getBusinessActivityResponse && getBusinessActivityResponse.Status && (getBusinessActivityResponse.Status.toLowerCase() == 'success')) {
                let baTempArray = [];
                debugger;

                if (getBusinessActivityResponse.GetChildBusinessActvities) {
                    if (getBusinessActivityResponse.GetChildBusinessActvities.Account.length) {
                        baTempArray = getBusinessActivityResponse.GetChildBusinessActvities.Account;
                    }
                    else {
                        baTempArray.push(getBusinessActivityResponse.GetChildBusinessActvities.Account)
                    }
                }
                // console.log("baTempArray::" + JSON.stringify(getBusinessActivityResponse))

                debugger;
                for (let index = 0; index < baTempArray.length; index++) {
                    let obj = Object();
                    let elementArr = Array();
                    const element = baTempArray[index];

                    obj.AccountNumber = element.AccountNumber;
                    obj.ArabicName = element.ArabicName;
                    obj.EstablishmentName = element.EstablishmentName;
                    obj.ListOfAdfcaActionAccount = element.ListOfAdfcaActionAccount;
                    obj.AdfcaActionAccount = []
                    let listOfAdfcaActionAccount = element.ListOfAdfcaActionAccount;
                    if (listOfAdfcaActionAccount && listOfAdfcaActionAccount != '') {
                        let AdfcaActionAccount = listOfAdfcaActionAccount.AdfcaActionAccount

                        for (let index = 0; index < AdfcaActionAccount.length; index++) {

                            let actionAccountObj = Object()

                            actionAccountObj.MainActivitty = AdfcaActionAccount[index].MainActivitty;
                            actionAccountObj.Description = AdfcaActionAccount[index].Description;
                            actionAccountObj.ParentActivityDesc = AdfcaActionAccount[index].ParentActivityDesc;
                            actionAccountObj.RiskCategory = AdfcaActionAccount[index].RiskCategory;
                            actionAccountObj.SubActivityFlag = AdfcaActionAccount[index].SubActivityFlag;
                            actionAccountObj.BusinessActivity = AdfcaActionAccount[index].BusinessActivity;
                            actionAccountObj.Status = AdfcaActionAccount[index].Status;
                            obj.AdfcaActionAccount.push(actionAccountObj)

                        }
                    }
                    obj.TradeLicense = element.TradeLicense;
                    baArray.push(obj);
                    // alert(JSON.stringify(baArray))
                }

                try {
                    let tempBusinessActivityArray: any = baArray
                    let tempArray1: any = [];

                    // console.log("businessActivityArray: ", JSON.stringify(tempBusinessActivityArray))
                    let AdfcaActionAccount = tempBusinessActivityArray[0] ? tempBusinessActivityArray[0].AdfcaActionAccount : []
                    let businessActivitiesArray = Array();
                    for (let i = 0; i < AdfcaActionAccount.length; i++) {
                        // console.log("AdfcaActionAccount[i].BusinessActivity: ", JSON.stringify(AdfcaActionAccount[i]))

                        let obj: any = {};
                        obj.lable = AdfcaActionAccount[i].BusinessActivity
                        obj.value = AdfcaActionAccount[i].Description ? AdfcaActionAccount[i].Description : ''
                        obj.RiskCategory = AdfcaActionAccount[i].RiskCategory

                        if ((AdfcaActionAccount[i].SubActivityFlag == 'Y') && AdfcaActionAccount[i].Description && item.Description && item.Description != '') {
                            let flag = true;
                            let obj = {
                                "@id": "business_activity",
                                "instance": {
                                    "@id": AdfcaActionAccount[i].Description,
                                    "attribute": {
                                        "@id": "business_activity",
                                        "@type": "text",
                                        "text-val": AdfcaActionAccount[i].Description,
                                        "text": ""
                                    }
                                }
                            }
                            if (businessActivitiesArray.length) {
                                for (let indexBa = 0; indexBa < businessActivitiesArray.length; indexBa++) {
                                    const element = businessActivitiesArray[indexBa];
                                    if (element["instance"]["@id"] == AdfcaActionAccount[i].Description) {
                                        flag = false;
                                        break
                                    }
                                }
                            }

                            if (flag) {
                                businessActivitiesArray.push(obj)
                            }
                        }
                        else {
                            tempArray1.push(obj)
                        }
                    }
                    if (businessActivitiesArray.length) {
                        self.subBusinessActivityArray = JSON.stringify(businessActivitiesArray);
                    }
                    let tempBusinessActivitySorted = Array();
                    a: for (let index1 = 0; index1 < tempArray1.length; index1++) {
                        const element = tempArray1[index1];
                        let flag = false;
                        b: if (tempBusinessActivitySorted.length) {
                            for (let index = 0; index < tempBusinessActivitySorted.length; index++) {
                                const elementTemp = tempBusinessActivitySorted[index];
                                if (elementTemp.value == element.value) {
                                    flag = true;
                                    break b;
                                }
                            }
                            if (!flag) {
                                tempBusinessActivitySorted.push(element);
                            }
                        }
                        else {
                            tempBusinessActivitySorted.push(element);
                        }
                    }

                    console.log('tempBusinessActivitySorted ::' + JSON.stringify(tempBusinessActivitySorted[0]))
                    // setBusinessActivityArray(tempBusinessActivitySorted);
                    // setsubBusinessActivityArray(businessActivitiesArray)
                    self.businessActivityArray = JSON.stringify(tempBusinessActivitySorted)
                }
                catch (error) {
                    console.log("error:" + error)
                }

                self.getBusinessActivityResponse = JSON.stringify(baArray);
                self.state = 'getBASuccess';
                self.bastate = 'getBASuccess';
                if (createAdhocFlag) {
                    self.createAdhoc = true;
                }
                console.log('self.state BA :::' + JSON.stringify(self.state));
            }
            else {
                ToastAndroid.show('Failed to get BA,Error_' + getBusinessActivityResponse.ErrorMessage + ',ErrorCode_' + getBusinessActivityResponse.ErrorCode, 1000);
                self.businessActivityArray = '';
                self.state = "error"
            }
        }
        catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }
    }),

    callToGetInspectionReport: flow(function* () {
        try {
            self.state = "pending"
            var path = DownloadDirectoryPath + '/' + self.taskId + "_SibleReport.pdf";
            // "ReferenceId": "1-2796924481",
            let payload: any = {
                "InterfaceID": "ADFCA_CRM_SBL_058",
                "LanguageType": "ENG",
                "ReferenceId": isDev ? "1-2796924481" : self.taskId,
                "EntityName": "Inspection"
            }
            let response = yield fetchSibleReport(payload);
            // debugger;
            // console.log("inspection::" + JSON.stringify(response))

            if (response && response.Status && (response.Status.toLowerCase() == 'success')) {

                // self.state = 'done';
                // if (!isDev) {
                writeFile(path, response.FileBuffer, 'base64')
                    .then((success) => {
                        console.log('FILE WRITTEN!');
                        FileViewer.open(path)
                            .then(() => {
                                self.state = 'done';
                                console.log('FILE Open!');
                                // Alert.alert("", "File download at location :-" + path)
                                // success
                            })
                            .catch(error => {
                                console.log('FILE Open failed!::' + error);
                                // error
                                self.state = 'done';

                            });
                    })
                    .catch((err) => {
                        console.log(err.message);
                        self.state = 'done';

                    });
                // }

            }
            else {
                self.state = 'done';
                ToastAndroid.show("ErrorCode_" + response.ErrorCode + ",ErrorMessage_" + response.ErrorMessage, 1000);
            }
        }
        catch (error) {
            // ... including try/catch error handling
            self.state = "error"
        }
    }),

    callToGetChecklistApi: flow(function* (dataObj: any, isArabic: boolean, fromHistory: boolean, description: string, SBL_EHSrisk: string) {
        // {
        debugger;
        // self.state = "pending"
        try {

            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, self.taskId);
            if (checkListData && checkListData['0'] && checkListData['0'].checkList && JSON.parse(checkListData[0].checkList).length) {
                self.getChecklistResponse = (checkListData['0'].checkList);
                self.noCheckList = '';
                self.checkListArray = (checkListData['0'].checkList);
                self.state = 'getChecklistSuccess'
                self.loadingState = ''
            }
            else {
                let subBusinessActivity = Array()
                if (self.subBusinessActivityArray != '') {
                    subBusinessActivity = JSON.parse(self.subBusinessActivityArray);
                }
                if (dataObj.Description == '' || dataObj.Description == null || dataObj.Description == 'null' || dataObj.Description == undefined) {
                    self.noCheckList = 'NocheckListAvailable';
                    self.loadingState = '';
                    ToastAndroid.show('No Checklist Available', 1000);
                    self.state = "error";
                } else {
                    let getChecklistResponse = yield fetchGetChecklistApi(dataObj, subBusinessActivity, isArabic, description);
                    debugger;
                    if (getChecklistResponse && getChecklistResponse['global-instance']) {

                        let checkListArray = [];
                        debugger;
                        let questionsArray = getChecklistResponse['global-instance'] ? getChecklistResponse['global-instance'].entity[1]["instance"] : [];
                        debugger;
                        if (questionsArray) {
                            self.state = 'getChecklistSuccess'
                            self.loadingState = '';
                            for (let i = 0; i < questionsArray.length; i++) {
                                let questionaire = Object();
                                questionaire.parameter_score = Array(5);
                                questionaire.parameter_score_desc = Array(5);
                                questionaire.parameter_non_comp_desc = Array(5);
                                for (let j = 0; j < questionsArray[i]['attribute'].length; j++) {

                                    switch (questionsArray[i]['attribute'][j]['@id']) {
                                        case 'parameter':
                                            questionaire.parameter = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            break;
                                        case 'parameter_weight_mobility':
                                            questionaire.parameter_weight_mobility = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                            break;
                                        case 'parameter_score_desc_2':
                                            debugger;
                                            questionaire.parameter_score_desc_2 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            questionaire.parameter_score_desc[2] = questionaire.parameter_score_desc_2;
                                            // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_2);
                                            break;
                                        case 'parameter_EHS_Risk':
                                            questionaire.parameter_EHS_Risk = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            break;
                                        case 'parameter_score_4':
                                            questionaire.parameter_score_4 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                            questionaire.parameter_score[4] = questionaire.parameter_score_4;
                                            // questionaire.parameter_score.push(questionaire.parameter_score_4);
                                            break;
                                        case 'parameter_score_desc_3':
                                            questionaire.parameter_score_desc_3 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            questionaire.parameter_score_desc[3] = questionaire.parameter_score_desc_3;
                                            // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_3);
                                            break;
                                        case 'parameter_EHS':
                                            questionaire.parameter_EHS = questionsArray[i]['attribute'][j]['boolean-val'] ? questionsArray[i]['attribute'][j]['boolean-val'] : '';
                                            break;
                                        case 'parameter_guidance_rules':
                                            questionaire.parameter_guidance_rules = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            break;
                                        case 'parameter_grace_minimum':
                                            questionaire.parameter_grace_minimum = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                            break;
                                        case 'parameter_score_desc_1':
                                            questionaire.parameter_score_desc_1 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            questionaire.parameter_score_desc[1] = questionaire.parameter_score_desc_1;
                                            // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_1);
                                            break;
                                        case 'parameter_reference':
                                            questionaire.parameter_reference = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            break;
                                        case 'parameter_score_desc_4':
                                            questionaire.parameter_score_desc_4 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            questionaire.parameter_score_desc[4] = questionaire.parameter_score_desc_4;
                                            // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_4);
                                            break;
                                        case 'parameter_non_comp_desc_4':
                                            questionaire.parameter_non_comp_desc_4 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            questionaire.parameter_non_comp_desc[4] = questionaire.parameter_non_comp_desc_4;
                                            // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_4);
                                            break;
                                        case 'parameter_non_comp_desc_2':
                                            questionaire.parameter_non_comp_desc_2 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            questionaire.parameter_non_comp_desc[2] = questionaire.parameter_non_comp_desc_2;
                                            // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_2);
                                            break;
                                        case 'parameter_non_comp_desc_3':
                                            questionaire.parameter_non_comp_desc_3 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            questionaire.parameter_non_comp_desc[3] = questionaire.parameter_non_comp_desc_3;
                                            // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_3);
                                            break;
                                        case 'parameter_non_comp_desc_0':
                                            questionaire.parameter_non_comp_desc_0 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            questionaire.parameter_non_comp_desc[0] = questionaire.parameter_non_comp_desc_0;
                                            // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_0);
                                            break;
                                        case 'parameter_non_comp_desc_1':
                                            questionaire.parameter_non_comp_desc_1 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            questionaire.parameter_non_comp_desc[1] = questionaire.parameter_non_comp_desc_1;
                                            // questionaire.parameter_non_comp_desc.push(questionaire.parameter_non_comp_desc_1);
                                            break;
                                        case 'parameter_subtype':
                                            questionaire.parameter_subtype = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            break;
                                        case 'parameter_reg_6':
                                            questionaire.parameter_reg_6 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            break;
                                        case 'parameter_score_desc_0':
                                            questionaire.parameter_score_desc_0 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            questionaire.parameter_score_desc[0] = questionaire.parameter_score_desc_0;
                                            // questionaire.parameter_score_desc.push(questionaire.parameter_score_desc_0);
                                            break;
                                        case 'parameter_score_1':
                                            questionaire.parameter_score_1 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                            questionaire.parameter_score[1] = questionaire.parameter_score_1;
                                            // questionaire.parameter_score.push(questionaire.parameter_score_1);
                                            break;
                                        case 'parameter_score_0':
                                            questionaire.parameter_score_0 = questionsArray[i]['attribute'][j]['number-val'] || (questionsArray[i]['attribute'][j]['number-val'] == 0) || (questionsArray[i]['attribute'][j]['number-val'] == 0.0) ? questionsArray[i]['attribute'][j]['number-val'] : ''
                                            questionaire.parameter_score[0] = questionaire.parameter_score_0;
                                            // questionaire.parameter_score.push(questionaire.parameter_score_0);
                                            break;
                                        case 'parameter_score_3':
                                            questionaire.parameter_score_3 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                            questionaire.parameter_score[3] = questionaire.parameter_score_3;
                                            // questionaire.parameter_score.push(questionaire.parameter_score_3);
                                            break;
                                        case 'parameter_score_2':
                                            questionaire.parameter_score_2 = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                            questionaire.parameter_score[2] = questionaire.parameter_score_2;
                                            // questionaire.parameter_score.push(questionaire.parameter_score_2);
                                            break;
                                        case 'parameter_reg_1':
                                            questionaire.parameter_reg_1 = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            break;
                                        case 'parameter_grace_maximum':
                                            questionaire.parameter_grace_maximum = questionsArray[i]['attribute'][j]['number-val'] ? questionsArray[i]['attribute'][j]['number-val'] : '';
                                            break;
                                        case 'parameter_type':
                                            questionaire.parameter_type = questionsArray[i]['attribute'][j]['text-val'] ? questionsArray[i]['attribute'][j]['text-val'] : '';
                                            break;
                                        case 'parameter_EFST':
                                            questionaire.parameter_EFST = questionsArray[i]['attribute'][j]['boolean-val'] ? questionsArray[i]['attribute'][j]['boolean-val'] : '';
                                            break;
                                        default:
                                            break;
                                    }

                                }

                                questionaire.parameter_score = questionaire.parameter_score.reverse();
                                questionaire.parameter_score_desc = questionaire.parameter_score_desc.reverse();
                                questionaire.parameter_non_comp_desc = questionaire.parameter_non_comp_desc.reverse();
                                questionaire.Answers = "";
                                questionaire.grace = "";
                                checkListArray.push(questionaire);
                            }
                            debugger;

                            if (checkListArray.length == 0) {
                                self.noCheckList = 'NocheckListAvailable';
                                self.loadingState = '';
                                self.checkliststate = "checklistNoLength";
                                ToastAndroid.show('No Checklist Available ', 1000);
                            }
                            else {

                                let obj: any = {};
                                let checkArr: any = [];

                                // console.log("checkListArray>>" + JSON.stringify(checkListArray));
                                if (dataObj.TaskType.toLowerCase() == 'routine inspection') {

                                    for (let index = 0; index < checkListArray.length; index++) {
                                        const element = checkListArray[index];

                                        let parameter_weight = element.parameter_weight_mobility != '' ? element.parameter_weight_mobility : 1;

                                        element.Answers = ((dataObj.TaskType.toLowerCase() == 'direct inspection') || (dataObj.TaskType.toLowerCase() == 'complaints')) ? "4" : '';
                                        element.color = "#ffffff";
                                        element.gracePeriod = "";
                                        element.guidance = "";
                                        element.Lang = isArabic ? "Arabic" : "ENU";
                                        element.parameter_reference_original = element.parameter_reference;
                                        element.parameter_reference = element.parameter_reference;
                                        element.parameter_score_desc = element.parameter_score_desc;
                                        element.parameter_score = element.parameter_score;
                                        element.parameter_non_comp_desc = element.parameter_non_comp_desc;
                                        element.parameterno = index;
                                        element.role = "";
                                        element.score = "";
                                        element.Score = "";
                                        element.syncDate = moment().format('L');
                                        element.TotalscoreForQuestion = "";
                                        element.NA = "N";
                                        element.NAValue = false;
                                        element.NI = "N";
                                        element.NIValue = false;
                                        element.comment = ((dataObj.TaskType.toLowerCase() == 'direct inspection') || (dataObj.TaskType.toLowerCase() == 'complaints')) ? (element.parameter_non_comp_desc[0] ? (element.parameter_non_comp_desc[0] === 'uncertain') ? '-' : element.parameter_non_comp_desc[0] : '') : "";

                                        if (element.parameter_type == 'uncertain') {
                                            element.parameter_type = 'EHS';
                                            element.parameter_EHS = true;
                                        }

                                        let parameter_EHS = JSON.stringify(element.parameter_EHS);
                                        if (SBL_EHSrisk) {
                                            if (SBL_EHSrisk.toLowerCase() == 'low' || SBL_EHSrisk.toLowerCase() == 'medium and low') {

                                                if (parameter_EHS.toLowerCase() == "true") {

                                                    if (SBL_EHSrisk.toLowerCase() == 'low') {

                                                        checkArr.push(element)

                                                    }
                                                    else if (SBL_EHSrisk.toLowerCase() == 'medium and low') {

                                                        if (element.parameter_EHS_Risk.toLowerCase() == 'medium and low') {

                                                            checkArr.push(element)

                                                        }
                                                    }
                                                }
                                                else {

                                                    checkArr.push(element)

                                                }
                                            }
                                            else if ((parameter_EHS) && (parameter_EHS.toString().toLowerCase() != "true")) {

                                                checkArr.push(element)
                                            }
                                        }
                                        else {

                                            if ((parameter_EHS) && (parameter_EHS.toString().toLowerCase() != "true")) {

                                                checkArr.push(element)

                                            }
                                            else if (element.parameter_EHS == null) {

                                                checkArr.push(element)

                                            }
                                        }
                                    }
                                }
                                else {
                                    for (let index = 0; index < checkListArray.length; index++) {
                                        const element = checkListArray[index];
                                        let parameter_weight = element.parameter_weight_mobility != '' ? element.parameter_weight_mobility : 1;

                                        element.Answers = ((dataObj.TaskType.toLowerCase() == 'direct inspection') || (dataObj.TaskType.toLowerCase() == 'complaints')) ? "4" : '';
                                        element.color = "#ffffff";
                                        element.gracePeriod = "";
                                        element.guidance = "";
                                        element.Lang = isArabic ? "Arabic" : "ENU";
                                        element.parameter_reference_original = element.parameter_reference;
                                        element.parameter_reference = element.parameter_reference;
                                        element.parameter_score_desc = element.parameter_score_desc;
                                        element.parameter_score = element.parameter_score;
                                        element.parameter_non_comp_desc = element.parameter_non_comp_desc;
                                        element.parameterno = index;
                                        element.role = "";
                                        element.score = ((dataObj.TaskType.toLowerCase() == 'direct inspection') || (dataObj.TaskType.toLowerCase() == 'complaints')) ? (4 * parseInt(parameter_weight)) : "";
                                        element.Score = ((dataObj.TaskType.toLowerCase() == 'direct inspection') || (dataObj.TaskType.toLowerCase() == 'complaints')) ? (4 * parseInt(parameter_weight)) : "";
                                        element.syncDate = moment().format('L');
                                        element.TotalscoreForQuestion = ((dataObj.TaskType.toLowerCase() == 'direct inspection') || (dataObj.TaskType.toLowerCase() == 'complaints')) ? (4 * parseInt(parameter_weight)) : "";
                                        element.NA = "N";
                                        element.NAValue = false;
                                        element.NI = "N";
                                        element.NIValue = false;
                                        element.comment = ((dataObj.TaskType.toLowerCase() == 'direct inspection') || (dataObj.TaskType.toLowerCase() == 'complaints')) ? (element.parameter_non_comp_desc[0] ? (element.parameter_non_comp_desc[0] === 'uncertain') ? '-' : element.parameter_non_comp_desc[0] : '') : "";
                                        if (dataObj.TaskType.toLowerCase() == 'direct inspection' || dataObj.TaskType.toLowerCase() == 'complaints') {
                                            if (element.parameter_EHS == true || element.parameter_EHS == 'true' || element.parameter_type === 'uncertain') {
                                            }
                                            else {
                                                checkArr.push(element)
                                            }
                                        }
                                        else {
                                            if (element.parameter_type == 'uncertain') {
                                                element.parameter_type = 'EHS';
                                                element.parameter_EHS = true;
                                            }
                                            checkArr.push(element)
                                        }
                                    }
                                }
                                //covid checklist flag
                                if (true) {
                                    CovidChecklistArray = getCovidChecklist(isArabic)
                                }

                                if (checkArr.length == 0) {
                                    self.noCheckList = 'NocheckListAvailable';
                                    self.loadingState = '';
                                    self.checkliststate = "checklistNoLength";
                                    ToastAndroid.show('No Checklist Available ', 1000);
                                } else {
                                    self.noCheckList = '';
                                }
                                let checklistSaveArr = Array();
                                let checklistCovidSaveArr = Array();
                                for (let indexcovid = 0; indexcovid < CovidChecklistArray.length; indexcovid++) {
                                    const element = CovidChecklistArray[indexcovid];
                                    let parameter_weight = element.parameter_weight_mobility != '' ? element.parameter_weight_mobility : 1;
                                    if (dataObj.TaskType.toLowerCase() == 'direct inspection' || (dataObj.TaskType.toLowerCase() == 'complaints')) {
                                        element.score = ((dataObj.TaskType.toLowerCase() == 'direct inspection') || (dataObj.TaskType.toLowerCase() == 'complaints')) ? (4 * parseInt(parameter_weight)) : "";
                                        element.Score = ((dataObj.TaskType.toLowerCase() == 'direct inspection') || (dataObj.TaskType.toLowerCase() == 'complaints')) ? (4 * parseInt(parameter_weight)) : "";
                                        element.Answers = ((dataObj.TaskType.toLowerCase() == 'direct inspection') || (dataObj.TaskType.toLowerCase() == 'complaints')) ? "4" : '';
                                        element.syncDate = moment().format('L');
                                        element.TotalscoreForQuestion = ((dataObj.TaskType.toLowerCase() == 'direct inspection') || (dataObj.TaskType.toLowerCase() == 'complaints')) ? (4 * parseInt(parameter_weight)) : "";
                                        element.comment = ((dataObj.TaskType.toLowerCase() == 'direct inspection') || (dataObj.TaskType.toLowerCase() == 'complaints')) ? (element.parameter_non_comp_desc[0] ? (element.parameter_non_comp_desc[0] === 'uncertain') ? '-' : element.parameter_non_comp_desc[0] : '') : "";
                                        if (element.parameter_EHS == true || element.parameter_EHS == 'true' || element.parameter_type === 'uncertain') {
                                        }
                                        else {
                                            checklistCovidSaveArr.push(element)
                                        }
                                    }
                                    else {
                                        checklistCovidSaveArr.push(element)
                                    }
                                }
                                checklistSaveArr = [...checklistCovidSaveArr, ...checkArr];

                                for (let indexChecklist = 0; indexChecklist < checklistSaveArr.length; indexChecklist++) {
                                    const element = checklistSaveArr[indexChecklist];
                                    element.parameterno = indexChecklist;
                                }

                                if (fromHistory) {
                                    self.checkListArray = JSON.stringify(checklistSaveArr);
                                } else {
                                    obj.checkList = JSON.stringify(checklistSaveArr);
                                    self.checkListArray = JSON.stringify(checklistSaveArr);
                                    obj.taskId = self.taskId;
                                    obj.timeElapsed = '';
                                    obj.timeStarted = '';
                                    debugger;

                                    RealmController.addCheckListInDB(realm, obj, () => {
                                        // ToastAndroid.show('Task added to db successfully', 1000);
                                    });
                                }


                                self.state = 'getChecklistSuccess'
                                self.checkliststate = "checklistLength";
                                // if (fromHistory) {
                                //     self.historyChecklist = false;
                                //     self.loadingState = ''
                                //     self.state = 'done'
                                //     NavigationService.navigate('EstablishmentDetails', { 'inspectionDetails': JSON.parse(self.selectedTask), 'flag': true });

                                // }
                            }
                        }
                        else {
                            self.noCheckList = 'NocheckListAvailable';
                            self.loadingState = '';
                            self.checkliststate = "checklistNoLength";
                            ToastAndroid.show('No Checklist Available ', 1000);
                        }
                    }
                    else {
                        self.noCheckList = 'NocheckListAvailable';
                        self.loadingState = '';
                        self.checkliststate = "checklistNoLength";
                        ToastAndroid.show(getChecklistResponse.Message ? getChecklistResponse.Message : getChecklistResponse.ErrorCode ? ("ErrorCode:" + getChecklistResponse.ErrorCode + "ErrorMessage:" + getChecklistResponse.ErrorMessage) : 'Failed to get checklist', 1000);
                        self.state = "error";
                    }
                }

            }
            console.log('checklistDone===============');

        }
        catch (e) {
            self.loadingState = '';
            console.log('Exception My Task' + e);
        }

    }),

    callToGetFoodDisposal: flow(function* (dataObj: any) {
        // {
        debugger;
        // self.state = "pending"
        try {
            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, dataObj.TaskId);
            if (checkListData && checkListData['0'] && checkListData['0'].checkList && JSON.parse(checkListData[0].checkList).length) {
                self.getChecklistResponse = (checkListData['0'].checkList);
                self.noCheckList = '';
                self.checkListArray = (checkListData['0'].checkList);
                self.state = 'getChecklistSuccess'
                self.loadingState = ''
            }
            else {
                let getChecklistResponse = yield fetchFoodDisposal(dataObj);
                getChecklistResponse = {
                    "ErrorCode": null,
                    "ErrorMessage": null,
                    "ListOfAdfcaMobilityDisposableItems": {
                        "Action": [
                            {
                                "DataLogger": null,
                                "Flashlight": null,
                                "LuxMeter": null,
                                "RiskCategory": "1-ASAP",
                                "ScorePercent": null,
                                "InspectionStatus": null,
                                "ContactName": "Tty",
                                "EmiratesId": "88599",
                                "MobileNumber": "332535566655",
                                "UVLight": null,
                                "TaskId": "1-845075387",
                                "ActualInspectionDate": null,
                                "Latitude": null,
                                "Longitude": null,
                                "Grade": null,
                                "Comment": null,
                                "Thermometer": null,
                                "GracePeriod": null,
                                "InspectorId": null,
                                "InspectorName": null,
                                "LanguageType": null,
                                "NearestDate": null,
                                "Score": null,
                                "Action": null,
                                "ListOfSwiAssetMgmt-Asset": {
                                    "SwiAssetMgmt-Asset": [
                                        {
                                            "Id": "Verified",
                                            "ExpiryDay": "10",
                                            "ExpiryMonth": "9",
                                            "ExpiryYear": "2018",
                                            "ProductionDay": null,
                                            "ProductionMonth": null,
                                            "ProductionYear": null,
                                            "Weight": "111",
                                            "IntegrationId": "1-553779102",
                                            "PackagingType": "Aluminum Box",
                                            "Name": "Magg",
                                            "ManufacturingCountry": "India",
                                            "Quantity": "1",
                                            "Unit": "KG",
                                            "Brand": "Nestle",
                                            "Batch": "8900099899",
                                            "Barcode": "8990007890"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "Status": "Success",
                    "TaskNumber": "1-845075387"
                }

                if (getChecklistResponse.Status == 'Success') {
                    self.state = 'getChecklistSuccess'

                    if (getChecklistResponse.ListOfAdfcaMobilityDisposableItems && getChecklistResponse.ListOfAdfcaMobilityDisposableItems.Action) {

                        for (let index = 0; index < getChecklistResponse.ListOfAdfcaMobilityDisposableItems.Action.length; index++) {
                            const element = getChecklistResponse.ListOfAdfcaMobilityDisposableItems.Action[index];
                            if (element['ListOfSwiAssetMgmt-Asset']) {
                                let data = element['ListOfSwiAssetMgmt-Asset'];
                                for (let index = 0; index < data['SwiAssetMgmt-Asset'].length; index++) {
                                    const elementData = data['SwiAssetMgmt-Asset'][index];
                                    // alert(JSON.stringify(elementData))
                                }
                            }
                        }
                    }
                }
                else {
                    self.state = 'error'

                }

            }
        }
        catch (e) {

        }
    }),

    callToSupervisoryGetQuestionarie: flow(function* (lang: string, taskId: string) {

        try {
            self.state = "pending"
            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, taskId);
            if (checkListData && checkListData['0'] && checkListData['0'].checkList && JSON.parse(checkListData[0].checkList).length) {
                self.getChecklistResponse = (checkListData['0'].checkList);
                self.noCheckList = '';
                self.checkListArray = (checkListData['0'].checkList);
                self.state = 'getChecklistSuccess'
                self.loadingState = ''
            }
            else {
                let getQuestionarieResponse = yield fetchGetQuestionarieApi(lang, taskId);
                debugger;
                if (getQuestionarieResponse && getQuestionarieResponse.Status == 'Success') {
                    self.noCheckList = '';
                    debugger;
                    // alert('getQuestionarieResponse' + JSON.stringify(getQuestionarieResponse));

                    for (let index = 0; index < getQuestionarieResponse.InspectionCheckList.Inspection.length; index++) {
                        const element = getQuestionarieResponse.InspectionCheckList.Inspection[index];
                        let checkListArray = Array();
                        let count = 1;
                        let questionaireList = Object();
                        questionaireList.TaskId = element.TaskId ? element.TaskId : '';
                        questionaireList.Thermometer = element.Thermometer ? element.Thermometer : '';
                        questionaireList.Flashlight = element.Flashlight ? element.Flashlight : '';
                        questionaireList.DataLogger = element.DataLogger ? element.DataLogger : '';
                        questionaireList.LuxMeter = element.LuxMeter ? element.LuxMeter : '';
                        questionaireList.UVLight = element.UVLight ? element.UVLight : '';
                        questionaireList.ActualInspectionDate = element.ActualInspectionDate ? element.ActualInspectionDate : '';
                        questionaireList.ScorePercent = element.ScorePercent ? element.ScorePercent : '';
                        questionaireList.ContactName = element.ContactName ? element.ContactName : '';
                        questionaireList.MobileNumber = element.MobileNumber ? element.MobileNumber : '';
                        questionaireList.EmiratesId = element.EmiratesId ? element.EmiratesId : '';
                        questionaireList.Latitude = element.Latitude ? element.Latitude : '';
                        questionaireList.Longitude = element.Longitude ? element.Longitude : '';
                        questionaireList.Grade = element.Grade ? element.Grade : '';
                        questionaireList.Comment = element.Comment ? element.Comment : '';
                        questionaireList.Score = element.Score ? element.Score : '';
                        questionaireList.Action = element.Action ? element.Action : '';
                        questionaireList.InspectionStatus = element.InspectionStatus ? element.InspectionStatus : '';

                        questionaireList.RiskCategory = element.RiskCategory ? element.RiskCategory : '';

                        let SalesAssessment = element.ListOfSalesAssessment ? element.ListOfSalesAssessment.SalesAssessment ? element.ListOfSalesAssessment.SalesAssessment : [] : [];

                        for (let checkListIndex = 0; checkListIndex < SalesAssessment.length; checkListIndex++) {

                            let elementChecklist = SalesAssessment[checkListIndex];
                            questionaireList.SiebelTaskId = elementChecklist.SiebelTaskId ? elementChecklist.SiebelTaskId : '';
                            questionaireList.AssessmentScore = elementChecklist.AssessmentScore ? elementChecklist.AssessmentScore : '';
                            questionaireList.Description2 = elementChecklist.Description2 ? elementChecklist.Description2 : '';
                            questionaireList.MaxScore = elementChecklist.MaxScore ? elementChecklist.MaxScore : '';
                            questionaireList.Name2 = elementChecklist.Name2 ? elementChecklist.Name2 : '';
                            questionaireList.Percent = elementChecklist.Percent ? elementChecklist.Percent : '';
                            questionaireList.Template_Name = elementChecklist.Template_Name ? elementChecklist.Template_Name : '';

                            let SalesAssessmentValue = elementChecklist.ListOfSalesAssessmentValue ? elementChecklist.ListOfSalesAssessmentValue.SalesAssessmentValue ? elementChecklist.ListOfSalesAssessmentValue.SalesAssessmentValue : [] : [];

                            for (let checkListValueIndex = 0; checkListValueIndex < SalesAssessmentValue.length; checkListValueIndex++) {

                                const elementChecklistValue = SalesAssessmentValue[checkListValueIndex];
                                let checklist = Object();
                                checklist.Assess_id = elementChecklistValue.Assess_id ? elementChecklistValue.Assess_id : '';
                                checklist.AttributeName = elementChecklistValue.AttributeName ? elementChecklistValue.AttributeName : '';
                                checklist.Comment2 = elementChecklistValue.Comment2 ? elementChecklistValue.Comment2 : '';
                                checklist.Order = elementChecklistValue.Order ? elementChecklistValue.Order : '';
                                checklist.Value = elementChecklistValue.Value ? elementChecklistValue.Value : '';
                                checklist.Weight = elementChecklistValue.Weight ? elementChecklistValue.Weight : '';
                                checklist.Score = elementChecklistValue.Score ? elementChecklistValue.Score : 'Satisfactory';
                                checklist.color = '#ffffff';

                                checklist.NA = "N";
                                checklist.NI = "N";

                                checklist.image1 = '';
                                checklist.image2 = '';

                                checklist.path1 = '';
                                checklist.path2 = '';

                                checklist.image1Base64 = '';
                                checklist.image2Base64 = '';

                                checkListArray.push(checklist);
                            }
                        }
                        questionaireList.questions = checkListArray;
                        //    alert(JSON.stringify(questionaireList));
                        if (checkListArray.length <= 0) {
                            self.noCheckList = 'NocheckListAvailable'
                            ToastAndroid.show('No Checklist Available ', 1000);
                        }
                        else {

                            self.getQuestionarieResponse = JSON.stringify(questionaireList);
                            self.checkListArray = JSON.stringify(checkListArray);
                            let obj: any = {};
                            obj.checkList = JSON.stringify(checkListArray);
                            obj.taskId = self.taskId;
                            self.noCheckList = '';
                            obj.timeElapsed = '';
                            obj.timeStarted = '';

                            let taskDetails = { ...JSON.parse(self.selectedTask) }
                            taskDetails.SiebelTaskId = questionaireList.SiebelTaskId;
                            taskDetails.AssessmentScore = questionaireList.AssessmentScore;
                            taskDetails.Description2 = questionaireList.Description2;
                            taskDetails.MaxScore = questionaireList.MaxScore;
                            taskDetails.Name2 = questionaireList.Name2;
                            taskDetails.Percent = questionaireList.Percent;
                            taskDetails.Template_Name = questionaireList.Template_Name;

                            RealmController.addTaskDetails(realm, taskDetails, TaskSchema.name, () => {
                                // ToastAndroid.show('Task added to db successfully', 1000);
                            });

                            RealmController.addCheckListInDB(realm, obj, () => {
                                // ToastAndroid.show('Task added to db successfully', 1000);
                            });
                            self.state = 'getSupervisoryQuestionarieSuccess';

                        }
                    }
                    //console.log(JSON.stringify(getQuestionarieResponse));
                }
                else {
                    self.noCheckList = 'NocheckListAvailable';
                    ToastAndroid.show(getQuestionarieResponse.message ? getQuestionarieResponse.message : getQuestionarieResponse.ErrorCode ? ("ErrorCode:" + getQuestionarieResponse.ErrorCode + "ErrorMessage:" + getQuestionarieResponse.ErrorMessage) : 'Failed to get checklist', 1000);
                    self.state = 'error'
                }
            }
        }
        catch (e) {
            //console.log(e);
        }
    }),

    callToOPAResult: flow(function* (payload: any, taskItem: any) {

        try {
            self.state = "pending"
            self.loadingState = "Fetching Result from OPA"

            let result = yield getOPAResultApi(payload);

            if (result && result['global-instance']) {

                if (result['global-instance'] && result['global-instance']["attribute"]) {
                    let res: any = result['global-instance']["attribute"]
                    if (res.length) {
                        for (let index = 0; index < res.length; index++) {
                            const element = res[index];
                            if (element["@id"] == "grade_percentage") {
                                self.percentage = element["number-val"] ? element["number-val"].toFixed(2).toString() : ''
                            }
                            else if (element["@id"] == "grade") {
                                self.grade = element["text-val"] ? ('Grade ' + element["text-val"]) : ''
                                console.log("grade::" + JSON.stringify(self.grade))
                            }
                            else if (element["@id"] == "total_score") {
                                self.totalScore = element["number-val"] ? element["number-val"].toString() : ''
                            }
                            else if (element["@id"] == "number_of_visits") {
                                self.noOfVisits = element["number-val"] ? element["number-val"].toString() : ''
                            }
                            else if (element["@id"] == "next_date_fri_sat") {
                                self.nextVisit = element["date-val"] ? element["date-val"] : ''
                                // taskItem.mappingData['0'].next_visit_date = element["date-val"] ? element["date-val"] : ''
                                // RealmController.addTaskDetails(realm, taskItem, TaskSchema.name, () => {
                                // });
                            }
                        }

                    }
                }
                self.state = "done"
                self.loadingState = ""
            }
            else {
                self.state = "done"
                self.loadingState = ""
                console.log('failed');
            }
        }
        catch (e) {
            self.state = "done"
            self.loadingState = ""
            console.log("OOPAREsult" + e);
        }
    }),

    callToGetQuestionaries: flow(function* (lang: string, taskId: string) {
        self.state = "pending"
        try {
            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, taskId);
            if (checkListData && checkListData['0'] && checkListData['0'].checkList) {
                self.getChecklistResponse = (checkListData['0'].checkList);
                self.noCheckList = '';
                self.checkListArray = (checkListData['0'].checkList);
                self.state = 'getChecklistSuccess'
                self.loadingState = ''
                // console.log('ffrom db>>>>'+checkListData['0'].checkList)
            }
            else {
                let getQuestionarieResponse = yield fetchGetQuestionarieApi(lang, taskId);
                debugger;
                if (getQuestionarieResponse && getQuestionarieResponse.Status == 'Success') {
                    self.noCheckList = '';
                    debugger;
                    for (let index = 0; index < getQuestionarieResponse.InspectionCheckList.Inspection.length; index++) {
                        const element = getQuestionarieResponse.InspectionCheckList.Inspection[index];
                        let checkListArray = Array();
                        let count = 1;
                        let questionaireList = Object();
                        questionaireList.TaskId = element.TaskId;
                        questionaireList.Thermometer = element.Thermometer;
                        questionaireList.Flashlight = element.Flashlight;
                        questionaireList.DataLogger = element.DataLogger;
                        questionaireList.LuxMeter = element.LuxMeter;
                        questionaireList.UVLight = element.UVLight;
                        if (element.ListOfFsExpenseItem && element.ListOfFsExpenseItem.Checklist && element.ListOfFsExpenseItem.Checklist.length) {
                            for (let checkListIndex = 0; checkListIndex < element.ListOfFsExpenseItem.Checklist.length; checkListIndex++) {
                                const checklistElement = element.ListOfFsExpenseItem.Checklist[checkListIndex];
                                let checkListObj = Object();
                                checkListObj.Answers = checklistElement.Answers;
                                checkListObj.originalScore = parseInt(checklistElement.Answers);
                                checkListObj.DescriptionArabic = checklistElement.DescriptionArabic ? checklistElement.DescriptionArabic : ""; //.replace(/&amp;/g, '&')
                                checkListObj.GracePeriod = checklistElement.GracePeriod ? checklistElement.GracePeriod : "";
                                checkListObj.QuestionNameArabic = checklistElement.QuestionNameArabic ? checklistElement.QuestionNameArabic : ""; //.replace(/&amp;/g, '&')
                                checkListObj.QuestionNameEnglish = checklistElement.QuestionNameEnglish ? checklistElement.QuestionNameEnglish : ""; //.replace(/&amp;/g, '&')
                                checkListObj.Weightage = checklistElement.Weightage ? checklistElement.Weightage : "";
                                if (isNaN(parseInt(checkListObj.Weightage))) {
                                    checkListObj.Weightage = 1;
                                }
                                if (checkListObj.Weightage.toString().length == 0) {
                                    checkListObj.Weightage = 1;
                                }
                                if (parseInt(checkListObj.Weightage) == 0) {
                                    checkListObj.Weightage = 1;
                                }
                                if (parseInt(checkListObj.Weightage) > 1)
                                    checkListObj.color = '#ffff66';
                                else
                                    checkListObj.color = '#ffffff';
                                checkListObj.NonComplianceEnglish = checklistElement.NonComplianceEnglish ? checklistElement.NonComplianceEnglish : "";
                                checkListObj.NonComplianceArabic = checklistElement.NonComplianceArabic ? checklistElement.NonComplianceArabic : "";
                                checkListObj.GracePeriodDate = checklistElement.GracePeriodDate ? checklistElement.GracePeriodDate : "";
                                //  checkListObj.GracePeriodDate = "11 / 01 / 2015";
                                checkListObj.NA = checklistElement.NA ? checklistElement.NA : "";
                                checkListObj.EFSTFlag = checklistElement.EFSTFlag ? checklistElement.EFSTFlag : false;
                                checkListObj.Action = checklistElement.Action ? checklistElement.Action : "";
                                checkListObj.NI = checklistElement.NI ? checklistElement.NI : "";
                                checkListObj.Comments = checklistElement.Comments ? checklistElement.Comments : ""; //.replace(/&amp;/g, '&')
                                checkListObj.MaxGracePeriod = checklistElement.MaxGracePeriod ? checklistElement.MaxGracePeriod : 30;
                                checkListObj.MinGracePeriod = checklistElement.MinGracePeriod ? checklistElement.MinGracePeriod : 0;
                                checkListObj.DescriptionEnglish = checklistElement.DescriptionEnglish ? checklistElement.DescriptionEnglish : ""; //.replace(/&amp;/g, '&')
                                checkListObj.ParameterNumber = checklistElement.ParameterNumber;
                                checkListObj.Regulation = checklistElement.Regulation;
                                checkListObj.image1 = '';
                                checkListObj.image2 = '';

                                if (checkListObj.Answers == null) {
                                    checkListObj.Answers = "";
                                }
                                checkListObj.image1Base64 = '';
                                checkListObj.image2Base64 = '';
                                checkListObj.Score = checklistElement.Score;
                                checkListObj.score = '';
                                checkListObj.giveAnsweredQuestion = ((checkListObj.Answers != "") && (checkListObj.Answers != "4")) ? false : true;
                                checkListObj.FinalScore = checkListObj.Answers;
                                if (isNaN(parseInt(checkListObj.Score)))
                                    checkListObj.Score = checkListObj.Answers * checkListObj.Weightage;
                                if (checkListObj.Answers != null && checkListObj.Answers.length > 0) {
                                    // checkListObj.Score = parseInt(checkListObj.Answers);
                                    checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                }
                                else if (checkListObj.NI == 'Y' || checkListObj.NA == 'Y') {

                                    if (checkListObj.NI == 'Y') {

                                        checkListObj.NI = true;

                                        if (checkListObj.Answers != '' && checkListObj.Answers != 5) {
                                            checkListObj.NI = false;
                                        }
                                        else {
                                            checkListObj.Score = 5;
                                            checkListObj.Answers = 5;
                                            checkListObj.originalScore = 5;
                                            checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                        }

                                        //added due to prevoius no NI condition
                                        if ((checkListObj.ParameterNumber == '3(1/3)') || (checkListObj.ParameterNumber == '3(2/3)') || (checkListObj.ParameterNumber == '4(4)') || (checkListObj.ParameterNumber == '6(1/6)')
                                            || (checkListObj.ParameterNumber == '6(2/6)') || (checkListObj.ParameterNumber == '6(4/6)') || (checkListObj.ParameterNumber == '6(5/6)') || (checkListObj.ParameterNumber == '6(6/6)') || (checkListObj.ParameterNumber == '6(7/6)')
                                            || (checkListObj.ParameterNumber == '6(8/6)') || (checkListObj.ParameterNumber == '11(3/11)')) {
                                            checkListObj.Score = 1;
                                            checkListObj.Answers = 1;
                                            checkListObj.originalScore = 1;
                                            checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                            checkListObj.NI = false;
                                        }
                                    }
                                }
                                if (checkListObj.NA != 'Y' && checkListObj.QuestionNameEnglish.toUpperCase() != 'EHS') {  //   && checkListObj.NI != 'Y'

                                    checkListObj.NA = false;
                                    if (checkListObj.NI == 'Y') {
                                        checkListObj.NI = true;
                                        checkListObj.wasNIDuringSync = true;

                                        if (checkListObj.Answers != '' && checkListObj.Answers != 5) {
                                            checkListObj.NI = false;
                                        }
                                        else {
                                            checkListObj.Score = 5;
                                            checkListObj.Answers = 5;
                                            checkListObj.originalScore = parseInt(checkListObj.Answers);
                                            checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                        }
                                    }
                                    else if (checkListObj.NI == 'N')
                                        checkListObj.NI = false;
                                    debugger;
                                    // if (!(checkListObj.NI == 'N' && checkListObj.Answers == null)) {
                                    //     if (checkListObj.Answers != null && checkListObj.Answers.toString().length) {
                                    checkListObj.parameterno = count++;
                                    checkListArray.push(checkListObj);
                                    //     }
                                    //     else {
                                    //         continue;
                                    //     }
                                    // }
                                }
                            }
                        }
                        else {
                            self.noCheckList = 'NocheckListAvailable'
                        }
                        questionaireList.questions = checkListArray;
                        console.log("checkListArray::" + JSON.stringify(checkListArray[0]))
                        if (checkListArray.length <= 0) {
                            self.state = 'done';
                            self.noCheckList = 'NocheckListAvailable'
                            ToastAndroid.show('No Checklist Available ', 1000);
                        }

                        else {
                            let covidQuestionFlag = true;
                            // for (let index = 0; index < checkListArray.length; index++) {
                            //     const element = checkListArray[index];
                            //     if ((element.ParameterNumber == '3(1/3)') || (element.ParameterNumber == '3(2/3)') || (element.ParameterNumber == '4(4)') || (element.ParameterNumber == '6(1/6)')
                            //         || (element.ParameterNumber == '6(2/6)') || (element.ParameterNumber == '6(4/6)') || (element.ParameterNumber == '6(5/6)') || (element.ParameterNumber == '6(6/6)') || (element.ParameterNumber == '6(7/6)')
                            //         || (element.ParameterNumber == '6(8/6)') || (element.ParameterNumber == '11(3/11)')) {
                            //         covidQuestionFlag = false;
                            //         break;
                            //     }
                            // }
                            //covid checklist flag  //to add change false to true
                            // if (false && covidQuestionFlag) {
                            //     CovidChecklistArray = getCovidChecklist(lang == "ENU" ? false : true)
                            // }

                            let checklistSaveArr = Array();
                            // checklistSaveArr = [...CovidChecklistArray, ...checkListArray];
                            checklistSaveArr = [...checkListArray];

                            for (let indexChecklist = 0; indexChecklist < checklistSaveArr.length; indexChecklist++) {
                                const element = checklistSaveArr[indexChecklist];
                                element.parameterno = indexChecklist;
                            }
                            self.checkListArray = JSON.stringify(checklistSaveArr);

                            self.getQuestionarieResponse = JSON.stringify(questionaireList);
                            let obj: any = {};
                            obj.checkList = JSON.stringify(checklistSaveArr);
                            obj.taskId = self.taskId;
                            self.noCheckList = '';
                            obj.timeElapsed = '';
                            obj.timeStarted = '';

                            RealmController.addCheckListInDB(realm, obj, () => {
                                //     ToastAndroid.show('Task added to db successfully', 1000);
                            });
                            self.state = 'getQuestionarieSuccess';
                        }

                    }

                }
                else {
                    self.noCheckList = 'NocheckListAvailable';
                    ToastAndroid.show(getQuestionarieResponse.message ? getQuestionarieResponse.message : getQuestionarieResponse.ErrorCode ? ("ErrorCode:" + getQuestionarieResponse.ErrorCode + "ErrorMessage:" + getQuestionarieResponse.ErrorMessage) : 'Failed to get checklist', 1000);
                    self.state = 'error'
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }),

    callToSubmitResheduledTasks: flow(function* (lang: string, rescheduledTaskList: any) {

        debugger;
        try {
            const getPercentageDed = (data: string) => {
                switch (data) {
                    case 'Violation':
                        return 20;
                    case 'First Warning':
                        return 10;
                    case 'Final Warning':
                        return 10;
                    case 'Notice':
                        return 5;
                    default:
                        return 0;
                }
            }

            const getGrade = (scorePercentage: any) => {
                let grade = 'Grade E';
                if (scorePercentage >= 90 && scorePercentage <= 100) {
                    grade = 'Grade A';
                } else if (scorePercentage >= 75 && scorePercentage < 90) {
                    grade = 'Grade B';
                } else if (scorePercentage >= 60 && scorePercentage < 75) {
                    grade = 'Grade C';
                } else if (scorePercentage >= 45 && scorePercentage < 60) {
                    grade = 'Grade D';
                } else if (scorePercentage < 45) {
                    grade = 'Grade E';
                }
                return grade;
            }

            const getFollowupCheckList = (checklist: any) => {
                let Arr = [...checklist];
                let weightage = 1;
                for (let k = 0; k < Arr.length; k++) {

                    if (Arr[k].Weightage == "" || Arr[k].Weightage == null) {
                        weightage = 1;
                    } else {
                        weightage = parseInt(Arr[k].Weightage);
                    }

                    if (Arr[k].score == 'Y') {
                        Arr[k].FinalScore = 4;
                        Arr[k].GracePeriod = 0;
                        Arr[k].calculatedGracePeriod = 0;
                    }
                    if (parseInt(Arr[k].score) == 4) {
                        // For Score == 4
                        //  Score Calculation
                        Arr[k].FinalScore = 4;
                        Arr[k].GracePeriod = 0;
                        Arr[k].calculatedGracePeriod = 0;

                    }
                    else {
                        // For score other than 4 , 
                        // If date is from future, do score and grace calculations
                        let date1 = new Date(Arr[k].GracePeriodDate);
                        let date2 = new Date();

                        if (date1 > date2) {
                            //Non Conformant Answered
                            if (Arr[k].score != '' && Arr[k].score != '-' && !Arr[k].NI) {
                                Arr[k].FinalScore = Arr[k].Answers;
                            }
                            else {
                                // Non Conformant not answered
                                try {
                                    // console.log('date1 is greater than date2' + date1 + 'sssss' + date2);
                                    Arr[k].isNotAnswered = true;
                                    // if (!isNaN(parseInt(Arr[k].score))) {
                                    //     Arr[k].FinalScore = Arr[k].score
                                    // }
                                    // else if (!isNaN(parseInt(Arr[k].Answers))) {
                                    //     Arr[k].FinalScore = Arr[k].Answers
                                    // }

                                }
                                catch (e) {

                                }
                            }

                        }
                        else {

                            if ((parseInt(Arr[k].Answers) > 0)) {
                                if (!isNaN(parseInt(Arr[k].score))) {
                                    Arr[k].FinalScore = Arr[k].score;

                                }
                                else if ((Arr[k].score == 'N') && Arr[k].originalScore > 0) {
                                    Arr[k].FinalScore = Arr[k].originalScore - 1;
                                    Arr[k].Answers = Arr[k].FinalScore;
                                }
                            }
                            else if ((parseInt(Arr[k].Answers) == 0)) {
                                Arr[k].FinalScore = Arr[k].Answers;
                            }
                        }
                    }
                    if ((Arr[k].GracePeriod) < 0) {
                        Arr[k].GracePeriod = 0;
                        Arr[k].calculatedGracePeriod = 0;
                    }

                }
                return Arr;
            }
            let payload: any = {};

            let rescheduledTaskListA = Array();
            // rescheduledTaskListA.push(rescheduledTaskList[0])

            // console.log('rescheduledTaskList ::' +JSON.stringify(rescheduledTaskList));
            yield Promise.all(rescheduledTaskList.map(async (taskDetails: any, index: number) => {

                let getQuestionarieAttachmentResponse = Object();
                let payloadAttachment = Object();
                let checkListArray = Array();

                let loginData = RealmController.getLoginData(realm, LoginSchema.name);
                loginData = loginData[0] ? loginData[0] : {};

                let getQuestionarieResponse = await fetchGetQuestionarieApi(lang, taskDetails.TaskId);
                debugger;

                if (getQuestionarieResponse && getQuestionarieResponse.Status == 'Success') {
                    debugger;

                    for (let index = 0; index < getQuestionarieResponse.InspectionCheckList.Inspection.length; index++) {

                        const element = getQuestionarieResponse.InspectionCheckList.Inspection[index];
                        let count = 1;
                        let questionaireList = Object();
                        questionaireList.TaskId = element.TaskId;
                        questionaireList.Thermometer = element.Thermometer;
                        questionaireList.Flashlight = element.Flashlight;
                        questionaireList.DataLogger = element.DataLogger;
                        questionaireList.LuxMeter = element.LuxMeter;
                        questionaireList.UVLight = element.UVLight;
                        if (element.ListOfFsExpenseItem && element.ListOfFsExpenseItem.Checklist && element.ListOfFsExpenseItem.Checklist.length) {

                            for (let checkListIndex = 0; checkListIndex < element.ListOfFsExpenseItem.Checklist.length; checkListIndex++) {
                                const checklistElement = element.ListOfFsExpenseItem.Checklist[checkListIndex];
                                let checkListObj = Object();
                                checkListObj.Answers = checklistElement.Answers;
                                checkListObj.originalScore = parseInt(checklistElement.Answers);
                                checkListObj.DescriptionArabic = checklistElement.DescriptionArabic ? checklistElement.DescriptionArabic.replace(/&amp;/g, '&') : "";
                                checkListObj.GracePeriod = checklistElement.GracePeriod ? checklistElement.GracePeriod : "";
                                checkListObj.QuestionNameArabic = checklistElement.QuestionNameArabic ? checklistElement.QuestionNameArabic.replace(/&amp;/g, '&') : "";
                                checkListObj.QuestionNameEnglish = checklistElement.QuestionNameEnglish ? checklistElement.QuestionNameEnglish.replace(/&amp;/g, '&') : "";
                                checkListObj.Weightage = checklistElement.Weightage ? checklistElement.Weightage : "";
                                if (isNaN(parseInt(checkListObj.Weightage))) {
                                    checkListObj.Weightage = 1;
                                }
                                if (checkListObj.Weightage.toString().length == 0) {
                                    checkListObj.Weightage = 1;
                                }
                                if (parseInt(checkListObj.Weightage) == 0) {
                                    checkListObj.Weightage = 1;
                                }
                                if (parseInt(checkListObj.Weightage) > 1)
                                    checkListObj.color = '#ffff66';
                                else
                                    checkListObj.color = '#ffffff';
                                checkListObj.NonComplianceEnglish = checklistElement.NonComplianceEnglish ? checklistElement.NonComplianceEnglish : "";
                                checkListObj.NonComplianceArabic = checklistElement.NonComplianceArabic ? checklistElement.NonComplianceArabic : "";
                                checkListObj.GracePeriodDate = checklistElement.GracePeriodDate ? checklistElement.GracePeriodDate : "";
                                //  checkListObj.GracePeriodDate = "11 / 01 / 2015";
                                checkListObj.NA = checklistElement.NA ? checklistElement.NA : "";
                                checkListObj.EFSTFlag = checklistElement.EFSTFlag ? checklistElement.EFSTFlag : false;
                                checkListObj.Action = checklistElement.Action ? checklistElement.Action : "";
                                checkListObj.NI = checklistElement.NI ? checklistElement.NI : "";
                                checkListObj.Comments = checklistElement.Comments ? checklistElement.Comments.replace(/&amp;/g, '&') : "";
                                checkListObj.MaxGracePeriod = checklistElement.MaxGracePeriod ? checklistElement.MaxGracePeriod : 30;
                                checkListObj.MinGracePeriod = checklistElement.MinGracePeriod ? checklistElement.MinGracePeriod : 0;
                                checkListObj.DescriptionEnglish = checklistElement.DescriptionEnglish ? checklistElement.DescriptionEnglish.replace(/&amp;/g, '&') : "";
                                checkListObj.ParameterNumber = checklistElement.ParameterNumber;
                                checkListObj.Regulation = checklistElement.Regulation;
                                checkListObj.image1 = '';
                                checkListObj.image2 = '';

                                if (checkListObj.Answers == null) {
                                    checkListObj.Answers = "";
                                }
                                checkListObj.image1Base64 = '';
                                checkListObj.image2Base64 = '';
                                checkListObj.Score = checklistElement.Score;
                                checkListObj.score = '';
                                checkListObj.giveAnsweredQuestion = ((checkListObj.Answers != "") && (checkListObj.Answers != "4")) ? false : true;
                                checkListObj.FinalScore = checkListObj.Answers;
                                if (isNaN(parseInt(checkListObj.Score)))
                                    checkListObj.Score = checkListObj.Answers * checkListObj.Weightage;
                                if (checkListObj.Answers != null && checkListObj.Answers.length > 0) {
                                    // checkListObj.Score = parseInt(checkListObj.Answers);
                                    checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                }
                                else if (checkListObj.NI == 'Y' || checkListObj.NA == 'Y') {

                                    if (checkListObj.NI == 'Y') {

                                        checkListObj.NI = true;

                                        if (checkListObj.Answers != '' && checkListObj.Answers != 5) {
                                            checkListObj.NI = false;
                                        }
                                        else {
                                            checkListObj.Score = 5;
                                            checkListObj.Answers = 5;
                                            checkListObj.originalScore = 5;
                                            checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                        }
                                    }
                                }
                                if (checkListObj.NA != 'Y' && checkListObj.QuestionNameEnglish.toUpperCase() != 'EHS') {  //   && checkListObj.NI != 'Y'

                                    checkListObj.NA = false;
                                    if (checkListObj.NI == 'Y') {
                                        checkListObj.NI = true;
                                        checkListObj.wasNIDuringSync = true;

                                        if (checkListObj.Answers != '' && checkListObj.Answers != 5) {
                                            checkListObj.NI = false;
                                        }
                                        else {
                                            checkListObj.Score = 5;
                                            checkListObj.Answers = 5;
                                            checkListObj.originalScore = parseInt(checkListObj.Answers);
                                            checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                        }
                                    }
                                    else if (checkListObj.NI == 'N')
                                        checkListObj.NI = false;
                                    debugger;
                                    // if (!(checkListObj.NI == 'N' && checkListObj.Answers == null)) {
                                    //     if (checkListObj.Answers != null && checkListObj.Answers.toString().length) {
                                    checkListObj.parameterno = count++;
                                    checkListArray.push(checkListObj);
                                    //     }
                                    //     else {
                                    //         continue;
                                    //     }
                                    // }
                                }
                            }
                        }
                        else {

                        }

                        questionaireList.questions = checkListArray;

                        // console.log("questionaireList.questions ::" + JSON.stringify(questionaireList.questions));
                        if (checkListArray.length <= 0) {

                        }
                        else {

                            let checklistSaveArr = Array();
                            // checklistSaveArr = [...CovidChecklistArray, ...checkListArray];
                            checklistSaveArr = [...checkListArray];

                            for (let indexChecklist = 0; indexChecklist < checklistSaveArr.length; indexChecklist++) {
                                const element = checklistSaveArr[indexChecklist];
                                element.parameterno = indexChecklist;
                            }
                            // self.checkListArray = JSON.stringify(checklistSaveArr);

                            // self.getQuestionarieResponse = JSON.stringify(questionaireList);

                            let tempArray = checklistSaveArr;

                            if (taskDetails.TaskType.toLowerCase() == 'follow-up') {
                                let followUpArray = getFollowupCheckList(tempArray)
                                await Promise.all(followUpArray = getFollowupCheckList(tempArray)).then(async (results) => {

                                    // console.log("followupchecklist:::>>>" + JSON.stringify(followUpArray))
                                    payload = await submissionPayloadFollow(followUpArray, taskDetails, followUpArray, questionaireList.TaskId, taskDetails, loginData.username, questionaireList.contactName, questionaireList.mobileNumber, questionaireList.emiratesId, '', questionaireList.finalComment, questionaireList.result, questionaireList.flashlightCBValue, questionaireList.thermometerCBValue, questionaireList.dataLoggerCBValue, questionaireList.luxmeterCBValue, questionaireList.UVlightCBValue, questionaireList.latitude, questionaireList.longitude, '', '', '');
                                    // console.log("results>>" + results);
                                }).catch(err => {
                                    // Alert.alert('', 'Failed To Upload Attachment');
                                    // console.log("err?>>" + err);
                                });

                            }
                            else {
                                if (taskDetails.TaskType.toLowerCase() == 'routine inspection' || taskDetails.TaskType.toLowerCase() == 'temporary routine inspection' || taskDetails.TaskType.toLowerCase() == 'direct inspection' || taskDetails.TaskType.toLowerCase() == 'complaints') {
                                    payload = submissionPayload(taskDetails.TaskType, tempArray, questionaireList.TaskId, taskDetails, loginData.username, questionaireList.contactName, questionaireList.mobileNumber, questionaireList.emiratesId, '', questionaireList.Comment, false, questionaireList.flashlightCBValue, questionaireList.thermometerCBValue, questionaireList.dataLoggerCBValue, questionaireList.luxmeterCBValue, questionaireList.UVlightCBValue, questionaireList.latitude, questionaireList.longitude, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
                                }
                            }
                        }
                    }
                }

                // debugger;
                if (payload != '') {
                    //console.log("payload::" + JSON.stringify(payload))
                    const getPercentageDed = (data: string) => {
                        switch (data) {
                            case 'Violation':
                                return 20;
                            case 'First Warning':
                                return 10;
                            case 'Final Warning':
                                return 10;
                            case 'Notice':
                                return 5;
                            default:
                                return 0;
                        }
                    }

                    const getGrade = (scorePercentage: any) => {
                        let grade = 'Grade E';
                        if (scorePercentage >= 90 && scorePercentage <= 100) {
                            grade = 'Grade A';
                        } else if (scorePercentage >= 75 && scorePercentage < 90) {
                            grade = 'Grade B';
                        } else if (scorePercentage >= 60 && scorePercentage < 75) {
                            grade = 'Grade C';
                        } else if (scorePercentage >= 45 && scorePercentage < 60) {
                            grade = 'Grade D';
                        } else if (scorePercentage < 45) {
                            grade = 'Grade E';
                        }
                        return grade;
                    }

                    const getFollowupCheckList = (checklist: any) => {
                        debugger;
                        let Arr = [...checklist];
                        let weightage = 1;
                        for (let k = 0; k < Arr.length; k++) {

                            if (Arr[k].Weightage == "" || Arr[k].Weightage == null) {
                                weightage = 1;
                            } else {
                                weightage = parseInt(Arr[k].Weightage);
                            }

                            if (Arr[k].score == 'Y') {
                                Arr[k].FinalScore = 4;
                                Arr[k].GracePeriod = 0;
                                Arr[k].calculatedGracePeriod = 0;
                            }
                            if (parseInt(Arr[k].score) == 4) {
                                // For Score == 4
                                //  Score Calculation
                                Arr[k].FinalScore = 4;
                                Arr[k].GracePeriod = 0;
                                Arr[k].calculatedGracePeriod = 0;

                            }
                            else {
                                // For score other than 4 , 
                                // If date is from future, do score and grace calculations
                                let date1 = new Date(Arr[k].GracePeriodDate);
                                let date2 = new Date();

                                if (date1 > date2) {
                                    //Non Conformant Answered
                                    if (Arr[k].score != '' && Arr[k].score != '-' && !Arr[k].NI) {
                                        Arr[k].FinalScore = Arr[k].Answers;
                                    }
                                    else {
                                        // Non Conformant not answered
                                        try {
                                            // console.log('date1 is greater than date2' + date1 + 'sssss' + date2);
                                            Arr[k].isNotAnswered = true;
                                            // if (!isNaN(parseInt(Arr[k].score))) {
                                            //     Arr[k].FinalScore = Arr[k].score
                                            // }
                                            // else if (!isNaN(parseInt(Arr[k].Answers))) {
                                            //     Arr[k].FinalScore = Arr[k].Answers
                                            // }

                                        }
                                        catch (e) {

                                        }
                                    }

                                }
                                else {

                                    if ((parseInt(Arr[k].Answers) > 0)) {
                                        if (!isNaN(parseInt(Arr[k].score))) {
                                            Arr[k].FinalScore = Arr[k].score;

                                        }
                                        else if ((Arr[k].score == 'N') && Arr[k].originalScore > 0) {
                                            Arr[k].FinalScore = Arr[k].originalScore - 1;
                                            Arr[k].Answers = Arr[k].FinalScore;
                                        }
                                    }
                                    else if ((parseInt(Arr[k].Answers) == 0)) {
                                        Arr[k].FinalScore = Arr[k].Answers;
                                    }
                                }
                            }
                            if ((Arr[k].GracePeriod) < 0) {
                                Arr[k].GracePeriod = 0;
                                Arr[k].calculatedGracePeriod = 0;
                            }

                        }
                        return Arr;
                    }

                    let TaskSubmitApiResponse: any;
                    // if (!self.taskSubmitted) {

                    TaskSubmitApiResponse = await InspectionSubmitService(payload, taskDetails.TaskType);

                    // console.log("TaskSubmitApiResponse::" + JSON.stringify(TaskSubmitApiResponse))

                }
            }))

        }
        catch (e) {
            console.log(e);
        }
    }),

    callToGetQuestionariesForHistorysearchRoutinetype: flow(function* (lang: string, taskId: string) {
        self.state = "pending"
        try {
            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, taskId);
            if (checkListData && checkListData['0'] && checkListData['0'].checkList) {
                self.getChecklistResponse = (checkListData['0'].checkList);
                self.noCheckList = '';
                self.checkListArray = (checkListData['0'].checkList);
                self.state = 'getChecklistSuccess'
                self.loadingState = ''
            }
            else {
                let getQuestionarieResponse = yield fetchGetQuestionarieApi(lang, taskId);
                debugger;
                if (getQuestionarieResponse && getQuestionarieResponse.Status == 'Success') {
                    self.noCheckList = '';
                    debugger;
                    for (let index = 0; index < getQuestionarieResponse.InspectionCheckList.Inspection.length; index++) {
                        const element = getQuestionarieResponse.InspectionCheckList.Inspection[index];
                        let checkListArray = Array();
                        let count = 1;
                        let questionaireList = Object();
                        questionaireList.TaskId = element.TaskId;
                        questionaireList.Thermometer = element.Thermometer;
                        questionaireList.Flashlight = element.Flashlight;
                        questionaireList.DataLogger = element.DataLogger;
                        questionaireList.LuxMeter = element.LuxMeter;
                        questionaireList.UVLight = element.UVLight;

                        self.mobileNumber = element.MobileNumber ? element.MobileNumber : ''
                        self.contactName = element.ContactName ? element.ContactName : ''
                        self.emiratesId = element.EmiratesId ? element.EmiratesId : ''
                        self.finalComment = element.Comment ? element.Comment : ''

                        if (element.ListOfFsExpenseItem && element.ListOfFsExpenseItem.Checklist && element.ListOfFsExpenseItem.Checklist.length) {
                            for (let checkListIndex = 0; checkListIndex < element.ListOfFsExpenseItem.Checklist.length; checkListIndex++) {
                                const checklistElement = element.ListOfFsExpenseItem.Checklist[checkListIndex];
                                let checkListObj = Object();
                                checkListObj.Answers = checklistElement.Answers;
                                checkListObj.originalScore = parseInt(checklistElement.Answers);
                                checkListObj.DescriptionArabic = checklistElement.DescriptionArabic ? checklistElement.DescriptionArabic : ""; //.replace(/&amp;/g, '&')
                                checkListObj.GracePeriod = checklistElement.GracePeriod ? checklistElement.GracePeriod : "";
                                checkListObj.QuestionNameArabic = checklistElement.QuestionNameArabic ? checklistElement.QuestionNameArabic : ""; //.replace(/&amp;/g, '&')
                                checkListObj.QuestionNameEnglish = checklistElement.QuestionNameEnglish ? checklistElement.QuestionNameEnglish : ""; //.replace(/&amp;/g, '&')
                                checkListObj.Weightage = checklistElement.Weightage ? checklistElement.Weightage : "";
                                if (isNaN(parseInt(checkListObj.Weightage))) {
                                    checkListObj.Weightage = 1;
                                }
                                if (checkListObj.Weightage.toString().length == 0) {
                                    checkListObj.Weightage = 1;
                                }
                                if (parseInt(checkListObj.Weightage) == 0) {
                                    checkListObj.Weightage = 1;
                                }
                                if (parseInt(checkListObj.Weightage) > 1)
                                    checkListObj.color = '#ffff66';
                                else
                                    checkListObj.color = '#ffffff';
                                checkListObj.NonComplianceEnglish = checklistElement.NonComplianceEnglish ? checklistElement.NonComplianceEnglish : "";
                                checkListObj.NonComplianceArabic = checklistElement.NonComplianceArabic ? checklistElement.NonComplianceArabic : "";
                                checkListObj.GracePeriodDate = checklistElement.GracePeriodDate ? checklistElement.GracePeriodDate : "";
                                //  checkListObj.GracePeriodDate = "11 / 01 / 2015";
                                checkListObj.NA = checklistElement.NA ? checklistElement.NA : "";
                                checkListObj.EFSTFlag = checklistElement.EFSTFlag ? checklistElement.EFSTFlag : false;
                                checkListObj.Action = checklistElement.Action ? checklistElement.Action : "";
                                checkListObj.NI = checklistElement.NI ? checklistElement.NI : "";
                                checkListObj.Comments = checklistElement.Comments ? checklistElement.Comments : "",//.replace(/&amp;/g, '&') : "";
                                    checkListObj.MaxGracePeriod = checklistElement.MaxGracePeriod ? checklistElement.MaxGracePeriod : 30;
                                checkListObj.MinGracePeriod = checklistElement.MinGracePeriod ? checklistElement.MinGracePeriod : 0;
                                checkListObj.DescriptionEnglish = checklistElement.DescriptionEnglish ? checklistElement.DescriptionEnglish : "";//.replace(/&amp;/g, '&')
                                checkListObj.ParameterNumber = checklistElement.ParameterNumber;
                                checkListObj.Regulation = checklistElement.Regulation;
                                checkListObj.image1 = '';
                                checkListObj.image2 = '';
                                checkListObj.parameter = checkListObj.DescriptionEnglish;
                                checkListObj.parameter_type = checkListObj.QuestionNameEnglish;
                                checkListObj.grace = checkListObj.GracePeriod;
                                checkListObj.comment = checkListObj.Comments;

                                if (checkListObj.Answers == null) {
                                    checkListObj.Answers = "";
                                }
                                checkListObj.image1Base64 = '';
                                checkListObj.image2Base64 = '';
                                checkListObj.Score = checklistElement.Score;
                                checkListObj.score = '';
                                checkListObj.giveAnsweredQuestion = ((checkListObj.Answers != "") && (checkListObj.Answers != "4")) ? false : true;
                                checkListObj.FinalScore = checkListObj.Answers;
                                if (isNaN(parseInt(checkListObj.Score)))
                                    checkListObj.Score = checkListObj.Answers * checkListObj.Weightage;
                                if (checkListObj.Answers != null && checkListObj.Answers.length > 0) {
                                    // checkListObj.Score = parseInt(checkListObj.Answers);
                                    checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                }
                                else if (checkListObj.NI == 'Y' || checkListObj.NA == 'Y') {

                                    if (checkListObj.NI == 'Y') {

                                        checkListObj.NI = true;

                                        if (checkListObj.Answers != '' && checkListObj.Answers != 5) {
                                            checkListObj.NI = false;
                                        }
                                        else {
                                            checkListObj.Score = 5;
                                            checkListObj.Answers = 5;
                                            checkListObj.originalScore = 5;
                                            checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                        }
                                    }
                                }
                                if (checkListObj.NA != 'Y') {  //   && checkListObj.NI != 'Y'

                                    checkListObj.NA = false;
                                    if (checkListObj.NI == 'Y') {
                                        checkListObj.NI = true;
                                        checkListObj.wasNIDuringSync = true;

                                        if (checkListObj.Answers != '' && checkListObj.Answers != 5) {
                                            checkListObj.NI = false;
                                        }
                                        else {
                                            checkListObj.Score = 5;
                                            checkListObj.Answers = 5;
                                            checkListObj.originalScore = parseInt(checkListObj.Answers);
                                            checkListObj.FinalScore == parseInt(checkListObj.Answers);
                                        }
                                    }
                                    else if (checkListObj.NI == 'N')
                                        checkListObj.NI = false;
                                    debugger;
                                    if (!(checkListObj.NI == 'N' && checkListObj.Answers == null)) {
                                        if (checkListObj.Answers != null && checkListObj.Answers.toString().length) {
                                            checkListObj.parameterno = count++;
                                            checkListArray.push(checkListObj);
                                        }
                                        else {
                                            continue;
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            self.noCheckList = 'NocheckListAvailable'
                        }
                        questionaireList.questions = checkListArray;
                        console.log("checkListArray::" + JSON.stringify(checkListArray[0]))
                        if (checkListArray.length <= 0) {
                            self.state = 'done';
                            self.noCheckList = 'NocheckListAvailable'
                            ToastAndroid.show('No Checklist Available ', 1000);
                        }

                        else {
                            let covidQuestionFlag = true;
                            for (let index = 0; index < checkListArray.length; index++) {
                                const element = checkListArray[index];
                                if ((element.ParameterNumber == '3(1/3)') || (element.ParameterNumber == '3(2/3)') || (element.ParameterNumber == '4(4)') || (element.ParameterNumber == '6(1/6)')
                                    || (element.ParameterNumber == '6(2/6)') || (element.ParameterNumber == '6(4/6)') || (element.ParameterNumber == '6(5/6)') || (element.ParameterNumber == '6(6/6)') || (element.ParameterNumber == '6(7/6)')
                                    || (element.ParameterNumber == '6(8/6)') || (element.ParameterNumber == '11(3/11)')) {
                                    covidQuestionFlag = false;
                                    break;
                                }
                            }
                            //covid checklist flag  //to add change false to true


                            let checklistSaveArr = Array();
                            checklistSaveArr = [...CovidChecklistArray, ...checkListArray];
                            // checklistSaveArr = [ ...checkListArray];

                            for (let indexChecklist = 0; indexChecklist < checklistSaveArr.length; indexChecklist++) {
                                const element = checklistSaveArr[indexChecklist];
                                element.parameterno = indexChecklist;
                            }
                            self.checkListArray = JSON.stringify(checklistSaveArr);

                            self.getQuestionarieResponse = JSON.stringify(questionaireList);
                            let obj: any = {};
                            obj.checkList = JSON.stringify(checklistSaveArr);
                            obj.taskId = self.taskId;
                            self.noCheckList = '';
                            obj.timeElapsed = '';
                            obj.timeStarted = '';

                            // RealmController.addCheckListInDB(realm, obj, () => {
                            //     ToastAndroid.show('Task added to db successfully', 1000);
                            // });
                            self.state = 'getQuestionarieSuccess';
                        }

                    }

                }
                else {
                    self.noCheckList = 'NocheckListAvailable';
                    ToastAndroid.show(getQuestionarieResponse.message ? getQuestionarieResponse.message : getQuestionarieResponse.ErrorCode ? ("ErrorCode:" + getQuestionarieResponse.ErrorCode + "ErrorMessage:" + getQuestionarieResponse.ErrorMessage) : 'Failed to get checklist', 1000);
                    self.state = 'error'
                }
            }
        }
        catch (e) {
            NavigationService.goBack()
            console.log(e);
        }
    }),

    callToGetAcknowlege: flow(function* (taskId: any) {
        debugger;
        self.acknowledgeState = "pending";
        self.loadingState = 'Acknowledging Task';

        try {
            let payload = {
                "InterfaceID": "ADFCA_CRM_SBL_068",
                "Longitude": "",
                "Latitude": "",
                "DateTime": "",
                "Comments": "",
                "LanguageType": "ENU",
                "InspectorName": "",
                "RequestType": "",
                "Reason": "",
                "TaskStatus": "Acknowledged",
                "TaskId": taskId,
                "InspectorId": "",
                "PreposedDateTime": ""
            }
            let getAcknowldgeResponse = yield fetchAcknowldgeApi(payload);

            if (getAcknowldgeResponse && getAcknowldgeResponse.Status && (getAcknowldgeResponse.Status.toLowerCase() == 'success')) {

                self.noCheckList = '';
                let acknowldged = RealmController.getTaskIsAck(realm, TaskSchema.name, taskId);

                if (acknowldged && acknowldged['0']) {
                    delete acknowldged['0'].isAcknowledge;

                    acknowldged['0'].isAcknowledge = true;
                    acknowldged['0'].TaskStatus = 'Acknowledged';

                    if (self.isMyTaskClick == 'myTask') {
                        if (self.dataArray1 != '') {
                            let temp = JSON.parse(self.dataArray1);
                            let sectionIndex = temp.findIndex((item: any) => item.TaskId == acknowldged['0'].TaskId);
                            acknowldged['0'].TaskStatus = 'Acknowledged';
                            temp[sectionIndex] = acknowldged['0'];
                            self.dataArray1 = (JSON.stringify(temp));
                        }
                    }
                    else if (self.isMyTaskClick == 'case') {
                        let temp = JSON.parse(self.complaintAndFoodPosioningList);
                        let sectionIndex = JSON.parse(self.complaintAndFoodPosioningList).findIndex((item: any) => item.TaskId == acknowldged['0'].TaskId);
                        acknowldged['0'].TaskStatus = 'Acknowledged';
                        temp[sectionIndex] = acknowldged['0'];
                        self.complaintAndFoodPosioningList = (JSON.stringify(temp));
                    }
                    else if (self.isMyTaskClick == 'license') {
                        let temp = JSON.parse(self.NOCList);
                        let sectionIndex = JSON.parse(self.NOCList).findIndex((item: any) => item.TaskId == acknowldged['0'].TaskId);
                        acknowldged['0'].TaskStatus = 'Acknowledged';
                        temp[sectionIndex] = acknowldged['0'];
                        self.NOCList = (JSON.stringify(temp));
                    }
                    else if (self.isMyTaskClick == 'tempPermit') {
                        let temp = JSON.parse(self.eventsList);
                        let sectionIndex = JSON.parse(self.eventsList).findIndex((item: any) => item.TaskId == acknowldged['0'].TaskId);
                        acknowldged['0'].TaskStatus = 'Acknowledged';
                        temp[sectionIndex] = acknowldged['0'];
                        self.eventsList = (JSON.stringify(temp));
                    }
                    else if (self.isMyTaskClick == 'campaign') {
                        let temp = JSON.parse(self.campaignList);
                        let sectionIndex = JSON.parse(self.campaignList).findIndex((item: any) => item.TaskId == acknowldged['0'].TaskId);
                        acknowldged['0'].TaskStatus = 'Acknowledged';
                        temp[sectionIndex] = acknowldged['0'];
                        self.campaignList = (JSON.stringify(temp));
                    }

                    RealmController.addTaskDetails(realm, acknowldged['0'], TaskSchema.name, () => {
                        ToastAndroid.show('Task acknowledged successfully ', 1000);
                        self.acknowledgeState = 'acknowledgeSuccess';
                        self.loadingState = '';
                    });

                }

            }
            else {
                ToastAndroid.show('Task Already Acknowledged', 1000);
                let acknowldged = RealmController.getTaskIsAck(realm, TaskSchema.name, taskId);
                if (acknowldged && acknowldged['0']) {
                    delete acknowldged['0'].isAcknowledge;

                    acknowldged['0'].isAcknowledge = true;
                    acknowldged['0'].TaskStatus = 'Acknowledged';

                    // let objct = RealmController.getTaskIsAck(realm, TaskSchema.name, self.taskId);

                    // let taskDetails = objct['0'] ? objct['0'] : JSON.parse(self.selectedTask)

                    if (self.isMyTaskClick == 'myTask') {
                        if (self.dataArray1 != '') {
                            let temp = JSON.parse(self.dataArray1);
                            let sectionIndex = temp.findIndex((item: any) => item.TaskId == acknowldged['0'].TaskId);
                            acknowldged['0'].TaskStatus = 'InProgress';
                            temp[sectionIndex] = acknowldged['0'];
                            self.dataArray1 = (JSON.stringify(temp));
                        }
                    }
                    else if (self.isMyTaskClick == 'case') {
                        let temp = JSON.parse(self.complaintAndFoodPosioningList);
                        let sectionIndex = JSON.parse(self.complaintAndFoodPosioningList).findIndex((item: any) => item.TaskId == acknowldged['0'].TaskId);
                        acknowldged['0'].TaskStatus = 'InProgress';
                        temp[sectionIndex] = acknowldged['0'];
                        self.complaintAndFoodPosioningList = (JSON.stringify(temp));
                    }
                    else if (self.isMyTaskClick == 'license') {
                        let temp = JSON.parse(self.NOCList);
                        let sectionIndex = JSON.parse(self.NOCList).findIndex((item: any) => item.TaskId == acknowldged['0'].TaskId);
                        acknowldged['0'].TaskStatus = 'InProgress';
                        temp[sectionIndex] = acknowldged['0'];
                        self.NOCList = (JSON.stringify(temp));
                    }
                    else if (self.isMyTaskClick == 'tempPermit') {
                        let temp = JSON.parse(self.eventsList);
                        let sectionIndex = JSON.parse(self.eventsList).findIndex((item: any) => item.TaskId == acknowldged['0'].TaskId);
                        acknowldged['0'].TaskStatus = 'InProgress';
                        temp[sectionIndex] = acknowldged['0'];
                        self.eventsList = (JSON.stringify(temp));
                    }
                    else if (self.isMyTaskClick == 'campaign') {
                        let temp = JSON.parse(self.campaignList);
                        let sectionIndex = JSON.parse(self.campaignList).findIndex((item: any) => item.TaskId == acknowldged['0'].TaskId);
                        acknowldged['0'].TaskStatus = 'InProgress';
                        temp[sectionIndex] = acknowldged['0'];
                        self.campaignList = (JSON.stringify(temp));
                    }
                    // alert(JSON.stringify(acknowldged['0']));
                    // alert(acknowldged['0'])
                    RealmController.addTaskDetails(realm, acknowldged['0'], TaskSchema.name, () => {
                        ToastAndroid.show('Task acknowldged successfully ', 1000);
                        self.loadingState = '';
                        self.acknowledgeState = 'acknowledgeSuccess';
                    });

                }

            }

        }
        catch (e) {
            // //console.log('Exception My Task' + e);
        }
    }),

    callToGetCampaignChecklistApi: flow(function* (campaignType: string, selectedEst: any, index: any, campaignDetails: any, isArabic: boolean) {
        // {
        debugger;
        self.checkListArray = '';
        self.state = "pending";
        self.loadingState = 'Getting Campaign Checklist';
        self.campaignSelectedEstIndex = index.toString();
        try {
            let payload = {

                "config": {
                },
                "global-instance": {
                    "attribute": [
                        {
                            "@id": "inspection_language",
                            "@type": "text",
                            "text-val": isArabic ? "ARA" : "ENU"

                        },
                        {
                            "@id": "service_name",
                            "@type": "text",
                            "text-val": "Campaigns"

                        },
                        {
                            "@id": "campaign_type",
                            "@type": "text",
                            "text-val": campaignType


                        }
                    ]
                }

            }

            debugger;
            let taskId = self.taskId + '_' + selectedEst.Id + '_' + index;
            self.campaignChecklistTaskId = taskId
            console.log("listOfEstArraytaskId: ", JSON.stringify(taskId))
            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, taskId);
            if (checkListData && checkListData['0'] && checkListData['0'].checkList && JSON.parse(checkListData[0].checkList).length) {
                self.getChecklistResponse = (checkListData['0'].checkList);
                self.noCheckList = '';
                self.checkListArray = (checkListData['0'].checkList);
                self.state = 'getChecklistSuccess'
                self.loadingState = ''
                // console.log("checklistDb: ", JSON.stringify(checkListData['0']))

            }
            else {

                let getCampaignChecklistResponse = yield fetchGetCampaignChecklistApi(payload);
                if (getCampaignChecklistResponse && getCampaignChecklistResponse['global-instance']) {
                    self.state = 'getCampaignChecklistSuccess';
                    // self.getCampaignChecklistResponse = JSON.stringify(getCampaignChecklistResponse);
                    let questionaireListfinal = Array();
                    debugger;
                    // console.log("listOfEstArraytaskId: ", JSON.stringify(payload))

                    let result = getCampaignChecklistResponse["global-instance"].entity

                    let campaignArray: any = []
                    for (let i = 0; i < result.length; i++) {

                        if (result[i].instance) {
                            campaignArray = result[i].instance
                        }
                    }

                    for (let index = 0; index < campaignArray.length; index++) {
                        const elementArray = campaignArray[index].attribute;
                        var questionaire = Object();
                        questionaire.parameter_score = Array(5);
                        questionaire.parameter_score_desc = Array(5);
                        questionaire.parameter_non_comp_desc = Array(5);
                        questionaire.regulation = Array();
                        var param = '';

                        for (let elementIndex = 0; elementIndex < elementArray.length; elementIndex++) {
                            // const element = elementArray[elementIndex];
                            a: switch (elementArray[elementIndex]['@id']) {
                                case 'campaign_parameter_reg_1':
                                    questionaire.regulation.push(elementArray[elementIndex]['text-val']);
                                    break;
                                case 'campaign_parameter_type':
                                    questionaire.parameter_type = elementArray[elementIndex]['text-val'];
                                    break;

                                case 'campaign_parameter_grace_minimum':
                                    questionaire.parameter_grace_minimum = parseInt(elementArray[elementIndex]['number-val']);
                                    break;

                                case 'campaign_parameter_score_desc_4':
                                    if (elementArray[elementIndex]['text-val'])
                                        questionaire.parameter_score_desc[4] = elementArray[elementIndex]['text-val'];
                                    questionaire.parameter_score[4] = 4;
                                    break;

                                case 'campaign_parameter_weight_mobility':
                                    questionaire.parameter_weight_mobility = parseInt(elementArray[elementIndex]['number-val']);
                                    break;

                                case 'campaign_parameter_reference':
                                    questionaire.parameter_reference = elementArray[elementIndex]['text-val'];
                                    questionaire.parameter_reference_original = elementArray[elementIndex]['text-val'];
                                    var last2 = questionaire.parameter_reference.slice(-2);
                                    var last1 = questionaire.parameter_reference.slice(-1);
                                    if (isNaN(last2) && !isNaN(last1)) {
                                        var char1 = questionaire.parameter_reference.charAt(questionaire.parameter_reference.length - 1);
                                        questionaire.parameter_reference = questionaire.parameter_reference.replace(char1, "0" + char1);
                                    }
                                    break;

                                case 'campaign_parameter_score_desc_0':
                                    if (elementArray[elementIndex]['text-val'])
                                        questionaire.parameter_score_desc[0] = elementArray[elementIndex]['text-val'];
                                    questionaire.parameter_score[0] = 0;
                                    break;

                                case 'campaign_parameter_grace_maximum':
                                    questionaire.parameter_grace_maximum = parseInt(elementArray[elementIndex]['number-val']);
                                    if ((questionaire.parameter_grace_maximum == 4) || (questionaire.parameter_grace_maximum == '4'))
                                        questionaire.parameter_grace_maximum = 30;
                                    break;

                                case 'campaign_parameter_score_4':
                                    if (elementArray[elementIndex]['number-val'])
                                        questionaire.parameter_score[4] = parseInt(elementArray[elementIndex]['number-val']);
                                    break;

                                case 'campaign_parameter_score_desc_3':
                                    if (elementArray[elementIndex]['text-val'])
                                        questionaire.parameter_score_desc[3] = elementArray[elementIndex]['text-val'];
                                    questionaire.parameter_score[3] = 3;
                                    break;

                                case 'campaign_parameter_score_1':
                                    if (elementArray[elementIndex]['number-val'])
                                        questionaire.parameter_score[1] = parseInt(elementArray[elementIndex]['number-val']);
                                    break;

                                case 'campaign_parameter_score_0':
                                    if (elementArray[elementIndex]['number-val'])
                                        questionaire.parameter_score[0] = parseInt(elementArray[elementIndex]['number-val']);
                                    break;

                                case 'campaign_parameter_score_3':
                                    if (elementArray[elementIndex]['number-val'])
                                        questionaire.parameter_score[3] = parseInt(elementArray[elementIndex]['number-val']);

                                    break;

                                case 'campaign_parameter_score_2':
                                    if (elementArray[elementIndex]['number-val'])
                                        questionaire.parameter_score[2] = parseInt(elementArray[elementIndex]['number-val']);
                                    break;

                                case 'campaign_parameter':
                                    param = elementArray[elementIndex]['text-val'];
                                    if (param)
                                        break a;
                                    break;

                                case 'campaign_parameter_non_comp_desc_0':
                                    if (elementArray[elementIndex]['text-val'].length > 0)
                                        questionaire.parameter_non_comp_desc[0] = elementArray[elementIndex]['text-val'];
                                    // questionaire.parameter_non_comp_desc[0] = 0;
                                    break;

                                case 'campaign_parameter_score_desc_2':
                                    if (elementArray[elementIndex]['text-val'].length > 0)
                                        questionaire.parameter_score_desc[2] = elementArray[elementIndex]['text-val'];
                                    questionaire.parameter_score[2] = 2;
                                    break;

                                case 'campaign_parameter_reg_6':
                                    if (elementArray[elementIndex]['text-val'].length > 0)
                                        questionaire.regulation.push(elementArray[elementIndex]['text-val'].length > 0);
                                    break;

                                case 'campaign_parameter_EFST':
                                    questionaire.parameter_EFST = elementArray[elementIndex]['boolean-val'];
                                    break;

                                case 'campaign_parameter_guidance_rules':
                                    questionaire.parameter_guidance_rules = elementArray[elementIndex]['text-val'];
                                    break;

                                case 'campaign_parameter_non_comp_desc_4':
                                    if (elementArray[elementIndex]['text-val'].length > 0)
                                        questionaire.parameter_non_comp_desc[4] = elementArray[elementIndex]['text-val'];
                                    break;

                                case 'campaign_parameter_weight_mobility':
                                    questionaire.parameter_weight_mobility = elementArray[elementIndex]['ns0:number-val'];
                                    break;

                                case 'campaign_parameter_non_comp_desc_2':
                                    if (elementArray[elementIndex]['text-val'].length > 0)
                                        questionaire.parameter_non_comp_desc[2] = elementArray[elementIndex]['text-val'];
                                    break;

                                case 'campaign_parameter_non_comp_desc_3':
                                    if (elementArray[elementIndex]['text-val'].length > 0)
                                        questionaire.parameter_non_comp_desc[3] = elementArray[elementIndex]['text-val'];
                                    break;

                                case 'campaign_parameter_score_desc_1':
                                    questionaire.parameter_score[1] = 1;
                                    if (elementArray[elementIndex]['text-val'].length > 0)
                                        questionaire.parameter_score_desc[1] = elementArray[elementIndex]['text-val'];
                                    break;

                                case 'campaign_parameter_non_comp_desc_1':
                                    if (elementArray[elementIndex]['text-val'].length > 0)
                                        questionaire.parameter_non_comp_desc[1] = elementArray[elementIndex]['text-val'];
                                    break;

                                case 'campaign_parameter_subtype':
                                    questionaire.parameter_subtype = elementArray[elementIndex]['text-val'];
                                    break;

                                case 'campaign_businessactivityscase parameters':
                                    questionaire.parameter_subtype = elementArray[elementIndex]['text-val'];
                                    break;

                                case 'global_parametersforthecampaigns_rev':
                                    questionaire.parameter_subtype = elementArray[elementIndex]['text-val'];
                                    break;

                            } // end of switch
                            if (param) {
                                questionaire.parameter = param;
                            }
                            //  Questionaires.questions[0].imageURL1

                        } // end of elementIndex

                        questionaire.parameter_score = questionaire.parameter_score.reverse();
                        questionaire.parameter_score_desc = questionaire.parameter_score_desc.reverse();
                        questionaire.parameter_non_comp_desc = questionaire.parameter_non_comp_desc.reverse();

                        questionaire.image1 = '';
                        questionaire.image2 = '';
                        questionaire.image1Base64 = '';
                        questionaire.image2Base64 = '';
                        questionaire.guidance = '';
                        questionaire.role = '';
                        questionaire.comment = '';
                        questionaire.Answers = '';
                        questionaire.grace = '';
                        questionaire.NA = 'N';
                        questionaire.NI = 'N';
                        questionaire.NAValue = false;
                        questionaire.NIValue = false;
                        questionaire.score = '';
                        questionaire.TotalscoreForQuestion = '';
                        questionaire.gracePeriod = '';
                        questionaire.parameterno = index + 1;
                        questionaireListfinal.push(questionaire);

                    }

                    // for (var i = 0; i < questionaireListfinal.length; i++)
                    //     questionaireListfinal[i].parameterno = i + 1;

                    //covid checklist flag
                    if (true) {
                        CovidChecklistArray = getCovidChecklist(isArabic)
                    }

                    if (questionaireListfinal.length == 0) {
                        self.noCheckList = 'NocheckListAvailable';
                        ToastAndroid.show('No Checklist Available ', 1000);
                    } else {
                        self.noCheckList = '';
                    }
                    let checklistSaveArr = Array();
                    let tmpchecklist = Array()
                    checklistSaveArr = [...CovidChecklistArray, ...questionaireListfinal];

                    for (let indexChecklist = 0; indexChecklist < checklistSaveArr.length; indexChecklist++) {
                        const element = checklistSaveArr[indexChecklist];
                        element.parameterno = indexChecklist;
                    }


                    if (checklistSaveArr.length <= 0) {
                        self.state = 'done';
                        self.loadingState = '';
                        self.noCheckList = 'NocheckListAvailable';
                        ToastAndroid.show('No Checklist Available ', 1000);
                    }
                    else {

                        for (let index = 0; index < checklistSaveArr.length; index++) {
                            const element = checklistSaveArr[index];
                            if (element.parameter_type != 'uncertain') {
                                tmpchecklist.push(element)
                            }
                        }

                        self.getQuestionarieResponse = JSON.stringify(tmpchecklist);
                        self.checkListArray = JSON.stringify(tmpchecklist);
                        let obj: any = {};
                        obj.checkList = JSON.stringify(tmpchecklist);
                        obj.taskId = taskId;
                        obj.timeElapsed = '';
                        obj.timeStarted = '';


                        let mappingData = self.campaignMappingData != '' ? JSON.parse(self.campaignMappingData) : []
                        // console.log(index + "mapinglength::" + mappingData.length)
                        if (mappingData && mappingData.length) {
                            mappingData[self.campaignSelectedEstIndex].inspectionForm = tmpchecklist;

                            campaignDetails.mappingData = mappingData;
                        }
                        // console.log('index & campaign Details :: ' + mappingData.length + ".." + JSON.stringify(campaignDetails));
                        self.selectedTask = (JSON.stringify(campaignDetails))
                        RealmController.addTaskDetails(realm, campaignDetails, TaskSchema.name, () => {
                            // ToastAndroid.show(taskId, 1000);
                        });

                        RealmController.addCheckListInDB(realm, obj, () => {
                            // ToastAndroid.show(taskId, 1000);
                        });
                        self.loadingState = '';
                        self.state = 'getCampaignChecklistSuccess';
                    }

                    self.getCampaignChecklistResponse = JSON.stringify(tmpchecklist);
                    // alert(JSON.stringify(getCampaignChecklistResponse));
                }
                else {
                    self.noCheckList = 'NocheckListAvailable';
                    ToastAndroid.show(getCampaignChecklistResponse.message ? getCampaignChecklistResponse.message : getCampaignChecklistResponse.ErrorCode ? ("ErrorCode:" + getCampaignChecklistResponse.ErrorCode + "ErrorMessage:" + getCampaignChecklistResponse.ErrorMessage) : 'Failed to get checklist', 1000);
                    self.state = "error";
                }
            }
        }
        catch (e) {
            self.state = "error";
            console.log('Exception My Task' + e);
        }
    }),

    callToSupervisoryInspectionEstDetails: flow(function* (payload: any) {

        try {
            self.state = "pending";
            self.loadingState = "Fetching Inspections Data";

            let getSupervisoryEstResponse = yield fetchSupervisoryEstDetails(payload);
            let checkListArray = Array();

            // console.log('getSupervisoryEstResponse ::' + JSON.stringify(getSupervisoryEstResponse));
            if (getSupervisoryEstResponse && getSupervisoryEstResponse.Status && (getSupervisoryEstResponse.Status.toLowerCase() == 'success')) {

                let checkListElement = getSupervisoryEstResponse.GetTask && getSupervisoryEstResponse.GetTask.Inspection ? getSupervisoryEstResponse.GetTask.Inspection : Array();
                if (checkListElement.length) {
                    for (let index = 0; index < checkListElement.length; index++) {
                        const element = checkListElement[index];
                        checkListArray.push(element);
                    }
                    self.getSupervisoryEstResponse = JSON.stringify(checkListArray);
                    NavigationService.navigate('SupervisoryMyTask');
                }
                else {
                    ToastAndroid.show("No Tasks available", 1000)
                }
                self.state = "done";
                self.loadingState = "";
            }
            else {
                ToastAndroid.show("No Tasks available", 1000)
                self.state = "done";
                self.loadingState = "";
            }
        }
        catch (error) {
            // ... including try/catch error handling
            self.state = "error"
            self.loadingState = "";
        }
    }),

    callToGetAssessment: flow(function* (lang: string, taskId: string, actualTaskId: string) {
        self.state = "pending";
        self.loadingState = 'Getting Bazar Checklist';
        try {

            console.log('callToGetAssessment taskId' + taskId);
            let checkListData = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, actualTaskId);
            console.log('callToGetAssessment checkListData' + JSON.stringify(checkListData));

            if (checkListData && checkListData['0'] && checkListData['0'].checkList && JSON.parse(checkListData['0'].checkList).length) {
                self.getChecklistResponse = (checkListData['0'].checkList);
                self.noCheckList = '';
                self.checkListArray = (checkListData['0'].checkList);
                self.state = 'getAssessmentSuccess'
                self.loadingState = ''
            }
            else {

                let getAssessmentResponse = yield fetchGetAssessmentAPI(lang, taskId);
                debugger;
                if (getAssessmentResponse && getAssessmentResponse.ListOfAdfcaMobilitySalesAssessment) {
                    self.noCheckList = '';
                    let salesAssessmentArray = Array();
                    let listOfAdfcaMobilitySalesAssessment = getAssessmentResponse.ListOfAdfcaMobilitySalesAssessment;
                    let salesAssessmentTemplate = listOfAdfcaMobilitySalesAssessment.SalesAssessmentTemplate;
                    for (let index = 0; index < salesAssessmentTemplate.length; index++) {
                        const element = salesAssessmentTemplate[index];
                        let salesAssessmentAttribute = element.ListOfSalesAssessmentAttribute.SalesAssessmentAttribute;
                        // console.log('salesAssessmentAttribute' + JSON.stringify(salesAssessmentAttribute)); 
                        for (let indexSalesAssessment = 0; indexSalesAssessment < salesAssessmentAttribute.length; indexSalesAssessment++) {
                            const elementSalesAssessment = salesAssessmentAttribute[indexSalesAssessment];
                            let saleAssessmentObj = Object();
                            saleAssessmentObj.AttributeName = elementSalesAssessment.Name;
                            saleAssessmentObj.Order = elementSalesAssessment.Order;
                            saleAssessmentObj.Comment = "";
                            saleAssessmentObj.Score = "";
                            saleAssessmentObj.Value = "";
                            saleAssessmentObj.Weight = "";
                            // saleAssessmentObj.tableNameList = "";
                            salesAssessmentArray.push(saleAssessmentObj);
                        }
                    }

                    // console.log('salesAssessmentArray ::' + JSON.stringify(salesAssessmentArray));
                    self.checkListArray = JSON.stringify(salesAssessmentArray);
                    self.getChecklistAssessmentResponse = JSON.stringify(salesAssessmentArray);

                    let obj: any = {};
                    obj.checkList = JSON.stringify(salesAssessmentArray);
                    obj.taskId = actualTaskId;
                    obj.timeElapsed = '';
                    obj.timeStarted = '';
                    RealmController.addCheckListInDB(realm, obj, () => {
                        // ToastAndroid.show('Task added to db successfully', 1000);
                    });
                    self.state = 'getAssessmentSuccess';
                    self.loadingState = '';
                    console.log('get assessment Response ::' + JSON.stringify(salesAssessmentArray))

                }
                else {
                    self.noCheckList = 'NocheckListAvailable';
                    ToastAndroid.show(getAssessmentResponse.message ? getAssessmentResponse.message : getAssessmentResponse.ErrorCode ? ("ErrorCode:" + getAssessmentResponse.ErrorCode + "ErrorMessage:" + getAssessmentResponse.ErrorMessage) : 'Failed to get checklist', 1000);
                    self.state = "error";
                }
            }
        }
        catch (e) {
            console.log(e);
        }
    }),

    callToUpdateLocation: flow(function* (payload: any) {
        self.state = "pending";
        self.loadingState = 'Updating Establishment Location';
        try {
            let response = yield updateEstLocation(payload);
            console.log("payload>>" + JSON.stringify(payload));
            console.log("payload>>" + JSON.stringify(response));
            if (response.Status == 'Success') {
                ToastAndroid.show('Location Updated Successfully', 1000);
                self.state = "done";
                self.loadingState = '';
            }
            else {
                self.state = "error";
                self.loadingState = '';
                ToastAndroid.show('Failed To Update Location', 1000);
            }
        }
        catch (e) {
            console.log(e);
            self.state = "error";
            self.loadingState = '';
        }
    }),

    callToReportThisTask: flow(function* (success: string) {
        // self.loadingState = 'Repor';
        // self.state = "pending";
        // var path = DownloadDirectoryPath + '/' + self.taskId + "_ReportTask.json";
        // // 2 payload stringify karayche inspection ani checklist ani get base64 db

        // let taskDetails = RealmController.getTaskIsAck(realm, TaskSchema.name, self.taskId);
        // taskDetails = (taskDetails['0']);

        // let arrayTemp = RealmController.getbase64ListForTaskId(realm, self.taskId)
        // let base64TEmp = (arrayTemp['0']);

        // let checklistTemp = RealmController.getCheckListForTaskId(realm, CheckListSchema.name, self.taskId)
        // let checklist = (checklistTemp['0']);

        // let temp = {
        //     inspectionDetails: taskDetails,
        //     imageBase64: base64TEmp,
        //     checklist: checklist
        // }

        // let submitFlag = false;
        try {
            let loginData = RealmController.getLoginData(realm, LoginSchema.name);
            loginData = loginData[0] ? loginData[0] : {};

            // console.log('submitFlag' + submitFlag)

            // readFile(path, 'base64').then(async (success) => {
            //     // console.log("success"+JSON.stringify(success));
            //     if (success != '') {

            let payloadAttachment = {
                "InterfaceID": "ADFCA_CRM_SBL_039",
                "LanguageType": "ENU",
                "InspectorId": [
                    loginData.username
                ],
                "InspectorName": loginData.username,
                "Checklistattachment": {
                    "Inspection": {
                        "TaskId": self.taskId,
                        "ListOfActionAttachment": {
                            "QuestAttachment": {
                                "FileExt": "json",
                                "FileName": self.taskId + '_ReportTask',
                                "FileSize": "",
                                "FileSrcPath": "",
                                "FileSrcType": "",
                                "Comment": "",
                                "FileBuffer": success
                            }
                        }
                    }
                }
            }
            // var path = DownloadDirectoryPath + '/' + self.taskId + "_reportPayloadtest.txt";

            // writeFile(path, JSON.stringify(payloadAttachment), 'utf8')
            //     .then((success) => {
            //         console.log('FILE WRITTEN!dffdd');



            //     })
            //     .catch((err) => {
            //     });
            let flag1 = true, flag2 = true, errorMessage = '';
            let getQuestionarieAttachmentResponse = yield fetchGetQuestionarieAttachmentApi(payloadAttachment);

            if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                // self.state = 'done';
                // ToastAndroid.show('Task Reported Successfully', 1000);
            }
            else {
                flag1 = false;
                errorMessage = getQuestionarieAttachmentResponse.message ? getQuestionarieAttachmentResponse.message : 'Failed To Upload Attachment,ErrorMessage:' + getQuestionarieAttachmentResponse.ErrorMessage + 'ErrorCode:' + getQuestionarieAttachmentResponse.ErrorCode;
                // self.state = 'done';
                // ToastAndroid.show(getQuestionarieAttachmentResponse.message ? getQuestionarieAttachmentResponse.message : 'Failed To Upload Attachment,ErrorMessage:' + getQuestionarieAttachmentResponse.ErrorMessage + 'ErrorCode:' + getQuestionarieAttachmentResponse.ErrorCode, 1000);
            }
            // var path = DownloadDirectoryPath + '/' + self.taskId + "_Payloadreport1.txt";
            // writeFile(path, JSON.stringify({ payloadAttachment, getQuestionarieAttachmentResponse }), 'utf8')
            //     .then(async (success) => {

            //     })
            //     .catch((err) => {
            //         console.log(err.message);
            //     });

            let attachmentReqRespath = DownloadDirectoryPath+"/smartcontrol/attachments/" + self.taskId + "_AttachmentPayload.txt";

            readFile(attachmentReqRespath, 'base64').then(async (success: any) => {
                let payloadAttachment = {
                    "InterfaceID": "ADFCA_CRM_SBL_039",
                    "LanguageType": "ENU",
                    "InspectorId": [
                        loginData.username
                    ],
                    "InspectorName": loginData.username,
                    "Checklistattachment": {
                        "Inspection": {
                            "TaskId": self.taskId,
                            "ListOfActionAttachment": {
                                "QuestAttachment": {
                                    "FileExt": "json",
                                    "FileName": self.taskId + '_AttachmentReportTask',
                                    "FileSize": "",
                                    "FileSrcPath": "",
                                    "FileSrcType": "",
                                    "Comment": "",
                                    "FileBuffer": success
                                }
                            }
                        }
                    }
                }
                let getQuestionarieAttachmentResponse = await fetchGetQuestionarieAttachmentApi(payloadAttachment);
                // var path = DownloadDirectoryPath + '/' + self.taskId + "_Payloadreport2.txt";
                // writeFile(path, JSON.stringify({ payloadAttachment, getQuestionarieAttachmentResponse }), 'utf8')
                //     .then(async (success) => {

                //     })
                //     .catch((err) => {
                //         console.log(err.message);
                //     });
                if (getQuestionarieAttachmentResponse && getQuestionarieAttachmentResponse.Status == "Success") {
                    // self.state = 'done';
                    // ToastAndroid.show('Task Reported Successfully', 1000);
                }
                else {
                    flag2 = false;
                    errorMessage = getQuestionarieAttachmentResponse.message ? getQuestionarieAttachmentResponse.message : 'Failed To Upload Attachment,ErrorMessage:' + getQuestionarieAttachmentResponse.ErrorMessage + 'ErrorCode:' + getQuestionarieAttachmentResponse.ErrorCode;
                    // self.state = 'done';
                    //     ToastAndroid.show(getQuestionarieAttachmentResponse.message ? getQuestionarieAttachmentResponse.message : 'Failed To Upload Attachment,ErrorMessage:' + getQuestionarieAttachmentResponse.ErrorMessage + 'ErrorCode:' + getQuestionarieAttachmentResponse.ErrorCode, 1000);
                }
                // console.log("getQuestionarieAttachmentResponse>>>" + JSON.stringify(getQuestionarieAttachmentResponse) + "," + "payloadBuffer>>" + payloadAttachment.Checklistattachment.Inspection.ListOfActionAttachment.QuestAttachment.FileBuffer[1])
            })

            if (flag1 && flag2) {
                self.state = 'done';
                ToastAndroid.show('Task Reported Successfully', 1000);
            }
            else {
                self.state = 'done';
                ToastAndroid.show(errorMessage, 1000);
            }
            // }
            // })
            // .catch((err) => {
            //     // self.state = 'done';
            //     submitFlag = true;
            //     console.log('111' + err);
            // });

        }
        catch (e) {
            self.state = 'done';
            console.log('exception :: ' + e);
        }
    }),

})).views(self => ({
    getDashboardClisk() {
        return self.myTaskResponse
    },
    getSelectedTask() {
        return self.selectedTask
    },
    getCheckListArray() {
        return self.checkListArray
    },
    getState() {
        return self.state
    },
    getBusinessActivityRes() {
        return self.getBusinessActivityResponse
    },
    getCampaignList() {
        return self.campaignList
    },
    getEstListArray() {
        return self.estListArray
    },
    getIsCompletedOfflineList() {
        return self.isCompletedOfflineList
    },
    getIsSuccess() {
        return self.isSuccess
    },
    getCampaignTaskId() {
        return self.campaignTaskId
    },
}));

export default MyTaskStore;