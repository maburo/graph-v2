import * as React from 'react';
import classNames from 'classnames';

import warningIcon from '../../../../../../assets/img/notification/notification-caution.svg';
import infoIcon from '../../../../../../assets/img/notification/notification-info.svg';
import errorIcon from '../../../../../../assets/img/notification/notification-error.svg';

class Title extends React.PureComponent {
    render() {
        return <div className="information-message-title">{this.props.children}</div>;
    }
}

class Text extends React.PureComponent {
    render() {
        return <div className="information-message-text">{this.props.children}</div>;
    }
}

interface InformationMessageProps {
    children: JSX.Element[] | JSX.Element;
    type?: 'info' | 'warning' | 'error';
    className?: string;
}

export class InformationMessage extends React.PureComponent<InformationMessageProps> {
    static Title = Title;
    static Text = Text;

    private icons = {
        info: infoIcon,
        warning: warningIcon,
        error: errorIcon,
    };

    render() {
        const { type = 'warning', className } = this.props;
        return (
            <div className={classNames(className, 'information-message', `information-message_${type}`)}>
                <img src={this.icons[type]} alt="" />
                <div className="information-message-content">{this.props.children}</div>
            </div>
        );
    }
}
