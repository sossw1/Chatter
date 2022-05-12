class Auth {
  private isAuthenticated: boolean;
  private static instance: Auth;

  private constructor() {
    this.isAuthenticated = false;
  }

  static getInstance() {
    if (Auth.instance) {
      return this.instance;
    }
    this.instance = new Auth();
  }
}

const auth = Auth.getInstance();

export {};
