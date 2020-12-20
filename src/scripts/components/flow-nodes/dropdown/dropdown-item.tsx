import * as React from 'react';

export interface ItemProps {
    label?: string;
    onSelect?: () => void;
    className?: string;
    children?: React.ReactNode;
}

export const DropdownItem: React.StatelessComponent<ItemProps> = (props: ItemProps) => {
    const handleClick = (event: React.SyntheticEvent<EventTarget>) => {
        event.preventDefault();
        event.stopPropagation();

        if (props.onSelect) {
            props.onSelect();
        }
    };

    return (
        <li className={props.className} onClick={handleClick}>
            {props.label || props.children}
        </li>
    );
};

DropdownItem.displayName = 'DropdownItem';
