const auth = {
  isAuthenticated: false,
  async login(email, password) {
    try {
      const url = '/api/users/login';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        this.isAuthenticated = true;
      }
      return response;
    } catch (error) {
      return error;
    }
  },
  logout() {
    this.isAuthenticated = false;
  }
}
