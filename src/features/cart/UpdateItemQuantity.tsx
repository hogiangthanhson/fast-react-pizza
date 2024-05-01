import { useAppDispatch } from 'hooks/hooks'
import Button from 'ui/Button'
import { decreaseItemQuantity, increaseItemQuantity } from './cartSlice'

export default function UpdateItemQuantity({ pizzaId, currentQuantity }: { pizzaId: number; currentQuantity: number }) {
  const dispatch = useAppDispatch()

  return (
    <div className='flex items-center gap-2 md:gap-3'>
      <Button type='round' onClick={() => dispatch(decreaseItemQuantity(pizzaId))}>
        -
      </Button>
      <span>{currentQuantity}</span>
      <Button type='round' onClick={() => dispatch(increaseItemQuantity(pizzaId))}>
        +
      </Button>
    </div>
  )
}
