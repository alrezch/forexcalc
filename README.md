# Comprehensive Forex Calculator

A modern, React-based forex calculator application that provides multiple trading calculators with live market data integration.

## Features

### 🧮 **Five Powerful Calculators**

1. **Lot Calculator** - Determine your position size based on account balance and risk percentage
2. **Margin Calculator** - Calculate required margin for trading positions
3. **Risk-Reward Ratio Calculator** - Find your breakeven win rate
4. **Pip Calculator** - Calculate pip values for different trade sizes
5. **Profit & Loss Calculator** - Plan potential profits and losses

### 🌐 **Live Market Data**
- Real-time exchange rate updates via API
- Automatic price refresh functionality
- Fallback rates for offline/demo use
- Support for multiple currency pairs

### 🎨 **Modern UI/UX**
- Clean, professional design matching the ePlanet style
- Responsive layout for all devices
- Intuitive navigation between calculators
- Beautiful purple accent colors and smooth animations

### ⚡ **Technical Features**
- Built with React 18 and modern hooks
- Styled-components for maintainable styling
- Axios for API integration
- Responsive design with mobile optimization

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd forexcalc
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## API Configuration

The application uses exchange rate APIs to fetch live market data. You can configure different APIs in `src/services/api.js`:

### Option 1: ExchangeRate-API (Recommended for free tier)
- URL: `https://api.exchangerate-api.com/v4/latest`
- Free tier available
- No API key required

### Option 2: Fixer.io
- More reliable and comprehensive
- Requires API key
- Paid service with free tier

### Option 3: Open Exchange Rates
- Good free tier
- Reliable service
- No API key required for basic usage

## Calculator Details

### Lot Calculator
- **Purpose**: Calculate optimal position size based on risk management
- **Inputs**: Account balance, risk percentage, stop loss, instrument details
- **Outputs**: Position size in lots, money at risk

### Margin Calculator
- **Purpose**: Determine required margin for trading positions
- **Inputs**: Trade size, leverage, instrument price, units per lot
- **Outputs**: Required margin amount

### Risk-Reward Ratio Calculator
- **Purpose**: Find breakeven win rate for risk-reward ratios
- **Inputs**: Risk-to-reward ratio
- **Outputs**: Win rate percentage needed to break even

### Pip Calculator
- **Purpose**: Calculate pip values in deposit currency
- **Inputs**: Pips, trade size, exchange rates, instrument details
- **Outputs**: Pip value in deposit currency

### Profit & Loss Calculator
- **Purpose**: Calculate potential profits and losses
- **Inputs**: Position direction, open/close prices, trade size
- **Outputs**: Profit/loss amount in deposit currency

## Project Structure

```
src/
├── components/
│   ├── Navigation.js          # Main navigation component
│   ├── LotCalculator.js       # Position size calculator
│   ├── MarginCalculator.js    # Margin requirement calculator
│   ├── RiskRewardCalculator.js # Risk-reward ratio calculator
│   ├── PipCalculator.js       # Pip value calculator
│   └── ProfitLossCalculator.js # Profit/loss calculator
├── services/
│   └── api.js                # API integration and fallback rates
├── App.js                     # Main application component
├── index.js                   # Application entry point
└── index.css                  # Global styles
```

## Customization

### Adding New Calculators
1. Create a new component in `src/components/`
2. Add it to the navigation in `src/components/Navigation.js`
3. Include it in the main App.js routing

### Styling
- All styling is done with styled-components
- Color scheme can be modified in individual components
- Responsive breakpoints are defined in `src/index.css`

### API Integration
- Modify `src/services/api.js` to integrate with your preferred data provider
- Add new currency pairs and instruments as needed
- Implement real-time data streaming if required

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

## Future Enhancements

- [ ] Real-time price streaming
- [ ] More currency pairs and instruments
- [ ] Advanced risk management tools
- [ ] Portfolio tracking
- [ ] Trade journal integration
- [ ] Mobile app version
- [ ] Dark mode theme
- [ ] Multi-language support

---

**Note**: This application is for educational and informational purposes. Always consult with financial professionals before making trading decisions.
