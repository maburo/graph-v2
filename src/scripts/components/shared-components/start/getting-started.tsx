import * as React from 'react';
// import * as _ from 'lodash';
import classNames from 'classnames';
import { AppConfig, FlowElementType, areEqualWithoutFunctions } from '@infobip/moments-components';

// import { Localization, I18n } from 'ib-i18n';
// import { track } from 'ib-client-util';

import * as onetimeIcon from '../../../assets/img/icon-users.svg';
import * as inboundMessageIcon from '../../../assets/img/icon-inbound-message.svg';
import * as evaluateEventIcon from '../../../assets/img/icon-evaluate-event.svg';
import * as webhookIcon from '../../../assets/img/canvas/icon-webhook-color.svg';
// import { accountRoutesPresent } from '../../utils/account-routes.utils';
// import { insertIf } from '../../utils/app.utils';

import { GettingStartedOptions, StartOption } from './types';
import { GettingStartedOption } from './getting-started-option';
import { GettingStartedFlow } from './getting-started-flow';

// const __: Localization = _.partial(I18n.__, 'Flow.GettingStarted');
const __ = (s: string) => s;

interface Props {
    config: AppConfig;
    startFlow: (type: FlowElementType) => void;
    onBackToTemplates?: () => void;
}

interface State {
    selectedOption: StartOption;
}

const gettingStartedOptions: GettingStartedOptions = {
    oneTimeAudience: {
        type: FlowElementType.START_RESOLVE_ONETIME_AUDIENCE,
        icon: onetimeIcon,
        title: __('One-time audience'),
        description: __('Existing users in the target section, grouped or tagged will enter the flow'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: One Time Audience',
    },
    inboundMessage: {
        type: FlowElementType.START_EVALUATE_INBOUND_MESSAGE,
        icon: inboundMessageIcon,
        title: __('Inbound message'),
        description: __('Users who send you a message with a specific keyword will enter the flow'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: Inbound Message',
    },
    peopleEvents: {
        type: FlowElementType.START_EVALUATE_PEOPLE_EVENT, // FlowElementType.START_EVALUATE_ATTRIBUTE_EVENT
        icon: evaluateEventIcon,
        title: __('People events'),
        description: __('Users whose specific attributes change after the flow starts will be added to the flow'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: People Events',
    },
    changeInPeopleProfile: {
        type: FlowElementType.START_EVALUATE_PEOPLE_EVENT,
        icon: evaluateEventIcon,
        title: __('Change in people profile'),
        description: __('Users whose specific attributes change after the flow starts will be added to the flow'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: People Events',
    },
    ivr: {
        type: FlowElementType.START_IVR_INBOUND,
        icon: inboundMessageIcon,
        title: __('Inbound call'),
        description: __('Users who call you will enter the flow'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: Inbound call',
    },
    peopleRealTimeEvent: {
        type: FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT,
        icon: evaluateEventIcon,
        title: __('People real-time event'),
        description: __('Users who perform a specific event will be triggered into the flow'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: People Events',
    },
    webhook: {
        type: FlowElementType.START_FLOW_WEBHOOK,
        icon: webhookIcon,
        title: __('Flow API'),
        description: __('Use Flow API to add people to the flow'),
        aptrinsicMessage: 'Communicate | Create Flow: Audience Selected - Audience: Flow API',
    },
    dateTimeAttribute: {
        type: FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE,
        icon: evaluateEventIcon,
        title: __('Date or Time'),
        description: __('Define the date(s) and/or time that will trigger your audience into the flow.'),
    },
};

export class GettingStarted extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedOption: gettingStartedOptions.oneTimeAudience,
        };
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return !areEqualWithoutFunctions(this.state, nextState);
    }

    render() {
        const {
            config: { enablePeopleEvents },
            startFlow,
            config,
            onBackToTemplates,
        } = this.props;

        return enablePeopleEvents ? (
            <GettingStartedFlow startFlow={startFlow} config={config} onBackToTemplates={onBackToTemplates} />
        ) : (
            this.renderGettingStarted()
        );
    }

    private renderGettingStarted = () => {
        const classes = classNames('btn flow-button', {
            disabled: !this.state.selectedOption,
        });

        const allStartOptions: StartOption[] = [
            // gettingStartedOptions.oneTimeAudience,
            // ...insertIf(accountRoutesPresent(this.props.config), gettingStartedOptions.inboundMessage),
            // this.props.config.enablePeopleEvents
            //     ? gettingStartedOptions.changeInPeopleProfile
            //     : gettingStartedOptions.peopleEvents,
            // ...insertIf(this.props.config.hasVoipIn, gettingStartedOptions.ivr), // Inbound call
            // ...insertIf(
            //     this.props.config.enableWebhook || !this.props.config.account.isResellerChain,
            //     gettingStartedOptions.webhook,
            // ), // Flow API
            // ...insertIf(this.props.config.enablePeopleEvents, gettingStartedOptions.peopleRealTimeEvent), // People real-time event
            // ...insertIf(this.props.config.enableDateTimeElements, gettingStartedOptions.dateTimeAttribute),
        ];

        return (
            <div className="tf-getting-started getting-started">
                <div className="container">
                    <div className="content">
                        {this.props.config.canSeeTemplates && this.props.onBackToTemplates && (
                            <div className="back-option" onClick={this.props.onBackToTemplates}>
                                <i className="fas fa-caret-left" />
                                {__('Back to templates')}
                            </div>
                        )}
                        <div className="title">{__('Who should get your messages?')}</div>
                        <div className="description">{__('Choose how your audience will be added to the flow.')}</div>
                        <div className="options-container row">
                            {allStartOptions?.map(option => this.renderStartOption(option, allStartOptions.length))}
                        </div>
                        <div className={classes} id="start-building-button" onClick={this.startFlow}>
                            {__('START BUILDING')}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    private renderStartOption = (option: StartOption, size: number) => {
        const classes = classNames({
            'col-md-6': size > 3,
            'col-md-12': size <= 3,
        });

        return (
            <div className={classes} key={option.type}>
                <GettingStartedOption
                    option={option}
                    selected={option.type === this.state.selectedOption.type}
                    onSelect={this.selectOption}
                />
            </div>
        );
    };

    private startFlow = () => {
        const { selectedOption } = this.state;

        if (selectedOption) {
            if (selectedOption.aptrinsicMessage) {
                // track(selectedOption.aptrinsicMessage);
            }

            this.props.startFlow(selectedOption.type);
        }
    };

    private selectOption = (option: StartOption) => {
        this.setState({ selectedOption: option });
    };
}
