import React, {useState, useEffect} from 'react'
import Layout from '@/Components/Layouts/Layout'
import Router, { useRouter } from 'next/router'
import axios from 'axios'
import Loading from '@/Components/Loading/loading'

export default function DetailCarts() {

    const router = useRouter()
    const [cart, setCart] =  useState<any>()
    const [products, setProducts] = useState<any>([])
    const [date, setDate] = useState<string>('')
    const [user, setUser] = useState<any>()
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        const { id } = router.query
        
        setIsLoading(true)

        if(id as string === undefined){
            const idLocal = localStorage.getItem('cartId')
            const idCart:number = parseInt(idLocal as string)
            Promise.all([
                getDetailCarts(idCart)
            ]).then(() => setIsLoading(false))
        }else{
            localStorage.setItem('cartId', id as string)
            const idCart:number = parseInt(id as string)
            Promise.all([
                getDetailCarts(idCart)
            ]).then(() => setIsLoading(false))
        }
    }, [])
    
    const getDetailCarts =(id: number) => {
        return new Promise<void>(async (resolve) => {
            await axios
                .get(`https://dummyjson.com/carts/${id}`)
                .then((res) => {
                    switch (res.status) {
                        case 200:
                            const data = res.data
                            setProducts(data.products)
                            setCart(data)
                            const date = new Date()
                            const today = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}` 
                            setDate(today)
                            Promise.all([
                                getUserDetail(data.userId)
                            ]).then(() => {resolve()})
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
        })
    }

    const getUserDetail = (id: number) => {
        new Promise<void>(async (resolve) => {
            await axios
                .get(`https://dummyjson.com/users/${id}`)
                .then((res) => {
                    switch (res.status) {
                        case 200:
                            const data = res.data
                            setUser(data)
                            resolve()
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
        })
    }



    return (
        <Layout title='Admin | Detail Product'>
            <div className='lg:p-8 p-3'>
                <div className='py-5 px-4 rounded-md bg-white'>
                    {isLoading ?
                        (
                            <Loading />
                        ) :
                        (
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
                                    <table className='w-full text-left border-[0.5px] rounded-md lg:overflow-x-auto overflow-x-scroll block'>
                                        <tbody>
                                            <tr className='border-b-[0.5px]'>
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
                                            </tr>
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
                                        <div className='flex lg:justify-end justify-start '>
                                            <div className='py-5 px-7 lg:w-1/4 w-full'>
                                                <p className=' text-Gray text-sm'>
                                                    Subtotal : 
                                                </p>
                                            </div>
                                            <div className='py-5 px-7 lg:w-1/4 w-full'>
                                                <p className=' text-Black text-sm font-semibold'>
                                                    ${cart?.total} 
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex lg:justify-end justify-start '>
                                            <div className='py-5 px-7 lg:w-1/4 w-full border-b-[0.5px] border-gray-300'>
                                                <p className=' text-Gray text-sm'>
                                                    Discount : 
                                                </p>
                                            </div>
                                            <div className='py-5 px-7 lg:w-1/4 w-full border-b-[0.5px] border-gray-300'>
                                                <p className=' text-red-500 text-sm font-semibold'>
                                                    ${cart?.total - cart?.discountedTotal} 
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex lg:justify-end justify-start '>
                                            <div className='py-5 px-7 lg:w-1/4 w-full'>
                                                <p className=' text-primary text-sm'>
                                                    Total : 
                                                </p>
                                            </div>
                                            <div className='py-5 px-7 lg:w-1/4 w-full'>
                                                <p className=' text-primary text-sm font-semibold'>
                                                    ${cart?.discountedTotal} 
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </Layout>
    )
}
