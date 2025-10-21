<template>
  <div class="tw-space-y-3 tw-p-6">
    <div class="tw-text-2xl tw-font-semibold tw-text-gray-800 tw-ml-2">
      {{ formData.id ? 'Edit Product' : 'Add Product' }}
    </div>

    <div class="tw-flex tw-justify-between tw-gap-4">
      <!-- Left Column -->
      <div class="tw-bg-white tw-w-full tw-rounded tw-shadow-sm tw-p-6 tw-space-y-5">
        <div>
          <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Product name</label>
          <q-input
              v-model="formData.name"
              placeholder="Enter product name"
              outlined
              class="tw-w-full"
          />
        </div>

        <div>
          <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Slug</label>
          <q-input
              v-model="formData.slug"
              placeholder="Enter product slug"
              outlined
              class="tw-w-full"
              @input="isSlugEditable = true"
              :disable="formData.id ? true : false"
          />
        </div>

        <div class="tw-flex tw-items-center tw-justify-between tw-gap-4">
          <div class="tw-w-full">
            <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Category</label>
            <category-select
                v-model="formData.category_id"
                @update:model-value="val => formData.category_id = val"
            />
          </div>

          <div class="tw-w-full">
            <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Brand</label>
            <brand-select
                v-model="formData.brand_id"
                @update:model-value="val => formData.brand_id = val"
            />
          </div>
        </div>

        <div>
          <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Short Description</label>
          <q-input
              v-model="formData.short_description"
              placeholder="Enter Short Description"
              type="textarea"
              outlined
          />
        </div>

        <div>
          <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Description</label>
          <q-input
              v-model="formData.description"
              placeholder="Enter Description"
              type="textarea"
              outlined
              rows="7"
          />
        </div>
      </div>

      <!-- Right Column -->
      <div class="tw-bg-white tw-pb-24 tw-w-full tw-rounded tw-shadow-sm tw-p-6 tw-space-y-5">
        <div>
          <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-2">
            Upload Image
          </label>

          <div v-if="imagePreview" class="tw-relative tw-inline-block tw-group">
            <img
                :src="imagePreview"
                class="tw-w-40 tw-h-40 tw-object-cover tw-rounded-xl tw-border tw-border-gray-200"
            />
            <q-btn
                round
                dense
                color="red"
                icon="mdi-close"
                size="sm"
                class="tw-absolute tw-top-1 tw-right-1 tw-opacity-0 group-hover:tw-opacity-100 tw-transition"
                @click.stop="removeImage"
            />
          </div>

          <div
              v-else
              class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-[170px] tw-border-2 tw-border-dashed tw-border-blue-400 tw-rounded-xl tw-cursor-pointer tw-transition tw-duration-200 hover:tw-bg-blue-50"
              @click="triggerFileSelect"
          >
            <q-icon name="mdi-cloud-upload" size="50px" color="blue"/>
            <p class="tw-text-gray-600 tw-mt-2 tw-text-sm tw-text-center">
              Drop your Image here or
              <span class="tw-text-blue-500 tw-font-semibold"> click to browse </span>
            </p>
            <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="tw-hidden"
                @change="onFileSelect"
            />
          </div>
        </div>

        <div>
          <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-2">
            Upload Gallery Images
          </label>


          <div v-if="galleryPreviews?.length > 0" class="tw-flex tw-flex-wrap tw-gap-2 tw-mb-2">
            <div v-for="(preview, index) in galleryPreviews" :key="index" class="tw-relative tw-inline-block tw-group">
              <img
                  :src="preview"
                  class="tw-w-32 tw-h-32 tw-object-cover tw-rounded-xl tw-border tw-border-gray-200"
              />
              <q-btn
                  round
                  dense
                  color="red"
                  icon="mdi-close"
                  size="sm"
                  class="tw-absolute tw-top-1 tw-right-1 tw-opacity-0 group-hover:tw-opacity-100 tw-transition"
                  @click.stop="removeGalleryImage(index)"
              />
            </div>
          </div>

          <div
              class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-[170px] tw-border-2 tw-border-dashed tw-border-blue-400 tw-rounded-xl tw-cursor-pointer tw-transition tw-duration-200 hover:tw-bg-blue-50"
              @click="triggerGallerySelect"
          >
            <q-icon name="mdi-cloud-upload" size="50px" color="blue"/>
            <p class="tw-text-gray-600 tw-mt-2 tw-text-sm tw-text-center">
              Drop your Images here or
              <span class="tw-text-blue-500 tw-font-semibold"> click to browse </span>
            </p>
            <input
                ref="galleryInput"
                type="file"
                accept="image/*"
                multiple
                class="tw-hidden"
                @change="onGallerySelect"
            />
          </div>
        </div>

        <div class="tw-flex tw-gap-4 tw-justify-between">
          <div class="tw-w-full">
            <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Price</label>
            <q-input
                v-model="formData.price"
                placeholder="Enter Price"
                outlined
                type="number"
            />
          </div>
          <div class="tw-w-full">
            <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Discount Price</label>
            <q-input
                v-model="formData.discount_price"
                placeholder="Enter Discount Price"
                outlined
                type="number"
            />
          </div>
        </div>

        <div class="tw-flex tw-gap-4 tw-justify-between">
          <div class="tw-w-full">
            <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">SKU</label>
            <q-input
                v-model="formData.sku"
                placeholder="Enter SKU"
                outlined
            />
          </div>
          <div class="tw-w-full">
            <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Stock</label>
            <q-input
                v-model="formData.stock"
                placeholder="Enter Stock"
                outlined
                type="number"
            />
          </div>
        </div>

        <div class="tw-flex tw-gap-4 tw-justify-between">
          <div class="tw-w-full">
            <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Featured</label>
            <q-select
                v-model="formData.is_featured"
                outlined
                :options="[
                    {label: 'Yes', value: 1},
                    {label: 'No', value: 0},
                ]"
                option-value="value"
                option-label="label"
                emit-value
                map-options
            />
          </div>

          <div class="tw-w-full">
            <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Status</label>
            <q-select
                v-model="formData.status"
                outlined
                :options="[
                                {label: 'Active', value: 1},
                                {label: 'Inactive', value: 0},
                            ]"
                option-value="value"
                option-label="label"
                emit-value
                map-options
            />
          </div>
        </div>

        <div
            class="tw-fixed tw-bottom-0 tw-left-0 tw-w-full tw-bg-white tw-border-t tw-border-gray-200 tw-shadow-md tw-px-6 tw-py-5 tw-flex tw-justify-end tw-gap-4 tw-z-50"
        >
          <q-btn
              label="Cancel"
              color="grey"
              outline
              class="tw-px-6"
              @click="router.back()"
              :disable="isLoading"
          />
          <q-btn
              :label="formData.id ? 'Update' : 'Save'"
              color="primary"
              class="tw-px-6"
              :loading="isLoading"
              @click="submitForm"
          />
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useQuasar} from "quasar";
import {useRoute, useRouter} from "vue-router";
import CategorySelect from "components/SelectComponents/CategorySelect.vue";
import BrandSelect from "components/SelectComponents/BrandSelect.vue";
import {useProductStore} from "stores/productStore.js";

const $q = useQuasar()
const router = useRouter()
const route = useRoute()
const productStore = useProductStore();

const formData = ref({
  name: '',
  slug: '',
  category_id: null,
  brand_id: null,
  short_description: '',
  description: '',
  image: null,
  gallery: [],
  price: '',
  discount_price: '',
  sku: '',
  stock: 0,
  is_featured: 1,
  status: 1,
});

const fileInput = ref(null);
const imagePreview = ref(null);
const galleryInput = ref(null);
const galleryPreviews = ref([]);
const isLoading = ref(false);
const isSlugEditable = ref(false);

// Track if images have been changed
const imageChanged = ref(false);
const galleryChanged = ref(false);


const triggerFileSelect = () => {
  fileInput.value?.click();
};

const triggerGallerySelect = () => {
  galleryInput.value?.click();
};

const onFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    formData.value.image = file;
    imageChanged.value = true;
    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreview.value = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const onGallerySelect = (e) => {
  const files = Array.from(e.target.files);
  files.forEach(file => {
    formData.value.gallery.push(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      galleryPreviews.value.push(event.target.result);
    };
    reader.readAsDataURL(file);
  });

  if (files.length > 0) {
    galleryChanged.value = true;
  }
};

const removeImage = () => {
  formData.value.image = null;
  imagePreview.value = null;
  imageChanged.value = true;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const removeGalleryImage = (index) => {
  formData.value.gallery.splice(index, 1);
  galleryPreviews.value.splice(index, 1);
  galleryChanged.value = true;
};



const validateFormData = () => {
  if (!formData.value.name) {
    $q.notify({
      message: 'Product Name is required',
      color: 'negative'
    })
    return false;
  }
  return true;
}

const generateSlug = (name) => {
  if (!name) return '';
  return name.toLowerCase().trim().replace(/[\s\W-]+/g, "-");
}

watch(() => formData.value.name,
    (newVal) => {
      if (!isSlugEditable.value && !formData.value.id) {
        formData.value.slug = generateSlug(newVal);
      }
    }
)

const submitForm = async () => {
  if (!validateFormData()) return;

  const payload = new FormData();

  Object.keys(formData.value).forEach((key) => {
    if (key !== 'gallery' && key !== 'image') {
      payload.append(key, formData.value[key] ?? '');
    }
  });

  if (imageChanged.value && formData.value.image) {
    payload.append('image', formData.value.image);
  }

  if (galleryChanged.value && formData.value.gallery.length > 0) {
    formData.value.gallery.forEach((file) => {
      payload.append('gallery[]', file);
    });
  }

  if (formData.value.id) {
    await updateItem(payload);
    return;
  }

  isLoading.value = true;

  try {
    await productStore.submitProductData(payload);
    $q.notify({ message: 'Product added successfully', color: 'positive' });
    router.push('/products');
  } catch {
    $q.notify({ message: 'Failed to add product', color: 'negative' });
  } finally {
    isLoading.value = false;
  }
};

const itemId = computed(() => route.params.id)

const fetchItemDetails = async () => {
  try {
    const {data} = await productStore.fetchProductById(itemId.value);
    if (data) {
      formData.value = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        category_id: data.category_id,
        brand_id: data.brand_id,
        short_description: data.short_description,
        description: data.description,
        price: data.price,
        discount_price: data.discount_price,
        sku: data.sku,
        stock: data.stock,
        is_featured: data.is_featured,
        status: data.status,
        image: null,
        gallery: []
      }

      const existingImage = data.media.find((m) => m.type === 'image');
      if (existingImage) {
        imagePreview.value = existingImage.url;
      }

      galleryPreviews.value = data.media
          .filter((m) => m.type === 'gallery')
          .map((m) => m.url);

      imageChanged.value = false;
      galleryChanged.value = false;
    }
  } catch (error) {
    console.error(error)
    $q.notify({
      message: error || 'Failed to fetch product details',
      color: 'negative',
    });
  }
}

const updateItem = async (payload) => {
  isLoading.value = true;
  try {
    await productStore.updateProduct(itemId.value, payload);

    $q.notify({
      message: 'Product updated successfully!',
      color: 'positive'
    });

    router.push('/products');
  } catch (error) {
    console.error(error)
    $q.notify({
      message: error || 'Failed to update product',
      color: 'negative',
    });
  } finally {
    isLoading.value = false;
  }
}


onMounted(() => {
  if (itemId.value) {
    fetchItemDetails()
  }
})
</script>