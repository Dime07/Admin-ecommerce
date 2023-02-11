import React, { useEffect, useState } from 'react'
import Layout from '@/Components/Layouts/Layout'
import { SearchNormal1 } from 'iconsax-react'
import axios from 'axios'
import Link from 'next/link'

import DataTable from 'react-data-table-component';
import Loading from '@/Components/Loading/loading'

export default function Products() {  
  useEffect(() => {
    const getDataProduct =() => {
      return new Promise<void>(async(resolve) => {
        await axios
          .get('https://dummyjson.com/products?limit=50')
          .then((res) => {
            switch(res.status) {
              case 200:
                const data = res.data
                setProducts(data.products)
                Promise.all([
                  getFilterData(data.products)
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
      getDataLocal(),
      getDataProduct()  
    ]).then(() => setIsLoading(false))
  }, [])
  
  const [products, setProducts] = useState<any>([])
  const [filteredProducts, setFilteredProducts] = useState<any>([])
  const [filterBrand, setFilterBrand] = useState<any>([])
  const [filterPriceRange, setFilterPriceRange] = useState<any>([])
  const [filterCategory, setFilterCategory] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false)

  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedPrice, setSelectedPrice] = useState({
    min: 0,
    max: 0
  })
  const [selectedCategory, setSelectedCategory] = useState('')


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
    resetFilter()
    axios
      .get(`https://dummyjson.com/products/search?q=${e.target.value}&limit=100`)
      .then((res) => {
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
    return new Promise<void>(resolve=>{
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
      resolve()
    })
  }

  const filterDataByBrand = (e:any) => {
    setSelectedBrand(e.target.value)
    localStorage.setItem('selected_brand', e.target.value)
    filterData(e.target.value, selectedCategory, selectedPrice.min, selectedPrice.max)
  }

  const filterDataByCategory = (e:any) => {
    setSelectedCategory(e.target.value)
    localStorage.setItem('selected_category', e.target.value)
    filterData(selectedBrand, e.target.value, selectedPrice.min, selectedPrice.max)
  }

  const filterDataByPrice = (e:any) => {
    if(parseFloat(e.target.value) === filterPriceRange[0]){
      const data = {...selectedPrice, min: 0, max: parseFloat(e.target.value)}
      setSelectedPrice(data)
      localStorage.setItem('selected_price', JSON.stringify(data) )

      filterData(selectedBrand, e.target.value, 0, e.target.value)
    }else{
      const data = {...selectedPrice, min: filterPriceRange[0], max: parseFloat(e.target.value)}
      setSelectedPrice(data)
      localStorage.setItem('selected_price', JSON.stringify(data) )

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

    localStorage.setItem('filtered_data', JSON.stringify(results))
    setFilteredProducts(results)
  }

  const resetFilter = () => {
    const brandDropdown:any = document.getElementById('brand-dropdown')
    const priceDropdown:any = document.getElementById('price-dropdown')
    const categoryDropdown:any = document.getElementById('category-dropdown')

    localStorage.removeItem('selected_category')
    localStorage.removeItem('selected_brand')
    localStorage.removeItem('selected_price')
    localStorage.removeItem('filtered_data')

    setSelectedBrand('')
    setSelectedCategory('')
    setSelectedPrice({min: 0, max: 0})
    setFilteredProducts([])

    brandDropdown.selectedIndex = 0
    priceDropdown.selectedIndex = 0
    categoryDropdown.selectedIndex = 0
  }
  
  const getDataLocal = () => {
    return new Promise<void>((resolve) => {
      const brandLocal = localStorage.getItem('selected_brand')
      const categoryLocal = localStorage.getItem('selected_category') 
      const priceLocalS = localStorage.getItem('selected_price') 
      const priceLocal = JSON.parse(priceLocalS as string)
      const filterDataS = localStorage.getItem('filtered_data')
      const filterData = JSON.parse(filterDataS as string)

      brandLocal !== null ? setSelectedBrand(brandLocal) : setSelectedBrand('') 
      categoryLocal !== null ? setSelectedCategory(categoryLocal) : setSelectedCategory('') 
      priceLocalS !== null ? setSelectedPrice({min: priceLocal.min, max: priceLocal.max}) : setSelectedPrice({min: 0, max: 0})
      filterDataS !== null ? setFilteredProducts(filterData) : setFilteredProducts([])
      resolve()
    })
  }

  return (
    <Layout title='Admin | Products'>
        <div className='lg:p-8 p-3'>
          <div className='py-5 px-4 rounded-md bg-white'>
            <p className='text-gray-600 font-semibold text-xl'>
              Product
            </p>
            {isLoading ?
              (
                <Loading />
              ) :
              (
                <>
                  <div className='flex lg:flex-row flex-col lg:justify-between justify-start lg:items-end items-start mt-3'>
                    <div className='lg:order-1 order-2'>
                      <div className='flex justify-between mb-2 items-center'>
                        <p className='text-sm text-gray-400'>
                          Filter by :
                        </p>
                        <button onClick={resetFilter} className='text-sm p-1 bg-primary text-white rounded-sm'>Clear Filter</button>
                      </div>
                      <div className='flex gap-2'>
                        <select name="category" id="category-dropdown" className='w-full py-1 px-2 rounded-md focus:outline-none border-[0.5px] border-gray-400' onChange={(e) => filterDataByCategory(e)}>
                          <option value='' hidden>{selectedCategory !== '' ? selectedCategory : 'Category'}</option>
                          {filterCategory.map((item:string, index: number) => (
                            <option value={item} key={index}>{item}</option>
                          ))}
                        </select>
                        <select name="brand" id="brand-dropdown" className='w-full py-1 px-2 rounded-md focus:outline-none border-[0.5px] border-gray-400' onChange={(e) => filterDataByBrand(e)}>
                          <option value='' hidden>{selectedBrand !== '' ? selectedBrand : 'Brand'}</option>
                          {filterBrand.map((item:string, index: number) => (
                            <option value={item} key={index}>{item}</option>
                          ))}
                        </select>
                        <select name="price_range" id="price-dropdown" className='w-full py-1 px-2 rounded-md focus:outline-none border-[0.5px] border-gray-400' onChange={(e) => filterDataByPrice(e)}>
                            <option value='' hidden>{selectedPrice.max !== 0 ? `$${selectedPrice.min} to $${selectedPrice.max}` : 'Price'}</option>
                            <option value={filterPriceRange[0]}>$0 to ${filterPriceRange[0]}</option>
                            <option value={filterPriceRange[1]}>${filterPriceRange[0]} to ${filterPriceRange[1]}</option>
                        </select>
                      </div>
                    </div>
                    <div className='lg:order-2 order-1border-gray-200 flex border-solid border-[0.5px] lg:w-1/3 w-full rounded-md py-2 px-3 mt-2 lg:mb-0 mb-4'>
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
                
                </>
              )
            }
          </div>
        </div>
    </Layout>
  )
}
