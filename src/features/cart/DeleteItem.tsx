import { useAppDispatch } from 'hooks/hooks'
import Button from 'ui/Button'
import { deleteItem } from './cartSlice'

export default function DeleteItem({ pizzaId }: { pizzaId: number }) {
  const dispatch = useAppDispatch()

  return (
    <Button type='small' onClick={() => dispatch(deleteItem(pizzaId))}>
      Delete
    </Button>
  )
}
