import { act } from 'react-dom/test-utils';
import TabBox from './tab-box';
import Tab from './tab';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('The <TabBox> component', () => {
  it('renders without errors', () => {
    render(<TabBox>Something</TabBox>);
  });

  it('renders the first tab by default', () => {
    render(
      <TabBox>
        <Tab tabTitle="one">One</Tab>
        <Tab tabTitle="two">Two</Tab>
      </TabBox>
    );
    expect(screen.queryByText('One')).toBeInTheDocument();
  });

  it("doesn't render the second tab by default", () => {
    render(
      <TabBox>
        <Tab tabTitle="one">One</Tab>
        <Tab tabTitle="two">Two</Tab>
      </TabBox>
    );

    expect(screen.queryByText('Two')).not.toBeInTheDocument();
  });

  it('renders a list of buttons for each tab', () => {
    render(
      <TabBox>
        <Tab tabTitle="oneTitle">One</Tab>
        <Tab tabTitle="twoTitle">Two</Tab>
      </TabBox>
    );

    const tabOne = screen.queryByRole('tab', { name: 'oneTitle' });
    expect(tabOne).toBeInTheDocument();

    const tabTwo = screen.queryByRole('tab', { name: 'twoTitle' });
    expect(tabTwo).toBeInTheDocument();
  });

  it('shows the second tab when the second button is clicked', () => {
    render(
      <TabBox>
        <Tab tabTitle="oneTitle">One</Tab>
        <Tab tabTitle="twoTitle">Two</Tab>
      </TabBox>
    );

    const tabTwo = screen.getByRole('tab', { name: 'twoTitle' });

    act(() => {
      userEvent.click(tabTwo);
    });

    expect(screen.queryByText('Two')).toBeInTheDocument();
  });

  it('hides the second tab when the second button is clicked', () => {
    render(
      <TabBox>
        <Tab tabTitle="oneTitle">One</Tab>
        <Tab tabTitle="twoTitle">Two</Tab>
      </TabBox>
    );

    const tabTwo = screen.getByRole('tab', { name: 'twoTitle' });

    act(() => {
      userEvent.click(tabTwo);
    });

    expect(screen.queryByText('One')).not.toBeInTheDocument();
  });

  it('renders the defaultTab first if provided', () => {
    render(
      <TabBox defaultTab="twoTitle">
        <Tab tabTitle="oneTitle">One</Tab>
        <Tab tabTitle="twoTitle">Two</Tab>
      </TabBox>
    );

    expect(screen.queryByText('One')).not.toBeInTheDocument();
    expect(screen.queryByText('Two')).toBeInTheDocument();
  });
});
