import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaBuilding, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaGlobe, 
  FaIndustry, 
  FaInfoCircle, 
  FaUpload,
  FaSave,
  FaExclamationTriangle,
  FaCalendar,
  FaUsers
} from "react-icons/fa";

export default function CompanyProfilePage() {
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    companyWebsite: "",
    companyIndustry: "",
    companyLocation: "",
    companyDescription: "",
    companySize: "",
    companyFounded: "",
    companyLogo: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const industryOptions = [
    "Technology", "Healthcare", "Finance", "Education", 
    "Manufacturing", "Retail", "Entertainment", "Hospitality",
    "Transportation", "Construction", "Agriculture", "Other"
  ];

  const companySizeOptions = [
    "1-10 employees", "11-50 employees", "51-200 employees", 
    "201-500 employees", "501-1000 employees", "1000+ employees"
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({...errors, [name]: null});
    }
  }

  function handleLogoChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, companyLogo: URL.createObjectURL(e.target.files[0]) });
    }
  }

  function validateForm() {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = "Company name is required";
    if (!formData.companyEmail.trim()) {
      newErrors.companyEmail = "Company email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.companyEmail)) {
      newErrors.companyEmail = "Please enter a valid email address";
    }
    
    if (!formData.companyWebsite.trim()) {
      newErrors.companyWebsite = "Company website is required";
    } else if (!/^(http|https):\/\/[^ "]+$/.test(formData.companyWebsite)) {
      newErrors.companyWebsite = "Please enter a valid URL (include http:// or https://)";
    }
    
    if (!formData.companyDescription.trim()) {
      newErrors.companyDescription = "Company description is required";
    } else if (formData.companyDescription.length < 50) {
      newErrors.companyDescription = "Description should be at least 50 characters";
    }

    if (!formData.companyIndustry.trim()) {
      newErrors.companyIndustry = "Industry is required";
    }

    if (!formData.companySize.trim()) {
      newErrors.companySize = "Company size is required";
    }

    if (formData.companyFounded && (formData.companyFounded < 1900 || formData.companyFounded > new Date().getFullYear())) {
      newErrors.companyFounded = "Please enter a valid year";
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      window.scrollTo(0, 0);
    } else {
      setIsSubmitting(true);
      setErrors({});
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessMessage(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }, 1000);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f1c] text-gray-300">
      <main className="flex-1 container pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/companydashboard" className="flex items-center mr-4 bg-[#161a26] text-purple-400 p-2 rounded-lg hover:text-purple-300 border border-gray-800 transition-colors">
              <FaArrowLeft className="h-5 w-5 text-white" />
            </Link>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r text-white">Company Profile</h1>
          </div>
        </div>

        {showSuccessMessage && (
          <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 text-white">
            <div className="flex items-center">
              <FaInfoCircle className="text-purple-400 mr-2 text-white" />
              <p>Company profile successfully updated!</p>
            </div>
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50">
            <div className="flex items-center mb-2">
              <FaExclamationTriangle className="text-red-400 mr-2 text-white" />
              <p className="font-medium text-red-400">Please correct the following errors:</p>
            </div>
            <ul className="list-disc pl-10 text-red-400 text-sm">
              {Object.values(errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 border border-gray-800 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-1 flex flex-col items-center justify-center">
              <div className="w-40 h-40 rounded-full bg-[#0b0f1c] border-2 border-dashed border-gray-700 flex items-center justify-center mb-4 overflow-hidden">
                {formData.companyLogo ? (
                  <img src={formData.companyLogo} alt="Company logo" className="w-full h-full object-cover" />
                ) : (
                  <FaBuilding className="text-5xl text-gray-600" />
                )}
              </div>
              <label className="bg-[#161a26] text-purple-400 px-4 py-2 rounded-lg border border-purple-500 cursor-pointer hover:bg-[#1c2235] transition-colors">
                <FaUpload className="inline mr-2" />
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2 text-center">Recommended: Square image, at least 400x400px</p>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">Company Information</h2>
              <p className="text-gray-400 mb-4">Complete your company profile to help candidates learn more about your organization.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    <FaBuilding className="inline mr-2 text-white" /> Company Name*
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter your company name"
                    className={`w-full border p-3 rounded-lg placeholder-gray-500 bg-[#0b0f1c] text-gray-300 ${
                      errors.companyName ? 'border-red-500 focus:border-red-500' : 'border-gray-800 focus:border-purple-500'
                    } focus:ring-1 focus:ring-purple-500 transition-colors`}
                  />
                  {errors.companyName && <p className="text-pink-500 text-sm mt-1">{errors.companyName}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    <FaEnvelope className="inline mr-2 text-white" /> Company Email*
                  </label>
                  <input
                    type="email"
                    name="companyEmail"
                    value={formData.companyEmail}
                    onChange={handleChange}
                    placeholder="Enter your company email"
                    className={`w-full border p-3 rounded-lg placeholder-gray-500 bg-[#0b0f1c] text-gray-300 ${
                      errors.companyEmail ? 'border-red-500 focus:border-red-500' : 'border-gray-800 focus:border-purple-500'
                    } focus:ring-1 focus:ring-purple-500 transition-colors`}
                  />
                  {errors.companyEmail && <p className="text-pink-500 text-sm mt-1">{errors.companyEmail}</p>}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  <FaGlobe className="inline mr-2 text-white" /> Company Website*
                </label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  className={`w-full border p-3 rounded-lg placeholder-gray-500 bg-[#0b0f1c] text-gray-300 ${
                    errors.companyWebsite ? 'border-red-500 focus:border-red-500' : 'border-gray-800 focus:border-purple-500'
                  } focus:ring-1 focus:ring-purple-500 transition-colors`}
                />
                {errors.companyWebsite && <p className="text-pink-500 text-sm mt-1">{errors.companyWebsite}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  <FaIndustry className="inline mr-2 text-white" /> Industry*
                </label>
                <select
                  name="companyIndustry"
                  value={formData.companyIndustry}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg bg-[#0b0f1c] text-gray-300 border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                >
                  <option value="" disabled>Select an industry</option>
                  {industryOptions.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  <FaMapMarkerAlt className="inline mr-2 text-white" /> Location
                </label>
                <input
                  type="text"
                  name="companyLocation"
                  value={formData.companyLocation}
                  onChange={handleChange}
                  placeholder="City, State, Country"
                  className="w-full border p-3 rounded-lg placeholder-gray-500 bg-[#0b0f1c] text-gray-300 border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  <FaUsers className="inline mr-2 text-white" /> Company Size
                </label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg bg-[#0b0f1c] text-gray-300 border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                >
                  <option value="" disabled>Select company size</option>
                  {companySizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  <FaCalendar className="inline mr-2 text-white" /> Founded Year
                </label>
                <input
                  type="number"
                  name="companyFounded"
                  value={formData.companyFounded}
                  onChange={handleChange}
                  placeholder="e.g. 2010"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full border p-3 rounded-lg placeholder-gray-500 bg-[#0b0f1c] text-gray-300 border-gray-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white mb-1">
                  <FaInfoCircle className="inline mr-2 text-white" /> Company Description*
                </label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleChange}
                  placeholder="Write a brief description about your company, its mission, values, and what makes it unique..."
                  className={`w-full border p-3 rounded-lg resize-none placeholder-gray-500 bg-[#0b0f1c] text-gray-300 ${
                    errors.companyDescription ? 'border-red-500 focus:border-red-500' : 'border-gray-800 focus:border-purple-500'
                  } focus:ring-1 focus:ring-purple-500 transition-colors`}
                  rows="5"
                />
                {errors.companyDescription && 
                  <p className="text-pink-500 text-sm mt-1">{errors.companyDescription}</p>
                }
                <p className="text-xs text-gray-500 mt-1">
                  {formData.companyDescription.length} character{formData.companyDescription.length !== 1 ? 's' : ''} 
                  (Minimum 50 characters recommended)
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-800 mt-8">
              <button 
                type="button" 
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 mr-4 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`bg-violet-900/30 border border-violet-500/30 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2 text-white" />
                    Save Company Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}