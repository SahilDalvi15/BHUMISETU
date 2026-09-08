const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'client', 'src', 'pages');

const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));

const replacements = [
  // Search strings
  { search: 'placeholder="Search by Project Name or ID"', replace: 'placeholder={t("common.search")}' },
  { search: 'placeholder="Search by ID or Title..."', replace: 'placeholder={t("common.search")}' },
  { search: 'placeholder="Search tasks by ID or Title..."', replace: 'placeholder={t("common.search")}' },
  { search: 'placeholder="Search parcels..."', replace: 'placeholder={t("common.search")}' },
  { search: 'placeholder="Search families or IDs..."', replace: 'placeholder={t("common.search")}' },
  { search: 'placeholder="Search by award ID or name..."', replace: 'placeholder={t("common.search")}' },
  { search: 'placeholder="Search messages..."', replace: 'placeholder={t("common.search")}' },
  
  // Table headers
  { search: '>Project ID & Name<', replace: '>{t("common.name")}<' },
  { search: '>Type / Area<', replace: '>{t("common.stage")} / Area<' },
  { search: '>Current Stage<', replace: '>{t("common.progress")}<' },
  { search: '>Risk Level<', replace: '>{t("common.status")}<' },
  { search: '>Actions<', replace: '>{t("common.action")}<' },
  { search: '>Project<', replace: '>{t("common.name")}<' },
  { search: '>Stage<', replace: '>{t("common.stage")}<' },
  { search: '>Progress<', replace: '>{t("common.progress")}<' },
  { search: '>Risk/Status<', replace: '>{t("common.status")}<' },
  { search: '>Status<', replace: '>{t("common.status")}<' },
  { search: '>Date<', replace: '>{t("common.date")}<' },
  
  // Common action buttons
  { search: 'View Details', replace: '{t("common.viewDetails")}' },
  
  // File Specific Headings (if present)
  { search: 'Project Management', replace: '{t("pages.projects.title")}' },
  { search: 'Manage and monitor all active land acquisition projects.', replace: '{t("pages.projects.desc")}' },
  
  { search: 'Land Proposals', replace: '{t("pages.proposals.title")}' },
  { search: 'Review and track proposals submitted by Requiring Bodies.', replace: '{t("pages.proposals.desc")}' },

  { search: 'Compensation & Disbursement', replace: '{t("pages.compensation.title")}' },
  { search: 'Manage awards and track direct benefit transfers (DBT).', replace: '{t("pages.compensation.desc")}' },

  { search: 'Rehabilitation & Resettlement (R&R)', replace: '{t("pages.rr.title")}' },
  { search: 'Track and manage displaced families and their rehabilitation entitlements.', replace: '{t("pages.rr.desc")}' },

  { search: 'Land Possession', replace: '{t("pages.possession.title")}' },
  { search: 'Track physical handover and encumbrance clearing of acquired land.', replace: '{t("pages.possession.desc")}' },

  { search: 'Spatial Viewer', replace: '{t("pages.gis.title")}' },
  { search: 'Geospatial mapping of land parcels and project corridors.', replace: '{t("pages.gis.desc")}' },

  { search: 'Workflow & Approvals', replace: '{t("pages.tasks.title")}' },
  { search: 'Manage pending tasks and document reviews.', replace: '{t("pages.tasks.desc")}' },

  { search: 'System Alerts', replace: '{t("pages.alerts.title")}' },
  { search: 'Monitor critical bottlenecks and compliance risks.', replace: '{t("pages.alerts.desc")}' },

  { search: 'Bhumi-AI Intelligence', replace: '{t("pages.intelligence.title")}' },
  { search: 'Ask questions, analyze documents, and predict bottlenecks.', replace: '{t("pages.intelligence.desc")}' },
];

for (const file of files) {
  if (file === 'Dashboard.jsx' || file === 'CreateProject.jsx' || file === 'Landing.jsx') continue;
  
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  let modified = false;

  // Add import if not exists
  if (!content.includes("import { useTranslation }")) {
    content = content.replace(/(import.*?;)/, "$1\nimport { useTranslation } from 'react-i18next';");
    modified = true;
  }

  // Add hook if not exists
  if (!content.includes("const { t } = useTranslation();")) {
    const match = content.match(/const [a-zA-Z0-9]+ = \(\) => \{\n/);
    if (match) {
      content = content.replace(match[0], `${match[0]}  const { t } = useTranslation();\n`);
      modified = true;
    }
  }

  // Apply replacements
  for (const rep of replacements) {
    if (content.includes(rep.search)) {
      // Basic string replace all
      content = content.split(rep.search).join(rep.replace);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
