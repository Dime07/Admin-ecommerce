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
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const idProduct:number = parseInt(id as string)
        setIsLoading(true)

        if(id as string === undefined){
            const idLocal = localStorage.getItem('cartId')
            const idProduct:number = parseInt(idLocal as string)
            Promise.all([
                getDetailProduct(idProduct)
            ]).then(() => setIsLoading(false))
        }else{
            localStorage.setItem('cartId', id as string)
            const idProduct:number = parseInt(id as string)
            Promise.all([
                getDetailProduct(idProduct)
            ]).then(() => setIsLoading(false))
        }
    }, [])
    
    const getDetailProduct = (id: number) => {
        return new Promise<void>(async (resolve) => {
            axios
                .get(`https://dummyjson.com/products/${id}`)
                .then((res) => {
                    switch (res.status) {
                        case 200:
                            const data = res.data
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
            <div className='lg:p-8 p-3'>
             <div className='lg:py-5 lg:px-4 p-2 rounded-md bg-white'>
                {isLoading ? 
                    (
                        <Loading />
                    ) :
                    (
                        <div className='flex lg:flex-row flex-col gap-10 lg:items-center items-start'>
                            <div className='lg:w-1/2 w-full'>
                                <div className='relative w-full rounded-md overflow-hidden'>
                                    <div>
                                        <div className='absolute left-0 top-0 bg-secondary p-3 rounded-br-lg'>
                                            <p className='text-white font-bold text-lg'>
                                                $ {product?.price}
                                            </p>
                                        </div>
                                    </div>
                                    {product !== undefined && (
                                        <div className='w-full h-[400px] border-[0.5px]'>
                                            <Image src={product.images[currentIndex]} className='transition-all ease-in-out' alt={`${product?.title} Photo`} width={500} height={500} style={{ objectFit: 'cover', width: '100%', height: '100%' }} priority/>
                                        </div>
                                    )}
                                </div>
                                <div className='w-full flex flex-row justify-between gap-2 h-[100px] mt-2'>
                                    {product?.images.map((item:any, index:number) => (
                                        <div className={`w-1/4 h-full rounded-md overflow-hidden border-[0.5px] hover:brightness-50 ${currentIndex === index ? 'border-primary border-[3px]' : ''} transition-all duration-500 ease-in-out`} key={index} onClick={() => setCurrentIndex(index)}>
                                            <Image src={item} alt={`${product?.title} Photo`} width={500} height={500} style={{ objectFit: 'cover', width: '100%', height: '100%' }} loading="lazy"/>
                                        </div>
                                    ))}
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
