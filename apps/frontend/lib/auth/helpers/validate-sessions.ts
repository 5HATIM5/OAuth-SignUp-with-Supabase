 export const getValidationRules = (type: string) => {
    const baseRules = {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
    };

    if(type === 'login') {
      return {
        ...baseRules,
        password: (val: string) => (val.length < 1 ? 'Password is required' : null),
      };
    }

    if (type === 'register') {
      return {
        ...baseRules,
        name: (val: string) => (val.length < 1 ? 'Name is required' : null),
        surname: (val: string) => (val.length < 1 ? 'Surname is required' : null),
        dateOfBirth: (val: string) => {
          const date = new Date(val);
          const today = new Date();
          const age = today.getFullYear() - date.getFullYear();
          if (age < 18) {
            return 'You must be at least 18 years old';
          }
          return null;
        },
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
        confirmPassword: (val: string, values: any) => val !== values.password ? 'Passwords do not match' : null,
      };
    }

    return baseRules;
  };