<template>
  <list-table
      title="Categories"
      create-page-url="CategoriesCreate"
      edit-page-url="CategoriesEdit"
      :rows="categories"
      :columns="columns"
      :computed-columns="[{name: 'status'},{name: 'media'}]"
      :loading="loading"
      @delete_item="deleteCategory"
  >
    <template #body-cell-status="props">
      <q-td :props="props">
        <q-badge
            :color="props.row.status ? 'positive' : 'negative'"
            :label="props.row.status ? 'Active' : 'Inactive'"
            rounded
            class="tw-px-4 tw-py-1.5 tw-font-medium"
        />
      </q-td>
    </template>

    <template #body-cell-media="props">
      <q-td :props="props">
        <div class="tw-flex tw-justify-center">
          <q-avatar size="60px" rounded>
            <q-img
                :src="props.row?.media?.url || '/placeholder-image.png'"
                height="60px"
                width="60px"
                class="tw-object-cover"
                :ratio="1"
            >
              <template v-slot:error>
                <div class="tw-flex tw-items-center tw-justify-center tw-h-full tw-bg-gray-100">
                  <q-icon name="mdi-image-off" size="24px" color="grey-5" />
                </div>
              </template>
              <template v-slot:loading>
                <q-spinner color="primary" size="20px" />
              </template>
            </q-img>
          </q-avatar>
        </div>
      </q-td>
    </template>
  </list-table>
</template>

<script setup>
import ListTable from "components/Common/ListTable.vue";
import {useCategoryStore} from "stores/categoryStore.js";
import {onMounted, ref} from 'vue';
import {storeToRefs} from "pinia";
import {useQuasar} from "quasar";

const CategoryStore = useCategoryStore();
const {fetchCategories, deleteItem} = CategoryStore
const {categories} = storeToRefs(CategoryStore)
const $q = useQuasar()
const loading = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    await fetchCategories()
  } finally {
    loading.value = false
  }
})

const columns = ref([
  {
    name: 'index',
    label: 'S.N.',
    field: 'index',
    sortable: true,
    align: 'center',
    style: 'width: 80px'
  },
  {
    name: 'media',
    label: 'Image',
    field: 'media',
    sortable: false,
    align: 'center',
    style: 'width: 100px'
  },
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    sortable: true,
    align: 'left'
  },
  {
    name: 'slug',
    label: 'Slug',
    field: 'slug',
    sortable: true,
    align: 'left',
  },
  {
    name: 'description',
    label: 'Description',
    field: 'description',
    sortable: true,
    align: 'left'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status',
    sortable: true,
    align: 'center',
    style: 'width: 120px'
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    sortable: false,
    align: 'center',
  },
])

const deleteCategory = async (id) => {
  try {
    $q.dialog({
      title: 'Delete Category',
      message: 'Are you sure you want to delete this Category? This action cannot be undone.',
      cancel: {
        label: 'Cancel',
        color: 'grey-7',
        flat: true
      },
      ok: {
        label: 'Delete',
        color: 'negative',
        unelevated: true
      },
      persistent: true,
    }).onOk(async () => {
      loading.value = true
      try {
        await deleteItem(id)
        await fetchCategories()
        $q.notify({
          message: 'Category deleted successfully',
          color: 'positive',
          icon: 'mdi-check-circle',
          position: 'top'
        })
      } catch (error) {
        $q.notify({
          message: error?.message || 'Failed to delete Category',
          color: 'negative',
          icon: 'mdi-alert-circle',
          position: 'top'
        })
      } finally {
        loading.value = false
      }
    })
  } catch (e) {
    $q.notify({
      message: e?.message || 'An error occurred',
      color: 'negative',
      icon: 'mdi-alert-circle',
      position: 'top'
    })
  }
}
</script>