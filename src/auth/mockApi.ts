const MOCK_USERS = {
    'admin@test.com': {
        id: '1',
        email: 'admin@test.com',
        role: 'ceo' as const,
        name: 'ceo User'
    },
    'manager@test.com': {
        id: '2',
        email: 'manager@test.com',
        role: 'accountant' as const,
        name: 'accountant User'
    },
    'user@test.com': {
        id: '3',
        email: 'user@test.com',
        role: 'driver' as const,
        name: 'driver User'
    }
};

export const mockLogin = async (email: string, password: string) => {
    console.log('Mock Login Called:', { email, password });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS[email as keyof typeof MOCK_USERS];

    if (!user) {
        console.log('User not found');
        throw new Error('Invalid credentials');
    }

    if (password !== '123456') {
        console.log('Invalid password');
        throw new Error('Invalid credentials');
    }

    console.log('Login successful:', user);
    return {
        user,
        token: 'mock-jwt-token'
    };
};