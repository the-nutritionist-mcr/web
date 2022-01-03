import 'jest-enzyme';
import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

import { createSerializer, matchers as emotionMatchers } from '@emotion/jest';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';

// eslint-disable-next-line fp/no-unused-expression
expect.extend(emotionMatchers);

// eslint-disable-next-line fp/no-unused-expression
Enzyme.configure({ adapter: new Adapter() });

// eslint-disable-next-line fp/no-unused-expression
expect.addSnapshotSerializer(createSerializer());
