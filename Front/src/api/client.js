import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Категории
export const getCategories = () => api.get("/categories");

// Товары
export const getProducts = (categoryId = "") =>
  api.get("/products", { params: categoryId ? { category: categoryId } : {} });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getSimilarProducts = (id) => api.get(`/products/${id}/similar`);

// Создание товара (одежда или обувь) — с файлами или без
export const createProduct = (data) => {
  // Если есть файлы — отправляем как FormData
  if (data.files && data.files.length > 0) {
    const formData = new FormData();

    // Основные поля
    formData.append("type", data.type); // 'clothing' или 'shoes'
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("categoryId", data.categoryId);
    formData.append("description", data.description || "");
    formData.append("color", data.color || "");
    formData.append("country", data.country || "");
    formData.append("sizes", data.sizes || "");
    formData.append("sku", data.sku || "");
    formData.append("stock", data.stock || 0);
    formData.append("isNew", data.isNew);
    formData.append("inStock", data.inStock);
    formData.append("isOnSale", data.isOnSale);
    formData.append("badges", JSON.stringify(data.badges || []));

    // URL изображений (которые введены вручную)
    formData.append("imageUrls", JSON.stringify(data.images || []));

    // Специфичные поля для одежды
    if (data.type === "clothing") {
      formData.append("material", data.material || "");
      formData.append("season", data.season || "");
    }

    // Специфичные поля для обуви
    if (data.type === "shoes") {
      formData.append("brand", data.brand || "");
      formData.append("model", data.model || "");
      formData.append("upperMaterial", data.upperMaterial || "");
      formData.append("soleMaterial", data.soleMaterial || "");
      formData.append("closure", data.closure || "");
      formData.append("purpose", data.purpose || "");
    }

    // Поля акции
    if (data.isOnSale) {
      formData.append("oldPrice", data.oldPrice || "");
      formData.append("discountPercent", data.discountPercent || "");
      formData.append("saleName", data.saleName || "");
      formData.append("saleEndDate", data.saleEndDate || "");
    }

    // Файлы изображений
    data.files.forEach((file, index) => {
      formData.append(`image_${index}`, file);
    });

    return api.post("/admin/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  // Если нет файлов — отправляем обычный JSON
  return api.post("/admin/products", data);
};

// Заказы
export const createOrder = (data) => api.post("/orders", data);

// Аналитика
export const getTopProducts = () => api.get("/analytics/top-products");

// Пользователи
export const registerUser = (data) => api.post("/users/register", data);
export const getUserByEmail = (email) => api.get(`/users/${email}`);
export const getUserOrders = (id) => api.get(`/users/${id}/orders`);

// Админ
export const getAllOrders = () => api.get("/admin/orders");
export const getAdminStats = () => api.get("/admin/stats");
export const updateOrderStatus = (id, status) =>
  api.patch(`/admin/orders/${id}`, { status });
