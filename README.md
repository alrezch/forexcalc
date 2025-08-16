# Forex Calculator - Professional Trading Tools

A comprehensive, modern Forex Calculator built with **Next.js 14**, **shadcn/ui components**, and **React Query** for real-time market data integration.

## 🚀 Features

### Core Calculators
- **Lot Size Calculator** - Calculate optimal position sizes based on risk management
- **Margin Calculator** - Determine required margin and leverage for trades
- **Risk-Reward Calculator** - Analyze risk-reward ratios for trade planning
- **Pip Calculator** - Calculate pip values and costs across different instruments
- **Profit & Loss Calculator** - Estimate potential profits and losses

### Advanced Features
- **Real-time Market Data** - Live exchange rates from multiple API sources
- **Configurable Data Refresh** - Choose from 30s, 1m, 5m, 1h, 24h, or manual updates
- **API Fallback System** - Multiple data sources with automatic failover
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **TypeScript** - Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: shadcn/ui (built on Radix UI + Tailwind CSS)
- **Data Fetching**: React Query (TanStack Query) with configurable refetch intervals
- **Styling**: Tailwind CSS with custom design system
- **Type Safety**: TypeScript with strict configuration
- **Icons**: Lucide React icon library
- **HTTP Client**: Axios for API requests

## 📱 Live APIs

The application integrates with multiple forex data providers:

- **Alpha Vantage** - Primary real-time data source
- **ExchangeRate-API** - Backup data provider
- **Open Exchange Rates** - Additional fallback source
- **Fixer.io** - Premium API option (requires key)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/alrezch/forexcalc.git
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

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🎨 UI Components

Built with shadcn/ui components for a consistent, accessible design:

- **Cards** - Clean, structured layouts
- **Buttons** - Multiple variants and states
- **Inputs** - Form controls with validation
- **Select** - Dropdown selections
- **Badges** - Status indicators
- **Navigation** - Responsive menu system

## 🔄 Data Management

### React Query Integration
- **Automatic Caching** - Smart data caching and invalidation
- **Background Updates** - Seamless data synchronization
- **Error Handling** - Graceful fallbacks and retry logic
- **Loading States** - Smooth user experience during data fetching

### Refetch Intervals
Configure how often data updates:

- **Real-time**: 30 seconds (for active trading)
- **Standard**: 1 minute (balanced performance)
- **Frequent**: 5 minutes (moderate updates)
- **Hourly**: 1 hour (background updates)
- **Daily**: 24 hours (long-term data)
- **Manual**: User-controlled updates

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

## 🌐 API Configuration

### Environment Variables
Create a `.env.local` file for API keys:

```env
# Alpha Vantage (recommended)
ALPHA_VANTAGE_API_KEY=your_key_here

# Fixer.io (optional)
FIXER_API_KEY=your_key_here
```

### API Priority
The system automatically tries APIs in order:
1. Alpha Vantage (real-time, 500 calls/day free)
2. ExchangeRate-API (no key required, 1500 calls/month)
3. Open Exchange Rates (no key required, 1000 calls/month)
4. Fixer.io (requires key, 100 calls/month)

## 📱 Responsive Design

- **Mobile-first** approach
- **Touch-friendly** interfaces
- **Adaptive layouts** for all screen sizes
- **Progressive enhancement** for older browsers

## 🔧 Development

### Code Quality
- **ESLint** configuration for code consistency
- **TypeScript** strict mode enabled
- **Prettier** formatting (recommended)
- **Component testing** ready

### Adding New Calculators
1. Create component in `src/components/calculators/`
2. Add to navigation in `src/components/Navigation.tsx`
3. Update main page routing in `src/app/page.tsx`
4. Follow existing patterns for consistency

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Environment Setup
- Ensure all environment variables are set
- Configure API keys for production APIs
- Set appropriate refetch intervals for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **TanStack Query** for powerful data management
- **Next.js team** for the excellent framework
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Check the troubleshooting guide
- Review the API setup documentation

---

**Built with ❤️ using modern web technologies**
