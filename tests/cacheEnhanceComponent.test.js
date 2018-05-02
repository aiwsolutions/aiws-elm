import React from 'react';
import { cachedEnhanceComponent } from '../src';

test('CachedEnhanceComponent should always returns the same enhanced componnent', () => {
    const Component = <div />;

    const EnhancedComponent = cachedEnhanceComponent(Comment, 'div');

    expect(cachedEnhanceComponent(Component, 'div') === EnhancedComponent).toBeTruthy();
    expect(cachedEnhanceComponent(Component, 'nother') === EnhancedComponent).toBeFalsy();
});
