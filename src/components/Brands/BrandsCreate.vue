<template>
  <div class="tw-space-y-6 tw-p-6 tw-bg-gray-50 tw-min-h-screen">
    <div class="tw-text-2xl tw-font-semibold tw-text-gray-800">
      Brand Information
    </div>

    <div class="tw-bg-white tw-shadow-md tw-rounded tw-p-6 tw-space-y-6">

      <div>
        <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Brand Name</label>
        <q-input
            v-model="formData.name"
            placeholder="Enter brand name"
            outlined
            class="tw-w-full"
        >
          <template #prepend>
            <q-icon name="mdi-tag" color="primary"/>
          </template>
        </q-input>
      </div>

      <div>
        <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Brand Slug</label>
        <q-input
            v-model="formData.slug"
            placeholder="auto-generated or enter manually"
            outlined
            class="tw-w-full"
            @input="isSlugEditable = true"
            :disable="!!formData.id"
        >
          <template #prepend>
            <q-icon name="mdi-link" color="primary"/>
          </template>
          <template #hint v-if="formData.id">
            Slug cannot be changed after creation
          </template>
        </q-input>
      </div>

      <div>
        <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Brand Description</label>
        <q-input
            v-model="formData.description"
            type="textarea"
            placeholder="Write a short description about the brand..."
            outlined
            class="tw-w-full"
            rows="4"
        >
          <template #prepend>
            <q-icon name="mdi-text" color="primary"/>
          </template>
        </q-input>
      </div>

      <div class="tw-flex tw-items-center tw-gap-3">
        <q-toggle
            v-model="formData.status"
            :true-value="1"
            :false-value="0"
            label="Active"
        />
      </div>

      <div>
        <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-2">
          Brand Logo
        </label>

        <div v-if="imagePreview" class="tw-relative tw-inline-block tw-group">
          <img
              :src="imagePreview"
              alt="Brand Logo Preview"
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
            class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-h-[220px] tw-border-2 tw-border-dashed tw-border-blue-400 tw-rounded-xl tw-cursor-pointer tw-transition tw-duration-200 hover:tw-bg-blue-50"
            @click="triggerFileSelect"
        >
          <q-icon name="mdi-cloud-upload" size="50px" color="blue"/>
          <p class="tw-text-gray-600 tw-mt-2 tw-text-sm tw-text-center">
            Drop your brand logo here or
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

      <div class="tw-flex tw-justify-end tw-pt-4">
        <q-btn
            color="primary"
            :label="formData.id ? 'Update' : 'Save'"
            icon="mdi-content-save"
            unelevated
            class="tw-px-6"
            @click="submitData"
            :loading="isLoading"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {useBrandStore} from "stores/brandStore.js";
import {useQuasar} from "quasar";
import {useRoute, useRouter} from "vue-router";

const brandStore = useBrandStore()
const $q = useQuasar()
const router = useRouter()
const route = useRoute()

const formData = ref({
  name: "",
  slug: "",
  description: "",
  status: 1,
  image: null,
});

const fileInput = ref(null);
const imagePreview = ref(null);
const isSlugEditable = ref(false);
const isLoading = ref(false);

const triggerFileSelect = () => {
  fileInput.value?.click();
};

const onFileSelect = (e) => {
  const file = e.target.files[0];
  if (file) {
    formData.value.image = file;

    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreview.value = event.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = () => {
  formData.value.image = null;
  imagePreview.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const validateFormData = () => {
  if (!formData.value.name) {
    $q.notify({
      message: 'Brand Name is required',
      color: 'negative'
    })
    return false;
  }
  return true;
}

const generateSlug = (name) => {
  return name.toLowerCase().trim().replace(/[\s\W-]+/g, "-");
}

const submitData = async () => {
  if (!validateFormData()) return;

  const payload = new FormData();
  payload.append("name", formData.value.name || "");
  payload.append("slug", formData.value.slug || "");
  payload.append("description", formData.value.description || "");
  payload.append("status", formData.value.status != null ? formData.value.status : 0);

  if (formData.value.image) {
    payload.append("image", formData.value.image);
  }

  if (formData.value.id) {
    await updateItem(payload);
    return;
  }

  isLoading.value = true;
  try {
    await brandStore.submitBrandData(payload);

    // Reset form
    formData.value = {
      name: "",
      slug: "",
      description: "",
      status: 1,
      image: null,
    };
    imagePreview.value = null;
    isSlugEditable.value = false;

    $q.notify({
      message: 'Brand created successfully!',
      color: 'positive',
    });

    router.push('/brands');

  } catch (error) {
    $q.notify({
      message: error || 'Failed to create brand',
      color: 'negative',
    });
  } finally {
    isLoading.value = false;
  }
}

const itemId = computed(() => route.params.id)

const fetchItemDetails = async () => {
  try {
    const {data} = await brandStore.fetchBrandsById(itemId.value);
    if (data) {
      formData.value = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description,
        status: data.status,
        image: null
      }
      imagePreview.value = data.media?.url || null;
    }
  }
  catch (error) {
    console.error(error)
    $q.notify({
      message: error || 'Failed to fetch brand details',
      color: 'negative',
    });
  }
}

const updateItem = async (payload) => {
  isLoading.value = true;
  try {
    await brandStore.updateItem(itemId.value, payload);

    $q.notify({
      message: 'Brand updated successfully!',
      color: 'positive'
    });

    router.push('/brands');
  }
  catch (error) {
    console.error(error)
    $q.notify({
      message: error || 'Failed to update brand',
      color: 'negative',
    });
  } finally {
    isLoading.value = false;
  }
}

watch(() => formData.value.name,
    (newVal) => {
      if (!isSlugEditable.value && !formData.value.id) {
        formData.value.slug = generateSlug(newVal);
      }
    }
)

onMounted(() => {
  if (itemId.value) {
    fetchItemDetails()
  }
})
</script>