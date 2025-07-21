 // Define validation rules based on form type
 export const getValidationRules = (type: string) => {
    const baseRules = {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: string) => {
        if (val.length < 8) {
          return 'Password must be at least 8 characters';
        }
        if (!/[A-Z]/.test(val)) {
          return 'Password must contain at least one uppercase letter';
        }
        if (!/[0-9]/.test(val)) {
          return 'Password must contain at least one number';
        }
        if (!/[!@#$%^&*]/.test(val)) {
          return 'Password must contain at least one special character';
        }
        return null;
      },
    };

    if (type === 'register') {
      return {
        ...baseRules,
        name: (val: string) => (val.length < 1 ? 'Name is required' : null),
        surname: (val: string) => (val.length < 1 ? 'Surname is required' : null),
        dateOfBirth: (val: string) => (val.length < 1 ? 'Date of birth is required' : null),
        confirmPassword: (val: string, values: any) => val !== values.password ? 'Passwords do not match' : null,
      };
    }

    return baseRules;
  };