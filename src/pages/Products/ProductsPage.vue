<template>
  <list-table
      title="Products"
      create-page-url="ProductsCreate"
      :columns="columns"
      :rows="rows"
  />
</template>

<script setup>
import ListTable from "components/Common/ListTable.vue"

const columns = [
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  { name: 'price', label: 'Price', field: 'price', align: 'right' },
  { name: 'category', label: 'Category', field: 'category', align: 'left' }
]

const rows = [
  { id: 1, name: 'Shoes', price: '1200', category: 'Footwear' },
  { id: 2, name: 'T-shirt', price: '800', category: 'Clothing' }
]
</script>
