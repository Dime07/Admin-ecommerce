import React, {useEffect, useState} from 'react'
import Layout from '@/Components/Layouts/Layout'
import Router, { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'
import { Star1 } from 'iconsax-react'

export default function DetailProducts() {
    
    const router = useRouter()
    const { id } = router.query
    const [product, setProduct] =  useState<any>()

    useEffect(() => {
        
        const idProduct:number = parseInt(id as string)
        getDetailProduct(idProduct)
    }, [])
    
    const getDetailProduct = (id: number) => {
        axios
            .get(`https://dummyjson.com/products/${id}`)
            .then((res) => {
                console.log(res)
                switch (res.status) {
                    case 200:
                        const data = res.data
                        console.log(data)
                        setProduct(data)
                        break;
                    
                    default:
                        break;
                }
            })
            .catch((err) => {
                const status = err.response.status
                switch (status) {
                    case 404:
                        Router.push('/products')
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
                <p className='text-3xl font-medium mb-4 text-center underline'>
                    Detail Product
                </p>
                <div className='flex gap-10 items-center'>
                    <div className='relative w-1/2 rounded-md overflow-hidden'>
                        <div>
                            <div className='absolute left-0 top-0 bg-secondary p-3 rounded-br-lg'>
                                <p className='text-white font-bold text-lg'>
                                    $ {product?.price}
                                </p>
                            </div>
                        </div>
                        <div className='w-full'>
                            <Image src={product?.thumbnail} alt={`${product?.title} Photo`} width={600} height={600} layout="responsive" loading="lazy" />
                        </div>
                    </div>
                    <div className='flex w-1/2 flex-col'>
                        <p className='text-sm font-medium'>
                            {product?.brand}
                        </p>
                        <p className='text-3xl font-semibold mb-3'>
                            {product?.title}
                        </p>
                        <div className='flex gap-3 mb-3'>
                            <p className='text-base text-gray-500'>
                                {product?.category}
                            </p>
                            <div className='flex gap-2 items-center'>
                                <Star1 color='#F6B445' size={18} variant="Bold"/>
                                <p className='text-base text-black font-semibold'>
                                    {product?.rating}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className='text-lg font-semibold'>
                                Description
                            </p>
                            <p>
                                {product?.description}
                            </p>
                        </div>
                        <p className='mt-4'>
                            Stock Left : <span className='font-bold text-primary'>{product?.stock}</span>
                        </p>
                    </div>
                </div>
             </div>
            </div>
        </Layout>
    )
}
