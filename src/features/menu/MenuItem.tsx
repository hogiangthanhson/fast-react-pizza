import DeleteItem from 'features/cart/DeleteItem'
import UpdateItemQuantity from 'features/cart/UpdateItemQuantity'
import { addItem, getCurrentQuantityById } from 'features/cart/cartSlice'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { Pizza } from 'types'
import Button from 'ui/Button'
import { formatCurrency } from 'utils/helpers'

function MenuItem({ pizza }: { pizza: Pizza }) {
  const dispatch = useAppDispatch()

  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza

  const currentQuantity = useAppSelector(getCurrentQuantityById(id))
  const isInCart = currentQuantity > 0

  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: 1 * unitPrice
    }
    dispatch(addItem(newItem))
  }

  return (
    <li className='flex gap-4 py-2'>
      <img src={imageUrl} alt={name} className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`} />
      <div className='flex grow flex-col pt-0.5'>
        <p className='font-medium'>{name}</p>
        <p className='font-sm capitalize italic text-stone-500'>{ingredients.join(', ')}</p>
        <div className='mt-auto flex items-center justify-between'>
          {!soldOut ? (
            <p className='text-sm'>{formatCurrency(unitPrice)}</p>
          ) : (
            <p className='text-sm font-medium uppercase text-stone-500'>Sold out</p>
          )}
          {isInCart && (
            <div className='flex items-center gap-3 sm:gap-8'>
              <UpdateItemQuantity pizzaId={id} currentQuantity={currentQuantity} />
              <DeleteItem pizzaId={id} />
            </div>
          )}

          {!soldOut && !isInCart && (
            <Button type='small' onClick={handleAddToCart}>
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </li>
  )
}

export default MenuItem
