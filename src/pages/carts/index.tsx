import React, {useEffect, useState} from 'react'
import Layout from '@/Components/Layouts/Layout'
import axios from 'axios'
import Link from 'next/link'
import DataTable from 'react-data-table-component'
import { MoneyRecive, Box } from 'iconsax-react'
import Loading from '@/Components/Loading/loading'

export default function Carts() {
  const [carts, setCarts] = useState([])
  const [totalIncome, setTotalIncome] = useState<number>()
  const [totalSold , setTotalSold] = useState<number>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getDataCarts =() => {
      return new Promise<void>(async (resolve) => {
        await axios
          .get('https://dummyjson.com/carts?limit=50')
          .then((res) => {
            switch(res.status) {
              case 200:
                const data = res.data
                setCarts(data.carts)
                Promise.all([
                  calculateData(data.carts)
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

    setIsLoading(true)
    Promise.all([
      getDataCarts()  
    ]).then(() => setIsLoading(false))
  }, [])

  const calculateData = (data: any) => {
    return new Promise<void>(resolve => {
      let totalIncome = 0;
      let totalSold = 0
      data.map((item: any) => {
        totalIncome += item.discountedTotal
        totalSold += item.totalQuantity
      })
      setTotalIncome(totalIncome)
      setTotalSold(totalSold)
      resolve()
    })
  }

  const columns = [
    {
        name: 'Order Id',
        selector: (row:any) => `ADMCOMRCE-${row.userId}`,
        sortable: true
    },
    {
        name: 'Quantity',
        selector: (row:any) => row.totalQuantity,
        sortable: true
    },
    {
        name: 'Total Product',
        selector: (row:any) => row.totalProducts,
        sortable: true
    },
    {
        name: 'Total ($)',
        selector: (row:any) => row.total,
        sortable: true
    },
    {
        name: 'Discounted Total ($)',
        selector: (row:any) => row.discountedTotal,
        sortable: true
    },
    {
        name: 'Action',
        cell: (data: any) => <Link href={`/carts/detail/${data.id}`} className='bg-blue-400 text-white rounded-md py-1 px-2'>Detail</Link>,
        ignoreRowClick: true,
    },
  ];

  return (
    <Layout title='Admin | Carts'>
        <div className='p-8'>
          <h2 className='text-gray-600 font-semibold text-xl mb-7'>
            Carts
          </h2>
          {isLoading ?
            (
              <Loading />
            ) :
            (
              <>
                <div className='flex lg:flex-row flex-col justify-start gap-4 mb-4'>
                  <div className='lg:w-1/3 w-full py-5 px-4 rounded-md bg-white flex align-middle items-center shadow-sm'>
                    <MoneyRecive size={38} color='#61CA77' variant='Bold' />
                    <div className='ml-2'>
                        <p className='text-sm font-medium text-gray-400'>
                          Total Income
                        </p>
                        <p className='text-2xl font-bold text-primary'>
                          ${totalIncome}
                        </p>
                    </div>
                  </div>
                  <div className='lg:w-1/3 w-full py-5 px-4 rounded-md bg-white flex align-middle items-center shadow-sm'>
                    <Box size={38} color='#61CA77' variant='Bold' />
                    <div className='ml-2'>
                        <p className='text-sm font-medium text-gray-400'>
                          Total Sold
                        </p>
                        <p className='text-2xl font-bold text-primary'>
                          {totalSold}
                        </p>
                    </div>
                  </div>
                </div>
                <div className='py-5 px-4 rounded-md bg-white'>
                  <DataTable
                      columns={columns}
                      data={carts}
                      pagination
                  />
                </div>
              </>
            )
          }
        </div>
    </Layout>
  )
}
