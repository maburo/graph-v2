import * as React from 'react';
import { findDOMNode } from 'react-dom';

const ESC_KEY_CODE = 27;

interface Props {
    tagName?: 'div' | 'span';
    className?: string;
    ignoreEscape?: boolean;
    closeOnElementRemoved?: boolean;
    onDismiss: Function | null;
    shouldIgnoreDismissFn?: (target: HTMLElement) => boolean;
}

export class Dismissible extends React.PureComponent<Props, {}> {
    static displayName = 'Dismissible';

    static defaultProps = {
        ignoreEscape: false,
    };

    private document: HTMLDocument | null = null;
    private dismissibleContainer: Element | null = null;
    private willUnmount = false;

    componentWillUnmount() {
        this.willUnmount = true;
        this.unlisten();
    }

    render() {
        const { tagName, className, children } = this.props;

        return React.createElement(
            tagName || 'div',
            {
                className,
                ref: this.listen,
            },
            children,
        );
    }

    private handleMouseDown = (event: MouseEvent) => {
        if (this.willUnmount || !this.props.onDismiss) {
            return;
        }

        const target = event.target as HTMLElement;
        const targetIsInDom = this.document && this.document.contains(target);
        const targetIsNotInsideContainer = !!this.dismissibleContainer && !this.dismissibleContainer.contains(target);
        const shouldIgnoreDismiss = !!this.props.shouldIgnoreDismissFn && this.props.shouldIgnoreDismissFn(target);

        // Skip dismissing any container if modal is open
        const isModalOpen = this.document && this.document.body.classList.contains('modal-open');

        if (
            targetIsNotInsideContainer &&
            !isModalOpen &&
            !shouldIgnoreDismiss &&
            (targetIsInDom || this.props.closeOnElementRemoved)
        ) {
            this.props.onDismiss(event);
        }
    };

    private handleKeyUp = (event: KeyboardEvent) => {
        if (this.willUnmount || !this.props.onDismiss) {
            return;
        }

        if (!this.props.ignoreEscape && event.keyCode === ESC_KEY_CODE) {
            this.props.onDismiss(event);
        }
    };

    private listen = (refElement: Element) => {
        // When component is unmounted it will call ref with null value, thus entering this method and causing memory leaks. To make sure that this
        // doesn't happen check if provided reference is not null to register listeners.
        if (refElement !== null) {
            this.unlisten();
            this.dismissibleContainer = findDOMNode(this) as Element;
            this.document = this.dismissibleContainer.ownerDocument || document;
            this.document.addEventListener('mousedown', this.handleMouseDown);
            this.document.addEventListener('keyup', this.handleKeyUp);
        }
    };

    private unlisten = () => {
        if (this.document) {
            this.document.removeEventListener('keyup', this.handleKeyUp);
            this.document.removeEventListener('mousedown', this.handleMouseDown);
            this.document = null;
            this.dismissibleContainer = null;
        }
    };
}
