import * as React from 'react';
// import { compareWithoutFunctions } from '@infobip/moments-components';

import errorIcon from '../../../assets/img/notification/notification-error.svg';
import successIcon from '../../../assets/img/notification/notification-valid.svg';
import warningIcon from '../../../assets/img/notification/notification-caution.svg';
import clearIcon from '../../../assets/img/notification/notification-clear.svg';

import { NotificationType } from './notification-messages';

interface Props {
    type: NotificationType;
    message: string | JSX.Element;
    clearMessage?: () => void;
    updateCanShowMessage?: (canShow: boolean) => void;
}

export class NotificationAlert extends React.Component<Props> {
    // shouldComponentUpdate(nextProps: Props) {
    //     return compareWithoutFunctions(this.props, nextProps);
    // }

    render() {
        return (
            <div className="flow-notification-alert">
                <div className="flow-notification-alert__inner">
                    <div>
                        <img src={this.getIcon()} className="flow-notification-alert__icon" />
                    </div>
                    <div className="flow-notification-alert__message">{this.props.message}</div>
                    <button type="button" onClick={this.close} className="flow-notification-alert__close">
                        <img src={clearIcon} />
                    </button>
                </div>
            </div>
        );
    }

    getIcon = () => {
        switch (this.props.type) {
            case NotificationType.ERROR:
                return errorIcon;
            case NotificationType.INFO:
                return successIcon;
            case NotificationType.SUCCESS:
                return successIcon;
            case NotificationType.WARNING:
                return warningIcon;
        }
    };

    private close = () => {
        if (this.props.clearMessage) {
            this.props.clearMessage();
        } else if (this.props.updateCanShowMessage) {
            this.props.updateCanShowMessage(false);
        }
    };
}
