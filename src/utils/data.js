import portfolioData from '../data/portfolio.json';

/**
 * Portfolio data management utility
 * Provides easy access to portfolio data with validation and fallbacks
 */

export class PortfolioDataManager {
  constructor() {
    this.data = portfolioData;
  }

  // Personal Information
  getPersonalInfo() {
    return this.data.personal || {};
  }

  getName() {
    return this.data.personal?.name || "Your Name";
  }

  getTitle() {
    return this.data.personal?.title || "Professional Title";
  }

  getTagline() {
    return this.data.personal?.tagline || "Your professional tagline";
  }

  getLocation() {
    return this.data.personal?.location || "Your Location";
  }

  getContact() {
    return {
      email: this.data.personal?.email || "your.email@example.com",
      phone: this.data.personal?.phone || "+1234567890",
      website: this.data.personal?.website || "https://yourwebsite.com"
    };
  }

  getAvailability() {
    return this.data.personal?.availability || { status: "unknown", message: "Status unknown" };
  }

  // Hero Section
  getHeroData() {
    return this.data.hero || {};
  }

  getTypedStrings() {
    return this.data.hero?.typedStrings || ["Welcome to my portfolio"];
  }

  getSanskritQuotes() {
    return this.data.hero?.sanskritQuotes || [];
  }

  // Social Links
  getSocialLinks() {
    return this.data.socialLinks || [];
  }

  getSocialLinkByPlatform(platform) {
    return this.data.socialLinks?.find(link => link.platform === platform) || null;
  }

  // Navigation
  getNavigation() {
    return this.data.navigation || [];
  }

  // About Section
  getAboutData() {
    return this.data.about || {};
  }

  getIntroduction() {
    return this.data.about?.introduction || "About me content";
  }

  getCoreCompetencies() {
    return this.data.about?.coreCompetencies || [];
  }

  getAdditionalSkills() {
    return this.data.about?.additionalSkills || [];
  }

  getCommunityInvolvement() {
    return this.data.about?.communityInvolvement || [];
  }

  getClosingStatement() {
    return this.data.about?.closingStatement || "";
  }

  getEducation() {
    return this.data.about?.education || {};
  }

  // Facts Section
  getFactsData() {
    return this.data.facts || {};
  }

  getStatistics() {
    return this.data.facts?.statistics || [];
  }

  getServices() {
    return this.data.facts?.services || [];
  }

  // Skills
  getSkillsData() {
    return this.data.skills || {};
  }

  getSkillCategories() {
    return this.data.skills?.categories || [];
  }

  getSkillsByCategory(categoryTitle) {
    const category = this.data.skills?.categories?.find(cat => cat.title === categoryTitle);
    return category?.skills || [];
  }

  // Experience
  getExperience() {
    return this.data.experience || [];
  }

  getExperienceByCompany(company) {
    return this.data.experience?.find(exp => exp.company === company) || null;
  }

  getEarlierRoles() {
    return this.data.earlierRoles || [];
  }

  getTechnicalSkills() {
    return this.data.technicalSkills || {};
  }

  getTechnicalSkillsByCategory(category) {
    return this.data.technicalSkills?.[category] || [];
  }

  // Contact
  getContactData() {
    return this.data.contact || {};
  }

  getContactMethods() {
    return this.data.contact?.contactMethods || [];
  }

  getSocialMedia() {
    return this.data.contact?.socialMedia || [];
  }

  // Footer
  getFooterData() {
    return this.data.footer || {};
  }

  // Theme and Settings
  getThemeSettings() {
    return this.data.theme || {};
  }

  getAnimationSettings() {
    return this.data.animations || {};
  }

  // Portfolio
  getPortfolioData() {
    return this.data.portfolio || {};
  }

  getPortfolioItems() {
    return this.data.portfolio?.items || [];
  }

  getPortfolioCategories() {
    return this.data.portfolio?.categories || [];
  }

  getPortfolioItemById(id) {
    return this.data.portfolio?.items?.find(item => item.id === id) || null;
  }

  getPortfolioItemsByCategory(category) {
    if (category === 'all' || !category) {
      return this.getPortfolioItems();
    }
    return this.data.portfolio?.items?.filter(item => 
      item.category.includes(category)
    ) || [];
  }

  // Group Code
  getGroupCodeData() {
    return this.data.groupcode || {};
  }

  getGroupCodeFeatures() {
    return this.data.groupcode?.features || [];
  }

  getGroupCodeSupportedLanguages() {
    return this.data.groupcode?.supportedLanguages || [];
  }

  getGroupCodeInstallation() {
    return this.data.groupcode?.installation || {};
  }

  getGroupCodeUsage() {
    return this.data.groupcode?.usage || {};
  }

  getGroupCodeFAQ() {
    return this.data.groupcode?.faq || [];
  }

  // Important Links
  getImportantLinksData() {
    return this.data.importantLinks || {};
  }

  getImportantLinksCategories() {
    return this.data.importantLinks?.categories || [];
  }

  getImportantLinksByCategory(categoryName) {
    const category = this.data.importantLinks?.categories?.find(cat => cat.category === categoryName);
    return category?.items || [];
  }

  // Utility Methods
  addExperience(experienceData) {
    if (!this.data.experience) this.data.experience = [];
    this.data.experience.unshift(experienceData); // Add to beginning (most recent)
    return this.data.experience;
  }

  updatePersonalInfo(updates) {
    this.data.personal = { ...this.data.personal, ...updates };
    return this.data.personal;
  }

  addSkill(category, skill) {
    const skillCategory = this.data.skills?.categories?.find(cat => cat.title === category);
    if (skillCategory) {
      skillCategory.skills.push(skill);
    }
    return skillCategory;
  }

  addSocialLink(socialLink) {
    if (!this.data.socialLinks) this.data.socialLinks = [];
    this.data.socialLinks.push(socialLink);
    return this.data.socialLinks;
  }

  // Validation Methods
  validateData() {
    const errors = [];
    
    if (!this.data.personal?.name) errors.push("Personal name is required");
    if (!this.data.personal?.email) errors.push("Personal email is required");
    if (!this.data.experience || this.data.experience.length === 0) {
      errors.push("At least one work experience is required");
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Export methods for different formats
  exportToJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  exportPersonalInfoForResume() {
    return {
      name: this.getName(),
      title: this.getTitle(),
      contact: this.getContact(),
      location: this.getLocation(),
      socialLinks: this.getSocialLinks()
    };
  }

  exportExperienceForResume() {
    return this.getExperience().map(exp => ({
      position: exp.title,
      company: exp.company,
      period: exp.period,
      location: exp.location,
      achievements: exp.achievements
    }));
  }

  // Search and filter methods
  searchExperience(query) {
    const lowercaseQuery = query.toLowerCase();
    return this.getExperience().filter(exp => 
      exp.title.toLowerCase().includes(lowercaseQuery) ||
      exp.company.toLowerCase().includes(lowercaseQuery) ||
      exp.technologies.some(tech => tech.toLowerCase().includes(lowercaseQuery)) ||
      exp.achievements.some(achievement => achievement.toLowerCase().includes(lowercaseQuery))
    );
  }

  getExperienceByTechnology(technology) {
    return this.getExperience().filter(exp => 
      exp.technologies.some(tech => 
        tech.toLowerCase().includes(technology.toLowerCase())
      )
    );
  }

  getSkillsFlat() {
    const allSkills = [];
    this.getSkillCategories().forEach(category => {
      category.skills.forEach(skill => {
        allSkills.push({
          ...skill,
          category: category.title
        });
      });
    });
    return allSkills;
  }
}

// Create a singleton instance
const portfolioDataManager = new PortfolioDataManager();

// Export individual functions for convenience
export const getPersonalInfo = () => portfolioDataManager.getPersonalInfo();
export const getName = () => portfolioDataManager.getName();
export const getTitle = () => portfolioDataManager.getTitle();
export const getHeroData = () => portfolioDataManager.getHeroData();
export const getSocialLinks = () => portfolioDataManager.getSocialLinks();
export const getNavigation = () => portfolioDataManager.getNavigation();
export const getAboutData = () => portfolioDataManager.getAboutData();
export const getFactsData = () => portfolioDataManager.getFactsData();
export const getSkillsData = () => portfolioDataManager.getSkillsData();
export const getExperience = () => portfolioDataManager.getExperience();
export const getContactData = () => portfolioDataManager.getContactData();
export const getFooterData = () => portfolioDataManager.getFooterData();
export const getPortfolioData = () => portfolioDataManager.getPortfolioData();
export const getPortfolioItems = () => portfolioDataManager.getPortfolioItems();
export const getPortfolioCategories = () => portfolioDataManager.getPortfolioCategories();
export const getGroupCodeData = () => portfolioDataManager.getGroupCodeData();
export const getImportantLinksData = () => portfolioDataManager.getImportantLinksData();
export const getImportantLinksCategories = () => portfolioDataManager.getImportantLinksCategories();

// Export the manager instance for advanced usage
export default portfolioDataManager;