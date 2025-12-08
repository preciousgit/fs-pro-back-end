
export const API_BASE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  "https://fs-pro-back-end.onrender.com";

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.details = data.details;
    error.status = response.status;
    throw error;
  }
  
  return data;
};

export const fetchLessons = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons`);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

export const fetchOrders = async (phoneNumber) => {
  try {
    const url = phoneNumber 
      ? `${API_BASE_URL}/orders?phone=${encodeURIComponent(phoneNumber)}`
      : `${API_BASE_URL}/orders`;
      
    const response = await fetch(url);
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

export const updateLessonSpaces = async (lessonId, spaces) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ spaces }), 
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Error updating lesson spaces:", error);
    throw error;
  }
};
