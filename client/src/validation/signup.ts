import validator from 'validator';

export interface ValidationError {
  field: 'username' | 'email' | 'password' | 'password2';
  error: string;
}

export function validate(
  username: string,
  email: string,
  password: string,
  password2: string
) {
  const errors: ValidationError[] = [];
  if (validator.isEmpty(username)) {
    errors.push({ field: 'username', error: 'Username is required' });
  }
  if (validator.isEmpty(email)) {
    errors.push({ field: 'email', error: 'Email Address is required' });
  }
  if (!validator.isEmail(email)) {
    errors.push({
      field: 'email',
      error: 'Invalid email address'
    });
  }
  if (validator.isEmpty(password)) {
    errors.push({ field: 'password', error: 'Password is required' });
  }
  if (!validator.equals(password, password2)) {
    errors.push({ field: 'password2', error: 'Passwords must match' });
  }

  const isValid = errors.length === 0;
  return { isValid, errors };
}
