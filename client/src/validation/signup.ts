import validator from 'validator';

export interface ValidationError {
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
    errors.push({ error: 'Username is required' });
  }
  if (!validator.isLength(username, { min: 8, max: 20 })) {
    errors.push({ error: 'Username must be between 8 and 20 characters' });
  }
  if (validator.isEmpty(email)) {
    errors.push({ error: 'Email Address is required' });
  }
  if (!validator.isEmail(email)) {
    errors.push({
      error: 'Invalid email address'
    });
  }
  if (validator.isEmpty(password)) {
    errors.push({ error: 'Password is required' });
  }
  if (!validator.isLength(password, { min: 8, max: 20 })) {
    errors.push({
      error: 'Password must be between 8 and 20 characters'
    });
  }
  if (!validator.equals(password, password2)) {
    errors.push({ error: 'Passwords must match' });
  }

  const isValid = errors.length === 0;
  return { isValid, errors };
}
