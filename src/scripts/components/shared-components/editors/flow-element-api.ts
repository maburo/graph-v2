// import * as _ from 'lodash';
import {
    FlowCommonConfig,
    FlowData,
    FlowElement,
    FlowElementApi,
    FlowElementType,
    RequestType,
} from '@infobip/moments-components';

// import {
//     CollectVoiceElementApi,
//     DialVoiceElementApi,
//     HangUpVoiceElementApi,
//     PlayVoiceElementApi,
//     RecordVoiceElementApi,
//     StartCallVoiceElementApi,
//     StartInboundCallVoiceElementApi,
// } from 'ib-flow-action-voice';

// import { AddToBlacklistElementApi } from './blacklist/add-to-blacklist-element-api';
// import { CallApiElementApi } from './call-api/components/call-api-element-api';
// import { EvaluateEventApi } from './evaluate-event/evaluate-event-api';
// import { EvaluateInboundMessageApi } from './evaluate-inbound-message/evaluate-inbound-message-api';
// import { EvaluateValueApi } from './evaluate-value/evaluate-value-api';
// import { ExitElementApi } from './exit/exit-element-api';
// import { FailoverElementApi } from './failover/failover-element-api';
// import { PauseElementApi } from './pause/pause-element-api';
// import { RemoveFromBlacklistElementApi } from './blacklist/remove-from-blacklist-element-api';
// import { SendActionApi } from './send-action/send-action-api';
// import { StartConversationApi } from './start-conversation/start-conversation-api';
// import { StartEventApi } from './start-event/start-event-api';
// import { StartEvaluateAttributeEventApi } from './start-evaluate-attribute-event/start-evaluate-attribute-event-api';
// import { StartInboundElementApi } from './start-inbound/start-inbound-element-api';
// import { StartOnetimeApi } from './start-onetime/start-onetime-api';
import { StartWebhookElementApi } from './start-webhook/start-webhook-element-api';
// import { TagsElementApi } from './tags/tags-element-api';
// import { PerformExperimentElementApi } from './perform-experiment/perform-experiment-api';
// import { StartEvaluateBehaviourEventApi } from './start-evaluate-behaviour-event/start-evaluate-behaviour-event-api';
// import { EvaluateBehaviourEventApi } from './evaluate-behaviour-event/evaluate-behaviour-event-api';
// import { EvaluateAttributeEventApi } from './evaluate-attribute-event/evaluate-attribute-event-api';
// import { EvaluateParticipantDataApi } from './evaluate-participant-data/evaluate-participant-data-api';
// import { UpdatePersonsEventApi } from './update-person-profile/update-person-profile-element-api';
// import { StartEvaluateDateTimeAttributeApi } from './start-evaluate-date-time-attribute/start-evaluate-date-time-attribute-api';
// import { EvaluateDateTimeAttributeApi } from './evaluate-date-time-attribute/evaluate-date-time-attribute-api';

// TODO: implement all editors
export function getFlowElementApi(
    commonConfig: FlowCommonConfig,
    element: FlowElement,
    campaign: FlowData,
    requestType?: RequestType,
): FlowElementApi | null {
    const resolvedRequestType = requestType || element.action?.serviceMessagingData?.requestType;

    switch (element.type) {
        // case FlowElementType.ADD_TO_BLACKLIST:
        //     return new AddToBlacklistElementApi();
        // case FlowElementType.REMOVE_FROM_BLACKLIST:
        //     return new RemoveFromBlacklistElementApi();
        // case FlowElementType.START_RESOLVE_ONETIME_AUDIENCE:
        //     return new StartOnetimeApi();
        // case FlowElementType.START_EVALUATE_INBOUND_MESSAGE:
        //     return new StartInboundElementApi();
        // case FlowElementType.START_EVALUATE_PEOPLE_EVENT:
        //     return commonConfig.config.enablePeopleEvents ? new StartEvaluateAttributeEventApi() : new StartEventApi();
        // case FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT:
        //     return new StartEvaluateBehaviourEventApi();
        // case FlowElementType.START_IVR_INBOUND:
            // return new StartInboundCallVoiceElementApi();
        case FlowElementType.START_FLOW_WEBHOOK:
            return new StartWebhookElementApi();
        case FlowElementType.SEND_ACTION:
        //     return new SendActionApi(resolvedRequestType, campaign);
        // case FlowElementType.EVALUATE_VALUE:
        //     return new EvaluateValueApi();
        // case FlowElementType.EVALUATE_PARTICIPANT_DATA:
        //     return new EvaluateParticipantDataApi();
        // case FlowElementType.EVALUATE_ATTRIBUTE_EVENT:
        //     return new EvaluateAttributeEventApi();
        // case FlowElementType.EVALUATE_BEHAVIOUR_EVENT:
        //     return new EvaluateBehaviourEventApi(commonConfig, campaign);
        // case FlowElementType.EVALUATE_EVENT:
        //     return new EvaluateEventApi();
        // case FlowElementType.ADD_TAG:
        // case FlowElementType.REMOVE_TAG:
        //     return new TagsElementApi(commonConfig.config, element);
        // case FlowElementType.START_CONVERSATION:
        //     return new StartConversationApi(commonConfig.config);
        // case FlowElementType.EVALUATE_INBOUND_MESSAGE:
        //     return new EvaluateInboundMessageApi();
        // case FlowElementType.PAUSE:
        //     return new PauseElementApi();
        // case FlowElementType.EXIT:
        //     return new ExitElementApi();
        // case FlowElementType.FAILOVER_ACTION:
        //     return new FailoverElementApi(commonConfig, element, campaign);
        // case FlowElementType.DIAL_IVR_ACTION:
        //     return new DialVoiceElementApi();
        // case FlowElementType.RECORD_IVR_ACTION:
        //     return new RecordVoiceElementApi();
        // case FlowElementType.PLAY_IVR_ACTION:
            // return new PlayVoiceElementApi();
        // case FlowElementType.CALL_URL:
        //     return new CallApiElementApi();
        // case FlowElementType.COLLECT_IVR_ACTION:
        //     return new CollectVoiceElementApi();
        // case FlowElementType.START_CALL_IVR_ACTION:
        //     return new StartCallVoiceElementApi();
        // case FlowElementType.IVR_HANG_UP:
        //     return new HangUpVoiceElementApi();
        // case FlowElementType.PERFORM_EXPERIMENT_ACTION:
        //     return new PerformExperimentElementApi();
        // case FlowElementType.UPDATE_PERSON_ACTION:
        //     return new UpdatePersonsEventApi();
        // case FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE:
        //     return new StartEvaluateDateTimeAttributeApi();
        // case FlowElementType.EVALUATE_DATE_TIME_ATTRIBUTE:
        //     return new EvaluateDateTimeAttributeApi();
        default:
            return null;
    }
}
