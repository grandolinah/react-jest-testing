import React from 'react'
import { render, fireEvent } from '@testing-library/react'

import { useFilters } from '../../../hooks/useFilters'
import { FiltersContext } from '../../../context/filters'

describe('The useFilters hook', () => {
  const Panel = () => {
    const { toggleShowingFilters } = useFilters();

    return (
      <div>
        <button onClick={toggleShowingFilters}>
          click me
        </button>
      </div>
    );
  };

  it('❌ returns the current value of the filters context', () => {
    const toggleShowingFilters = jest.fn();

    const { debug, getByText } = render(
      <FiltersContext.Provider value={{ toggleShowingFilters } as any}>
        <Panel />
      </FiltersContext.Provider>
    );

    const button = getByText(/click me/i);

    fireEvent.click(button);

    expect(toggleShowingFilters).toHaveBeenCalled();
  })
})
