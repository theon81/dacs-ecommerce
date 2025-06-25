# Login Function Test Suite

## Overview
This test suite provides comprehensive automated testing for the login functionality of the DACS e-commerce application. It covers various edge cases, security scenarios, and error conditions.

## Test Coverage

### 1. Basic Login Tests (`login.test.js`)
- ✅ Successful login with valid credentials
- ❌ Failed login with invalid email
- ❌ Failed login with invalid password
- ❌ Failed login with both invalid credentials
- ❌ Empty email field
- ❌ Empty password field
- ❌ Both fields empty
- ❌ Missing email field
- ❌ Missing password field
- ❌ Missing both fields

### 2. Security Tests
- 🔒 Account locking after multiple failed attempts
- 🔓 Login attempts reset after successful login
- 🛡️ Password security (not exposed in responses)
- ⏱️ Timing attack protection
- 💉 SQL/NoSQL injection protection

### 3. Edge Cases (`loginEdgeCases.test.js`)
- 🌐 Unicode and special characters
- 📝 Different Content-Type headers
- 🔄 Concurrent login attempts
- 📏 Very long inputs
- 🔤 Case sensitivity
- 🚫 Malformed JSON handling

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Only Login Tests
```bash
npx jest --testNamePattern="Login"
```

### Run Specific Test File
```bash
npx jest test/login.test.js
```

## Test Results Interpretation

### Success Indicators
- ✅ Green checkmarks indicate passing tests
- 📊 Coverage reports show code coverage percentage
- 🎯 All critical login paths are tested

### Failure Analysis
- ❌ Red X marks indicate failing tests
- 📋 Detailed error messages help identify issues
- 🔍 Stack traces point to exact failure locations

## Test Environment

### Database
- Uses MongoDB Memory Server for isolated testing
- Fresh database for each test suite
- No interference with production data

### Authentication
- Test JWT secrets used
- Isolated from production tokens
- Secure test environment

## Extending Tests

### Adding New Test Cases
1. Create new test file in `/test` directory
2. Import necessary helpers from `/test/helpers`
3. Follow existing naming conventions
4. Update this documentation

### Custom Test Helpers
- Use helpers from `/test/helpers/testHelpers.js`
- Create reusable test data generators
- Maintain consistent test structure

## Security Considerations

### What We Test
- Input validation
- Authentication logic
- Rate limiting (account locking)
- Error message consistency
- Response time consistency

### What We Don't Expose
- Real passwords
- Production secrets
- Sensitive user data
- Internal system details

## Performance Metrics

### Expected Response Times
- Login endpoint: < 500ms
- Failed attempts: < 300ms
- Account locked response: < 100ms

### Concurrency
- Tests handle 10+ concurrent requests
- No race conditions in user creation
- Proper cleanup between tests

## Troubleshooting

### Common Issues
1. **MongoDB connection errors**: Ensure MongoDB Memory Server is properly installed
2. **JWT secret missing**: Check test environment variables in setup.js
3. **Port conflicts**: Tests use random ports to avoid conflicts
4. **Timeout errors**: Increase test timeout in jest.config.js

### Debug Mode
```bash
npx jest --detectOpenHandles --forceExit
```

## Best Practices

### Test Structure
- One assertion per test when possible
- Clear test descriptions
- Proper setup and teardown
- Independent test cases

### Naming Conventions
- Descriptive test names
- Group related tests in describe blocks
- Use consistent file naming
- Clear variable names

### Maintenance
- Update tests when functionality changes
- Remove obsolete tests
- Keep test data realistic
- Regular dependency updates
