import { getMenu } from 'services/apiRestaurant'
import { useLoaderData } from 'react-router-dom'
import { Pizza } from 'types'
import MenuItem from './MenuItem'

function Menu() {
  const menu = useLoaderData() as Pizza[]

  return (
    <ul className='divide-y divide-stone-200 px-2'>
      {menu.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  )
}

export async function loader() {
  const menu = await getMenu()
  return menu
}
export default Menu
