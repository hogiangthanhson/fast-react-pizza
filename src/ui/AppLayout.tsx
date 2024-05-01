import CartOverview from 'features/cart/CartOverview'
import Header from './Header'
import { Outlet, useNavigation } from 'react-router-dom'
import Loader from './Loader'

export default function AppLayout() {
  const navigation = useNavigation()
  const isLoading = navigation.state === 'loading'

  return (
    <div className='grid h-dvh grid-rows-[auto_1fr_auto] gap-8'>
      {isLoading && <Loader />}

      <Header />
      <div className='overflow-auto'>
        <main className='mx-auto max-w-3xl '>
          <Outlet />
        </main>
      </div>

      <CartOverview />
    </div>
  )
}
