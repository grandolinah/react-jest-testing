import React from 'react'
import { axe } from 'jest-axe'
import { render } from '@testing-library/react'
import ProductTile from '../../../components/ProductTile'

const defaultProps = {
  id: 456464,
  name: 'Product tile',
  price: '2.50',
  image: '/image.png',
  brand: 'product brand',
  createdAt: '',
  isActive: true,
  isNew: true,
  isSoldOut: false,
  priceUnformatted: 2.501212
};

describe('The <ProductTile /> component', () => {
  const setupProductTile = (props = defaultProps) => render(<ProductTile {...props} />);

  it('❌ renders a product tile with name, image and price', () => {
    const { getByAltText, getByText, debug } = render(
      <ProductTile {...defaultProps as any} />
    )

    const name = getByText(defaultProps.name);
    const price = getByText(defaultProps.price)
    const image = getByAltText(defaultProps.name)

    // debug(name);
    // debug(price);
    // debug(image);

    expect(name).toBeInTheDocument();
    expect(price).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  })

  it('❌ renders a product tile with name and price only', () => {
    const { queryByTestId } = render(
      <ProductTile {...{
        ...defaultProps,
        image: undefined
      } as any} />
    )

    const image = queryByTestId('ProductTileImage');

    expect(image).not.toBeInTheDocument();
  })

  it('❌ has no accessibility violations', async () => {
    const { container } = setupProductTile();

    expect(await axe(container)).toHaveNoViolations();
  })
})
