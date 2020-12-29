// import * as _ from 'lodash';

// import { I18n, Localization } from 'ib-i18n';

import { FLOW_NAME_MAX_LENGTH } from '../constants';
// import { FlowError, FlowErrorType } from '../../typings';

// const __: Localization = _.partial(I18n.__, 'NotificationMessages');
const __ = (s: string) => s;

export enum NotificationMessages {
    INFO_FLOW_DUPLICATED,
    INFO_FLOW_STOPPED,
    VALIDATION_FLOW_NAME_MISSING,
    VALIDATION_FLOW_NAME_TOO_LONG,
    VALIDATION_START_MISSING,
    VALIDATION_UNIQUE_INBOUND_START_RECIPIENT,
    VALIDATION_UNIQUE_VARIABLE_NAME,
    VALIDATION_INTERNAL_VALIDATION_ERROR,
    VALIDATION_START_GOES_TO_EXIT,
    VALIDATION_NO_ACTION_ELEMENT_IN_FLOW,
    VALIDATION_ELEMENT_NOT_IN_FLOW,
    VALIDATION_EXIT_UNREACHABLE,
    VALIDATION_INVALID_LOOP,
    VALIDATION_START_CONVERSATION_NOT_LEADING_TO_EXIT,
    VALIDATION_START_ELEMENT_CONDITION_NOT_CONNECTED,
    ERROR_LOADING_FLOW,
    ERROR_LAUNCHING_FLOW,
    ERROR_LOADING_STATISTICS,
    ERROR_LOADING_METRICS,
    ERROR_SAVING_FLOW,
    ERROR_STOPPING_FLOW,
    ERROR_DUPLICATING_FLOW,
    VALIDATION_VOICE_MESSAGE_NOT_SUPPORTED,
    ERROR_SAVING_FLOW_TEMPLATE,
    ERROR_CREATE_FLOW_FROM_TEMPLATE,
    SUCCESS_UPDATE_SCHEDULE,
    ERROR_UPDATE_SCHEDULE,
    SUCCESS_UPDATE_GOAL,
    ERROR_UPDATE_GOAL,
    MISSING_FLOW_TAGS,
    MISSING_FLOW_PLACEHOLDERS,
    CREATE_NEW_VERSION_FLOW,
    DATE_TIME_ATTRIBUTE_WITHOUT_TIME_VALUE,
    ELEMENT_HAS_NOT_NEXT_ELEMENT,
    ELEMENT_MUST_HAVE_ELSE_RULE,
    IVR_INVALID_TRANSITION,
}

export enum NotificationType {
    ERROR,
    WARNING,
    INFO,
    SUCCESS,
}

export interface NotificationMessage {
    message: NotificationMessages;
    type: NotificationType;
    payload?: string;
}

const LAUNCHING_FLOW_ERROR_MESSAGE = __('An error occurred while launching flow. ');

// export const getNotificationByFlowError = (error: FlowError): { message: NotificationMessages; payload?: string } => {
//     switch (error.type) {
//         case FlowErrorType.DateTimeAttributeWithoutTimeValue:
//             return {
//                 message: NotificationMessages.DATE_TIME_ATTRIBUTE_WITHOUT_TIME_VALUE,
//                 payload: error.payload?.attribute,
//             };
//         case FlowErrorType.TagsNotFound:
//             return {
//                 message: NotificationMessages.MISSING_FLOW_TAGS,
//                 payload: error.payload?.tags.join(' '),
//             };
//         case FlowErrorType.PlaceholdersNotFound:
//             return {
//                 message: NotificationMessages.MISSING_FLOW_PLACEHOLDERS,
//                 payload: error.payload?.placeholders.join(' '),
//             };
//         case FlowErrorType.ElementHasNotNextElement:
//             return { message: NotificationMessages.ELEMENT_HAS_NOT_NEXT_ELEMENT };
//         case FlowErrorType.ElementMustHaveElseRule:
//             return { message: NotificationMessages.ELEMENT_MUST_HAVE_ELSE_RULE };
//         case FlowErrorType.IVRInvalidTransition:
//             return { message: NotificationMessages.IVR_INVALID_TRANSITION };
//         default:
//             return { message: NotificationMessages.ERROR_LAUNCHING_FLOW };
//     }
// };

export const getNotificationMessage = (message: NotificationMessages, payload?: string): string => {
    switch (message) {
        case NotificationMessages.INFO_FLOW_DUPLICATED:
            return __('The flow is duplicated.');
        case NotificationMessages.CREATE_NEW_VERSION_FLOW:
            return __('The new version of flow is created');
        case NotificationMessages.INFO_FLOW_STOPPED:
            return __('The flow is stopped. If needed, you can duplicate it.');
        case NotificationMessages.VALIDATION_FLOW_NAME_MISSING:
            return __('The Flow must have a name.');
        case NotificationMessages.VALIDATION_FLOW_NAME_TOO_LONG:
            return __(`Flow name must have less than ${FLOW_NAME_MAX_LENGTH + 1} characters.`);
        case NotificationMessages.VALIDATION_START_MISSING:
            return __('Flow must contain a start element.');
        case NotificationMessages.VALIDATION_UNIQUE_INBOUND_START_RECIPIENT:
            return __('Each inbound start element should define a different recipient.');
        case NotificationMessages.VALIDATION_UNIQUE_VARIABLE_NAME:
            return __('Each variable should be defined with a unique name.');
        case NotificationMessages.VALIDATION_INTERNAL_VALIDATION_ERROR:
            return __('Element(s) contain(s) invalid fields.');
        case NotificationMessages.VALIDATION_START_GOES_TO_EXIT:
            return __('Start element cannot lead to exit element.');
        case NotificationMessages.VALIDATION_NO_ACTION_ELEMENT_IN_FLOW:
            return __('Each flow path must have at least one action element.');
        case NotificationMessages.VALIDATION_ELEMENT_NOT_IN_FLOW:
            return __('Connect the element(s) to the Flow or delete it/them.');
        case NotificationMessages.VALIDATION_EXIT_UNREACHABLE:
            return __("Element(s) can't reach any of the exit elements.");
        case NotificationMessages.VALIDATION_INVALID_LOOP:
            return __('Loops require at least one MO or delay/wait condition.');
        case NotificationMessages.VALIDATION_START_CONVERSATION_NOT_LEADING_TO_EXIT:
            return __('Starting a conversation should end the flow.');
        case NotificationMessages.VALIDATION_START_ELEMENT_CONDITION_NOT_CONNECTED:
            return __('Each condition in start element must be connected to at least one flow element.');
        case NotificationMessages.ERROR_LOADING_FLOW:
            return __('An error occurred while loading flow. Refresh the page and try again.');
        case NotificationMessages.ERROR_LAUNCHING_FLOW:
            return __('An error occurred while launching flow. Refresh the page and try launching the flow again.');
        case NotificationMessages.ERROR_LOADING_STATISTICS:
            return __('An error occurred while loading statistics. Refresh the page and try again.');
        case NotificationMessages.ERROR_LOADING_METRICS:
            return __('An error occurred while loading metrics. Refresh the page and try again.');
        case NotificationMessages.ERROR_SAVING_FLOW:
            return __('An error occurred while saving flow. Refresh the page and try again.');
        case NotificationMessages.ERROR_STOPPING_FLOW:
            return __('An error occurred while stopping flow. Refresh the page and try again.');
        case NotificationMessages.ERROR_DUPLICATING_FLOW:
            return __('An error occurred while duplicating flow. Refresh the page and try again.');
        case NotificationMessages.VALIDATION_VOICE_MESSAGE_NOT_SUPPORTED:
            return __(
                'Voice Message element is no longer supported. Please, replace it with the IVR actions. See tutorial.',
            );
        case NotificationMessages.ERROR_SAVING_FLOW_TEMPLATE:
            return __('An error occurred while saving template. Refresh the page and try again.');
        case NotificationMessages.ERROR_CREATE_FLOW_FROM_TEMPLATE:
            return __('An error occurred while creating flow from template. Refresh the page and try again.');
        case NotificationMessages.SUCCESS_UPDATE_SCHEDULE:
            return __('Flow schedule has been successfully updated.');
        case NotificationMessages.ERROR_UPDATE_SCHEDULE:
            return __('An error occurred while updating schedule for flow. Refresh the page and try again.');
        case NotificationMessages.SUCCESS_UPDATE_GOAL:
            return __('Flow goal has been successfully updated.');
        case NotificationMessages.ERROR_UPDATE_GOAL:
            return __('An error occurred while updating goal of the flow. Refresh the page and try again.');
        case NotificationMessages.MISSING_FLOW_TAGS:
            return LAUNCHING_FLOW_ERROR_MESSAGE + __(`Not existing tags used in flow: ${payload}`);
        case NotificationMessages.MISSING_FLOW_PLACEHOLDERS:
            return (
                LAUNCHING_FLOW_ERROR_MESSAGE +
                __(`Not existing placeholders used in flow: {payload}`)
            );
        case NotificationMessages.DATE_TIME_ATTRIBUTE_WITHOUT_TIME_VALUE:
            return (
                LAUNCHING_FLOW_ERROR_MESSAGE +
                __(`Date/Time element has not time value in the attribute {payload}.`)
            );
        case NotificationMessages.ELEMENT_HAS_NOT_NEXT_ELEMENT:
            return LAUNCHING_FLOW_ERROR_MESSAGE + __('Element has not next element.');
        case NotificationMessages.ELEMENT_MUST_HAVE_ELSE_RULE:
            return LAUNCHING_FLOW_ERROR_MESSAGE + __('Element must have else rule.');
        case NotificationMessages.IVR_INVALID_TRANSITION:
            return LAUNCHING_FLOW_ERROR_MESSAGE + __('Invalid IVR transition.');
        default:
            return __('We found some errors. Resolve them before launching your Flow.');
    }
};
