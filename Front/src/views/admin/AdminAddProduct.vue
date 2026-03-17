<template>
  <AdminLayout>
    <div class="admin-add-product">
      <h1>➕ Добавление товара</h1>

      <!-- Выбор типа -->
      <div class="type-selector">
        <button
          :class="{ active: productType === 'clothing' }"
          @click="productType = 'clothing'">
          👕 Одежда
        </button>
        <button
          :class="{ active: productType === 'shoes' }"
          @click="productType = 'shoes'">
          👟 Обувь
        </button>
      </div>

      <!-- Форма -->
      <form @submit.prevent="submitProduct" class="form">
        <!-- Название -->
        <div class="field">
          <label>Название *</label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Введите название" />
        </div>

        <!-- Цена и категория -->
        <div class="row">
          <div class="field">
            <label>Цена (₽) *</label>
            <input
              v-model.number="form.price"
              type="number"
              min="1"
              required
              placeholder="1990" />
          </div>
          <div class="field">
            <label>Категория *</label>
            <select v-model="form.categoryId" required>
              <option value="">Выберите</option>
              <option
                v-for="cat in allCategories"
                :key="cat.id"
                :value="cat.id">
                {{ cat.name }}
              </option>
            </select>

            <!-- Управление категориями -->
            <div class="category-management">
              <div class="add-category">
                <input
                  v-model="newCategory"
                  type="text"
                  placeholder="Новая категория..."
                  @keyup.enter="addCategory" />
                <button type="button" @click="addCategory">+ Добавить</button>
              </div>

              <!-- Список категорий с удалением -->
              <div v-if="customCategories.length" class="custom-cats-list">
                <p class="cats-label">
                  Ваши категории (нажмите ✕ чтобы удалить):
                </p>
                <div class="cat-tags">
                  <span
                    v-for="cat in customCategories.filter(
                      (c) => c.type === productType,
                    )"
                    :key="cat.id"
                    class="cat-tag">
                    {{ cat.name }}
                    <button
                      type="button"
                      class="delete-cat"
                      @click="confirmDeleteCategory(cat)">
                      ✕
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Для обуви: бренд и модель -->
        <div class="row" v-if="productType === 'shoes'">
          <div class="field">
            <label>Бренд *</label>
            <input
              v-model="form.brand"
              type="text"
              required
              placeholder="Nike, Adidas..." />
          </div>
          <div class="field">
            <label>Модель</label>
            <input v-model="form.model" type="text" placeholder="Air Force 1" />
          </div>
        </div>

        <!-- Описание -->
        <div class="field">
          <label>Описание</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Описание товара..."></textarea>
        </div>

        <!-- Поля для одежды -->
        <template v-if="productType === 'clothing'">
          <div class="row">
            <div class="field">
              <label>Состав</label>
              <input
                v-model="form.material"
                type="text"
                placeholder="100% хлопок" />
            </div>
            <div class="field">
              <label>Сезон</label>
              <select v-model="form.season">
                <option value="">Не указан</option>
                <option>Лето</option>
                <option>Зима</option>
                <option>Весна/Осень</option>
                <option>Всесезон</option>
              </select>
            </div>
          </div>

          <!-- РОСТ -->
          <div class="field height-section">
            <label>Рекомендуемый рост</label>
            <div class="height-options">
              <label v-for="h in heightOptions" :key="h" class="height-tag">
                <input type="checkbox" :value="h" v-model="selectedHeights" />
                <span>{{ h }}</span>
              </label>
            </div>
            <div class="height-custom">
              <input
                v-model="customHeight"
                type="text"
                placeholder="Или введите вручную, например: 150-160"
                @keyup.enter="addCustomHeight" />
              <button type="button" @click="addCustomHeight">Добавить</button>
            </div>
            <div v-if="allHeights.length" class="selected-heights">
              <span v-for="(h, i) in allHeights" :key="i" class="height-badge">
                {{ h }}
                <button type="button" @click="removeHeight(i)">✕</button>
              </span>
              <button
                type="button"
                class="clear-heights"
                @click="clearAllHeights">
                Очистить все
              </button>
            </div>
          </div>
        </template>

        <!-- Поля для обуви -->
        <template v-if="productType === 'shoes'">
          <div class="row">
            <div class="field">
              <label>Материал верха</label>
              <input
                v-model="form.upperMaterial"
                type="text"
                placeholder="Кожа, сетка..." />
            </div>
            <div class="field">
              <label>Материал подошвы</label>
              <input
                v-model="form.soleMaterial"
                type="text"
                placeholder="Резина, пена..." />
            </div>
          </div>
          <div class="row">
            <div class="field">
              <label>Застежка</label>
              <select v-model="form.closure">
                <option value="">Не указана</option>
                <option>Шнуровка</option>
                <option>Липучка</option>
                <option>Молния</option>
                <option>Без застежки</option>
              </select>
            </div>
            <div class="field">
              <label>Назначение</label>
              <select v-model="form.purpose">
                <option value="">Не указано</option>
                <option>Повседневные</option>
                <option>Бег</option>
                <option>Баскетбол</option>
                <option>Тренировки</option>
              </select>
            </div>
          </div>
        </template>

        <!-- Общие поля -->
        <div class="row">
          <div class="field">
            <label>Цвет</label>
            <input v-model="form.color" type="text" placeholder="Белый" />
          </div>
          <div class="field">
            <label>Страна</label>
            <input
              v-model="form.country"
              type="text"
              placeholder="Китай, Турция..." />
          </div>
        </div>

        <!-- РАЗМЕРЫ -->
        <div class="field sizes-section">
          <label>Размеры</label>

          <div class="available-sizes">
            <p class="sizes-label">
              Доступные размеры (нажмите чтобы добавить):
            </p>
            <div class="sizes-buttons">
              <button
                v-for="size in availableSizes"
                :key="size"
                type="button"
                class="size-btn"
                :disabled="selectedSizes.includes(size)"
                @click="addSize(size)">
                {{ size }}
                <span v-if="selectedSizes.includes(size)" class="check">✓</span>
              </button>
            </div>
          </div>

          <div v-if="selectedSizes.length" class="selected-sizes">
            <div class="selected-header">
              <p class="sizes-label">Выбрано ({{ selectedSizes.length }}):</p>
              <button type="button" class="clear-all" @click="clearAllSizes">
                Удалить все
              </button>
            </div>
            <div class="selected-list">
              <span
                v-for="(size, index) in selectedSizes"
                :key="index"
                class="selected-tag">
                {{ size }}
                <button
                  type="button"
                  class="remove-one"
                  @click="removeSize(index)">
                  ✕
                </button>
              </span>
            </div>
          </div>

          <div class="manual-input">
            <p class="sizes-label">Или добавить вручную:</p>
            <div class="manual-row">
              <input
                v-model="manualSize"
                type="text"
                placeholder="Например: 47, 48 или One Size"
                @keyup.enter="addManualSize" />
              <button
                type="button"
                class="btn-add-manual"
                @click="addManualSize">
                Добавить
              </button>
            </div>
          </div>
        </div>

        <!-- ИЗОБРАЖЕНИЯ -->
        <div class="field">
          <label>Изображения товара</label>

          <div class="upload-tabs">
            <button
              type="button"
              :class="{ active: uploadMode === 'url' }"
              @click="uploadMode = 'url'">
              📎 По ссылке
            </button>
            <button
              type="button"
              :class="{ active: uploadMode === 'file' }"
              @click="uploadMode = 'file'">
              💾 С компьютера
            </button>
          </div>

          <div v-if="uploadMode === 'url'" class="url-section">
            <div v-for="(url, i) in imageUrls" :key="i" class="url-row">
              <input
                v-model="imageUrls[i]"
                type="url"
                placeholder="https://site.com/image.jpg" />
              <button
                type="button"
                @click="removeUrl(i)"
                v-if="imageUrls.length > 1"
                class="btn-remove">
                ✕
              </button>
            </div>
            <button type="button" @click="addUrl" class="btn-add">
              + Добавить URL
            </button>
          </div>

          <div v-else class="file-section">
            <input
              type="file"
              ref="fileInput"
              multiple
              accept="image/*"
              @change="handleFileSelect"
              hidden />
            <div
              class="dropzone"
              @click="$refs.fileInput.click()"
              @dragover.prevent
              @drop.prevent="handleDrop">
              <span class="drop-icon">📁</span>
              <p>Нажмите или перетащите фото сюда</p>
              <span class="drop-hint">JPG, PNG, WEBP до 5MB</span>
            </div>

            <div v-if="uploadedFiles.length" class="file-list">
              <div
                v-for="(file, i) in uploadedFiles"
                :key="i"
                class="file-item">
                <img :src="file.preview" />
                <span class="file-name">{{ file.name }}</span>
                <button type="button" @click="removeFile(i)" class="btn-remove">
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div v-if="allImages.length" class="preview-all">
            <p>Всего: {{ allImages.length }} фото</p>
            <div class="preview-grid">
              <div v-for="(img, i) in allImages" :key="i" class="preview-thumb">
                <img :src="img" />
                <button type="button" @click="removeImage(i)">✕</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Дополнительно -->
        <div class="row">
          <div class="field">
            <label>Артикул (SKU)</label>
            <input v-model="form.sku" type="text" placeholder="SKU-001" />
          </div>
          <div class="field">
            <label>Количество на складе</label>
            <input
              v-model.number="form.stock"
              type="number"
              min="0"
              placeholder="100" />
          </div>
        </div>

        <!-- БЕЙДЖИ -->
        <div class="badges-section">
          <h3>Бейджи на товаре</h3>
          <div class="badges">
            <label class="badge new" :class="{ active: form.isNew }">
              <input type="checkbox" v-model="form.isNew" />
              <span>✨ Новинка</span>
            </label>

            <label class="badge stock" :class="{ active: form.inStock }">
              <input type="checkbox" v-model="form.inStock" />
              <span>✓ В наличии</span>
            </label>

            <label class="badge sale" :class="{ active: form.isOnSale }">
              <input type="checkbox" v-model="form.isOnSale" />
              <span>🔥 Акция</span>
            </label>
          </div>
        </div>

        <!-- Поля акции -->
        <div v-if="form.isOnSale" class="sale-fields">
          <div class="row">
            <div class="field">
              <label>Старая цена (₽)</label>
              <input
                v-model.number="form.oldPrice"
                type="number"
                min="1"
                placeholder="Цена до скидки" />
            </div>
            <div class="field">
              <label>Скидка (%)</label>
              <input
                v-model.number="form.discountPercent"
                type="number"
                min="1"
                max="99"
                placeholder="20" />
            </div>
          </div>
          <div class="field">
            <label>Название акции</label>
            <input
              v-model="form.saleName"
              type="text"
              placeholder="Черная пятница" />
          </div>
        </div>

        <!-- Кнопки -->
        <div class="buttons-row">
          <button type="button" @click="testConsole" class="btn-test">
            🧪 Тест (консоль)
          </button>
          <button type="button" @click="confirmReset" class="btn-reset">
            🔄 Сбросить
          </button>
          <button type="submit" class="btn-submit" :disabled="loading">
            {{ loading ? "Сохранение..." : "✓ Добавить товар" }}
          </button>
        </div>
      </form>

      <!-- Уведомление -->
      <div v-if="message" :class="['alert', messageType]">
        {{ message }}
      </div>
    </div>
  </AdminLayout>

  <!-- МОДАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ -->
  <div v-if="showDeleteModal" class="modal-overlay" @click.self="cancelDelete">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-icon">⚠️</span>
        <h3>Удаление категории</h3>
      </div>
      <div class="modal-body">
        <p>
          Вы точно хотите удалить категорию
          <strong>"{{ categoryToDelete?.name }}"</strong>?
        </p>
        <p class="modal-warning">Это действие нельзя отменить.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-cancel" @click="cancelDelete">
          Отмена
        </button>
        <button type="button" class="btn-confirm-delete" @click="executeDelete">
          Удалить
        </button>
      </div>
    </div>
  </div>

  <!-- МОДАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ СБРОСА ФОРМЫ -->
  <div v-if="showResetModal" class="modal-overlay" @click.self="cancelReset">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-icon">⚠️</span>
        <h3>Сброс формы</h3>
      </div>
      <div class="modal-body">
        <p>Вы точно хотите сбросить все поля формы?</p>
        <p class="modal-warning">Введенные данные будут потеряны.</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn-cancel" @click="cancelReset">
          Отмена
        </button>
        <button type="button" class="btn-confirm-delete" @click="executeReset">
          Сбросить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useShopStore } from "../../stores/shop";
import AdminLayout from "./AdminLayout.vue";

const store = useShopStore();

// Тип товара
const productType = ref("clothing");

// Режим загрузки
const uploadMode = ref("url");
const fileInput = ref(null);

// МОДАЛЬНОЕ ОКНО
const showDeleteModal = ref(false);
const categoryToDelete = ref(null);
const showResetModal = ref(false);

// Данные формы
const form = reactive({
  name: "",
  price: null,
  categoryId: "",
  description: "",
  brand: "",
  model: "",
  material: "",
  upperMaterial: "",
  soleMaterial: "",
  season: "",
  closure: "",
  purpose: "",
  color: "",
  country: "",
  sku: "",
  stock: 0,
  isNew: false,
  inStock: true,
  isOnSale: false,
  oldPrice: null,
  discountPercent: null,
  saleName: "",
});

// КАТЕГОРИИ
const defaultCategories = [
  { id: "cat_tshirts", name: "Футболки", type: "clothing" },
  { id: "cat_jeans", name: "Джинсы", type: "clothing" },
  { id: "cat_jackets", name: "Куртки", type: "clothing" },
  { id: "cat_dresses", name: "Платья", type: "clothing" },
  { id: "cat_sneakers", name: "Кроссовки", type: "shoes" },
  { id: "cat_boots", name: "Ботинки", type: "shoes" },
  { id: "cat_sandals", name: "Сандалии", type: "shoes" },
  { id: "cat_slippers", name: "Тапочки", type: "shoes" },
];

const customCategories = ref([]);
const newCategory = ref("");

const allCategories = computed(() => {
  const filtered = defaultCategories.filter(
    (c) => c.type === productType.value,
  );
  const custom = customCategories.value.filter(
    (c) => c.type === productType.value,
  );
  return [...filtered, ...custom];
});

const addCategory = () => {
  const name = newCategory.value.trim();
  if (!name) return;

  const exists = allCategories.value.some(
    (c) => c.name.toLowerCase() === name.toLowerCase(),
  );

  if (exists) {
    alert("Такая категория уже есть!");
    return;
  }

  const id = `cat_custom_${Date.now()}`;
  customCategories.value.push({
    id,
    name,
    type: productType.value,
  });

  form.categoryId = id;
  newCategory.value = "";
};

// Подтверждение удаления
const confirmDeleteCategory = (cat) => {
  categoryToDelete.value = cat;
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  categoryToDelete.value = null;
};

const executeDelete = () => {
  if (!categoryToDelete.value) return;

  const cat = categoryToDelete.value;

  // Если удаляемая категория выбрана — сбрасываем выбор
  if (form.categoryId === cat.id) {
    form.categoryId = "";
  }

  // Удаляем из массива
  const idx = customCategories.value.findIndex((c) => c.id === cat.id);
  if (idx > -1) {
    customCategories.value.splice(idx, 1);
  }

  showDeleteModal.value = false;
  categoryToDelete.value = null;
};

// РОСТ
const heightOptions = [
  "146-152",
  "152-158",
  "158-164",
  "164-170",
  "170-176",
  "176-182",
  "182-188",
  "188-194",
  "Универсальный",
];
const selectedHeights = ref([]);
const customHeight = ref("");

const allHeights = computed(() => {
  return [...selectedHeights.value];
});

const addCustomHeight = () => {
  const h = customHeight.value.trim();
  if (h && !selectedHeights.value.includes(h)) {
    selectedHeights.value.push(h);
    customHeight.value = "";
  }
};

const removeHeight = (index) => {
  selectedHeights.value.splice(index, 1);
};

const clearAllHeights = () => {
  selectedHeights.value = [];
};

// РАЗМЕРЫ
const selectedSizes = ref([]);
const manualSize = ref("");

const clothingSizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const shoeSizes = [
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
  "46",
  "47",
];

const availableSizes = computed(() => {
  return productType.value === "clothing" ? clothingSizes : shoeSizes;
});

const addSize = (size) => {
  if (!selectedSizes.value.includes(size)) {
    selectedSizes.value.push(size);
  }
};

const removeSize = (index) => {
  selectedSizes.value.splice(index, 1);
};

const clearAllSizes = () => {
  selectedSizes.value = [];
};

const addManualSize = () => {
  const size = manualSize.value.trim();
  if (size && !selectedSizes.value.includes(size)) {
    selectedSizes.value.push(size);
    manualSize.value = "";
  }
};

// Изображения
const imageUrls = ref([""]);
const uploadedFiles = ref([]);

const allImages = computed(() => {
  const urls = imageUrls.value.filter((u) => u.trim());
  const files = uploadedFiles.value.map((f) => f.preview);
  return [...urls, ...files];
});

const loading = ref(false);
const message = ref("");
const messageType = ref("");

watch([() => form.oldPrice, () => form.discountPercent], ([old, discount]) => {
  if (old && discount) {
    form.price = Math.round(old * (1 - discount / 100));
  }
});

const addUrl = () => imageUrls.value.push("");
const removeUrl = (i) => imageUrls.value.splice(i, 1);

const handleFileSelect = (e) => {
  const files = Array.from(e.target.files);
  addFiles(files);
};

const handleDrop = (e) => {
  const files = Array.from(e.dataTransfer.files).filter((f) =>
    f.type.startsWith("image/"),
  );
  addFiles(files);
};

const addFiles = (files) => {
  files.forEach((file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`Файл ${file.name} слишком большой (макс. 5MB)`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedFiles.value.push({
        file: file,
        name: file.name,
        preview: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  });
};

const removeFile = (i) => uploadedFiles.value.splice(i, 1);

const removeImage = (i) => {
  const urlCount = imageUrls.value.filter((u) => u.trim()).length;
  if (i < urlCount) {
    const idx = imageUrls.value.findIndex(
      (u) => u.trim() === allImages.value[i],
    );
    if (idx > -1) imageUrls.value.splice(idx, 1);
  } else {
    uploadedFiles.value.splice(i - urlCount, 1);
  }
};

// Функция сброса формы
const resetForm = () => {
  // Сброс основных полей формы
  Object.keys(form).forEach((key) => {
    if (typeof form[key] === "boolean") {
      form[key] = key === "inStock"; // inStock = true, остальные false
    } else if (typeof form[key] === "number") {
      form[key] = key === "stock" ? 100 : null;
    } else {
      form[key] = "";
    }
  });

  // Сброс специфических полей
  selectedSizes.value = [];
  selectedHeights.value = [];
  imageUrls.value = [""];
  uploadedFiles.value = [];
  uploadMode.value = "url";
  productType.value = "clothing";
  newCategory.value = "";
  manualSize.value = "";
  customHeight.value = "";

  // Показываем уведомление
  message.value = "Форма сброшена";
  messageType.value = "success";
  setTimeout(() => (message.value = ""), 3000);
};

const confirmReset = () => {
  showResetModal.value = true;
};

const cancelReset = () => {
  showResetModal.value = false;
};

const executeReset = () => {
  showResetModal.value = false;
  resetForm();
};

const testConsole = () => {
  const category = allCategories.value.find((c) => c.id === form.categoryId);
  const categoryName = category ? category.name : "";

  const data = {
    type: productType.value,
    name: form.name,
    price: form.price,
    categoryId: form.categoryId,
    categoryName: categoryName,
    description: form.description,
    color: form.color,
    country: form.country,
    sizes: selectedSizes.value.join(", "),
    height: selectedHeights.value.join(", "),
    images: imageUrls.value.filter((u) => u.trim()),
    filesInfo: uploadedFiles.value.map((f) => ({ name: f.name, size: f.size })),
    sku: form.sku,
    stock: form.stock,
    isNew: form.isNew,
    inStock: form.inStock,
    isOnSale: form.isOnSale,
    badges: [],
  };

  if (form.isNew) data.badges.push("new");
  if (form.inStock) data.badges.push("inStock");
  if (form.isOnSale) data.badges.push("sale");

  if (form.isOnSale) {
    data.oldPrice = form.oldPrice;
    data.discountPercent = form.discountPercent;
    data.saleName = form.saleName;
  }

  if (productType.value === "clothing") {
    data.material = form.material;
    data.season = form.season;
  } else {
    data.brand = form.brand;
    data.model = form.model;
    data.upperMaterial = form.upperMaterial;
    data.soleMaterial = form.soleMaterial;
    data.closure = form.closure;
    data.purpose = form.purpose;
  }

  console.log("=".repeat(60));
  console.log("🧪 ТЕСТОВЫЙ ВЫВОД ДАННЫХ");
  console.log("=".repeat(60));
  console.log(JSON.stringify(data, null, 2));
  console.log("=".repeat(60));
  console.log("📊 Размеры:", selectedSizes.value);
  console.log("📊 Рост:", selectedHeights.value);
  console.log("📊 Категория:", categoryName, `(${form.categoryId})`);
  console.log("=".repeat(60));

  message.value = "✅ Данные в консоли! Нажми F12 → Console";
  messageType.value = "success";
  setTimeout(() => (message.value = ""), 3000);
};

// Осторожно! Ниже код функции отправки данных на сервер. Убедитесь, что бэкенд ожидает данные в таком формате и обрабатывает их корректно. Рекомендуется сначала протестировать с помощью testConsole, чтобы убедиться, что все данные собираются правильно, а затем раскомментировать и адаптировать функцию submitProduct для реальной отправки.
//  const submitProduct = async () => {
//   if (!form.name || !form.price || !form.categoryId) {
//     message.value = "Заполните название, цену и категорию"
//     messageType.value = "error"
//     return
//   }

//   if (productType.value === "shoes" && !form.brand) {
//     message.value = "Укажите бренд обуви"
//     messageType.value = "error"
//     return
//   }

//   // Находим название категории по ID
//   const category = allCategories.value.find(c => c.id === form.categoryId)
//   const categoryName = category ? category.name : ""

//   const sizes = selectedSizes.value.join(", ")
//   const height = selectedHeights.value.join(", ")

//   const data = {
//     type: productType.value,
//     name: form.name,
//     price: form.price,
//     categoryId: form.categoryId,
//     categoryName: categoryName,
//     description: form.description,
//     color: form.color,
//     country: form.country,
//     sizes: sizes,
//     height: height,
//     images: imageUrls.value.filter((u) => u.trim()),
//     files: uploadedFiles.value.map((f) => f.file),
//     sku: form.sku,
//     stock: form.stock,
//     isNew: form.isNew,
//     inStock: form.inStock,
//     isOnSale: form.isOnSale,
//     badges: [],
//   }

//   // Добавляем бейджи
//   if (form.isNew) data.badges.push("new")
//   if (form.inStock) data.badges.push("inStock")
//   if (form.isOnSale) data.badges.push("sale")

//   // Поля акции
//   if (form.isOnSale) {
//     data.oldPrice = form.oldPrice
//     data.discountPercent = form.discountPercent
//     data.saleName = form.saleName
//   }

//   // Специфичные поля
//   if (productType.value === "clothing") {
//     data.material = form.material
//     data.season = form.season
//   } else {
//     data.brand = form.brand
//     data.model = form.model
//     data.upperMaterial = form.upperMaterial
//     data.soleMaterial = form.soleMaterial
//     data.closure = form.closure
//     data.purpose = form.purpose
//   }

//   loading.value = true

//   try {
//     const result = await store.createProduct(data)

//     message.value = `Товар "${result.name}" добавлен!`
//     messageType.value = "success"

//     // Сброс формы
//     Object.keys(form).forEach((k) => {
//       if (typeof form[k] === "boolean") form[k] = k === "inStock"
//       else if (typeof form[k] === "number")
//         form[k] = k === "stock" ? 100 : null
//       else form[k] = ""
//     })
//     selectedSizes.value = []
//     selectedHeights.value = []
//     customCategories.value = []
//     imageUrls.value = [""]
//     uploadedFiles.value = []
//     uploadMode.value = "url"
//     productType.value = "clothing"

//   } catch (err) {
//     console.error("Ошибка:", err)
//     message.value = err.response?.data?.message || err.response?.data?.error || "Ошибка сервера"
//     messageType.value = "error"
//   } finally {
//     loading.value = false
//     setTimeout(() => (message.value = ""), 5000)
//   }
// }
</script>

<style scoped>
.admin-add-product {
  max-width: 800px;
  padding: 2rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
}

.type-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.type-selector button {
  flex: 1;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.type-selector button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #555;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: #3498db;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* КАТЕГОРИИ */
.category-management {
  margin-top: 0.8rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.add-category {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.add-category input {
  flex: 1;
  font-size: 0.9rem;
}

.add-category button {
  padding: 0.6rem 1rem;
  background: #9b59b6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 0.9rem;
}

.custom-cats-list {
  border-top: 1px solid #e0e0e0;
  padding-top: 0.8rem;
}

.cats-label {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.cat-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cat-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: #e3f2fd;
  color: #1565c0;
  border-radius: 16px;
  font-size: 0.9rem;
}

.delete-cat {
  width: 20px;
  height: 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.delete-cat:hover {
  transform: scale(1.1);
}

/* МОДАЛЬНОЕ ОКНО */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
}

.modal {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s;
}

.modal-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.modal-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.modal-header h3 {
  color: #333;
  font-size: 1.3rem;
}

.modal-body {
  text-align: center;
  margin-bottom: 2rem;
}

.modal-body p {
  color: #555;
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.modal-warning {
  color: #e74c3c;
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  gap: 1rem;
}

.modal-footer button {
  flex: 1;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #ecf0f1;
  color: #555;
  border: 2px solid #ddd;
}

.btn-cancel:hover {
  background: #d5dbdb;
}

.btn-confirm-delete {
  background: #e74c3c;
  color: white;
  border: none;
}

.btn-confirm-delete:hover {
  background: #c0392b;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* РОСТ */
.height-section {
  background: #f0f8ff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 2px solid #b3d9ff;
}

.height-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.height-tag {
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  background: white;
  border: 2px solid #ddd;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.height-tag input {
  display: none;
}

.height-tag input:checked + span {
  color: #1976d2;
  font-weight: bold;
}

.height-tag:has(input:checked) {
  background: #bbdefb;
  border-color: #1976d2;
}

.height-custom {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.height-custom input {
  flex: 1;
}

.height-custom button {
  padding: 0.6rem 1rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.selected-heights {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.height-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #1976d2;
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
}

.height-badge button {
  width: 18px;
  height: 18px;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-heights {
  padding: 0.4rem 0.8rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

/* РАЗМЕРЫ */
.sizes-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}

.sizes-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.8rem;
}

.available-sizes {
  margin-bottom: 1.5rem;
}

.sizes-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.size-btn {
  padding: 0.6rem 1.2rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.size-btn:hover:not(:disabled) {
  border-color: #3498db;
  background: #ebf5fb;
}

.size-btn:disabled {
  background: #d4edda;
  border-color: #27ae60;
  color: #155724;
  cursor: default;
}

.size-btn .check {
  font-size: 0.8rem;
}

.selected-sizes {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #3498db;
  margin-bottom: 1.5rem;
}

.selected-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.clear-all {
  padding: 0.4rem 0.8rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border-radius: 20px;
  font-size: 0.95rem;
}

.remove-one {
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.7rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.manual-input {
  margin-top: 1rem;
}

.manual-row {
  display: flex;
  gap: 0.5rem;
}

.manual-row input {
  flex: 1;
}

.btn-add-manual {
  padding: 0.8rem 1.5rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

/* ИЗОБРАЖЕНИЯ */
.upload-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.upload-tabs button {
  padding: 0.7rem 1.2rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 6px;
  cursor: pointer;
}

.upload-tabs button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.url-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.url-row {
  display: flex;
  gap: 0.5rem;
}

.url-row input {
  flex: 1;
}

.btn-remove {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-add {
  padding: 0.8rem 1.5rem;
  background: #ecf0f1;
  border: 2px dashed #bdc3c7;
  border-radius: 6px;
  cursor: pointer;
  color: #555;
}

.dropzone {
  border: 3px dashed #bdc3c7;
  border-radius: 12px;
  padding: 2.5rem;
  text-align: center;
  cursor: pointer;
  background: #f8f9fa;
}

.drop-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.drop-hint {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.file-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.file-item img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.file-name {
  flex: 1;
  font-size: 0.9rem;
}

.preview-all {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid #ecf0f1;
}

.preview-all p {
  margin-bottom: 0.5rem;
  color: #555;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
}

.preview-thumb {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
}

.preview-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-thumb button {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 20px;
  height: 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 0.7rem;
  cursor: pointer;
}

/* БЕЙДЖИ */
.badges-section {
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.badges-section h3 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1rem;
}

.badges {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid #ddd;
  background: white;
  transition: all 0.3s;
}

.badge input {
  display: none;
}

.badge.new.active {
  background: #e8f5e9;
  border-color: #4caf50;
}

.badge.stock.active {
  background: #e3f2fd;
  border-color: #2196f3;
}

.badge.sale.active {
  background: #ffebee;
  border-color: #f44336;
}

/* АКЦИЯ */
.sale-fields {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background: #fff3e0;
  border-radius: 8px;
  border: 2px dashed #ff9800;
}

.sale-fields .field label {
  color: #e65100;
}

/* КНОПКИ */
.buttons-row {
  display: flex;
  gap: 1rem;
}

.btn-test {
  flex: 1;
  padding: 1.2rem;
  background: #9b59b6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
}

.btn-submit {
  flex: 2;
  padding: 1.2rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
}

.btn-submit:disabled {
  background: #95a5a6;
  cursor: not-allowed;
}

.alert {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
}

.alert.success {
  background: #27ae60;
}

.alert.error {
  background: #e74c3c;
}
/* Кнопка сброса */
.btn-reset {
  background: #606060;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  flex: 1;
}
@media (max-width: 600px) {
  .row {
    grid-template-columns: 1fr;
  }

  .buttons-row {
    flex-direction: column;
  }

  .modal-footer {
    flex-direction: column;
  }

  .cat-tags {
    gap: 0.3rem;
  }

  .cat-tag {
    font-size: 0.8rem;
  }
}
</style>
