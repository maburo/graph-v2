import * as React from 'react';
// import * as _ from 'lodash';
import { AppConfig, FlowElementType, areEqualWithoutFunctions } from '@infobip/moments-components';
import classnames from 'classnames';
// import ReactTooltip from 'react-tooltip';

// import { Localization, I18n } from 'ib-i18n';
// import { track } from 'ib-client-util';

import startIcon from '../../../../../../assets/img/start-flow.svg';
import startFlowIcon from '../../../../../../assets/img/start-options/icon-plus.svg';
import onetimeIcon from '../../../../../../assets/img/icon-users.svg';
import inboundMessageIcon from '../../../../../../assets/img/icon-inbound-message.svg';
import evaluateEventIcon from '../../../../../../assets/img/icon-evaluate-event.svg';
import webhookIcon from '../../../../../../assets/img/canvas/icon-webhook-color.svg';
// import { accountRoutesPresent } from '../../../utils/account-routes.utils';
import { StartOption } from '../types';
import { gettingStartedOptions } from '../getting-started-flow';

import { StartCreatorOption } from './start-creator-option';
import { StartCreatorOptionFlow } from './start-creator-option-flow';

// const __: Localization = _.partial(I18n.__, 'GettingStarted');
const __ = (s: string) => s;

interface Props {
    config: AppConfig;
    hasOnetimeAudience: boolean;
    hasInboundIvrAudience: boolean;
    hasWebhookAudience: boolean;
    disabled?: boolean;
    disabledEntryPointsMsgTooltip?: string;
    addStartElement: (type: FlowElementType) => void;
}

interface State {
    opened: boolean;
}

export const getStartOptions = (config: AppConfig): StartOption[] => [
    {
        type: FlowElementType.START_RESOLVE_ONETIME_AUDIENCE,
        icon: onetimeIcon,
        title: __('One-time audience'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: One Time Audience',
    },
    {
        type: FlowElementType.START_EVALUATE_INBOUND_MESSAGE,
        icon: inboundMessageIcon,
        title: __('Inbound message'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: Inbound Message',
    },
    {
        type: FlowElementType.START_EVALUATE_PEOPLE_EVENT, // FlowElementType.START_EVALUATE_ATTRIBUTE_EVENT
        icon: evaluateEventIcon,
        title: config.canSeePeopleEvents ? __('Change in people profile') : __('People events'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: Wait for Change in People Profile',
    },
    {
        type: FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT,
        icon: evaluateEventIcon,
        title: __('Wait for an event'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: Wait for an Event',
    },
    {
        type: FlowElementType.START_IVR_INBOUND,
        icon: inboundMessageIcon,
        title: __('Inbound call'),
    },
    {
        type: FlowElementType.START_FLOW_WEBHOOK,
        icon: webhookIcon,
        title: __('Flow API'),
    },
    {
        type: FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE,
        icon: evaluateEventIcon,
        title: __('Date or Time'),
    },
];

export const triggerOptions: StartOption[] = [
    gettingStartedOptions.changeInPeopleProfile,
    gettingStartedOptions.peopleRealTimeEvent,
    gettingStartedOptions.inboundMessage,
    gettingStartedOptions.inboundCall,
    gettingStartedOptions.dateTimeAttribute,
];

export class StartCreator extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            opened: false,
        };
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return (
            !areEqualWithoutFunctions(this.props, nextProps, ['config']) ||
            !areEqualWithoutFunctions(this.state, nextState)
        );
    }

    render() {
        const isEnablePeopleEvents = this.props.config.enablePeopleEvents;
        const { disabled, disabledEntryPointsMsgTooltip } = this.props;

        const entryPoint = isEnablePeopleEvents
            ? {
                  title: 'Add New Entry point',
                  icon: startFlowIcon,
              }
            : {
                  title: 'Add New Trigger Entry Point',
                  icon: startIcon,
              };

        return (
            <div className="disable-user-selection">
                {/* {this.state.opened && !disabled && (
                    <Dismissible onDismiss={this.onDismiss} closeOnElementRemoved={true}>
                        <div className="flow-start-creator-panel">
                            {isEnablePeopleEvents
                                ? this.renderStartOptionsFlow()
                                : getStartOptions(this.props.config).map(this.renderStartOption)}
                        </div>
                    </Dismissible>
                )} */}

                <div
                    data-tip
                    data-for="flow-start-creator-tooltip"
                    className={classnames('flow-start-creator', { 'flow-start-creator__disabled': disabled })}
                    onClick={this.openDropdown}
                >
                    <img src={entryPoint.icon} alt="" />
                    <div>
                        <p className="title">{__(`${entryPoint.title}`)}</p>
                        <p className="description">{__('Click here to add a new entry point')}</p>
                    </div>
                </div>
                {/* {disabled && disabledEntryPointsMsgTooltip && (
                    <ReactTooltip
                        place="bottom"
                        id="flow-start-creator-tooltip"
                        effect="solid"
                        offset={{ top: -10 }}
                        className="ib-flow-tooltip ib-flow-tooltip__start-creator"
                    >
                        {disabledEntryPointsMsgTooltip}
                    </ReactTooltip>
                )} */}
            </div>
        );
    }

    private onDismiss = () => {
        this.setState({ opened: false });
    };

    private openDropdown = () => {
        if (this.props.disabled) return;
        this.setState(prevState => ({ opened: !prevState.opened }));
    };

    private renderStartOptionsFlow = () => {
        const commonProps = {
            onSelect: this.selectStartElement,
            shouldRenderOption: this.shouldRenderStartOption,
        };

        return (
            <div>
                <StartCreatorOptionFlow
                    {...commonProps}
                    className="flow-start-creator-panel__start-option--top"
                    option={gettingStartedOptions.predefinedAudience}
                />
                <div className="flow-start-creator-panel__start-option flow-start-creator-panel__start-option--trigger">
                    <span className="trigger">{__('Triggers')}</span>
                </div>
                <StartCreatorOptionFlow {...commonProps} option={gettingStartedOptions.changeInPeopleProfile} />
                <StartCreatorOptionFlow {...commonProps} option={gettingStartedOptions.peopleRealTimeEvent} />
                <StartCreatorOptionFlow {...commonProps} option={gettingStartedOptions.inboundMessage} />
                <StartCreatorOptionFlow {...commonProps} option={gettingStartedOptions.inboundCall} />
                <StartCreatorOptionFlow {...commonProps} option={gettingStartedOptions.dateTimeAttribute} />
                <StartCreatorOptionFlow
                    {...commonProps}
                    className="flow-start-creator-panel__start-option--bottom"
                    option={gettingStartedOptions.flowApi}
                />
            </div>
        );
    };

    private renderStartOption = (option: StartOption) => {
        if (!this.shouldRenderStartOption(option)) {
            return null;
        }

        return <StartCreatorOption key={option.type} option={option} onSelect={this.selectStartElement} />;
    };

    private shouldRenderStartOption = (option: StartOption): boolean => {
        if (this.props.hasOnetimeAudience && option.type === FlowElementType.START_RESOLVE_ONETIME_AUDIENCE) {
            return false;
        }

        // if (
        //     !accountRoutesPresent(this.props.config) &&
        //     option.type === FlowElementType.START_EVALUATE_INBOUND_MESSAGE
        // ) {
        //     return false;
        // }

        if (!this.props.config.hasVoipIn && option.type === FlowElementType.START_IVR_INBOUND) {
            return false;
        }

        if (this.props.hasInboundIvrAudience && option.type === FlowElementType.START_IVR_INBOUND) {
            return false;
        }

        if (
            !this.props.config.enableWebhook &&
            this.props.config.account.isResellerChain &&
            option.type === FlowElementType.START_FLOW_WEBHOOK
        ) {
            return false;
        }

        if (this.props.hasWebhookAudience && option.type === FlowElementType.START_FLOW_WEBHOOK) {
            return false;
        }

        if (!this.props.config.canSeePeopleEvents && option.type === FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT) {
            return false;
        }

        if (
            !this.props.config.enableDateTimeElements &&
            option.type === FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE
        ) {
            return false;
        }

        return true;
    };

    private selectStartElement = (option: StartOption) => {
        this.setState({ opened: false }, () => {
            if (option.aptrinsicMessage) {
                // track(option.aptrinsicMessage);
            }

            this.props.addStartElement(option.type);
        });
    };
}
