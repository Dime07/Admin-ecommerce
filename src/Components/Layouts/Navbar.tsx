import Image from 'next/image'
import React from 'react'
import logo from '../../../public/logo.png'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Navbar() {

  const router = useRouter()

  return (
    <nav className='flex flex-col p-5 w-56 fixed bg-White h-screen'>
        <div className='py-7 flex justify-center'>
          <Image src={logo} alt="Logo brand"/>
        </div>
        <ul>
            <Link href='/'>
              <li className={`text-sm py-3 px-4 rounded-lg hover:bg-primary cursor-pointer text-Gray hover:text-White transition-all mb-2 ${router.pathname == '/' ? 'bg-primary text-White' : ''}`}>
                  Dashboard
                </li> 
            </Link>
            <Link href='/products'>
              <li className={`text-sm py-3 px-4 rounded-lg hover:bg-primary cursor-pointer text-Gray hover:text-White transition-all mb-2 ${router.pathname.includes('products') ? 'bg-primary text-White' : ''}`}>
                  Products
                </li> 
            </Link>
            <Link href='/carts'>
              <li className={`text-sm py-3 px-4 rounded-lg hover:bg-primary cursor-pointer text-Gray hover:text-White transition-all mb-2 ${router.pathname.includes('carts') ? 'bg-primary text-White' : ''}`}>
                  Carts
                </li> 
            </Link>
        </ul>
    </nav>
  )
}
