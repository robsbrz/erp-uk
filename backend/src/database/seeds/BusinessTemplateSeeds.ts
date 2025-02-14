import { getRepository } from 'typeorm';
import { BusinessTemplate } from '../../models/templates/BusinessTemplate';
import { CustomField, FieldType, EntityType } from '../../models/templates/CustomField';

const templates = [
  // Retail Business
  {
    name: 'Retail Store',
    description: 'Template for UK retail businesses and shops',
    features: ['inventory_management', 'epos', 'customer_loyalty', 'staff_management'],
    modules: {
      inventory: {
        enabled: true,
        settings: {
          stock_control: true,
          supplier_management: true,
          barcode_scanning: true,
          reorder_automation: true
        }
      },
      sales: {
        enabled: true,
        settings: {
          pos_integration: true,
          loyalty_program: true,
          gift_cards: true,
          online_integration: true
        }
      }
    },
    defaultSettings: {
      currency: 'GBP',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Europe/London',
      vatEnabled: true
    },
    customFields: [
      {
        name: 'store_type',
        label: 'Store Type',
        type: 'select' as FieldType,
        entityType: 'products' as EntityType,
        required: true,
        options: ['High Street', 'Shopping Centre', 'Retail Park', 'Online']
      },
      {
        name: 'sales_channel',
        label: 'Sales Channel',
        type: 'select' as FieldType,
        entityType: 'products' as EntityType,
        required: true,
        options: ['In-Store', 'Online', 'Marketplace', 'Multi-Channel']
      }
    ]
  },

  // Hospitality
  {
    name: 'Hospitality Business',
    description: 'Template for UK hotels, restaurants and hospitality venues',
    features: ['bookings', 'pos', 'inventory', 'staff_management'],
    modules: {
      reservations: {
        enabled: true,
        settings: {
          online_booking: true,
          table_management: true,
          room_management: true,
          event_spaces: true
        }
      },
      operations: {
        enabled: true,
        settings: {
          kitchen_management: true,
          housekeeping: true,
          maintenance: true,
          stock_control: true
        }
      }
    },
    defaultSettings: {
      currency: 'GBP',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Europe/London',
      foodHygieneRating: ''
    },
    customFields: [
      {
        name: 'venue_type',
        label: 'Venue Type',
        type: 'select' as FieldType,
        entityType: 'services' as EntityType,
        required: true,
        options: ['Restaurant', 'Hotel', 'Pub', 'Cafe', 'Event Venue']
      },
      {
        name: 'service_type',
        label: 'Service Type',
        type: 'select' as FieldType,
        entityType: 'services' as EntityType,
        required: true,
        options: ['Full Service', 'Quick Service', 'Bar Service', 'Room Service']
      }
    ]
  },

  // Manufacturing
  {
    name: 'Manufacturing',
    description: 'Template for UK manufacturing and production facilities',
    features: ['production_planning', 'inventory_control', 'quality_management', 'supply_chain'],
    modules: {
      production: {
        enabled: true,
        settings: {
          batch_tracking: true,
          quality_control: true,
          machinery_maintenance: true,
          waste_management: true
        }
      },
      supply_chain: {
        enabled: true,
        settings: {
          supplier_management: true,
          raw_materials: true,
          distribution: true,
          warehouse_management: true
        }
      }
    },
    defaultSettings: {
      currency: 'GBP',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Europe/London',
      iso_certified: false
    },
    customFields: [
      {
        name: 'production_type',
        label: 'Production Type',
        type: 'select' as FieldType,
        entityType: 'products' as EntityType,
        required: true,
        options: ['Batch Production', 'Mass Production', 'Custom Manufacturing', 'Assembly']
      },
      {
        name: 'quality_standard',
        label: 'Quality Standard',
        type: 'select' as FieldType,
        entityType: 'products' as EntityType,
        required: true,
        options: ['ISO 9001', 'ISO 14001', 'OHSAS 18001', 'Industry Specific']
      }
    ]
  },

  // Construction
  {
    name: 'Construction',
    description: 'Template for UK construction companies and contractors',
    features: ['project_management', 'resource_planning', 'health_safety', 'estimating'],
    modules: {
      projects: {
        enabled: true,
        settings: {
          site_management: true,
          resource_scheduling: true,
          progress_tracking: true,
          document_control: true
        }
      },
      compliance: {
        enabled: true,
        settings: {
          health_safety: true,
          building_regulations: true,
          environmental: true,
          certifications: true
        }
      }
    },
    defaultSettings: {
      currency: 'GBP',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Europe/London',
      constructionScheme: ''
    },
    customFields: [
      {
        name: 'project_type',
        label: 'Project Type',
        type: 'select' as FieldType,
        entityType: 'services' as EntityType,
        required: true,
        options: ['Residential', 'Commercial', 'Industrial', 'Infrastructure']
      },
      {
        name: 'contract_type',
        label: 'Contract Type',
        type: 'select' as FieldType,
        entityType: 'services' as EntityType,
        required: true,
        options: ['Fixed Price', 'Cost Plus', 'Design & Build', 'Framework']
      }
    ]
  },

  // Professional Services
  {
    name: 'Professional Services',
    description: 'Template for UK consulting and professional service firms',
    features: ['project_management', 'time_tracking', 'client_portal', 'billing'],
    modules: {
      service_delivery: {
        enabled: true,
        settings: {
          project_tracking: true,
          resource_allocation: true,
          deliverable_management: true,
          client_collaboration: true
        }
      },
      business_dev: {
        enabled: true,
        settings: {
          proposal_management: true,
          pipeline_tracking: true,
          client_reporting: true,
          performance_metrics: true
        }
      }
    },
    defaultSettings: {
      currency: 'GBP',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Europe/London',
      professional_indemnity: true
    },
    customFields: [
      {
        name: 'service_category',
        label: 'Service Category',
        type: 'select' as FieldType,
        entityType: 'services' as EntityType,
        required: true,
        options: ['Consulting', 'Advisory', 'Technical Services', 'Creative Services']
      },
      {
        name: 'billing_model',
        label: 'Billing Model',
        type: 'select' as FieldType,
        entityType: 'services' as EntityType,
        required: true,
        options: ['Time & Materials', 'Fixed Fee', 'Retainer', 'Performance Based']
      }
    ]
  },

  // Financial Services
  {
    name: 'Financial Services',
    description: 'Template for UK financial advisers and planners',
    features: ['client_management', 'investment_tracking', 'compliance', 'reporting'],
    modules: {
      compliance: {
        enabled: true,
        settings: {
          fca_regulated: true,
          mifid_ii: true,
          client_categorisation: true
        }
      },
      investments: {
        enabled: true,
        settings: {
          risk_profiling: true,
          portfolio_tracking: true,
          fund_analysis: true
        }
      }
    },
    defaultSettings: {
      currency: 'GBP',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Europe/London',
      regulator: 'FCA'
    },
    customFields: [
      {
        name: 'risk_profile',
        label: 'Risk Profile',
        type: 'select' as FieldType,
        entityType: 'customers' as EntityType,
        required: true,
        options: ['Conservative', 'Balanced', 'Growth', 'Aggressive']
      },
      {
        name: 'investment_horizon',
        label: 'Investment Horizon',
        type: 'select' as FieldType,
        entityType: 'customers' as EntityType,
        required: true,
        options: ['0-3 years', '3-5 years', '5-10 years', '10+ years']
      }
    ]
  },

  // Healthcare
  {
    name: 'Healthcare',
    description: 'Template for UK healthcare providers and clinics',
    features: ['patient_management', 'appointments', 'medical_records', 'billing'],
    modules: {
      clinical: {
        enabled: true,
        settings: {
          electronic_records: true,
          prescription_management: true,
          lab_integration: true,
          nhs_integration: true
        }
      },
      appointments: {
        enabled: true,
        settings: {
          online_booking: true,
          waitlist_management: true,
          reminder_system: true,
          emergency_slots: true
        }
      }
    },
    defaultSettings: {
      currency: 'GBP',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Europe/London',
      nhs_registered: true
    },
    customFields: [
      {
        name: 'speciality',
        label: 'Medical Speciality',
        type: 'select' as FieldType,
        entityType: 'services' as EntityType,
        required: true,
        options: ['General Practice', 'Dentistry', 'Physiotherapy', 'Specialist Care']
      },
      {
        name: 'registration_type',
        label: 'Registration Type',
        type: 'select' as FieldType,
        entityType: 'services' as EntityType,
        required: true,
        options: ['NHS', 'Private', 'Mixed', 'Specialist']
      }
    ]
  },

  // Education and Training
  {
    name: 'Education Provider',
    description: 'Template for UK education and training providers',
    features: ['student_management', 'course_management', 'attendance_tracking', 'assessments'],
    modules: {
      academic: {
        enabled: true,
        settings: {
          curriculum_management: true,
          assessment_tracking: true,
          attendance_monitoring: true,
          virtual_learning: true
        }
      },
      administration: {
        enabled: true,
        settings: {
          enrollment_management: true,
          timetabling: true,
          resource_allocation: true,
          reporting: true
        }
      }
    },
    defaultSettings: {
      currency: 'GBP',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      timezone: 'Europe/London',
      ofsted_registered: false
    },
    customFields: [
      {
        name: 'institution_type',
        label: 'Institution Type',
        type: 'select' as FieldType,
        entityType: 'services' as EntityType,
        required: true,
        options: ['School', 'College', 'University', 'Training Provider']
      },
      {
        name: 'course_level',
        label: 'Course Level',
        type: 'select' as FieldType,
        entityType: 'services' as EntityType,
        required: true,
        options: ['Primary', 'Secondary', 'Higher Education', 'Professional']
      }
    ]
  }
];

export const seedBusinessTemplates = async () => {
    const templateRepository = getRepository(BusinessTemplate);
    const customFieldRepository = getRepository(CustomField);
  
    try {
      console.log('Starting business templates seeding...');
  
      for (const templateData of templates) {
        const { customFields, ...templateInfo } = templateData;
        
        // Check if template already exists
        const existingTemplate = await templateRepository.findOne({ 
          where: { name: templateInfo.name }
        });
        
        if (existingTemplate) {
          console.log(`Template ${templateInfo.name} already exists, skipping...`);
          continue;
        }
  
        // Create new template
        const template = templateRepository.create(templateInfo);
        
        try {
          const savedTemplate = await templateRepository.save(template);
          console.log(`Created template: ${savedTemplate.name}`);
  
          if (customFields && customFields.length > 0) {
            for (const fieldData of customFields) {
              try {
                const field = customFieldRepository.create({
                  ...fieldData,
                  template: savedTemplate,
                  segmentSpecific: false,
                  settings: {}
                });
                await customFieldRepository.save(field);
                console.log(`Created custom field: ${field.name} for template: ${savedTemplate.name}`);
              } catch (fieldError) {
                console.error(`Error creating custom field ${fieldData.name}:`, fieldError);
                // Continue with other fields even if one fails
              }
            }
          }
        } catch (templateError) {
          console.error(`Error creating template ${templateInfo.name}:`, templateError);
          // Continue with other templates even if one fails
        }
      }
  
      console.log('Business templates seeding completed successfully!');
    } catch (error) {
      console.error('Fatal error seeding business templates:', error);
      throw error;
    }
  };
  
