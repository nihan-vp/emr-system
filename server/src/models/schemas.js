import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseOptions = {
  _id: false,
  minimize: false,
};

const stringField = {
  type: String,
  default: '',
  trim: true,
};

export const appointmentSchema = new Schema(
  {
    id: {
      type: Schema.Types.Mixed,
      required: true,
    },
    name: stringField,
    mobile: stringField,
    email: stringField,
    time: stringField,
    date: stringField,
    notes: stringField,
    status: {
      type: String,
      default: 'upcoming',
      trim: true,
    },
    blood: stringField,
  },
  baseOptions
);

export const vitalEntrySchema = new Schema(
  {
    id: {
      type: Schema.Types.Mixed,
      required: true,
    },
    date: stringField,
    sys: stringField,
    dia: stringField,
    pulse: stringField,
    spo2: stringField,
    weight: stringField,
    temp: stringField,
    tempUnit: {
      type: String,
      default: 'C',
      trim: true,
    },
  },
  baseOptions
);

export const prescriptionMedicineSchema = new Schema(
  {
    id: {
      type: Schema.Types.Mixed,
      required: true,
    },
    inventoryId: {
      type: Schema.Types.Mixed,
      default: null,
    },
    name: stringField,
    content: stringField,
    type: {
      type: String,
      default: 'Tablet',
      trim: true,
    },
    doseQty: stringField,
    dosage: stringField,
    freq: stringField,
    duration: stringField,
    instruction: stringField,
    isTapering: {
      type: Boolean,
      default: false,
    },
  },
  baseOptions
);

export const procedureSchema = new Schema(
  {
    id: {
      type: Schema.Types.Mixed,
      required: true,
    },
    name: stringField,
    category: stringField,
    cost: stringField,
    duration: stringField,
    notes: stringField,
    date: stringField,
  },
  baseOptions
);

export const labReportSchema = new Schema(
  {
    fileName: stringField,
    mimeType: stringField,
    uri: stringField,
    size: {
      type: Number,
      default: null,
    },
    base64: stringField,
    dataUri: stringField,
    uploadedAt: stringField,
    uploadedBy: stringField,
  },
  baseOptions
);

export const investigationSchema = new Schema(
  {
    id: {
      type: Schema.Types.Mixed,
      required: true,
    },
    name: stringField,
    category: stringField,
    cost: stringField,
    duration: stringField,
    notes: stringField,
    report: {
      type: labReportSchema,
      default: null,
    },
  },
  baseOptions
);

export const patientSnapshotSchema = new Schema(
  {
    id: {
      type: Schema.Types.Mixed,
      default: null,
    },
    name: stringField,
    mobile: stringField,
    age: stringField,
    gender: stringField,
    blood: stringField,
  },
  baseOptions
);

export const prescriptionMetaSchema = new Schema(
  {
    sourceTemplateId: {
      type: Schema.Types.Mixed,
      default: null,
    },
    medicineCount: {
      type: Number,
      default: 0,
    },
    procedureCount: {
      type: Number,
      default: 0,
    },
    investigationCount: {
      type: Number,
      default: 0,
    },
  },
  baseOptions
);

export const prescriptionSchema = new Schema(
  {
    id: {
      type: Schema.Types.Mixed,
      required: true,
    },
    date: stringField,
    createdAt: stringField,
    updatedAt: stringField,
    templateName: stringField,
    diagnosis: stringField,
    advice: stringField,
    referral: stringField,
    medicines: {
      type: [prescriptionMedicineSchema],
      default: [],
    },
    procedures: {
      type: [procedureSchema],
      default: [],
    },
    nextVisitInvestigations: {
      type: [investigationSchema],
      default: [],
    },
    patientSnapshot: {
      type: patientSnapshotSchema,
      default: null,
    },
    meta: {
      type: prescriptionMetaSchema,
      default: () => ({}),
    },
  },
  baseOptions
);

export const patientSchema = new Schema(
  {
    id: {
      type: Schema.Types.Mixed,
      required: true,
    },
    name: stringField,
    mobile: stringField,
    email: stringField,
    age: stringField,
    dob: stringField,
    gender: stringField,
    blood: stringField,
    address: stringField,
    registeredDate: stringField,
    vitalsHistory: {
      type: [vitalEntrySchema],
      default: [],
    },
    rxHistory: {
      type: [prescriptionSchema],
      default: [],
    },
  },
  baseOptions
);

export const inventoryMedicineSchema = new Schema(
  {
    id: {
      type: Schema.Types.Mixed,
      required: true,
    },
    name: stringField,
    type: {
      type: String,
      default: 'Tablet',
      trim: true,
    },
    content: stringField,
  },
  baseOptions
);

export const templateSchema = new Schema(
  {
    id: {
      type: Schema.Types.Mixed,
      required: true,
    },
    name: stringField,
    diagnosis: stringField,
    advice: stringField,
    referral: stringField,
    medicines: {
      type: [prescriptionMedicineSchema],
      default: [],
    },
    procedures: {
      type: [procedureSchema],
      default: [],
    },
    nextVisitInvestigations: {
      type: [investigationSchema],
      default: [],
    },
  },
  baseOptions
);
