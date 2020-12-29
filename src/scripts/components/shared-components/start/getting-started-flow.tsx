import * as React from 'react';
// import * as _ from 'lodash';
import { AppConfig, FlowElementType, areEqualWithoutFunctions } from '@infobip/moments-components';

// import { Localization, I18n } from 'ib-i18n';
// import { track } from 'ib-client-util';

import * as predefinedAudienceIcon from '../../../../../assets/img/start-options/icon-predefined-audience.svg';
import * as triggerIcon from '../../../../../assets/img/start-options/icon-trigger.svg';
import * as flowApiIcon from '../../../../../assets/img/start-options/icon-flow-api.svg';
import * as changeInPeopleProfileIcon from '../../../../../assets/img/start-options/icon-change-in-people-profile.svg';
import * as peopleRealTimeEventIcon from '../../../../../assets/img/start-options/icon-people-real-time-event.svg';
import * as inboundMessageIcon from '../../../../../assets/img/icon-inbound-message.svg';
import * as inboundCallIcon from '../../../../../assets/img/start-options/icon-inbound-call.svg';
import * as dateOrTimeIcon from '../../../../../assets/img/icon-evaluate-event.svg';
// import { accountRoutesPresent } from '../../utils/account-routes.utils';
// import { insertIf } from '../../utils/app.utils';

import { GettingStartedOptions, START_TRIGGER_OPTION, StartOption, StartOptionTrigger } from './types';
import { GettingStartedOption } from './getting-started-option';

// const __: Localization = _.partial(I18n.__, 'Flow.GettingStarted');
const __ = (s: string) => s;

interface Props {
    config: AppConfig;
    startFlow: (type: FlowElementType) => void;
    onBackToTemplates?: () => void;
}

interface State {
    selectedOption: StartOption | StartOptionTrigger;
}

interface GettingStartedProps {
    option: StartOption | StartOptionTrigger;
}

export const triggerOption: StartOptionTrigger = {
    type: START_TRIGGER_OPTION,
    icon: triggerIcon,
    title: __('Trigger'),
    description: __('An action or event will continuously add your Audience into the flow.'),
};

export const gettingStartedOptions: GettingStartedOptions = {
    predefinedAudience: {
        type: FlowElementType.START_RESOLVE_ONETIME_AUDIENCE,
        icon: predefinedAudienceIcon,
        title: __('Predefined audience'),
        description: __('Use segments and tags to define a one-time Audience for this flow.'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: One Time Audience',
        link: 'https://www.infobip.com/docs/flow/moments-features-flow#flow-entry-points',
    },
    flowApi: {
        type: FlowElementType.START_FLOW_WEBHOOK,
        icon: flowApiIcon,
        title: __('Flow API'),
        description: __('Use 3rd party integrations to continuously add your Audience into the flow.'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: Flow API',
        link: 'https://www.infobip.com/docs/flow/moments-features-flow#flow-entry-points',
    },
    changeInPeopleProfile: {
        type: FlowElementType.START_EVALUATE_PEOPLE_EVENT,
        icon: changeInPeopleProfileIcon,
        title: __('Change in people profile'),
        description: __('A change in specific profile attribute(s) will trigger your audience into the flow.'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: Wait for Change in People Profile',
        link: 'https://www.infobip.com/docs/flow/moments-features-flow#triggers',
    },
    peopleRealTimeEvent: {
        type: FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT,
        icon: peopleRealTimeEventIcon,
        title: __('People real-time event'),
        description: __('Users who perform a specific event will be triggered into the flow.'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: Wait for an Event',
        link: 'https://www.infobip.com/docs/flow/moments-features-flow#triggers',
    },
    inboundMessage: {
        type: FlowElementType.START_EVALUATE_INBOUND_MESSAGE,
        icon: inboundMessageIcon,
        title: __('Inbound message'),
        description: __('Users who send a specific message will be triggered into the flow.'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: Inbound Message',
        link: 'https://www.infobip.com/docs/flow/moments-features-flow#triggers',
    },
    inboundCall: {
        type: FlowElementType.START_IVR_INBOUND,
        icon: inboundCallIcon,
        title: __('Inbound call'),
        description: __('Users who call and select a specific option will be triggered into the flow.'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: Inbound call',
        link: 'https://www.infobip.com/docs/flow/moments-features-flow#triggers',
    },
    dateTimeAttribute: {
        type: FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE,
        icon: dateOrTimeIcon,
        title: __('Date or Time'),
        description: __('Define the date(s) and/or time that will trigger your audience into the flow.'),
        link: 'https://www.infobip.com/docs/flow/moments-features-flow#triggers',
    },
};

export class GettingStartedFlow extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedOption: triggerOption,
        };
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return !areEqualWithoutFunctions(this.state, nextState);
    }

    render() {
        const allStartOptions: (StartOption | StartOptionTrigger)[] = [
            gettingStartedOptions.predefinedAudience,
            triggerOption,
            // ...insertIf(
            //     this.props.config.enableWebhook || !this.props.config.account.isResellerChain,
            //     gettingStartedOptions.flowApi,
            // ),
        ];

        const triggerOptions: StartOption[] = [
            gettingStartedOptions.changeInPeopleProfile,
            // ...insertIf(this.props.config.enablePeopleEvents, gettingStartedOptions.peopleRealTimeEvent),
            // ...insertIf(accountRoutesPresent(this.props.config), gettingStartedOptions.inboundMessage),
            // ...insertIf(this.props.config.enableDateTimeElements, gettingStartedOptions.dateTimeAttribute),
            // ...insertIf(this.props.config.hasVoipIn, gettingStartedOptions.inboundCall),
        ];

        const isTriggerSelectedOption = [...triggerOptions, triggerOption].some(
            option => option === this.state.selectedOption,
        );

        return (
            <div className="tf-getting-started getting-started-flow">
                <div className="container">
                    <div className="content">
                        {this.props.config.canSeeTemplates && this.props.onBackToTemplates && (
                            <div className="flow-back-option" onClick={this.props.onBackToTemplates}>
                                <i className="fas fa-caret-left" />
                                {__('BACK')}
                            </div>
                        )}
                        <div className="flow-title">{__('How will your audience enter this flow?')}</div>
                        <div className="flow-description">
                            {__(
                                'Please define the entry point for your audience by selecting one of the options below.',
                            )}
                        </div>

                        <div className="options-container row">
                            {allStartOptions.map(option => this.renderStartOption({ option }))}
                        </div>
                    </div>

                    {isTriggerSelectedOption && (
                        <div className="content content--trigger">
                            <div className="flow-title">{__('Choose the Trigger')}</div>
                            <div className="flow-description">
                                {__(
                                    'Choose the action or event that will continuously add your Audience into this flow.',
                                )}
                            </div>

                            <div className="options-container row">
                                {triggerOptions.map(option => this.renderStartOption({ option }))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    private renderStartOption = ({ option }: GettingStartedProps) => {
        return (
            <div key={option.type}>
                <GettingStartedOption
                    option={option}
                    selected={option.type === this.state.selectedOption.type}
                    onSelect={this.selectOption}
                />
            </div>
        );
    };

    private startFlow = (selectedOption: StartOption) => {
        if (selectedOption && selectedOption !== triggerOption) {
            if (selectedOption.aptrinsicMessage) {
                // track(selectedOption.aptrinsicMessage);
            }

            this.props.startFlow(selectedOption.type);
        }
    };

    private selectOption = (option: StartOption) => {
        this.setState({ selectedOption: option });
        this.startFlow(option);
    };
}
