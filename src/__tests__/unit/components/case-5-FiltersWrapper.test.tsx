import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { FiltersContext } from '../../../context/filters'
import { FiltersWrapper } from '../../../components/FiltersWrapper'

describe('The <FiltersWrapper /> component', () => {
  const hideMessage = 'hide filters';
  const showMessage = 'show filters';

  const setupFilterWapper = () => render(<FiltersWrapper>
    <FiltersContext.Consumer>
      {({ showingFilters, toggleShowingFilters }) => {
        return (
          <button onClick={toggleShowingFilters}>
            {showingFilters ? showMessage : hideMessage}
          </button>
        )
      }}
    </FiltersContext.Consumer>
  </FiltersWrapper>);

  it('❌ should render all children passed to it', () => {
    const { debug, getByTestId } = render(<FiltersWrapper>
      <p data-testid="TestParagraph"></p>
    </FiltersWrapper>
    );
    const paragraph = getByTestId('TestParagraph');

    // debug();
    expect(paragraph).toBeInTheDocument();
  })

  it('❌ should update the filters context with correct state values', () => {
    const { debug, getByText } = setupFilterWapper();

    const button = getByText(hideMessage);

    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    // debug();

    const afterClickButton = getByText(showMessage);

    expect(afterClickButton).toBeInTheDocument();
  })

  it('❌ should update the body style to prevent scrolling when filter is toggled', () => {
    const { debug, getByText } = setupFilterWapper();

    const button = getByText(hideMessage);

    fireEvent.click(button);

    const elementOveflow = document.body.style.overflow;

    expect(elementOveflow).toBe('hidden');

    const afterClickButton = getByText(showMessage);

    fireEvent.click(afterClickButton);

    const aftereElementOveflow = document.body.style.overflow;
    // debug();
    expect(aftereElementOveflow).toBe('scroll');
  })
})
