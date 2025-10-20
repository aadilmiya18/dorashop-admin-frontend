<template>
  <div class="tw-space-y-6 tw-p-6 tw-bg-gray-50 tw-min-h-screen">
    <div class="tw-text-2xl tw-font-semibold tw-text-gray-800">
      Category Information
    </div>

    <div class="tw-bg-white tw-shadow-md tw-rounded tw-p-6 tw-space-y-6">

      <div>
        <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Category Name</label>
        <q-input
            v-model="formData.name"
            placeholder="Enter Category name"
            outlined
            class="tw-w-full"
        >
          <template #prepend>
            <q-icon name="mdi-tag" color="primary"/>
          </template>
        </q-input>
      </div>

      <div>
        <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Category Slug</label>
        <q-input
            v-model="formData.slug"
            placeholder="auto-generated or enter manually"
            outlined
            class="tw-w-full"
            @input="isSlugEditable = true"
            :disable="formData.id ? true : false"
        >
          <template #prepend>
            <q-icon name="mdi-link" color="primary"/>
          </template>
        </q-input>
      </div>

      <div>
        <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-1">Category Description</label>
        <q-input
            v-model="formData.description"
            type="textarea"
            placeholder="Write a short description about the Category..."
            outlined
            class="tw-w-full"
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
            color="green"
            label="Active"
        />
      </div>

      <div>
        <label class="tw-text-gray-700 tw-font-medium tw-block tw-mb-2">
          Category Image
        </label>

        <div v-if="imagePreview" class="tw-relative tw-inline-block tw-group">
          <img
              :src="imagePreview"
              alt="Category Image Preview"
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
            Drop your Category Image here or
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
            label="Save"
            icon="mdi-content-save"
            unelevated
            class="tw-px-6"
            @click="submitData"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, watch} from "vue";
import {useCategoryStore} from "stores/categoryStore.js";
import {useQuasar} from "quasar";

const categoryStore = useCategoryStore();
const $q = useQuasar()

const formData = ref({
  name: "",
  slug: "",
  description: "",
  status: 1,
  image: null,
});

const fileInput = ref(null);
const imagePreview = ref(null);

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
  fileInput.value.value = "";
};

const validateFormData = () => {
  if (!formData.value.name) {
    $q.notify({
      message: 'Category Name is required',
      color: 'negative'
    })
    return false;
  }
  return true;
}

const submitData = async () => {
  if (!validateFormData()) return;

  const payload = new FormData();
  payload.append("name", formData.value.name);
  payload.append("slug", formData.value.slug)
  payload.append("description", formData.value.description)
  payload.append("status", formData.value.status)
  if (formData.value.image) payload.append("image", formData.value.image)

  try {
    await categoryStore.submitCategoryData(payload);
    formData.value = {
      name: "",
      slug: "",
      description: "",
      status: 1,
      image: null,
    };
    imagePreview.value = null;

    $q.notify({
      message: 'Category created successfully!',
      color: 'positive',
    });
  } catch (error) {
    $q.notify({
      message: error,
      color: 'negative',
    });

  }
}

const isSlugEditable = ref(false);

const generateSlug = (name) => {
  return name.toLowerCase().trim().replace(/[\s\W-]+/g, "-");
}

watch(() => formData.value.name,
    (newVal) => {
      if (!isSlugEditable.value && !formData.value.id) {
        formData.value.slug = generateSlug(newVal);
      }
    }
)
</script>
