const API_BASE_URL = 'http://localhost:3000'; // Change this to your Render URL when deploying

export const fetchLessons = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons`);
    if (!response.ok) throw new Error('Failed to fetch lessons');
    return await response.json();
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const updateLessonSpaces = async (lessonId, spaces) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ space: spaces })
    });
    if (!response.ok) throw new Error('Failed to update lesson spaces');
    return await response.json();
  } catch (error) {
    console.error('Error updating lesson spaces:', error);
    throw error;
  }
};