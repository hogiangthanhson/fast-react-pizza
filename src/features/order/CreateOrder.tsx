/* eslint-disable @typescript-eslint/no-explicit-any */
import EmptyCart from 'features/cart/EmptyCart'
import { clearCart, getCart, getTotalCartPrice } from 'features/cart/cartSlice'
import { fetchAddress } from 'features/user/userSlice'
import { useAppDispatch, useAppSelector } from 'hooks/hooks'
import { useState } from 'react'
import { Form, redirect, useActionData, useNavigation } from 'react-router-dom'
import type { ActionFunctionArgs } from 'react-router-dom'
import { createOrder } from 'services/apiRestaurant'
import store from 'store'
import Button from 'ui/Button'
import { formatCurrency } from 'utils/helpers'

interface FormErrors {
  phone?: string
}

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str: string) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(str)

function CreateOrder() {
  const [withPriority, setWithPriority] = useState(false)
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  const formErrors = useActionData() as FormErrors
  const {
    username,
    status: addressStatus,
    position,
    address,
    error: errorAddress
  } = useAppSelector((state) => state.user)
  const isLoadingAddress = addressStatus === 'loading'
  const cart = useAppSelector(getCart)
  const totalCartPrice = useAppSelector(getTotalCartPrice)
  const dispatch = useAppDispatch()
  const priorityPrice = withPriority ? totalCartPrice * 0.2 : 0
  const totalPrice = totalCartPrice + priorityPrice

  if (!cart.length) return <EmptyCart />

  return (
    <div className='px-4 py-6'>
      <h2 className='mb-8 text-xl font-semibold'>Ready to order? Let's go!</h2>
      {/* <Form method='POST' action='/order/new'> */}
      <Form method='POST'>
        <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
          <label className='sm:basis-40'>First Name</label>
          <input type='text' name='customer' required className='input grow' defaultValue={username} />
        </div>

        <div className='mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
          <label className='self-start sm:basis-40'>Phone number</label>
          <div className='grow'>
            <input type='tel' name='phone' required className='input w-full' />
            {formErrors?.phone && (
              <p className='mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700'>{formErrors.phone}</p>
            )}
          </div>
        </div>

        <div className='relative mb-5 flex flex-col gap-2 sm:flex-row sm:items-center'>
          <label className='sm:basis-40'>Address</label>
          <div className='grow'>
            <input
              type='text'
              name='address'
              required
              className='input w-full'
              disabled={isLoadingAddress}
              defaultValue={address}
            />
            {addressStatus === 'error' && (
              <p className='mt-2 rounded-md bg-red-100 p-2 text-xs text-red-700'>{errorAddress}</p>
            )}
          </div>
          {!position.latitude && !position.longitude && (
            <span className='absolute right-[3px] top-[35px] z-50 sm:top-[3px] md:right-[5px] md:top-[5px]'>
              <Button
                disabled={isLoadingAddress}
                type='small'
                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                  e.preventDefault()
                  dispatch(fetchAddress())
                }}
              >
                Get position
              </Button>
            </span>
          )}
        </div>

        <div className='mb-12 flex items-center gap-5'>
          <input
            className='h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2'
            type='checkbox'
            name='priority'
            id='priority'
            value={withPriority ? 'true' : 'false'}
            onChange={(e) => setWithPriority(e.target.checked)}
          />
          <label htmlFor='priority' className='font-medium'>
            Want to yo give your order priority?
          </label>
        </div>

        <div>
          <input type='hidden' name='cart' value={JSON.stringify(cart)} />
          <input
            type='hidden'
            name='position'
            value={position.latitude && position.longitude ? `${position.latitude}, ${position.longitude}` : ''}
          />

          <Button type='primary' disabled={isSubmitting || isLoadingAddress}>
            {isSubmitting ? 'Packing order...' : `Order now from ${formatCurrency(totalPrice)}`}
          </Button>
        </div>
      </Form>
    </div>
  )
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  const order: any = {
    ...data,
    cart: JSON.parse(formData.get('cart') as string),
    priority: data.priority === 'true'
  }

  // Validate phone
  const errors: any = {}
  if (order.phone && !isValidPhone(order.phone))
    errors.phone = 'Please give us your correct phone number. We might need it to contact you.'

  // Return data if we have errors
  if (Object.keys(errors).length > 0) return errors

  store.dispatch(clearCart())

  // Otherwise, create new order and redirect
  const newOrder = await createOrder(order)
  return redirect(`/order/${newOrder.id}`)
}

export default CreateOrder
