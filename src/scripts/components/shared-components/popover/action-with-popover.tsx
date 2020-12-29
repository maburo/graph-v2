import * as React from 'react';

type Props = {
    popoverButtonTitle: string;
    popoverTrackTitle: string;
    children?: React.ReactNode;
    opened: boolean;
    onOpen: () => void;
};

export class ActionWithPopover extends React.Component<Props> {
    constructor(props: Props) {
        super(props);

        this.state = {
            opened: false,
        };
    }

    render() {
        return (
            <div className="flow-action-with-popover">
                {this.props.opened && this.props.children}
                <a id="open-popover" className="btn btn-with-popover tf-open-popover-btn" onClick={this.openPopover}>
                    {this.props.popoverButtonTitle}
                </a>
            </div>
        );
    }

    private openPopover = (event: React.MouseEvent<EventTarget>) => {
        event.preventDefault();
        this.props.onOpen();
    };
}
