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
  if (!validator.isLength(username, { min: 8, max: 20 })) {
    errors.push({
      field: 'username',
      error: 'Username must be between 8 and 20 characters in length'
    });
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
  if (!validator.isLength(password, { min: 8, max: 20 })) {
    errors.push({
      field: 'password',
      error: 'Password must be between 8 and 20 characters in length'
    });
  }
  if (!validator.equals(password, password2)) {
    errors.push({ field: 'password2', error: 'Passwords must match' });
  }

  const isValid = errors.length === 0;
  return { isValid, errors };
}
