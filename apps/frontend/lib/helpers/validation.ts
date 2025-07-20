 // Define validation rules based on form type
 export const getValidationRules = (type: string) => {
    const baseRules = {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: string) => (val.length < 6 ? 'Password must be at least 6 characters' : null),
    };

    if (type === 'register') {
      return {
        ...baseRules,
        name: (val: string) => (val.length < 1 ? 'Name is required' : null),
        surname: (val: string) => (val.length < 1 ? 'Surname is required' : null),
        nickname: (val: string) => {
          if (val.length < 1) return 'Nickname is required';
          if (!/^[a-zA-Z0-9_]+$/.test(val)) return 'Nickname can only contain letters, numbers, and underscores';
          return null;
        },
        dateOfBirth: (val: string) => (val.length < 1 ? 'Date of birth is required' : null),
        confirmPassword: (val: string, values: any) => val !== values.password ? 'Passwords do not match' : null,
      };
    }

    return baseRules;
  };