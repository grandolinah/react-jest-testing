import React from 'react'
import { Axios } from '../../helpers/axios'
import { render, fireEvent, act, waitFor } from '@testing-library/react'
import { Provider as StoreProvider } from 'react-redux'
import { build, fake } from '@jackfranklin/test-data-bot'

import App from '../../components/App'
import { createStore } from '../../store'
import { FiltersWrapper } from '../../components/FiltersWrapper'

// mock the api call
jest.mock('../../helpers/axios');

const mockAxios = Axios as any;

const productBuilder = build('Product', {
  fields: {
    id: fake(f => f.random.number()),
    name: fake(f => f.lorem.words()),
    image: fake(f => f.image.imageUrl()),
    price: fake(f => `from ${f.random.number(100)}`),
    brand: fake(f => f.lorem.words()),
  }
});

describe('The app ', () => {
  const setupApp = () =>
    render(
      <StoreProvider store={createStore()}>
        <FiltersWrapper>
          <App />
        </FiltersWrapper>
      </StoreProvider>
    );

  afterEach(() => jest.clearAllMocks());

  test('❌ it fetches and renders all products on the page', async () => {
    mockAxios.get.mockResolvedValue({
      data: [productBuilder(), productBuilder()]
    });

    const { findAllByTestId, debug } = setupApp();

    const products = await findAllByTestId('ProductTile');

    expect(products).toHaveLength(2);
  });

  test('❌ it can open and close the filters panel', async () => {
    const { getByText, queryByText } = setupApp();
    const filterButton = getByText(/filter/i);

    expect(queryByText(/reset to defaults/i)).not.toBeInTheDocument();

    fireEvent.click(filterButton);

    expect(queryByText(/reset to defaults/i)).toBeInTheDocument();

    fireEvent.click(getByText(/view results/i));

    expect(queryByText(/reset to defaults/i)).not.toBeInTheDocument();
    expect(queryByText(/view results/i)).not.toBeInTheDocument();
  });

  test('❌ it can search products as user types in the search field', async () => {
    jest.useFakeTimers();

    mockAxios.get.mockResolvedValueOnce({
      data: [productBuilder(), productBuilder(), productBuilder(), productBuilder(), productBuilder()]
    })
      // the second time that is called
      .mockResolvedValueOnce({
        data: [productBuilder(), productBuilder()]
      });

    const { findAllByTestId, getByText, getByPlaceholderText } = setupApp();

    expect(await findAllByTestId('ProductTile')).toHaveLength(5);

    fireEvent.click(getByText(/filter/i));

    const searchBox = getByPlaceholderText(/largo/i);

    fireEvent.change(searchBox, {
      target: {
        value: 'searching'
      }
    });

    act(() => {
      jest.runAllTimers();
    });

    await waitFor(() => expect(mockAxios.get).toHaveBeenCalledTimes(2));

    expect(await findAllByTestId('ProductTile')).toHaveLength(2);
  });
});
