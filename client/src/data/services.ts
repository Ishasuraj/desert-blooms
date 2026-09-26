import indoor1 from "@/assets/services/indoor_landscaping.jpg";
import indoor2 from "@/assets/services/indoor_landscaping_2.jpg";
import indoor3 from "@/assets/services/indoor_landscaping_3.png";

import outdoor1 from "@/assets/services/outdoor_landscaping.jpg";
import outdoor2 from "@/assets/services/outdoor_landscaping_2.jpg";
import outdoor3 from "@/assets/services/outdoor_landscaping_3.jpg";

import design1 from "@/assets/services/design_installation.jpg";
import design2 from "@/assets/services/design_installation_2.jpg";
import design3 from "@/assets/services/design_installation_3.jpg";

import irrigation1 from "@/assets/services/irrigation_systems.jpg";
import irrigation2 from "@/assets/services/irrigation_systems_2.jpg";
import irrigation3 from "@/assets/services/irrigation_systems_3.jpg";

import maintenance1 from "@/assets/services/landscape_maintenance.jpg";
import maintenance2 from "@/assets/services/landscape_maintenance_2.jpg";
import maintenance3 from "@/assets/services/landscape_maintenance_3.jpg";

import plants1 from "@/assets/services/plants_palms.jpg";
import plants2 from "@/assets/services/plants_palms_2.jpg";
import plants3 from "@/assets/services/plants_palms_3.jpg";

export interface Service {
  id: string;
  slug: string;
  number: string;
  title: string;
  summary: string;
  intro: string; // 2-3 sentence expanded paragraph
  bullets: string[]; // what's included
  benefits: string[]; // why it matters / outcomes
  cta: string; // closing call to action line
  image: string;
  galleryImages?: string[]; // optional additional images for asymmetric hero collage
  process?: { step: string }[];
}

export const SERVICES: Service[] = [
  {
    id: "indoor-landscaping",
    slug: "indoor-landscaping",
    number: "01",
    title: "INDOOR LANDSCAPING",
    summary: "Interior planting solutions designed to refresh commercial and residential spaces.",
    intro:
      "Bringing greenery indoors does more than decorate a space — it changes how a room feels and functions. We design and install indoor plant environments tailored to offices, hotels, and commercial interiors across Kuwait, where the harsh outdoor climate makes indoor green spaces especially valued. From a single statement planter to a full living wall, every installation is chosen for the light, humidity, and traffic of the space it's going into.",
    bullets: [
      "Indoor Plants & Trees",
      "Green Walls & Vertical Gardens",
      "Decorative Planters",
      "Natural Ambience for Offices/Hotels/Commercial Spaces",
      "Low Maintenance Solutions",
    ],
    benefits: [
      "Improves indoor air quality",
      "Softens hard commercial interiors",
      "Creates a calmer, more welcoming space for staff and visitors",
      "Selected for low upkeep in Kuwait's indoor climate",
    ],
    cta: "Have a lobby, office, or interior space that needs life? Get a free indoor landscaping consultation.",
    image: indoor1,
    galleryImages: [indoor2, indoor3],
  },
  {
    id: "outdoor-landscaping",
    slug: "outdoor-landscaping",
    number: "02",
    title: "OUTDOOR LANDSCAPING",
    summary: "Beautiful and functional outdoor spaces built for Kuwait's climate and lifestyle.",
    intro:
      "An outdoor space in Kuwait has to work with the climate, not against it — hardy planting, smart shade, and layouts that stay usable even in peak summer heat. We build residential gardens, villa landscapes, and public and commercial outdoor spaces that balance beauty with practicality, combining softscapes and hardscapes into a cohesive, low-maintenance design.",
    bullets: [
      "Residential Landscaping",
      "Commercial & Public Landscapes",
      "Softscapes & Hardscapes",
      "Palm Trees & Ornamental Plants",
      "Garden Lighting",
      "Water Features",
    ],
    benefits: [
      "Designed specifically for Kuwait's climate and soil",
      "Increases property value and curb appeal",
      "Combines beauty with day-to-day usability",
      "Lighting and water features extend outdoor living into the evening",
    ],
    cta: "Ready to transform your outdoor space? Get a free outdoor landscaping consultation.",
    image: outdoor1,
    galleryImages: [outdoor2, outdoor3],
  },
  {
    id: "landscape-design-installation",
    slug: "landscape-design-installation",
    number: "03",
    title: "LANDSCAPE DESIGN & INSTALLATION",
    summary: "Full-service design and execution for landscapes that are planned and installed with precision.",
    intro:
      "Every great landscape starts as an idea and a site visit. Our design team manages the full journey from first concept to final handover, so you're not coordinating separate designers, suppliers, and installers yourself — one team owns the project end to end, with attention to detail at every stage.",
    bullets: [
      "Custom Landscape Concepts",
      "Site & Soil Assessment",
      "Material Sourcing & Selection",
      "Full Installation Management",
      "Post-Installation Support",
    ],
    benefits: [
      "Single point of accountability from concept to completion",
      "Designs matched to your site's specific conditions",
      "No coordination headaches between separate contractors",
      "Ongoing support after handover",
    ],
    process: [
      { step: "Consultation & Site Assessment" },
      { step: "Concept & Design" },
      { step: "Material Selection" },
      { step: "Installation & Execution" },
      { step: "Final Handover & Support" },
    ],
    cta: "Have a landscape project in mind? Get a free design consultation and site assessment.",
    image: design1,
    galleryImages: [design2, design3],
  },
  {
    id: "irrigation-systems",
    slug: "irrigation-systems",
    number: "04",
    title: "IRRIGATION SYSTEMS",
    summary: "Efficient watering systems that save water while keeping landscapes healthy year-round.",
    intro:
      "Kuwait's climate makes efficient irrigation a necessity, not a luxury — a landscape is only as healthy as its watering system. We design and install irrigation setups that deliver the right amount of water to the right place at the right time, cutting waste while keeping green spaces healthy through the hottest months.",
    bullets: [
      "Automatic Irrigation Systems",
      "Drip Irrigation",
      "Smart Controllers & Timers",
      "Water-Efficient Solutions",
      "Maintenance & Upgrades",
    ],
    benefits: [
      "Reduces water waste and utility costs",
      "Keeps landscapes healthy year-round with minimal manual effort",
      "Smart controllers adjust automatically to weather and season",
      "Extends the life of existing plantings",
    ],
    cta: "Want a landscape that waters itself efficiently? Get a free irrigation system assessment.",
    image: irrigation1,
    galleryImages: [irrigation2, irrigation3],
  },
  {
    id: "landscape-maintenance",
    slug: "landscape-maintenance",
    number: "05",
    title: "LANDSCAPE MAINTENANCE",
    summary: "Reliable upkeep that keeps gardens clean, green, and presentation-ready through every season.",
    intro:
      "A landscape needs consistent care to stay healthy, especially in Kuwait's demanding climate. We offer regular maintenance programs and one-off seasonal services that keep lawns, plants, and gardens looking their best year-round, so your investment in landscaping doesn't fade after the first season.",
    bullets: [
      "Lawn Care & Mowing",
      "Pruning & Trimming",
      "Weed Control & Fertilization",
      "Pest & Disease Management",
      "Seasonal Cleanups",
      "Scheduled Maintenance Contracts",
    ],
    benefits: [
      "Protects your original landscaping investment long-term",
      "Flexible one-off or scheduled contract options",
      "Early pest and disease detection prevents costly damage",
      "Keeps properties looking presentation-ready year-round",
    ],
    cta: "Keep your landscape looking its best. Ask about a maintenance contract.",
    image: maintenance1,
    galleryImages: [maintenance2, maintenance3],
  },
  {
    id: "plants-palms-ground-covers",
    slug: "plants-palms-ground-covers",
    number: "06",
    title: "PLANTS, PALMS & GROUND COVERS",
    summary: "High-quality planting selections chosen specifically to thrive in Kuwait's conditions.",
    intro:
      "The right plant selection makes or breaks a landscape in Kuwait's climate. We supply and plant a wide range of palms, ornamentals, flowering plants, and ground covers chosen specifically for their ability to thrive in the local heat and soil conditions — so what you plant today still looks good years from now.",
    bullets: [
      "Palm Trees",
      "Ornamental Plants & Shrubs",
      "Flowering Plants",
      "Ground Covers",
      "Cacti & Succulents",
      "Plants Supply & Plantation",
    ],
    benefits: [
      "Species selected specifically for Kuwait's climate and soil",
      "Wide range from statement palms to low ground covers",
      "Direct supply and planting in one service",
      "Reduces plant loss and replacement costs long-term",
    ],
    cta: "Need plants that will actually thrive here? Get a free plant selection consultation.",
    image: plants1,
    galleryImages: [plants2, plants3],
  },
];

export const whyChooseUs: string[] = [
  "Experienced & Professional Team",
  "High Quality & Reliable Service",
  "Creative & Customized Solutions",
  "Use of Quality Materials & Plants",
  "Timely Completion & Support",
  "Commitment to Sustainability",
];

