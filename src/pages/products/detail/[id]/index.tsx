import React, {useEffect, useState} from 'react'
import Layout from '@/Components/Layouts/Layout'
import Router, { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'
import { Star1 } from 'iconsax-react'
import Loading from '@/Components/Loading/loading'

export default function DetailProducts() {
    
    const router = useRouter()
    const { id } = router.query
    const [product, setProduct] =  useState<any>()
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const idProduct:number = parseInt(id as string)
        setIsLoading(true)
        Promise.all([
            getDetailProduct(idProduct)
        ]).then(() => setIsLoading(false))
    }, [])
    
    const getDetailProduct = (id: number) => {
        return new Promise<void>(async (resolve) => {
            axios
                .get(`https://dummyjson.com/products/${id}`)
                .then((res) => {
                    console.log(res)
                    switch (res.status) {
                        case 200:
                            const data = res.data
                            console.log(data)
                            setProduct(data)
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
                            Router.push('/products')
                            break;
                    
                        default:
                            break;
                    }
                })
        })
    }

    return (
        <Layout title='Admin | Detail Product'>
            <div className='p-8'>
             <div className='lg:py-5 lg:px-4 p-2 rounded-md bg-white'>
                {isLoading ? 
                    (
                        <Loading />
                    ) :
                    (
                        <div className='flex lg:flex-row flex-col gap-10 lg:items-center items-start'>
                            <div className='relative lg:w-1/2 w-full rounded-md overflow-hidden'>
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
                            <div className='flex lg:w-1/2 w-full flex-col'>
                                <p className='text-3xl font-bold mb-3 text-primary' >
                                    Detail Product
                                </p>
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

                    )
                }
             </div>
            </div>
        </Layout>
    )
}
