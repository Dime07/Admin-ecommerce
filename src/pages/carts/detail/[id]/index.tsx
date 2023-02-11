import React, {useState, useEffect} from 'react'
import Layout from '@/Components/Layouts/Layout'
import Router, { useRouter } from 'next/router'
import axios from 'axios'

export default function DetailCarts() {

    const router = useRouter()
    const { id } = router.query
    const [cart, setCart] =  useState<any>()
    const [products, setProducts] = useState<any>([])
    const [date, setDate] = useState<string>('')
    const [user, setUser] = useState<any>()

    useEffect(() => {
        const idProduct:number = parseInt(id as string)
        getDetailCarts(idProduct)
    }, [])
    
    const getDetailCarts = (id: number) => {
        axios
            .get(`https://dummyjson.com/carts/${id}`)
            .then((res) => {
                switch (res.status) {
                    case 200:
                        const data = res.data
                        setProducts(data.products)
                        setCart(data)
                        getUserDetail(data.userId)

                        const date = new Date()
                        const today = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` 
                        setDate(today)
                        break;
                    
                    default:
                        break;
                }
            })
            .catch((err) => {
                const status = err.response.status
                switch (status) {
                    case 404:
                        Router.push('/carts')
                        break;
                
                    default:
                        break;
                }
            })
    }

    const getUserDetail = (id: number) => {
        axios
            .get(`https://dummyjson.com/users/${id}`)
            .then((res) => {
                switch (res.status) {
                    case 200:
                        const data = res.data
                        setUser(data)
                        break;
                    
                    default:
                        break;
                }
            })
            .catch((err) => {
                const status = err.response.status
                switch (status) {
                    case 404:
                        Router.push('/carts')
                        break;
                
                    default:
                        break;
                }
            })
    }



    return (
        <Layout title='Admin | Detail Product'>
            <div className='p-8'>
                <div className='py-5 px-4 rounded-md bg-white'>
                    <div className='border-[0.5px] border-gray-200 rounded-md'>
                        <div className='py-6 px-8 bg-primaryLight'>
                            <p className='text-xl font-semibold'>
                                ADMCOMRCE-{cart?.userId}
                            </p>
                            <p className='text-sm text-Gray font-medium mt-1'>
                                {date}
                            </p>
                        </div>
                        <div className='py-6 px-8'>
                            <div className='mb-4'>
                                <p className='text-base font-semibold mb-2'>
                                    Costumer Info :
                                </p>
                                <p className='text-sm font-semibold text-Black'>
                                    {user?.firstName} {user?.lastName}  
                                </p>
                                <p className='text-sm font-medium text-Black'>
                                    {user?.email}
                                </p>
                                <p className='text-sm text-Gray'>
                                    {user?.phone}
                                </p>
                                <p className='text-sm text-Gray'>
                                    {user?.address.address} {user?.address.city}<br></br>
                                    {user?.address.postalCode}
                                </p>
                            </div>
                            <table className='w-full text-left border-[0.5px] rounded-md'>
                                <thead className='border-b-[0.5px]'>
                                    <th className='py-5 px-7 w-1/4'>
                                        <p className='text-base font-semibold text-Black'>
                                            Product Name
                                        </p>
                                    </th>
                                    <th className='py-5 px-7 w-1/4'>
                                        <p className='text-base font-semibold text-Black'>
                                            Quantity
                                        </p>
                                    </th>
                                    <th className=' py-5 px-7 w-1/4'>
                                        <p className='text-base font-semibold text-Black'>
                                            Price
                                        </p>
                                    </th>
                                    <th className='py-5 px-7 w-1/4'>
                                        <p className='text-base font-semibold text-Black'>
                                            Amount
                                        </p>
                                    </th>
                                </thead>
                                <tbody>
                                    {products.map((item: any, index: number) => (
                                        <tr key={index}>
                                            <td  className='py-5 px-7'>
                                                <p className=' text-Gray text-sm'>
                                                    {item.title}
                                                </p>
                                            </td>
                                            <td  className='py-5 px-7'>
                                                <p className=' text-Gray text-sm'>
                                                    {item.quantity}
                                                </p>
                                            </td>
                                            <td  className='py-5 px-7'>
                                                <p className=' text-Gray text-sm'>
                                                    ${item.price}
                                                </p>
                                            </td>
                                            <td  className='py-5 px-7'>
                                                <p className=' text-Gray text-sm'>
                                                    ${item.total}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div>
                                <div className='flex justify-end'>
                                    <div className='py-5 px-7 w-1/4'>
                                        <p className=' text-Gray text-sm'>
                                            Subtotal : 
                                        </p>
                                    </div>
                                    <div className='py-5 px-7 w-1/4'>
                                        <p className=' text-Black text-sm font-semibold'>
                                            ${cart?.total} 
                                        </p>
                                    </div>
                                </div>
                                <div className='flex justify-end'>
                                    <div className='py-5 px-7 w-1/4 border-b-[0.5px] border-gray-300'>
                                        <p className=' text-Gray text-sm'>
                                            Discount : 
                                        </p>
                                    </div>
                                    <div className='py-5 px-7 w-1/4 border-b-[0.5px] border-gray-300'>
                                        <p className=' text-Black text-sm font-semibold'>
                                            ${cart?.total - cart?.discountedTotal} 
                                        </p>
                                    </div>
                                </div>
                                <div className='flex justify-end'>
                                    <div className='py-5 px-7 w-1/4'>
                                        <p className=' text-primary text-sm'>
                                            Total : 
                                        </p>
                                    </div>
                                    <div className='py-5 px-7 w-1/4'>
                                        <p className=' text-primary text-sm font-semibold'>
                                            ${cart?.discountedTotal} 
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
