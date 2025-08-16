# Contributing to Forex Calculator

Thank you for your interest in contributing to the Forex Calculator project! This document provides guidelines and information for contributors.

## 🚀 Project Overview

Forex Calculator is a modern, Next.js-based application that provides comprehensive trading calculators with real-time market data integration. The project uses:

- **Next.js 14** with App Router
- **shadcn/ui** components for consistent UI
- **React Query** for data management
- **TypeScript** for type safety
- **Tailwind CSS** for styling

## 📋 Prerequisites

Before contributing, ensure you have:

- **Node.js 18+** installed
- **npm** or **yarn** package manager
- **Git** for version control
- Basic knowledge of **React**, **TypeScript**, and **Next.js**

## 🔧 Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/forexcalc.git
   cd forexcalc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main application page
│   └── globals.css        # Global styles
├── components/             # Reusable UI components
│   ├── ui/                # shadcn/ui components
│   ├── calculators/       # Calculator implementations
│   ├── Navigation.tsx     # Main navigation
│   └── APIStatus.tsx      # API status dashboard
├── lib/                    # Utility libraries
│   ├── api/               # API services and hooks
│   ├── providers.tsx      # React Query provider
│   └── utils.ts           # Utility functions
└── config/                 # Configuration files
    └── api-config.ts      # API configuration
```

## 🎯 Areas for Contribution

### High Priority
- **Bug fixes** and error handling improvements
- **Performance optimizations** for data fetching
- **Accessibility improvements** for UI components
- **Mobile responsiveness** enhancements

### Medium Priority
- **New calculator types** (Fibonacci, Elliott Wave, etc.)
- **Additional currency pairs** and instruments
- **Enhanced error messages** and user feedback
- **Unit tests** for components and utilities

### Low Priority
- **Documentation improvements**
- **Code style consistency**
- **Performance monitoring** and analytics
- **Internationalization** support

## 🧪 Testing

### Running Tests
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build verification
npm run build
```

### Testing Guidelines
- Ensure all TypeScript errors are resolved
- Verify ESLint passes without warnings
- Test on multiple screen sizes
- Verify API integrations work correctly

## 📝 Code Style Guidelines

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces for all props
- Avoid `any` types when possible
- Use meaningful type names

### React Components
- Use functional components with hooks
- Follow the `'use client'` directive for client components
- Implement proper error boundaries
- Use React Query for data fetching

### Styling
- Use Tailwind CSS utility classes
- Follow shadcn/ui component patterns
- Maintain consistent spacing and typography
- Ensure responsive design principles

### File Naming
- Use PascalCase for components: `LotCalculator.tsx`
- Use camelCase for utilities: `utils.ts`
- Use kebab-case for CSS files: `globals.css`

## 🔄 Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clear, descriptive commit messages
   - Keep commits focused and atomic
   - Test your changes thoroughly

3. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Create a Pull Request**
   - Provide a clear description of changes
   - Include screenshots if UI changes
   - Reference any related issues

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] All tests pass (`npm run type-check`, `npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Changes are tested in development

### PR Description Template
```markdown
## Description
Brief description of what this PR accomplishes

## Changes Made
- [ ] Feature A added
- [ ] Bug B fixed
- [ ] Component C updated

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Verified API integration
- [ ] Checked accessibility

## Screenshots
(if applicable)

## Related Issues
Closes #123
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected vs actual behavior**
4. **Environment details** (browser, OS, device)
5. **Screenshots** or error messages
6. **Console logs** if applicable

## 💡 Feature Requests

For new features, please:

1. **Describe the feature** clearly
2. **Explain the use case** and benefits
3. **Provide examples** of similar implementations
4. **Consider implementation complexity**
5. **Discuss potential alternatives**

## 🚫 What Not to Contribute

- **Breaking changes** without discussion
- **Major refactoring** without consensus
- **New dependencies** without justification
- **Style changes** that don't improve UX

## 🤝 Community Guidelines

- **Be respectful** and constructive
- **Help others** learn and contribute
- **Provide feedback** on others' contributions
- **Follow the project's code of conduct**

## 📚 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [React Query Guide](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🏆 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributor hall of fame
- GitHub contributors list

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and ideas
- **Pull Request Reviews**: For code feedback
- **Documentation**: Check existing guides first

## 🎉 Thank You!

Your contributions help make Forex Calculator better for everyone. Whether you're fixing bugs, adding features, or improving documentation, your work is appreciated!

---

**Happy coding! 🚀**
