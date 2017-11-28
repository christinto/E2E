module.exports = {
    'extends': 'google',
    'plugins': [
        'react',
    ],
    'parserOptions': {
        'ecmaVersion': 6,
        "sourceType": "module",
        'ecmaFeatures': {
            'jsx': true,
        },
    },
    'rules': {
        'array-bracket-spacing': ['error', 'never'],
        'brace-style': ['error', '1tbs'],
        'camelcase': ['error', {'properties': 'always'}],
        'no-console': ['warn'],
        'no-debugger': ['warn'],
        'no-trailing-spaces': ['error'],
        'quote-props': ['error', 'always'],
        'padded-blocks': ['off'],
        'indent': ['error', 4],
        'semi': ['error', 'never'],
        'no-unused-vars': ['off'],
    },
}
