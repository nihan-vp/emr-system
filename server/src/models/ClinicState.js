import mongoose from 'mongoose';
import {
  appointmentSchema,
  inventoryMedicineSchema,
  patientSchema,
  procedureSchema,
  templateSchema
} from './schemas.js';

const { Schema } = mongoose;

const clinicStateSchema = new Schema(
  {
    stateKey: {
      type: String,
      required: true,
      unique: true,
      default: 'primary'
    },
    appointments: {
      type: [appointmentSchema],
      default: []
    },
    patients: {
      type: [patientSchema],
      default: []
    },
    medicines: {
      type: [inventoryMedicineSchema],
      default: []
    },
    templates: {
      type: [templateSchema],
      default: []
    },
    procedures: {
      type: [procedureSchema],
      default: []
    }
  },
  {
    timestamps: true,
    minimize: false
  }
);

export const ClinicState = mongoose.models.ClinicState || mongoose.model('ClinicState', clinicStateSchema);
