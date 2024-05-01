export interface ICart {
  pizzaId: number
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface IOrder {
  id?: string
  status?: string
  customer?: string
  phone?: string
  address?: string
  priority: boolean
  estimatedDelivery?: string
  cart: ICart[]
  position?: string
  orderPrice?: number
  priorityPrice?: number
}

export interface Pizza {
  id: number
  name: string
  unitPrice: number
  imageUrl: string
  ingredients: string[]
  soldOut: boolean
}
