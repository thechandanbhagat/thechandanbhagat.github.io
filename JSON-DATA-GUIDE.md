# Portfolio JSON Data Management Guide

This guide explains how to use the comprehensive JSON data system to manage your portfolio content easily without touching React components.

## 📁 File Structure

```
src/
├── data/
│   └── portfolio.json          # Main data file
├── utils/
│   └── data.js                 # Data management utilities
└── components/                 # React components (use JSON data)
```

## 🗂️ JSON Data Structure Overview

The `portfolio.json` file contains all your portfolio content organized into logical sections:

### 1. **Personal Information** (`personal`)
```json
{
  "personal": {
    "name": "Your Full Name",
    "title": "Your Professional Title",
    "tagline": "Brief professional summary",
    "location": "City, Country",
    "email": "your.email@example.com",
    "phone": "+1234567890",
    "website": "https://yourwebsite.com",
    "profileImage": "/assets/img/profile-img.jpg",
    "availability": {
      "status": "available|busy|unavailable",
      "message": "Current availability status"
    }
  }
}
```

### 2. **Hero Section** (`hero`)
```json
{
  "hero": {
    "typedStrings": [
      "I'm a Software Engineer",
      "I'm a Cloud Consultant",
      "Add more roles here..."
    ],
    "sanskritQuotes": [
      "Optional quotes in any language",
      "Will be displayed with typing effect"
    ]
  }
}
```

### 3. **Social Links** (`socialLinks`)
```json
{
  "socialLinks": [
    {
      "platform": "twitter",
      "url": "https://twitter.com/username",
      "icon": "bx bxl-twitter",
      "className": "twitter"
    }
  ]
}
```

### 4. **Navigation Menu** (`navigation`)
```json
{
  "navigation": [
    {
      "label": "Home",
      "href": "#hero",
      "icon": "bx bx-home"
    },
    {
      "label": "Custom Page",
      "href": "/custom",
      "icon": "/path/to/icon.svg",
      "isImage": true
    }
  ]
}
```

### 5. **About Section** (`about`)
```json
{
  "about": {
    "introduction": "Your professional introduction",
    "coreCompetencies": [
      {
        "title": "Skill Name",
        "description": "Detailed description of this skill"
      }
    ],
    "additionalSkills": [
      {
        "title": "Skill Name",
        "icon": "fas fa-icon-name",
        "description": "Description"
      }
    ],
    "communityInvolvement": [
      {
        "title": "Activity Name",
        "description": "What you do in this community"
      }
    ],
    "education": {
      "degree": "Your Degree",
      "institution": "University Name",
      "period": "2020 - 2024"
    }
  }
}
```

### 6. **Skills Categories** (`skills`)
```json
{
  "skills": {
    "categories": [
      {
        "title": "Category Name",
        "skills": [
          {
            "name": "Skill Name",
            "icon": "bx bxl-skill-icon"
          },
          {
            "name": "Custom Skill",
            "icon": "custom-svg",
            "customSvg": "<svg>...</svg>"
          }
        ]
      }
    ]
  }
}
```

### 7. **Work Experience** (`experience`)
```json
{
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "period": "Start Date - End Date",
      "location": "City, Country",
      "type": "full-time|part-time|contract|leadership",
      "technologies": ["Tech1", "Tech2", "Tech3"],
      "achievements": [
        "Achievement 1 with metrics",
        "Achievement 2 with impact",
        "Achievement 3 with results"
      ]
    }
  ]
}
```

### 8. **Facts & Services** (`facts`)
```json
{
  "facts": {
    "title": "Section Title",
    "statistics": [
      {
        "number": "10+",
        "title": "Years Experience",
        "icon": "bx bx-time-five"
      }
    ],
    "services": [
      {
        "title": "Service Name",
        "description": "Service description",
        "icon": "bx bxs-icon",
        "animation": "fade-right"
      }
    ]
  }
}
```

### 9. **Contact Information** (`contact`)
```json
{
  "contact": {
    "title": "Get in Touch",
    "subtitle": "Contact subtitle",
    "contactMethods": [
      {
        "type": "email",
        "icon": "bi bi-envelope",
        "title": "Email",
        "value": "your.email@example.com",
        "link": "mailto:your.email@example.com"
      }
    ],
    "socialMedia": [
      {
        "platform": "LinkedIn",
        "icon": "bi bi-linkedin",
        "url": "https://linkedin.com/in/username"
      }
    ]
  }
}
```

## 🛠️ How to Update Content

### Adding New Work Experience

1. Open `src/data/portfolio.json`
2. Find the `experience` array
3. Add new experience at the beginning (most recent first):

```json
{
  "title": "Senior Software Engineer",
  "company": "New Company",
  "period": "January 2024 - Present",
  "location": "Remote",
  "type": "full-time",
  "technologies": ["React", "Node.js", "AWS", "Docker"],
  "achievements": [
    "Led team of 5 developers to deliver 3 major features",
    "Improved application performance by 40%",
    "Implemented CI/CD pipeline reducing deployment time by 60%"
  ]
}
```

### Adding New Skills

1. Find the `skills.categories` array
2. Either add to existing category or create new category:

```json
{
  "title": "New Technology Category",
  "skills": [
    {
      "name": "New Framework",
      "icon": "bx bxl-react"
    },
    {
      "name": "Custom Tool",
      "icon": "custom-svg",
      "customSvg": "<svg>your custom SVG here</svg>"
    }
  ]
}
```

### Updating Personal Information

1. Find the `personal` section
2. Update any field:

```json
{
  "personal": {
    "name": "Updated Name",
    "title": "New Job Title",
    "email": "newemail@example.com",
    "phone": "+1234567890",
    "location": "New City, Country"
  }
}
```

### Adding Social Links

1. Find the `socialLinks` array
2. Add new social platform:

```json
{
  "platform": "youtube",
  "url": "https://youtube.com/@username",
  "icon": "bx bxl-youtube",
  "className": "youtube"
}
```

## 🚀 Using Data in Components

### Import Data Utilities

```javascript
import { 
  getPersonalInfo, 
  getExperience, 
  getSkillsData,
  portfolioDataManager 
} from '../utils/data';
```

### Basic Usage

```javascript
const MyComponent = () => {
  const personalInfo = getPersonalInfo();
  const experience = getExperience();
  
  return (
    <div>
      <h1>{personalInfo.name}</h1>
      <p>{personalInfo.email}</p>
      
      {experience.map((job, index) => (
        <div key={index}>
          <h3>{job.title} at {job.company}</h3>
          <p>{job.period}</p>
        </div>
      ))}
    </div>
  );
};
```

### Advanced Usage with Data Manager

```javascript
import portfolioDataManager from '../utils/data';

const AdvancedComponent = () => {
  // Search functionality
  const reactExperience = portfolioDataManager.searchExperience('react');
  
  // Add new experience
  const addNewJob = () => {
    portfolioDataManager.addExperience({
      title: "New Position",
      company: "New Company",
      // ... other fields
    });
  };
  
  // Get skills by category
  const frontendSkills = portfolioDataManager.getSkillsByCategory(
    'Languages & Frameworks'
  );
  
  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
};
```

## 🎨 Customization Tips

### Icons
- Use [Boxicons](https://boxicons.com/) for most icons: `bx bx-icon-name`
- Use [Bootstrap Icons](https://icons.getbootstrap.com/) for contact: `bi bi-icon-name`
- Use [Font Awesome](https://fontawesome.com/) for special icons: `fas fa-icon-name`
- Add custom SVGs using the `customSvg` field

### Animations
- AOS animations: `fade-up`, `fade-right`, `zoom-in`, `flip-up`
- Add delays: `data-aos-delay="100"`

### Images
- Place images in `public/assets/img/`
- Reference as `/assets/img/filename.jpg`
- Optimize images for web (WebP format recommended)

## 📋 Content Templates

### Experience Entry Template
```json
{
  "title": "Position Title",
  "company": "Company Name",
  "period": "Month Year - Month Year",
  "location": "City, Country/Remote",
  "type": "full-time|part-time|contract|leadership",
  "technologies": ["Tech1", "Tech2", "Tech3"],
  "achievements": [
    "Quantified achievement with metrics (increased X by Y%)",
    "Leadership achievement (led team of X people)",
    "Technical achievement (implemented X resulting in Y)"
  ]
}
```

### Skill Entry Template
```json
{
  "name": "Technology/Skill Name",
  "icon": "bx bxl-technology-icon",
  "proficiency": "beginner|intermediate|advanced|expert",
  "yearsOfExperience": 5
}
```

### Contact Method Template
```json
{
  "type": "email|phone|location|website",
  "icon": "bi bi-icon-name",
  "title": "Display Title",
  "value": "Actual Value",
  "link": "clickable-link-if-applicable"
}
```

## 🔍 Validation and Testing

The data manager includes validation methods:

```javascript
import portfolioDataManager from '../utils/data';

// Validate all data
const validation = portfolioDataManager.validateData();
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
}

// Export data for backup
const jsonBackup = portfolioDataManager.exportToJSON();
```

## 🔄 Migration and Backup

### Export Current Data
```javascript
// Full JSON export
const fullData = portfolioDataManager.exportToJSON();

// Resume-specific export
const resumeData = portfolioDataManager.exportPersonalInfoForResume();
const experienceData = portfolioDataManager.exportExperienceForResume();
```

### Import New Data
1. Update `src/data/portfolio.json` with new content
2. The React components will automatically use the new data
3. Restart development server to see changes

## 🚨 Important Notes

1. **Always validate JSON syntax** - Use a JSON validator before saving
2. **Backup before major changes** - Keep copies of your data
3. **Images paths** - Use absolute paths starting with `/`
4. **Icons** - Verify icon names exist in the respective libraries
5. **Links** - Ensure all URLs are complete and working
6. **Performance** - Large amounts of data may affect page load times

## 🆘 Troubleshooting

### Component Not Updating
- Check JSON syntax validity
- Restart development server
- Clear browser cache

### Icons Not Showing
- Verify icon library is imported in `src/index.css`
- Check icon name spelling
- Ensure icon exists in the specified library

### Images Not Loading
- Check file path spelling and case sensitivity
- Ensure image exists in `public/assets/img/`
- Check browser network tab for 404 errors

---

This JSON system makes your portfolio completely data-driven and easy to maintain. You can update content, add new sections, or modify existing information without touching any React code!