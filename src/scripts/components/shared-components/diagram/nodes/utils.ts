// import * as _ from 'lodash';
import {
    AppConfig,
    FlowElementType,
    RequestType,
    RequestTypeId,
    UrlShorteningParams,
} from '@infobip/moments-components';

// import { Localization, I18n } from 'ib-i18n';

// import { isStandaloneViberEnabled } from '../../../utils/account-routes.utils';
import smsIcon from '../../../../../../assets/img/icon-sms-color.svg';
import viberIcon from '../../../../../../assets/img/icon-viber-color.svg';
import facebookIcon from '../../../../../../assets/img/icon-facebook-color.svg';
import emailIcon from '../../../../../../assets/img/icon-email-color.svg';
import voiceIcon from '../../../../../../assets/img/icon-voice-color.svg';
import pushIcon from '../../../../../../assets/img/icon-push-color.svg';
import rcsIcon from '../../../../../../assets/img/icon-rcs-color.svg';
import whatsAppIcon from '../../../../../../assets/img/icon-whatsapp-color.svg';
import addToBlacklistIcon from '../../../../../../assets/img/icon-addblacklist-color.svg';
import removeFromBlacklistIcon from '../../../../../../assets/img/icon-remove-from-blacklist-color.svg';
import pauseIcon from '../../../../../../assets/img/canvas/icon-pause-action-color.svg';
import updatePersonIcon from '../../../../../../assets/img/canvas/icon-user-edit-m-color.svg';
import removeTagIcon from '../../../../../../assets/img/icon-removeTag.svg';
import addTagIcon from '../../../../../../assets/img/icon-addTag.svg';
import ccaasIcon from '../../../../../../assets/img/icon-ccaas.svg';
import evaluateValue from '../../../../../../assets/img/icon-evaluateValue.svg';
import inboundMessageIcon from '../../../../../../assets/img/icon-inbound-message.svg';
import eventIcon from '../../../../../../assets/img/icon-event.svg';
import failoverIcon from '../../../../../../assets/img/icon-failover-color.svg';
import splitAudienceIcon from '../../../../../../assets/img/icon-split-audience-color.svg';
import startCallIcon from '../../../../../../assets/img/ivr/start-call.svg';
import collectIcon from '../../../../../../assets/img/ivr/icon-collect.svg';
import dialIcon from '../../../../../../assets/img/ivr/icon-dial.svg';
import playIcon from '../../../../../../assets/img/ivr/play.svg';
import recordIcon from '../../../../../../assets/img/ivr/record.svg';
import hangUpIcon from '../../../../../../assets/img/ivr/icon-hang-up.svg';
import callUrlIcon from '../../../../../../assets/img/ivr/icon-call-url.svg';


export const DEFAULT_DESCRIPTION_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';

// const __: Localization = _.partial(I18n.__, 'Diagram');
const __ = (s: string) => s;

const _urlRegexp = /https?:\/\/[^\s]+/gi;

export enum ElementGroup {
    CHANNEL = 'Channel',
    IVR = 'IVR',
    FUNCTION = 'Function',
}

export const getElementGroupTitle = (group: ElementGroup) => {
    switch (group) {
        case ElementGroup.CHANNEL:
            return __('Channels');
        case ElementGroup.IVR:
            return __('IVR');
        case ElementGroup.FUNCTION:
            return __('Functions');
    }
};

export interface ElementDefinition {
    title: string;
    type: FlowElementType;
    requestType?: RequestType;
    requestTypeId?: RequestTypeId;
    icon: string;
    group: ElementGroup;
    tooltip?: string;
    disabled?: boolean;
    tooltipWhenDisabled?: string;
    aptrinsicMessage: string;
    shouldHide?: (config: AppConfig) => boolean;
}

export interface ActiveServices {
    id: number;
    code: string;
}

export const getDefaultFlowElements: () => ElementDefinition[] = 
// _.memoize(
    () => [
    {
        title: __('Send SMS message'),
        type: FlowElementType.SEND_ACTION,
        requestType: RequestType.APPLICATION_TYPE_SMS_MT,
        requestTypeId: RequestTypeId.SMS,
        icon: smsIcon,
        group: ElementGroup.CHANNEL,
        aptrinsicMessage: 'Select Channel - Channel: SMS',
    },
    {
        title: __('Send Viber message'),
        type: FlowElementType.SEND_ACTION,
        requestType: RequestType.APPLICATION_TYPE_VIBER,
        requestTypeId: RequestTypeId.VIBER,
        icon: viberIcon,
        group: ElementGroup.CHANNEL,
        aptrinsicMessage: 'Select Channel - Channel: Viber',
        // shouldHide: (config: AppConfig) =>
        //     !isStandaloneViberEnabled(config.disabledViberStandaloneChids, Number(config.account.id)),
    },
    {
        title: __('Send Facebook message'),
        type: FlowElementType.SEND_ACTION,
        requestType: RequestType.APPLICATION_TYPE_FACEBOOK,
        requestTypeId: RequestTypeId.FACEBOOK,
        icon: facebookIcon,
        group: ElementGroup.CHANNEL,
        aptrinsicMessage: 'Select Channel - Channel: Facebook',
    },
    {
        title: __('Send Email'),
        type: FlowElementType.SEND_ACTION,
        requestType: RequestType.EMAIL,
        requestTypeId: RequestTypeId.EMAIL,
        icon: emailIcon,
        group: ElementGroup.CHANNEL,
        aptrinsicMessage: 'Select Channel - Channel: Email',
    },
    {
        title: __('Send Voice message'),
        type: FlowElementType.SEND_ACTION,
        requestType: RequestType.SERVICE_VOIP_OUTBOUND,
        requestTypeId: RequestTypeId.VOICE_OUTBOUND,
        icon: voiceIcon,
        group: ElementGroup.CHANNEL,
        aptrinsicMessage: 'Select Channel - Channel: Voice messages',
    },
    {
        title: __('Send Push notification'),
        type: FlowElementType.SEND_ACTION,
        requestType: RequestType.APPLICATION_TYPE_NEW_PUSH_NOTIF,
        requestTypeId: RequestTypeId.PUSH,
        icon: pushIcon,
        group: ElementGroup.CHANNEL,
        aptrinsicMessage: 'Select Channel - Channel: Push',
    },
    {
        title: __('Send RCS message'),
        type: FlowElementType.SEND_ACTION,
        requestType: RequestType.APPLICATION_TYPE_RCS,
        requestTypeId: RequestTypeId.RCS,
        icon: rcsIcon,
        group: ElementGroup.CHANNEL,
        aptrinsicMessage: 'Select Channel - Channel: RCS',
    },
    {
        title: __('Send WhatsApp message'),
        type: FlowElementType.SEND_ACTION,
        requestType: RequestType.APPLICATION_TYPE_WHATSAPP,
        requestTypeId: RequestTypeId.WHATSAPP,
        icon: whatsAppIcon,
        group: ElementGroup.CHANNEL,
        aptrinsicMessage: 'Select Channel - Channel: WhatsApp',
    },
    {
        title: __('Failover'),
        type: FlowElementType.FAILOVER_ACTION,
        icon: failoverIcon,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Failover',
    },
    {
        title: __('Evaluate inbound message'),
        type: FlowElementType.EVALUATE_INBOUND_MESSAGE,
        icon: inboundMessageIcon,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Evaluate Inbound Message',
    },
    {
        title: __('Evaluate data'),
        type: FlowElementType.EVALUATE_VALUE,
        icon: evaluateValue,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Evaluate Data',
        shouldHide: (config: AppConfig) => config.enablePeopleEvents,
    },
    {
        title: __('Evaluate event'),
        type: FlowElementType.EVALUATE_EVENT,
        icon: eventIcon,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Evaluate Event',
        shouldHide: (config: AppConfig) => !hasActiveService(config.activeServices, RequestTypeId.EMAIL),
    },
    {
        title: __('Segment audience'),
        type: FlowElementType.EVALUATE_PARTICIPANT_DATA,
        icon: evaluateValue,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Segment audience',
        shouldHide: (config: AppConfig) => !config.canSeePeopleEvents,
    },
    {
        title: __('Wait for an event'),
        type: FlowElementType.EVALUATE_BEHAVIOUR_EVENT,
        icon: evaluateValue,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Wait for an event',
        shouldHide: (config: AppConfig) => !config.canSeePeopleEvents,
    },
    {
        title: __('Wait for change in people profile'),
        type: FlowElementType.EVALUATE_ATTRIBUTE_EVENT,
        icon: evaluateValue,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Wait for change in people profile',
        shouldHide: (config: AppConfig) => !config.canSeePeopleEvents,
    },
    {
        title: __('Wait for a date'),
        type: FlowElementType.EVALUATE_DATE_TIME_ATTRIBUTE,
        icon: evaluateValue,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: '',
        shouldHide: (config: AppConfig) => !config.enableDateTimeElements,
    },
    {
        title: __('Pause'),
        type: FlowElementType.PAUSE,
        icon: pauseIcon,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Pause Flow',
    },
    {
        title: __('Update person profile'),
        type: FlowElementType.UPDATE_PERSON_ACTION,
        icon: updatePersonIcon,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Update Person',
        shouldHide: (config: AppConfig) => !config.enableUpdatePerson,
    },
    {
        title: __('Add Tag'),
        type: FlowElementType.ADD_TAG,
        icon: addTagIcon,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Tag Person',
        shouldHide: (config: AppConfig) => !config.canManagePeopleTags,
    },
    {
        title: __('Remove Tag'),
        type: FlowElementType.REMOVE_TAG,
        icon: removeTagIcon,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Untag Person',
        shouldHide: (config: AppConfig) => !config.canManagePeopleTags,
    },
    {
        title: __('Start a conversation'),
        type: FlowElementType.START_CONVERSATION,
        icon: ccaasIcon,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Conversations Element',
        shouldHide: (config: AppConfig) => !config.canManageConversations,
    },
    {
        title: __('Add to Do Not Contact list'),
        type: FlowElementType.ADD_TO_BLACKLIST,
        icon: addToBlacklistIcon,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Add To Blacklist',
        shouldHide: (config: AppConfig) => !config.canManagePeopleBlacklist,
    },
    {
        title: __('Remove from Do Not Contact list'),
        type: FlowElementType.REMOVE_FROM_BLACKLIST,
        icon: removeFromBlacklistIcon,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Remove From Blacklist',
        shouldHide: (config: AppConfig) => !config.canManagePeopleBlacklist,
    },
    {
        title: __('Split audience'),
        type: FlowElementType.PERFORM_EXPERIMENT_ACTION,
        icon: splitAudienceIcon,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Split Audience',
        shouldHide: (config: AppConfig) => !config.enableAbExperiments,
    },
]
// );

export const getIvrElements: () => ElementDefinition[] = 
// _.memoize(
    () => [
    {
        title: __('Start call'),
        type: FlowElementType.START_CALL_IVR_ACTION,
        icon: startCallIcon,
        group: ElementGroup.IVR,
        aptrinsicMessage: 'Select Element - Element Picker: Start Call',
        tooltip: __('Initiate a call towards the set audience'),
    },
    {
        title: __('Collect'),
        type: FlowElementType.COLLECT_IVR_ACTION,
        icon: collectIcon,
        group: ElementGroup.IVR,
        aptrinsicMessage: 'Select Element - Element Picker: Collect',
        tooltip: __('Collect and store digits entered by user on their phone keypad'),
    },
    {
        title: __('Forward call'),
        type: FlowElementType.DIAL_IVR_ACTION,
        icon: dialIcon,
        group: ElementGroup.IVR,
        aptrinsicMessage: 'Select Element - Element Picker: Forward call',
        tooltip: __('Redirect call to another number'),
    },
    {
        title: __('Play'),
        type: FlowElementType.PLAY_IVR_ACTION,
        icon: playIcon,
        group: ElementGroup.IVR,
        aptrinsicMessage: 'Select Element - Element Picker: Play Audio',
        tooltip: __('Play audio file or text-to-speech message'),
    },
    {
        title: __('Record Voicemail'),
        type: FlowElementType.RECORD_IVR_ACTION,
        icon: recordIcon,
        group: ElementGroup.IVR,
        aptrinsicMessage: 'Select Element - Element Picker: Record Audio',
        tooltip: __('Record user’s voice message'),
    },
    {
        title: __('Call API'),
        type: FlowElementType.CALL_URL,
        icon: callUrlIcon,
        group: ElementGroup.FUNCTION,
        aptrinsicMessage: 'Select Element - Element Picker: Call API',
        tooltip: __('Send and receive data from third parties over HTTP(S) requests'),
    },
    {
        title: __('Hang up'),
        type: FlowElementType.IVR_HANG_UP,
        icon: hangUpIcon,
        group: ElementGroup.IVR,
        aptrinsicMessage: 'Select Element - Element Picker: End Call',
        tooltip: __('End the call, and if needed, continue with the non-IVR action'),
    },
]
// );

export const getAllFlowElements: () => ElementDefinition[] = 
// _.memoize(
    () => [
    ...getDefaultFlowElements(),
    ...getIvrElements(),
]
// );

export function hasActiveService(
    activeServices: ActiveServices[], 
    requestTypeId: number | undefined
): boolean {
    return !!activeServices.find(el => el.id === requestTypeId);
}

export function resolveUrlShortenedText(text: string, urlShorteningParams?: UrlShorteningParams): string {
    if (!urlShorteningParams || !!text) {
        return text;
    }

    const shortUrlBase = urlShorteningParams?.customBaseUrl ?? 'https://eeg.nu/';
    return shortenUrls(text, shortUrlBase);
}

export function shortenUrls(text: string, shortUrlBase: string) {
    return text && text.replace(_urlRegexp, shortUrlBase + 'shortUrl');
}
