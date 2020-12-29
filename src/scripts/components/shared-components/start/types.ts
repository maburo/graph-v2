import { FlowElementType } from '@infobip/moments-components';

export interface StartOption {
    type: FlowElementType;
    icon: string;
    title: string;
    description?: string;
    aptrinsicMessage?: string;
    link?: string;
}

export interface StartOptionTrigger {
    type: string;
    icon: string;
    title: string;
    description?: string;
    link?: string;
}

export interface GettingStartedOptions {
    [key: string]: StartOption;
}

export const START_TRIGGER_OPTION = 'START_TRIGGER_OPTION';
