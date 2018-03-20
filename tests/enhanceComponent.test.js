import React from 'react';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import renderer from 'react-test-renderer';
import { enhanceReducer, enhanceComponent } from '../src';

const counterInitialState = {
    counter: 0
};

function increaseOne() {
    return {
        type: 'INCREASE_ONE'
    };
}

const counterReducer = (state = { ...counterInitialState }, action) => {
    switch (action.type) {
        case 'INCREASE_ONE':
            return {
                ...state,
                counter: state.counter + 1
            };
        default:
            return state;
    }
};

const Counter = ({ counter, id, ...others }) =>
    <div>
        {counter}
        <button
            id={`button-${id}`}
            onClick={() => others.increaseOne()}
        />
    </div>;

const mapStateToProps = state => ({
    counter: state.counter
});

const mapDispatchToProps = {
    increaseOne
};

const ConnectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter);

const racingInitialState = {
    CounterOne: counterInitialState,
    CounterTwo: counterInitialState
};

const racingReducer = enhanceReducer(racingInitialState, {
    'Counter.*': counterReducer
});

const CounterOne = enhanceComponent(ConnectedCounter, 'CounterOne');
const CounterTwo = enhanceComponent(ConnectedCounter, 'CounterTwo');

const Racing = () =>
    <div>
        <CounterOne
            id="one"
        />
        <CounterTwo
            id="two"
        />
    </div>;

test('enhanceComponent', () => {
    const store = createStore(racingReducer, {
        ...racingInitialState
    });
    const comp = renderer.create(
        <Provider store={store}>
            <Racing />
        </Provider>
    );
    expect(comp.toJSON()).toMatchSnapshot();

    // simulate button two click
    comp.root.findByProps({ id: 'button-two' }).props.onClick();
    expect(comp.toJSON()).toMatchSnapshot();
});

