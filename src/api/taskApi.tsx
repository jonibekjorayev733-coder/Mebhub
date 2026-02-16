import axiosInstance from "../axiosConfig";

export const getTasks = () => axiosInstance.get("/tasks");

export const createTask = (data: any) =>
    axiosInstance.post("/tasks", data);

export const moveTask = (id: number, status: string) =>
    axiosInstance.put(`/tasks/${id}/move?new_status=${status}`);

// ============ COURSE API ============

/**
 * Barcha kurslarni ol (pagination bilan)
 */
export const getCourses = (skip = 0, limit = 10, category?: string) => {
    const params: any = { skip, limit };
    if (category) params.category = category;
    return axiosInstance.get("/courses", { params });
};

/**
 * Kurs ID bo'yicha to'liq ma'lumot (lessons bilan)
 */
export const getCourseById = (courseId: number) =>
    axiosInstance.get(`/courses/${courseId}`);

/**
 * Kursning barcha darslarini ol
 */
export const getCourseLessons = (courseId: number) =>
    axiosInstance.get(`/courses/${courseId}/lessons`);

/**
 * Kursga yangi dars qo'shish
 */
export const createLesson = (courseId: number, data: any) =>
    axiosInstance.post(`/courses/${courseId}/lessons`, data);

/**
 * Kursga yozilish
 */
export const enrollCourse = (courseId: number) =>
    axiosInstance.post(`/courses/${courseId}/enroll`);

/**
 * Mening yozilgan kurslarim (pagination bilan)
 */
export const getMyEnrolledCourses = (skip = 0, limit = 10) =>
    axiosInstance.get("/courses/me/enrolled", { params: { skip, limit } });

/**
 * Kurs izlash sarlavha bo'yicha
 */
export const searchCourses = (query: string) =>
    axiosInstance.get("/courses/search/by-title", { params: { q: query } });

/**
 * Kurslar statistikasi
 */
export const getCourseStats = () =>
    axiosInstance.get("/courses/stats/summary");

// ============ AUTH API ============

export const login = (username: string, password: string) => {
    return axiosInstance.post("/auth/login", { username, password });
};

export const register = (email: string, username: string, password: string) =>
    axiosInstance.post("/auth/register", { email, username, password });

export const getCurrentUser = () =>
    axiosInstance.get("/auth/me");

export const logout = () =>
    axiosInstance.post("/auth/logout");

// ============ UTILITY FUNCTIONS ============

/**
 * Bearer token-ni localStorage'da saqlash
 */
export const setAuthToken = (token: string) => {
    localStorage.setItem("token", token);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

/**
 * Token-ni o'chirish
 */
export const clearAuthToken = () => {
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
};

/**
 * Token bor yoki yo'qligini tekshirish
 */
export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
};

export default axiosInstance;
