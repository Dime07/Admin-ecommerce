import Image from 'next/image'
import React, { useState } from 'react'
import logo from '../../../public/logo.png'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { HambergerMenu } from 'iconsax-react'

export default function Navbar() {

  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className='flex flex-col p-5 lg:w-56 w-full fixed z-10 bg-White lg:h-screen h-fit lg:shadow-sm shadow-md'>
        <div className='lg:hidden inline-block' onClick={() => setIsOpen(!isOpen)}>
          <HambergerMenu size={32} color='#61CA77'/>
        </div>

        <div className={`lg:h-screen ${isOpen ? 'h-fit' : 'h-0'} overflow-hidden transition-all ease-in-out duration-[1000ms]`}>
          <div className='lg:py-7 py-0 lg:mb-0 mb-3 flex justify-center'>
            <Image src={logo} alt="Logo brand" width={50} height={50}/>
          </div>
          <ul className='inline'>
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
        </div>
    </nav>
  )
}
