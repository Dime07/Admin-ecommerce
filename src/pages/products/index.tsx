import React, { useEffect, useState } from 'react'
import Layout from '@/Components/Layouts/Layout'
import { SearchNormal1 } from 'iconsax-react'
import axios from 'axios'
import Link from 'next/link'

import DataTable from 'react-data-table-component';

export default function Products() {  
  useEffect(() => {
    getDataProduct()  
  }, [])
  
  const [products, setProducts] = useState<any>([])
  const [filteredProducts, setFilteredProducts] = useState<any>([])
  const [filterBrand, setFilterBrand] = useState<any>([])
  const [filterPriceRange, setFilterPriceRange] = useState<any>([])
  const [filterCategory, setFilterCategory] = useState<any>([])

  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedPrice, setSelectedPrice] = useState({
    min: 0,
    max: 0
  })
  const [selectedCategory, setSelectedCategory] = useState('')
  
  const getDataProduct =async () => {
    await axios
      .get('https://dummyjson.com/products?limit=50')
      .then((res) => {
        switch(res.status) {
          case 200:
            const data = res.data
            setProducts(data.products)
            getFilterData(data.products)
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        alert(err.response.status)
      })
    
  }

  const columns = [
    {
        name: 'Products Name',
        selector: (row:any) => row.title,
        sortable: true
    },
    {
        name: 'Stock',
        selector: (row:any) => row.stock,
        sortable: true
    },
    {
        name: 'Price ($)',
        selector: (row:any) => row.price,
        sortable: true
    },
    {
        name: 'Category',
        selector: (row:any) => row.category,
        sortable: true
    },
    {
        name: 'Action',
        cell: (data: any) => <Link href={`/products/detail/${data.id}`} className='bg-blue-400 text-white rounded-md py-1 px-2'>Detail</Link>,
        ignoreRowClick: true,
    },
  ];

  const searchProduct = (e : any) => {
    console.log(`https://dummyjson.com/products?q=${e.target.value}`)
    axios
      .get(`https://dummyjson.com/products/search?q=${e.target.value}&limit=100`)
      .then((res) => {
        console.log(res.data)
        switch(res.status) {
          case 200:
            const data = res.data
            setProducts(data.products)
            break;
          default:
            break;
        }
      })
      .catch((err) => {
        alert(err.response.status)
      })
  }

  const getFilterData = (data: any) => {
    const brands = data.map((item:any) => item.brand) 
    let allBrands = Array.from(new Set(brands))
    setFilterBrand(allBrands)

    const price = data.map((item:any) => item.price)
    let allPrice:number[] = Array.from(new Set(price))
    let priceRange= [
      Math.max(...allPrice) / 2,
      Math.max(...allPrice)
    ]
    setFilterPriceRange(priceRange)

    const category = data.map((item:any) => item.category) 
    let allCategory = Array.from(new Set(category))
    setFilterCategory(allCategory)
  }

  const filterDataByBrand = (e:any) => {
    setSelectedBrand(e.target.value)
    filterData(e.target.value, selectedCategory, selectedPrice.min, selectedPrice.max)
  }

  const filterDataByCategory = (e:any) => {
    setSelectedCategory(e.target.value)
    filterData(selectedBrand, e.target.value, selectedPrice.min, selectedPrice.max)
  }

  const filterDataByPrice = (e:any) => {
    if(parseFloat(e.target.value) === filterPriceRange[0]){
      setSelectedPrice({...selectedPrice, min: 0, max: parseFloat(e.target.value)})
      filterData(selectedBrand, e.target.value, 0, e.target.value)
    }else{
      setSelectedPrice({...selectedPrice, min: filterPriceRange[0], max: parseFloat(e.target.value)})
      filterData(selectedBrand, e.target.value, filterPriceRange[0], e.target.value)
    }
  }


  const filterData = (brand: string, category:string, min:number, max:number) => {
    const results:any[] = products.filter((item : any) => {
      if(max === 0){
        return (item.brand === brand || item.category === category) || (item.price >= min && item.price <= max)
      }else{
        return item.brand === brand || item.category === category
      }
    })

    setFilteredProducts(results)
  }

  const resetFilter = () => {
    // const brandDropdown:HTMLElement = document.getElementById('brand-dropdown')
    // const priceDropdown = document.getElementById('price-dropdown')
    // const categoryDropdown = document.getElementById('category-dropdown')

    setFilteredProducts([])
    // brandDropdown?.selectedIndex = 0
    // priceDropdown?.selectedIndex = 0
    // categoryDropdown?.selectedIndex = 0
  }
  
  return (
    <Layout title='Admin | Products'>
        <div className='p-8'>
          <div className='py-5 px-4 rounded-md bg-white'>
            <p className='text-gray-600 font-semibold text-xl'>
              Product
            </p>
            <div className='flex justify-between items-end mt-3'>
              <div>
                <div className='flex justify-between mb-2 items-center'>
                  <p className='text-sm text-gray-400'>
                    Filter by :
                  </p>
                  <button onClick={resetFilter} className='text-sm p-1 bg-primary text-white rounded-sm'>Clear Filter</button>
                </div>
                <div className='flex gap-2'>
                  <select name="brand" id="brand-dropdown" className='w-full py-1 px-2 rounded-md focus:outline-none border-[0.5px] border-gray-400' onChange={(e) => filterDataByBrand(e)}>
                    <option value='' hidden>Brand</option>
                    {filterBrand.map((item:string) => (
                      <option value={item}>{item}</option>
                    ))}
                  </select>
                  <select name="price_range" id="price-dropdown" className='w-full py-1 px-2 rounded-md focus:outline-none border-[0.5px] border-gray-400' onChange={(e) => filterDataByPrice(e)}>
                    <option value='' hidden>Price Range</option>
                      <option value={filterPriceRange[0]}>$0 to ${filterPriceRange[0]}</option>
                      <option value={filterPriceRange[1]}>${filterPriceRange[0]} to ${filterPriceRange[1]}</option>
                  </select>
                  <select name="category" id="category-dropdown" className='w-full py-1 px-2 rounded-md focus:outline-none border-[0.5px] border-gray-400' onChange={(e) => filterDataByCategory(e)}>
                    <option value='' hidden>Category</option>
                    {filterCategory.map((item:string) => (
                      <option value={item}>{item}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='border-gray-200 flex border-solid border-[0.5px] w-1/3 rounded-md py-2 px-3 mt-2'>
                <SearchNormal1 size={24} color={'#727272'} />
                <input type="text" name="search" id="search" placeholder='Search Product...' className='ml-2 focus:outline-none' onChange={(e) => searchProduct(e)}/>
              </div>
            </div>
            <div className='mt-5'>
              <DataTable
                  columns={columns}
                  data={filteredProducts.length > 0 ? filteredProducts : products}
                  pagination
              />
            </div>
          </div>
        </div>
    </Layout>
  )
}
