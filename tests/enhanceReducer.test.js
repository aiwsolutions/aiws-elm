import { enhanceReducer } from '../src';

const TOGGLE_CHILD = 'TOGGLE_CHILD';
const TOGGLE_PARENT = 'TOGGLE_PARENT';

const childInitialState = {
    on: false
};

const childReducer = (state = childInitialState, action) => {
    switch (action.type) {
        case TOGGLE_CHILD:
            return {
                ...state,
                on: !state.on
            };
        default:
            return state;
    }
};

const parentInitialState = {
    CHILD: childInitialState,
    on: false
};

const parentReducer = enhanceReducer(parentInitialState, {
    CHILD: childReducer,
    root: (state, action) => {
        switch (action.type) {
            case TOGGLE_PARENT:
                return {
                    ...state,
                    on: !state.on
                };
            default:
                return state;
        }
    }
});

test('enhanceReducer - child action', () => {
    const state = parentReducer({ ...parentInitialState }, { type: `CHILD/${TOGGLE_CHILD}` });
    expect(state.on).toBeFalsy();
    expect(state.CHILD.on).toBeTruthy();
});

test('enhanceReducer - parent action', () => {
    const state = parentReducer({ ...parentInitialState }, { type: TOGGLE_PARENT });
    expect(state.on).toBeTruthy();
    expect(state.CHILD.on).toBeFalsy();
});

test('enhanceReducer - regex', () => {
    const initialState = {
        'CHILD-0': childInitialState,
        'CHILD-1': childInitialState
    };
    const regexReducer = enhanceReducer(initialState, {
        'CHILD-[0-9]': childReducer
    });

    const state = regexReducer({ ...initialState }, { type: `CHILD-1/${TOGGLE_CHILD}` });
    expect(state['CHILD-0'].on).toBeFalsy();
    expect(state['CHILD-1'].on).toBeTruthy();
});

