const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  reportName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reportType: {
    type: DataTypes.ENUM(
      'Executive Summary',
      'Risk Assessment',
      'Compliance Report',
      'Attack Surface Analysis',
      'Business Impact Analysis',
      'Full Assessment',
      'Control Effectiveness',
      'Remediation Plan'
    ),
    allowNull: false,
  },
  format: {
    type: DataTypes.ENUM('PDF', 'Excel', 'HTML'),
    defaultValue: 'PDF',
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Generated', 'Reviewed', 'Approved', 'Archived'),
    defaultValue: 'Draft',
  },
  
  // Report Content
  executiveSummary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  riskOverview: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  compliancePosture: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  attackSurfaceAnalysis: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  businessImpactAnalysis: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  recommendedControls: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  governanceObservations: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  
  // Metrics
  totalRisksIdentified: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  criticalRisks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  highRisks: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  complianceScore: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0,
  },
  
  // File Information
  filePath: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  downloadUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  // Metadata
  generatedBy: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  approvedBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  reportPeriodStart: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reportPeriodEnd: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  recipientEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'Reports',
  timestamps: true,
  paranoid: true,
});

module.exports = Report;
