# Chandan Bhagat Portfolio - React Application

This is a React-based portfolio website for Chandan Bhagat, converted from static HTML to a modern React application with GitHub Pages deployment.

## 🚀 Features

- **Modern React Application**: Built with React 18 and modern JavaScript
- **Responsive Design**: Mobile-first responsive design with Bootstrap 5
- **Animations**: Smooth scroll animations with AOS (Animate On Scroll)
- **Professional Sections**: Hero, About, Skills, Resume, Contact sections
- **GitHub Pages Ready**: Automated deployment with GitHub Actions
- **Performance Optimized**: Optimized build with code splitting

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/chandan-g-bhagat/chandan-g-bhagat.github.io.git
cd chandan-g-bhagat.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## 🏗️ Build

To build the project for production:

```bash
npm run build
```

This creates a `build` folder with the production-ready files.

## 🚀 Deployment to GitHub Pages

### Automatic Deployment

The repository is configured with GitHub Actions for automatic deployment:

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy to GitHub Pages
3. Your site will be available at `https://chandan-g-bhagat.github.io`

### Manual Deployment

If you prefer manual deployment:

1. Install gh-pages globally:
```bash
npm install -g gh-pages
```

2. Deploy:
```bash
npm run deploy
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.js       # Navigation header
│   ├── Hero.js         # Hero section with typing animation
│   ├── About.js        # About section
│   ├── Facts.js        # Facts and services section
│   ├── Skills.js       # Skills showcase
│   ├── Resume.js       # Professional experience
│   ├── Contact.js      # Contact information
│   ├── Footer.js       # Footer
│   ├── FixedButtons.js # Fixed action buttons
│   └── Preloader.js    # Loading screen
├── assets/             # Static assets (CSS, images, JS)
├── App.js              # Main App component
├── index.js            # Entry point
└── index.css           # Global styles

public/
├── assets/             # Public assets
├── index.html          # HTML template
└── manifest.json       # PWA manifest
```

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks
- **Bootstrap 5**: Responsive CSS framework
- **AOS**: Animate On Scroll library
- **Typed.js**: Typing animation effect
- **Boxicons & Bootstrap Icons**: Icon libraries
- **GitHub Pages**: Static site hosting
- **GitHub Actions**: CI/CD pipeline

## 🎨 Customization

### Update Content

- **Personal Information**: Edit `src/components/About.js` and `src/components/Hero.js`
- **Professional Experience**: Update `src/components/Resume.js`
- **Skills**: Modify `src/components/Skills.js`
- **Contact Details**: Edit `src/components/Contact.js`

### Styling

- **Global Styles**: Edit `src/index.css`
- **Custom CSS**: Modify `src/assets/assets/css/style.css`
- **Component Styles**: Add component-specific styles

### Assets

- **Images**: Place in `public/assets/img/`
- **Other Assets**: Place in appropriate `public/assets/` subdirectories

## 🔧 Available Scripts

- `npm start`: Start development server
- `npm run build`: Build for production
- `npm test`: Run tests
- `npm run deploy`: Deploy to GitHub Pages
- `npm run eject`: Eject from Create React App (not recommended)

## 📋 GitHub Pages Setup

1. Go to your GitHub repository settings
2. Navigate to "Pages" section
3. Set source to "GitHub Actions"
4. The deployment workflow will handle the rest

## 🐛 Troubleshooting

### Build Issues

If you encounter build issues:

1. Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

2. Clear React scripts cache:
```bash
npm start -- --reset-cache
```

### Deployment Issues

If GitHub Pages deployment fails:

1. Check GitHub Actions logs in the repository
2. Ensure the `homepage` field in `package.json` is correct
3. Verify GitHub Pages is enabled in repository settings

## 📄 License

This project is licensed under the MIT License - see the repository for details.

## 👤 Author

**Chandan Gupta Bhagat**
- Website: [chandanbhagat.com.np](https://chandanbhagat.com.np)
- Email: chandan.bhagat@outlook.com
- LinkedIn: [guptac](https://linkedin.com/in/guptac)
- GitHub: [thechandanbhagat](https://github.com/thechandanbhagat)

---

## 🔄 Migration from Static HTML

This React application was migrated from a static HTML website with the following improvements:

- ✅ Component-based architecture
- ✅ Modern build process
- ✅ Automated deployment
- ✅ Better performance optimization
- ✅ Improved maintainability
- ✅ TypeScript ready (can be added later)

The original static files are preserved in the repository for reference.