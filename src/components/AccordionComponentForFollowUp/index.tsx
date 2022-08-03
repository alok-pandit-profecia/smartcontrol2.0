import React, { useState, useContext, useEffect } from 'react'
import {
    FlatList,
    View,
    Image,
    TouchableOpacity,
    Text,
    Dimensions,
    ScrollView,
    SectionList
} from 'react-native';

// get hight and width
const HEIGHT = Dimensions.get("window").height;
const WIDTH = Dimensions.get("window").width;

// imports
import Accordion from 'react-native-collapsible/Accordion';
import TextComponent from '../TextComponent';
import Strings from '../../config/strings';
import CheckListComponentForFollowUp from './../CheckListComponentForFollowUp';
import { fontFamily, fontColor } from '../../config/config';

interface Props {
    onDashClick: (item: any, index: number, activeSections: number, indx: number) => void,
    onNAClick?: (item: any, index: number, activeSections: number, indx: number) => void,
    onNIClick: (item: any, index: number, activeSections: number, indx: number) => void,
    onScoreImageClick: (item: any, index: number, activeSections: number, indx: number) => void,
    onGraceImageClick: (item: any, index: number, activeSections: number, indx: number) => void,
    onCommentImageClick: (item: any, index: number, activeSections: number, indx: number) => void,
    onAttachmentImageClick: (item: any, index: number, activeSections: number, indx: number) => void,
    onRegulationClick: (item: any, index: number, activeSections: number, indx: number) => void,
    onInfoImageClick: (item: any, index: number, activeSections: number, indx: number) => void,
    isArabic: boolean,
    data: any,
    currentGrace: boolean,
    currentScore: boolean
}

const AccordionComponentForFollowUp = (props: Props) => {
    //  //console.log("Props data1",JSON.stringify(props.data));
    const [activeSections, setSection] = useState([0]);
    const [activeSectionsSub, setSectionSub] = useState([0]);
    const [title1, setTitle] = useState('');

    const renderAccordionHeader = (content: any, index: any, isActive: any) => {
        let title = '';
        switch (content.title.toString()) {

            case '0':
                title = "Violations";
                break;

            case '1':
                title = "Final Warning";
                break;

            case '2':
                title = "First Warning";
                break;

            case '3':
                title = "Notice";
                break;

            case '4':
                title = "Satisfactory";
                break;

            case '5':
                title = "NI";
                break;

            default: title = content.title;

        }

        return (

            <View style={{ minHeight: HEIGHT * 0.04, height: 'auto', backgroundColor: '#abcfbf', flexDirection: props.isArabic ? 'row-reverse' : 'row', width: '90%', padding: 5, alignSelf: 'center', marginBottom: 5, borderRadius: 22 }}>
                <View style={{ flex: 8.4, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <TextComponent
                        textStyle={{ color: '#5c666f', textAlign: 'left', fontSize: 12, fontFamily: fontFamily.tittleFontFamily, fontWeight: 'normal' }}
                        label={title}
                    />
                </View>
                <View style={{ flex: 0.1 }} />
                <View style={{ flex: 1.5, justifyContent: 'center', alignItems: 'center', height: 40, }}>
                    {
                        isActive ?
                            <Image
                                source={require("./../../assets/images/startInspection/Grey/Arrow.png")}
                                style={{ height: 22, width: 22, alignItems: 'flex-end', transform: props.isArabic ? [{ rotate: '90deg' }] : [{ rotate: '90deg' }] }}
                                resizeMode={'contain'}
                            />
                            :
                            <Image
                                source={require("./../../assets/images/startInspection/Grey/Arrow.png")}
                                style={{ height: 22, width: 22, alignItems: 'flex-end', transform: props.isArabic ? [{ rotate: '-180deg' }] : [{ rotate: '0deg' }] }}
                                resizeMode={'contain'}
                            />
                    }
                </View>
            </View>
        );
    };

    const renderAccordionContentSub = (content: any, index: number, isActive: boolean) => {
        if (isActive) {
            return (
                <View style={{ height: 'auto', width: '100%', padding: '2%' }}>
                    {
                        content.data.map((item: any, indx: number) => {
                            if (item.Answers == 4) {
                                item.isScore = true;
                                item.score = 4;
                                item.GracePeriod = 0;
                                item.calculatedGracePeriod = 0;
                            }

                            if (item.Answers == 5) {
                                item.isScore = true;
                                item.scoreDisable = true;
                                item.NI = true;
                                item.score = '-';

                            }
                            //  //console.log("Current data only",item);

                            return (
                                <CheckListComponentForFollowUp
                                    currentScore={props.currentScore}
                                    currentGrace={props.currentGrace}
                                    onDashClick={(item, index) => props.onDashClick(item, indx, 0, activeSectionsSub)}
                                    onNAClick={(item, index) => props.onNAClick(item, indx, 0, activeSectionsSub)}
                                    onNIClick={(item, index) => props.onNIClick(item, indx, 0, activeSectionsSub)}
                                    onScoreImageClick={(item, index) => { props.onScoreImageClick(item, indx, 0, activeSectionsSub) }}
                                    onGraceImageClick={(item, index) => props.onGraceImageClick(item, indx, 0, activeSectionsSub)}
                                    onCommentImageClick={(item, index) => props.onCommentImageClick(item, indx, 0, activeSectionsSub)}
                                    onInfoImageClick={(item, index) => props.onInfoImageClick(item, indx, 0, activeSectionsSub)}
                                    onAttachmentImageClick={(item, index) => props.onAttachmentImageClick(item, indx, 0, activeSectionsSub)}
                                    onRegulationClick={(item, index) => props.onRegulationClick(item, indx, 0, activeSectionsSub)}
                                    item={item}
                                    isArabic={props.isArabic}
                                    index={index}
                                />
                            );
                        })
                    }
                </View>
            );
        }
    }

    const renderAccordionContent = (content: any, index: number, isActive: boolean) => {
        if (isActive) {
            return (
                <View style={{ height: 'auto', width: '100%', padding: '2%' }}>
                    {
                        // content.title == 'COVID-19' ?
                        //     <View style={{ width: '95%', alignSelf: 'center' }}>
                        //         <Accordion
                        //             activeSections={activeSectionsSub}
                        //             sections={content.data}
                        //             touchableComponent={TouchableOpacity}
                        //             expandMultiple={false}
                        //             renderHeader={renderAccordionHeader}
                        //             renderContent={renderAccordionContentSub}
                        //             duration={0}
                        //             onChange={updateSectionsSub}
                        //         />
                        //         {/* <AccordionComponentForFollowUp
                        //             currentScore={props.currentScore}
                        //             currentGrace={props.currentGrace}
                        //             onDashClick={(item, index) => props.onDashClick(item, index, activeSections)}
                        //             onNAClick={(item, index) => props.onNAClick(item, index, activeSections)}
                        //             onNIClick={(item, index) => props.onNIClick(item, index, activeSections)}
                        //             onScoreImageClick={(item, index) => props.onScoreImageClick(item, index, activeSections)}
                        //             onGraceImageClick={(item, index) => props.onGraceImageClick(item, index, activeSections)}
                        //             onCommentImageClick={(item, index) => props.onCommentImageClick(item, index, activeSections)}
                        //             onInfoImageClick={(item, index) => props.onInfoImageClick(item, index, activeSections)}
                        //             onAttachmentImageClick={(item, index) => props.onAttachmentImageClick(item, index, activeSections)}
                        //             onRegulationClick={(item, index) => props.onRegulationClick(item, index, activeSections)}
                        //             isArabic={props.isArabic}
                        //             data={content.data}
                        //         /> */}
                        //     </View>
                        //     :
                            content.data.map((item: any, index: number) => {
                                if (item.Answers == 4) {
                                    item.isScore = true;
                                    item.score = 4;
                                    item.GracePeriod = 0;
                                    item.calculatedGracePeriod = 0;
                                }

                                if (item.Answers == 5) {
                                    item.isScore = true;
                                    item.scoreDisable = true;
                                    item.NI = true;
                                    item.score = '-';

                                }
                                //  //console.log("Current data only",item);

                                return (
                                    <CheckListComponentForFollowUp
                                        currentScore={props.currentScore}
                                        currentGrace={props.currentGrace}
                                        onDashClick={(item, index) => props.onDashClick(item, index, activeSections)}
                                        onNAClick={(item, index) => props.onNAClick(item, index, activeSections)}
                                        onNIClick={(item, index) => props.onNIClick(item, index, activeSections)}
                                        onScoreImageClick={(item, index) => props.onScoreImageClick(item, index, activeSections)}
                                        onGraceImageClick={(item, index) => props.onGraceImageClick(item, index, activeSections)}
                                        onCommentImageClick={(item, index) => props.onCommentImageClick(item, index, activeSections)}
                                        onInfoImageClick={(item, index) => props.onInfoImageClick(item, index, activeSections)}
                                        onAttachmentImageClick={(item, index) => props.onAttachmentImageClick(item, index, activeSections)}
                                        onRegulationClick={(item, index) => props.onRegulationClick(item, index, activeSections)}
                                        item={item}
                                        isArabic={props.isArabic}
                                        index={index}
                                    />
                                );
                            })
                    }
                </View>
            );
        }
    }

    const updateSections = (activeSections: any) => {
        setSection(activeSections.includes(undefined) ? [] : activeSections);
    };
    const updateSectionsSub = (activeSections: any) => {
        setSectionSub(activeSections.includes(undefined) ? [] : activeSections);
    };
    return (
        <View style={{ width: '100%' }}>
            <Accordion
                activeSections={activeSections}
                sections={props.data}
                touchableComponent={TouchableOpacity}
                expandMultiple={false}
                renderHeader={renderAccordionHeader}
                renderContent={renderAccordionContent}
                duration={0}
                onChange={updateSections}
            />
        </View>
    );

}

export default AccordionComponentForFollowUp