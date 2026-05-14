const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assessment = sequelize.define('Assessment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  assetId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Assets',
      key: 'id',
    },
  },
  riskId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Risks',
      key: 'id',
    },
  },
  assessmentName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  likelihood: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 },
    defaultValue: 3,
  },
  impact: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 },
    defaultValue: 3,
  },
  inheritRiskScore: {
    type: DataTypes.INTEGER,
    compute: function() {
      return this.likelihood * this.impact;
    },
  },
  currentControls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  controlEffectiveness: {
    type: DataTypes.INTEGER,
    validate: { min: 0, max: 100 },
    defaultValue: 0,
  },
  residualRiskScore: {
    type: DataTypes.INTEGER,
  },
  priority: {
    type: DataTypes.ENUM('Critical', 'High', 'Medium', 'Low'),
    defaultValue: 'Medium',
  },
  complianceFrameworks: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  status: {
    type: DataTypes.ENUM('Not Started', 'In Progress', 'Mitigated', 'Accepted'),
    defaultValue: 'Not Started',
  },
  // Business Impact Analysis
  estimatedFinancialLoss: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  rto: {
    type: DataTypes.STRING, // Recovery Time Objective
    defaultValue: '4 hours',
  },
  rpo: {
    type: DataTypes.STRING, // Recovery Point Objective
    defaultValue: '1 hour',
  },
  criticalBusinessFunction: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  downtimeCost: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
  },
  // Attack Surface Analysis
  internetExposureLevel: {
    type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
    defaultValue: 'Medium',
  },
  exposedServices: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  attackVectors: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  // Recommendations
  recommendedControls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
}, {
  tableName: 'Assessments',
});

// Calculate residual risk before saving
Assessment.addHook('beforeSave', (assessment) => {
  const mitigation = assessment.controlEffectiveness / 100;
  assessment.residualRiskScore = Math.round(assessment.inheritRiskScore * (1 - mitigation));
});

module.exports = Assessment;
