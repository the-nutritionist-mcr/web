import 'jest-enzyme';
import '@testing-library/jest-dom/extend-expect';
import 'jest-styled-components';

import { createSerializer, matchers as emotionMatchers } from '@emotion/jest';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Enzyme from 'enzyme';

expect.extend(emotionMatchers);

Enzyme.configure({ adapter: new Adapter() });

expect.addSnapshotSerializer(createSerializer());
