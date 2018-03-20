import _ from 'lodash';
import { enhanceAction } from '../src';

function sampleAction(payload) {
    return {
        type: 'SAMPLE_ACTION',
        payload
    };
}

test('enhanceAction - single action', () => {
    const action = enhanceAction(sampleAction, 'Enhanced');
    expect(action('test')).toMatchObject({
        type: 'Enhanced/SAMPLE_ACTION',
        payload: 'test'
    });
});

test('enhanceAction - multiple actions', () => {
    const actions = enhanceAction([sampleAction, () => ({ type: 'test' })], 'Enhanced');
    _.forEach(actions, action => expect(_.startsWith(action().type, 'Enhanced/')).toBeTruthy());
});

test('enhanceAction - non default separator', () => {
    const action = enhanceAction(sampleAction, 'Enhanced', '.');
    expect(action('test')).toMatchObject({
        type: 'Enhanced.SAMPLE_ACTION',
        payload: 'test'
    });
});

