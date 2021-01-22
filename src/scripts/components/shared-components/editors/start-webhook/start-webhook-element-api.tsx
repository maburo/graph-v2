// import * as React from 'react';
// // import * as _ from 'lodash';
// import {
//     FlowActionType,
//     FlowElement,
//     FlowElementApi,
//     FlowElementComponentProps,
//     ValidationResult,
//     // valid,
// } from '@infobip/moments-components';

// // import { Localization, I18n } from 'ib-i18n';
// // import { track } from 'ib-client-util';

// import icon from '../../../../../../assets/img/canvas/icon-webhook-color.svg';

// // import { StartWebhookEditor } from './start-webhook-component';

// // const __: Localization = _.partial(I18n.__, 'Editor.Webhook');
// const __ = (s: string) => s;

// export class StartWebhookElementApi implements FlowElementApi {
//     initialize() {
//         return {
//             action: {
//                 type: FlowActionType.FLOW_WEBHOOK_ACTION,
//             },
//         };
//     }

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     // validate(element: FlowElement): ValidationResult {
//     //     return valid();
//     // }

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     getPreview(element: FlowElement) {
//         return {
//             icon: icon,
//             title: __('Flow API'),
//             content: __('Add people to the flow'),
//         };
//     }

//     // getEditorComponent(props: FlowElementComponentProps) {
//     //     return (
//     //         <StartWebhookEditor
//     //             flowWebhookApiUrl={props.config.flowWebhookApiUrl}
//     //             communicationId={props.communicationId}
//     //             firstRender={props.firstRender}
//     //             readOnly={props.readOnly}
//     //         />
//     //     );
//     // }

//     // onLaunch(element: FlowElement) {
//     //     track('Communicate | Create Flow: Launch Flow - Audience: Flow API');
//     //     return Promise.resolve(element);
//     // }
// }
