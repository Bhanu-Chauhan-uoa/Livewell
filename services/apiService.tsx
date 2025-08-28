const API_CONFIG = {
  baseURL: 'https://mws-apim-test-01.azure-api.net/v1',
  subscriptionKey: '7403025e-06da-416f-b939-94f422a9a977'
};

export const registerUser = async (userData: any) => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': API_CONFIG.subscriptionKey,
      },
      body: JSON.stringify(userData),
    });

    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Network error' };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_CONFIG.baseURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': API_CONFIG.subscriptionKey,
      },
      body: JSON.stringify({ email, password }),
    });

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Network error' };
  }
};
