import React from 'react'
import Head from 'next/head'
import Layout from '@/Components/Layouts/Layout'
import { useEffect, useState } from 'react'
import axios, { all } from 'axios'
import { Bag2, ShoppingCart } from 'iconsax-react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Loading from '@/Components/Loading/loading'
import { resolve } from 'path'


export default function Dashboard() {

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getDataProduct = () => {
      return new Promise<void>(async (resolve) => {
         await axios
          .get('https://dummyjson.com/products?limit=50')
          .then((res) => {
            switch(res.status) {
              case 200:
                const data = res.data
                setProducts(data.products)
                Promise.all([
                  calculateTotalItemBrand(data.products)
                ]).then(() => resolve())
                break;
              default:
                break;
            }
          })
          .catch((err) => {
            alert(err.response.status)
          })
      })
    }

    const getDataCart = () => {
      return new Promise<void>(async (resolve) => {
        await axios
        .get('https://dummyjson.com/carts')
        .then((res) => {
          console.log(res.data)
          switch(res.status) {
            case 200:
              const data = res.data
              setCarts(data.carts)
              resolve()
              break;
            default:
              break;
          }
        })
        .catch((err) => {
          alert(err.response.status)
        })
      })
    }
    setIsLoading(true)
    Promise.all([
      getDataProduct(),
      getDataCart()
    ]).then(() => setIsLoading(false))
  }, [])

  const [products, setProducts] = useState([])
  const [carts, setCarts] = useState([])
  const [brands, setBrands] = useState<String[]>([])
  const [totalItem, setTotalItem] = useState<Number[]>([])

  const calculateTotalItemBrand = (data : any) => {
    return new Promise<void>(resolve => {
      let brands:String[] = []
      let totalItem:Number[] = []
      
      data.map((item : any) => {
        brands.push(item.brand)
      })
  
      let allBrands:String[] = Array.from(new Set(brands))
  
      for(let i = 0; i <= allBrands.length - 1; i++){
        let total = 0
        for(let j = 0; j <= brands.length - 1; j++){
          allBrands[i] == brands[j] ? total += 1 : total = total
          console.log( allBrands[i], brands[j])
        }
        totalItem.push(total)
      }
  
      setTotalItem(totalItem)
      setBrands(allBrands)
      resolve()
    })

  }

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const data = {
    labels: brands,
    datasets: [{
      label: 'Brand',
      data: totalItem,
      backgroundColor: [
        '#7CCF8D',
      ],
      borderRadius: 6
    }]
  }

  return (
    <Layout title='Admin | Ecommerce' >
      <div className='p-8'>
        <h2 className='text-gray-600 font-semibold text-xl mb-7'>
          Dashboards
        </h2>
        {isLoading ? 
          (
            <Loading />
          ) :
          (
            <>
              <div className='flex lg:flex-row flex-col justify-start gap-4 mb-4'>
                <div className='lg:w-1/3 w-full py-5 px-4 rounded-md bg-white flex align-middle items-center shadow-sm'>
                  <Bag2 size={38} color='#61CA77' variant='Bold' />
                  <div className='ml-2'>
                      <p className='text-sm font-medium text-gray-400'>
                        Total Products
                      </p>
                      <p className='text-2xl font-bold text-primary'>
                        {products.length}
                      </p>
                  </div>
                </div>
                <div className='lg:w-1/3 w-full py-5 px-4 rounded-md bg-white flex align-middle items-center shadow-sm'>
                  <ShoppingCart size={38} color='#61CA77' variant='Bold' />
                  <div className='ml-2'>
                      <p className='text-sm font-medium text-gray-400'>
                        Total Carts
                      </p>
                      <p className='text-2xl font-bold text-primary'>
                        {carts.length}
                      </p>
                  </div>
                </div>
              </div>
              <div className='w-full py-5 px-4 rounded-md bg-white h-80'>
                <Bar
                  data={data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </>
          )
        }
      </div>
    </Layout>
  )
}
