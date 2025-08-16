# Contributing to Forex Calculator

Thank you for your interest in contributing to the Forex Calculator project! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager
- Git

### Setup
1. Fork the repository
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/forexcalc.git
   cd forexcalc
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```

## 🛠️ Development

### Project Structure
```
src/
├── components/          # React components
├── services/           # API services and utilities
├── config/             # Configuration files
├── App.js              # Main application component
└── index.js            # Application entry point
```

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use styled-components for styling
- Maintain consistent naming conventions
- Add comments for complex logic

### Testing
- Test your changes locally before submitting
- Ensure all calculators work correctly
- Test API integrations
- Verify responsive design on different screen sizes

## 🎯 Areas for Contribution

### Features
- New calculator types
- Additional currency pairs
- Enhanced UI components
- Performance optimizations

### Bug Fixes
- API integration issues
- UI/UX improvements
- Calculation accuracy
- Cross-browser compatibility

### Documentation
- README improvements
- API documentation
- Code comments
- Tutorial guides

## 📝 Submitting Changes

### 1. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Your Changes
- Write clear, focused commits
- Test your changes thoroughly
- Update documentation if needed

### 3. Commit Your Changes
```bash
git add .
git commit -m "feat: add new calculator type"
git commit -m "fix: resolve API timeout issue"
git commit -m "docs: update README with new features"
```

### 4. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Screenshots if UI changes
- Testing instructions
- Any breaking changes noted

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console errors
- [ ] Responsive design maintained

### PR Description Template
```markdown
## Description
Brief description of what this PR accomplishes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement

## Testing
- [ ] Tested locally
- [ ] All calculators working
- [ ] API integration tested
- [ ] Responsive design verified

## Screenshots (if applicable)
Add screenshots for UI changes

## Additional Notes
Any additional information or context
```

## 🐛 Reporting Issues

### Bug Report Template
```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: [e.g. Chrome, Safari]
- OS: [e.g. macOS, Windows]
- Version: [e.g. 1.0.0]

## Screenshots
If applicable, add screenshots

## Additional Context
Any other context about the problem
```

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help other contributors
- Provide constructive feedback
- Follow the project's code of conduct

## 📞 Getting Help

- Open an issue for bugs or feature requests
- Join discussions in existing issues
- Check the README for setup instructions
- Review the API setup guide for configuration help

## 🎉 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- GitHub contributors list

Thank you for contributing to making the Forex Calculator better for everyone! 🚀
