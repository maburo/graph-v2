// import * as React from 'react';
// import * as _ from 'lodash';
// import classNames from 'classnames';
// import {
//     AppConfig,
//     areEqualWithoutFunctions,
//     CommonData,
//     ConditionType,
//     FlowElement,
//     FlowElementMetric,
//     FlowElementType,
//     Input,
//     RequestType,
// } from '@infobip/moments-components';

// import { I18n, Localization } from 'ib-i18n';
// import { track } from 'ib-client-util';

// import clearIcon from '../../../../assets/img/clear.svg';
// import { hasSender } from '../../../utils/account-routes.utils';
// import { DiagramReactTooltip } from '../../../utils/diagram-react-tooltip';
// import { LIST_NON_EDIT_FLOW_ELEMENTS } from '../../../constants/constants';
// import { IvrValidator } from '../../../validation/flow/ivr-validator';

// import { ElementDefinition, ElementGroup, getAllFlowElements, getElementGroupTitle, hasActiveService } from './utils';

// const __: Localization = _.partial(I18n.__, 'Diagram');

// const allTypes = _.map(getAllFlowElements(), 'type');

// const ivrTypes = [
//     FlowElementType.DIAL_IVR_ACTION,
//     FlowElementType.COLLECT_IVR_ACTION,
//     FlowElementType.RECORD_IVR_ACTION,
//     FlowElementType.PLAY_IVR_ACTION,
//     FlowElementType.IVR_HANG_UP,
// ];

// const startIvrAndEvaluateTypes = [
//     FlowElementType.START_CALL_IVR_ACTION,
//     FlowElementType.EVALUATE_INBOUND_MESSAGE,
//     FlowElementType.EVALUATE_EVENT,
//     FlowElementType.PAUSE,
//     FlowElementType.EVALUATE_BEHAVIOUR_EVENT,
//     FlowElementType.EVALUATE_ATTRIBUTE_EVENT,
//     FlowElementType.EVALUATE_DATE_TIME_ATTRIBUTE,
// ];

// const disabledTypesForEvaluateDateTime = [
//     ..._.without(ivrTypes, FlowElementType.PLAY_IVR_ACTION),
//     FlowElementType.EVALUATE_EVENT,
//     FlowElementType.EVALUATE_INBOUND_MESSAGE,
// ];

// const disabledElementTypes = {
//     [FlowElementType.START_RESOLVE_ONETIME_AUDIENCE]: ivrTypes,
//     [FlowElementType.START_EVALUATE_INBOUND_MESSAGE]: ivrTypes,
//     [FlowElementType.START_EVALUATE_PEOPLE_EVENT]: ivrTypes,
//     [FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT]: ivrTypes,
//     [FlowElementType.START_FLOW_WEBHOOK]: ivrTypes,
//     [FlowElementType.START_IVR_INBOUND]: startIvrAndEvaluateTypes,
//     [FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE]: disabledTypesForEvaluateDateTime,
//     [FlowElementType.EVALUATE_INBOUND_MESSAGE]: ivrTypes,
//     [FlowElementType.EVALUATE_EVENT]: ivrTypes,
//     [FlowElementType.EVALUATE_BEHAVIOUR_EVENT]: ivrTypes,
//     [FlowElementType.EVALUATE_ATTRIBUTE_EVENT]: ivrTypes,
//     [FlowElementType.EVALUATE_DATE_TIME_ATTRIBUTE]: disabledTypesForEvaluateDateTime,
//     [FlowElementType.DIAL_IVR_ACTION]: ivrTypes,
//     [FlowElementType.PAUSE]: startIvrAndEvaluateTypes,
//     [FlowElementType.COLLECT_IVR_ACTION]: startIvrAndEvaluateTypes,
//     [FlowElementType.RECORD_IVR_ACTION]: startIvrAndEvaluateTypes,
//     [FlowElementType.PLAY_IVR_ACTION]: startIvrAndEvaluateTypes,
//     [FlowElementType.START_CALL_IVR_ACTION]: startIvrAndEvaluateTypes,
//     [FlowElementType.IVR_HANG_UP]: ivrTypes,
//     [ConditionType.IvrHangUp]: ivrTypes,
//     [ConditionType.IvrMachineAnswered]: _.without(
//         allTypes,
//         FlowElementType.IVR_HANG_UP,
//         FlowElementType.PLAY_IVR_ACTION,
//     ),
// };

// const LIST_PEOPLE_EVENTS_ELEMENTS = [
//     FlowElementType.EVALUATE_PARTICIPANT_DATA,
//     FlowElementType.EVALUATE_BEHAVIOUR_EVENT,
//     FlowElementType.EVALUATE_ATTRIBUTE_EVENT,
// ];

// interface Props {
//     id: number;
//     metrics?: FlowElementMetric;
//     accountRoutesPresent: boolean;
//     deleteElement: (id: number) => void;
//     changeType: (type: FlowElementType, requestType?: RequestType) => void;
//     config: AppConfig;
//     commonData: CommonData;
//     zoomLevel: number;
//     createdFromType?: FlowElementType | ConditionType;
//     isEditingFlow?: boolean;
//     ivrChains?: FlowElement[][];
// }

// interface State {
//     search: string;
//     elements: ElementDefinition[];
// }

// export class CreateElementMenu extends React.Component<Props, State> {
//     constructor(props: Props) {
//         super(props);

//         this.state = {
//             search: '',
//             elements: this.getElements(props),
//         };
//     }

//     shouldComponentUpdate(nextProps: Props, nextState: State) {
//         return (
//             !areEqualWithoutFunctions(this.props, nextProps, ['config', 'commonData']) ||
//             !areEqualWithoutFunctions(this.state, nextState)
//         );
//     }

//     render() {
//         return (
//             <div id="flow-create-element-menu" className="tf-flow-create-element-menu flow-create-element-menu">
//                 <div className="flow-create-element-menu-header">
//                     <div className="flow-create-element-menu-header-title">{__('Select element')}</div>
//                     <button onClick={this.closeMenu} className="flow-create-element-menu-header-button">
//                         <img src={clearIcon} alt="" />
//                     </button>
//                 </div>

//                 <div className="flow-create-element-menu-search">
//                     <div className="flow-create-element-menu-search-input" onMouseDown={this.preventMouseDown}>
//                         <i className="tf-icon-search icon-search search-text-input-icon" />
//                         <Input
//                             type="search"
//                             className="search-text-input"
//                             value={this.state.search}
//                             placeholder={__('Search options')}
//                             onValueChange={this.filterItems}
//                         />
//                     </div>
//                     {_.map(ElementGroup, this.renderItems)}
//                 </div>
//             </div>
//         );
//     }

//     private getElements = (props: Props): ElementDefinition[] => {
//         let elements = this.filterVoiceElements(props);

//         if (!props.config.enablePeopleEvents) {
//             elements = elements.filter(({ type }) => !LIST_PEOPLE_EVENTS_ELEMENTS.includes(type));
//         }

//         if (props.isEditingFlow) {
//             elements = elements.filter(({ type }) => !LIST_NON_EDIT_FLOW_ELEMENTS.includes(type));
//         }

//         return elements;
//     };

//     private filterVoiceElements = (props: Props): ElementDefinition[] => {
//         if (!props.config.hasVoipIn && !props.config.hasVoipOut) {
//             return _.filter(
//                 getAllFlowElements(),
//                 el => el.group !== ElementGroup.IVR && _.get(el, 'requestType') !== RequestType.SERVICE_VOIP_OUTBOUND,
//             );
//         }

//         if (!props.config.hasVoipOut) {
//             return _.filter(
//                 getAllFlowElements(),
//                 el =>
//                     el.type !== FlowElementType.START_CALL_IVR_ACTION &&
//                     _.get(el, 'requestType') !== RequestType.SERVICE_VOIP_OUTBOUND,
//             );
//         }

//         return _.filter(getAllFlowElements(), el => _.get(el, 'requestType') !== RequestType.SERVICE_VOIP_OUTBOUND);
//     };

//     private renderItems = (group: ElementGroup, value: string) => {
//         const elements = this.getAndApplyPermissionsToGroupElements(group);

//         if (_.isEmpty(elements)) {
//             return null;
//         }

//         return (
//             <div key={value} className="flow-create-element-menu-group">
//                 <div className="flow-create-element-menu-group-title">
//                     {getElementGroupTitle(group)}
//                     <div
//                         className={classNames(
//                             'flow-create-element-menu-group-line',
//                             `flow-create-element-menu-group-line--${group.toLowerCase()}`,
//                         )}
//                     />
//                 </div>

//                 {_.map(elements, (item: ElementDefinition) => {
//                     const tooltipId = `flow-create-element-menu-${_.join([item.type, item.requestType], '-')}`;

//                     return (
//                         <div
//                             key={item.title}
//                             className={classNames('flow-create-element-menu-item', {
//                                 'flow-create-element-menu-item--disabled': item.disabled,
//                             })}
//                             data-menu-element-type={item.requestType || item.type}
//                             onMouseUp={this.selectItem(item)}
//                             data-tip=""
//                             data-for={tooltipId}
//                             data-offset="{'left': -35}"
//                         >
//                             <img className="flow-create-element-menu-item-icon" src={item.icon} alt="" />
//                             <div className="flow-create-element-menu-item-title">{item.title}</div>

//                             <DiagramReactTooltip
//                                 id={tooltipId}
//                                 place="right"
//                                 className="ib-flow-tooltip flow-create-element-menu-tooltip"
//                                 zoomLevel={this.props.zoomLevel}
//                             >
//                                 {(item.disabled ? item.tooltipWhenDisabled : item.tooltip) || ''}
//                             </DiagramReactTooltip>
//                         </div>
//                     );
//                 })}
//             </div>
//         );
//     };

//     private closeMenu = () => {
//         this.props.deleteElement(this.props.id);
//     };

//     preventMouseDown(event: React.MouseEvent<HTMLElement>) {
//         event.stopPropagation();
//     }

//     private filterItems = (value: string) => {
//         this.setState({
//             search: value,
//             elements: _.filter(
//                 this.getElements(this.props),
//                 element =>
//                     getElementGroupTitle(element.group).toLowerCase().includes(value.toLowerCase()) ||
//                     element.title.toLowerCase().includes(value.toLowerCase()),
//             ),
//         });
//     };

//     private selectItem = (item: ElementDefinition) => {
//         if (item.disabled) {
//             return;
//         }

//         return (event: React.MouseEvent<HTMLElement>) => {
//             event.stopPropagation();
//             track(`Communicate | Create Flow: ${item.aptrinsicMessage}`);
//             this.props.changeType(item.type, item.requestType);
//         };
//     };

//     private getAndApplyPermissionsToGroupElements = (group: ElementGroup) => {
//         const filteredItems = _.filter(this.state.elements, (item: ElementDefinition) => {
//             if (item.type === FlowElementType.EVALUATE_INBOUND_MESSAGE && !this.props.accountRoutesPresent) {
//                 return false;
//             }

//             if (item.type === FlowElementType.SEND_ACTION) {
//                 if (!hasActiveService(this.props.config.activeServices, item.requestTypeId)) {
//                     return false;
//                 }

//                 if (
//                     item.requestType === RequestType.APPLICATION_TYPE_WHATSAPP &&
//                     !hasSender(this.props.commonData.senders, 'WHATSAPP')
//                 ) {
//                     return false;
//                 }
//             }

//             if (item.shouldHide && item.shouldHide(this.props.config)) {
//                 return false;
//             }

//             return item.group === group;
//         });

//         const disabledTypes = this.props.createdFromType ? disabledElementTypes[this.props.createdFromType] : [];
//         return _.map(filteredItems, item => {
//             if (
//                 _.includes(disabledTypes, item.type) ||
//                 (this.shouldBeCheckedByIvrValidator(item) && !this.isValidByIvrValidator(item)) ||
//                 this.isSendVoiceActionInsideIvrScenario(item, this.props.createdFromType)
//             ) {
//                 return {
//                     ...item,
//                     disabled: true,
//                 };
//             }
//             return item;
//         });
//     };

//     private isValidByIvrValidator = (item: ElementDefinition) => {
//         if (!this.props.ivrChains) {
//             return true;
//         }

//         // If we are not inside IVR, we can create only start call and split audience
//         if (this.props.ivrChains.length === 0) {
//             return [FlowElementType.START_CALL_IVR_ACTION, FlowElementType.PERFORM_EXPERIMENT_ACTION].includes(
//                 item.type,
//             );
//         }

//         return this.props.ivrChains.every(chain => {
//             const chainClone = _.cloneDeep(chain);
//             const newElement = chainClone.find(e => e.type === FlowElementType.NEW_ELEMENT);
//             if (newElement) {
//                 newElement.type = item.type;
//                 return (
//                     new IvrValidator(chainClone).validateIvrsInFlow({
//                         config: this.props.config,
//                         commonData: this.props.commonData,
//                         readOnly: true,
//                     }).size === 0
//                 );
//             } else {
//                 return true;
//             }
//         });
//     };

//     private shouldBeCheckedByIvrValidator = (item: ElementDefinition) => {
//         return item.group === ElementGroup.IVR || item.type === FlowElementType.PERFORM_EXPERIMENT_ACTION;
//     };

//     private isSendVoiceActionInsideIvrScenario = (
//         item: ElementDefinition,
//         createdFromType?: FlowElementType | ConditionType,
//     ) => {
//         return (
//             item.requestType === RequestType.SERVICE_VOIP_OUTBOUND &&
//             _.includes(
//                 [
//                     FlowElementType.START_IVR_INBOUND,
//                     FlowElementType.START_CALL_IVR_ACTION,
//                     FlowElementType.COLLECT_IVR_ACTION,
//                     FlowElementType.RECORD_IVR_ACTION,
//                     FlowElementType.PLAY_IVR_ACTION,
//                     FlowElementType.IVR_HANG_UP,
//                 ],
//                 createdFromType,
//             )
//         );
//     };
// }
