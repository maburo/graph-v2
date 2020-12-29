import { FlowElementType } from '@infobip/moments-components';

export class SmsMoOptionGroup {
    static DEDICATED = 'DEDICATED';
    static CHEMISTRY = 'CHEMISTRY';
    static SHARED = 'SHARED';
}

export const BIRTH_DATE = 'birthDate';
export const TODAY = 'today';

export const FLOW_DIAGRAM_POSITIONS = 'flow_diagram_positions';
export const MAX_COUNT_STORED_DIAGRAM_POSITIONS = 1000;

export const FLOW_NAME_MAX_LENGTH = 64;

// TODO ENP 137 Currently we don't support change for these elements while editing flow version
export const LIST_NON_EDIT_FLOW_ELEMENTS = [
    FlowElementType.START_CALL_IVR_ACTION,
    FlowElementType.START_RESOLVE_ONETIME_AUDIENCE,
    FlowElementType.START_IVR_INBOUND,
    FlowElementType.COLLECT_IVR_ACTION,
    FlowElementType.DIAL_IVR_ACTION,
    FlowElementType.PLAY_IVR_ACTION,
    FlowElementType.RECORD_IVR_ACTION,
    FlowElementType.IVR_HANG_UP,
];
