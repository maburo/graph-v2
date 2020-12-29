// import * as _ from 'lodash';
import { FlowElementMetric, FlowElementType, RequestType } from '@infobip/moments-components';

// import { I18n, Localization } from 'ib-i18n';

import usersIconSmall from '../../../../../../assets/img/icon-users-small.svg';
import usersIconSmallWhite from '../../../../../../assets/img/icon-users-small-white.svg';
import personCircleIcon from '../../../../../../assets/img/icon-person-circle.svg';
import personCircleWhiteIcon from '../../../../../../assets/img/icon-person-circle-white.svg';

// const __: Localization = _.partial(I18n.__, 'Metrics');
const __ = (s: string) => s;

export const getMetricsIcon = (
    metricType: keyof FlowElementMetric,
    flowElementType?: FlowElementType | string,
): string | undefined => {
    const isStartType =
        flowElementType &&
        (flowElementType === FlowElementType.START_EVALUATE_INBOUND_MESSAGE ||
            flowElementType === FlowElementType.START_EVALUATE_PEOPLE_EVENT ||
            flowElementType === FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT ||
            flowElementType === FlowElementType.START_RESOLVE_ONETIME_AUDIENCE ||
            flowElementType === FlowElementType.START_FLOW_WEBHOOK ||
            flowElementType === FlowElementType.START_IVR_INBOUND ||
            flowElementType === FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE);

    switch (metricType) {
        case 'count':
            return isStartType ? usersIconSmallWhite : usersIconSmall;
        case 'conversion':
            return isStartType ? personCircleWhiteIcon : personCircleIcon;
        default:
            return undefined;
    }
};

export const getActionMetricsTooltipData = (type: FlowElementType): FlowElementMetric | undefined => {
    switch (type) {
        case FlowElementType.ADD_TAG:
            return {
                tooltipTitle: __('Tag added'),
                tooltipDescription: __('Number of times the tag has been added in total'),
            };
        case FlowElementType.REMOVE_TAG:
            return {
                tooltipTitle: __('Tag removed'),
                tooltipDescription: __('Number of times the tag has been removed in total'),
            };
        case FlowElementType.ADD_TO_BLACKLIST:
            return {
                tooltipTitle: __('Added to Do Not Contact list triggered'),
                tooltipDescription: __('Number of clicks on the "Add to Do Not Contact list" option'),
            };
        case FlowElementType.REMOVE_FROM_BLACKLIST:
            return {
                tooltipTitle: __('Removed from Do Not Contact list triggered'),
                tooltipDescription: __('Number of clicks on the "Remove from Do Not Contact list" option'),
            };
        case FlowElementType.FAILOVER_ACTION:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of users to whom any message from the failover has been sent'),
            };
        case FlowElementType.START_CALL_IVR_ACTION:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of users who were dialed'),
            };
        case FlowElementType.IVR_HANG_UP:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of users who reached Hang up'),
            };

        default:
            return undefined;
    }
};

export const getRulesMetricsTooltipData = (type: FlowElementType): FlowElementMetric | undefined => {
    switch (type) {
        case FlowElementType.EVALUATE_INBOUND_MESSAGE:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of users who sent a message to the set number'),
            };
        case FlowElementType.EVALUATE_EVENT:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of people who triggered the event'),
            };
        case FlowElementType.EVALUATE_PARTICIPANT_DATA:
        case FlowElementType.EVALUATE_VALUE:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of users whose values have been evaluated'),
            };
        case FlowElementType.EVALUATE_ATTRIBUTE_EVENT:
        case FlowElementType.EVALUATE_BEHAVIOUR_EVENT:
        case FlowElementType.EVALUATE_DATE_TIME_ATTRIBUTE:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of users whose values have been evaluated'),
            };
        case FlowElementType.EXIT:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Users that reached the end of the flow at this point'),
            };
        case FlowElementType.DIAL_IVR_ACTION:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of users whose calls were forwarded'),
            };
        case FlowElementType.RECORD_IVR_ACTION:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of users who entered Record'),
            };
        case FlowElementType.PLAY_IVR_ACTION:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of users who entered Play'),
            };
        case FlowElementType.CALL_URL:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of users for whom HTTP(S) request was sent to third party backend'),
            };
        case FlowElementType.COLLECT_IVR_ACTION:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of users who entered Collect'),
            };
        case FlowElementType.PERFORM_EXPERIMENT_ACTION:
            return {
                tooltipTitle: __('Engaged users'),
                tooltipDescription: __('Number of users who entered Experiment'),
            };
        default:
            return undefined;
    }
};

export const getSendMetricsTooltipData = (requestType: RequestType): FlowElementMetric | undefined => {
    let tooltipDescription = '';
    switch (requestType) {
        case RequestType.APPLICATION_TYPE_SMS_MT:
            tooltipDescription = __('Number of users to whom a SMS has been sent');
            break;
        case RequestType.EMAIL:
            tooltipDescription = __('Number of users to whom a EMAIL has been sent');
            break;
        case RequestType.APPLICATION_TYPE_VIBER:
        case RequestType.APPLICATION_TYPE_FACEBOOK:
        case RequestType.APPLICATION_TYPE_NEW_PUSH_NOTIF:
            tooltipDescription = __(`Number of users to which a ${appNameByCommunicationId[requestType]} message has been sent`);
            break;
    }

    return {
        tooltipTitle: __('Engaged users'),
        tooltipDescription,
    };
};

export const getStartMetricsTooltipData = (): FlowElementMetric => {
    return {
        tooltipTitle: __('People engaged'),
        tooltipDescription: __('Number of people that entered the flow through this point'),
    };
};

const appNameByCommunicationId = {
    [RequestType.APPLICATION_TYPE_NEW_PUSH_NOTIF]: 'Push',
    [RequestType.APPLICATION_TYPE_VIBER]: 'Viber',
    [RequestType.APPLICATION_TYPE_FACEBOOK]: 'Facebook',
};
