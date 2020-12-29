import * as React from 'react';
import clamp from 'clamp-js-main';
import classNames from 'classnames';
import sanitizeHtml from 'sanitize-html';

interface Props {
    text: string;
    title?: string;
    lines?: number;
    shouldTruncate?: boolean;
    truncationChar?: string;
}

export class TruncateWithEllipsis extends React.Component<Props> {
    private elementRef = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        if (this.props.shouldTruncate) {
            this.truncate();
        }
    }

    shouldComponentUpdate(nextProps: Props) {
        return this.props.text !== nextProps.text;
    }

    componentDidUpdate() {
        if (this.props.shouldTruncate) {
            this.truncate();
        }
    }

    render() {
        const classes = classNames('fs-exclude', {
            'text-ellipsis': this.isOneWord(this.props.text),
        });

        return (
            <div
                className={classes}
                ref={this.elementRef}
                title={this.props.title}
                dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(this.props.text, {
                        allowedTags: ['span'],
                        allowedAttributes: { span: ['class'] },
                    }),
                }}
            />
        );
    }

    private isOneWord(text: string): boolean {
        return !/\s/.test(text);
    }

    private truncate() {
        if (this.isOneWord(this.props.text)) {
            return;
        }

        clamp(this.elementRef.current, {
            clamp: this.props.lines || 2,
            useNativeClamp: false,
            truncationChar: this.props.truncationChar || '...',
        });
    }
}
