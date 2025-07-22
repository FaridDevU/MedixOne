import React from 'react'
import type { NextPage } from 'next'
import { Layout } from '@/components/layout/Layout'
import { PrescriptionForm } from '@/components/prescriptions/PrescriptionForm'

// Tipos locales para la página
interface Patient {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  dateOfBirth: Date
  gender: 'M' | 'F' | 'OTHER'
  allergies?: string
  createdAt: Date
  updatedAt: Date
}

interface Doctor {
  id: string
  firstName: string
  lastName: string
  specialty: string
  email: string
  phone: string
  schedule: any[]
  isActive: boolean
}

interface Medication {
  id: string
  name: string
  genericName: string
  brand: string
  category: string
  form: string
  strength: string
  unit: string
  description: string
  indications: string[]
  contraindications: string[]
  sideEffects: string[]
  interactions: string[]
  pregnancy: string
  price: number
  isControlled: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const NewPrescriptionPage: NextPage = () => {
  // Datos mock - en producción vendrían de APIs
  const mockPatients: Patient[] = [
    {
      id: '1',
      firstName: 'María',
      lastName: 'González',
      email: 'maria.gonzalez@email.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: new Date('1985-03-15'),
      gender: 'F',
      allergies: 'Penicilina, Sulfonamidas',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
    },
    {
      id: '2',
      firstName: 'Carlos',
      lastName: 'Mendoza',
      email: 'carlos.mendoza@email.com',
      phone: '+1 (555) 234-5678',
      dateOfBirth: new Date('1978-07-22'),
      gender: 'M',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-25'),
    },
    {
      id: '3',
      firstName: 'Ana',
      lastName: 'Herrera',
      email: 'ana.herrera@email.com',
      phone: '+1 (555) 345-6789',
      dateOfBirth: new Date('1992-11-08'),
      gender: 'F',
      allergies: 'Aspirina',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-05'),
    },
  ]

  const mockDoctors: Doctor[] = [
    {
      id: '1',
      firstName: 'Juan',
      lastName: 'Rodríguez',
      specialty: 'Medicina General',
      email: 'juan.rodriguez@medixone.com',
      phone: '+1 (555) 100-0001',
      schedule: [],
      isActive: true,
    },
    {
      id: '2',
      firstName: 'Ana',
      lastName: 'López',
      specialty: 'Endocrinología',
      email: 'ana.lopez@medixone.com',
      phone: '+1 (555) 100-0002',
      schedule: [],
      isActive: true,
    },
    {
      id: '3',
      firstName: 'Luis',
      lastName: 'Martínez',
      specialty: 'Cardiología',
      email: 'luis.martinez@medixone.com',
      phone: '+1 (555) 100-0003',
      schedule: [],
      isActive: true,
    },
  ]

  const mockMedications: Medication[] = [
    // Analgésicos
    {
      id: '1',
      name: 'Paracetamol',
      genericName: 'Acetaminofén',
      brand: 'Tylenol',
      category: 'ANALGESIC',
      form: 'TABLET',
      strength: '500mg',
      unit: 'mg',
      description: 'Analgésico y antipirético',
      indications: ['Dolor', 'Fiebre'],
      contraindications: ['Insuficiencia hepática severa'],
      sideEffects: ['Reacciones alérgicas raras'],
      interactions: ['Warfarina'],
      pregnancy: 'B',
      price: 3.5,
      isControlled: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Ibuprofeno',
      genericName: 'Ibuprofeno',
      brand: 'Advil',
      category: 'ANALGESIC',
      form: 'TABLET',
      strength: '400mg',
      unit: 'mg',
      description: 'AINE con acción analgésica y antiinflamatoria',
      indications: ['Dolor', 'Inflamación', 'Fiebre'],
      contraindications: ['Úlcera péptica', 'Insuficiencia renal'],
      sideEffects: ['Dolor epigástrico', 'Náuseas'],
      interactions: ['Warfarina', 'Aspirina'],
      pregnancy: 'C',
      price: 5.25,
      isControlled: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Antibióticos
    {
      id: '3',
      name: 'Amoxicilina',
      genericName: 'Amoxicilina',
      brand: 'Amoxil',
      category: 'ANTIBIOTIC',
      form: 'CAPSULE',
      strength: '500mg',
      unit: 'mg',
      description: 'Antibiótico betalactámico',
      indications: ['Infecciones bacterianas'],
      contraindications: ['Alergia a penicilinas'],
      sideEffects: ['Diarrea', 'Náuseas', 'Rash'],
      interactions: ['Anticoagulantes orales'],
      pregnancy: 'B',
      price: 8.75,
      isControlled: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      name: 'Ciprofloxacina',
      genericName: 'Ciprofloxacino',
      brand: 'Cipro',
      category: 'ANTIBIOTIC',
      form: 'TABLET',
      strength: '500mg',
      unit: 'mg',
      description: 'Antibiótico fluoroquinolona',
      indications: ['Infecciones del tracto urinario', 'Infecciones respiratorias'],
      contraindications: ['Hipersensibilidad', 'Menores de 18 años'],
      sideEffects: ['Náuseas', 'Diarrea', 'Mareo'],
      interactions: ['Antiácidos', 'Warfarina', 'Teofilina'],
      pregnancy: 'C',
      price: 12.25,
      isControlled: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Antihipertensivos
    {
      id: '5',
      name: 'Amlodipina',
      genericName: 'Amlodipina Besilato',
      brand: 'Norvasc',
      category: 'ANTIHYPERTENSIVE',
      form: 'TABLET',
      strength: '10mg',
      unit: 'mg',
      description: 'Bloqueador de canales de calcio',
      indications: ['Hipertensión', 'Angina'],
      contraindications: ['Hipersensibilidad', 'Shock cardiogénico'],
      sideEffects: ['Edema', 'Fatiga', 'Mareo'],
      interactions: ['Simvastatina'],
      pregnancy: 'C',
      price: 15.5,
      isControlled: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '6',
      name: 'Enalapril',
      genericName: 'Enalapril Maleato',
      brand: 'Vasotec',
      category: 'ANTIHYPERTENSIVE',
      form: 'TABLET',
      strength: '10mg',
      unit: 'mg',
      description: 'Inhibidor de la ECA',
      indications: ['Hipertensión', 'Insuficiencia cardíaca'],
      contraindications: ['Angioedema previo', 'Embarazo'],
      sideEffects: ['Tos seca', 'Hipotensión', 'Hiperkalemia'],
      interactions: ['Diuréticos', 'Litio'],
      pregnancy: 'D',
      price: 7.8,
      isControlled: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Antidiabéticos
    {
      id: '7',
      name: 'Metformina',
      genericName: 'Clorhidrato de Metformina',
      brand: 'Glucophage',
      category: 'ANTIDIABETIC',
      form: 'TABLET',
      strength: '500mg',
      unit: 'mg',
      description: 'Biguanida para el control de diabetes',
      indications: ['Diabetes mellitus tipo 2'],
      contraindications: ['Insuficiencia renal', 'Acidosis metabólica'],
      sideEffects: ['Náuseas', 'Diarrea', 'Dolor abdominal'],
      interactions: ['Alcohol', 'Contraste yodado'],
      pregnancy: 'B',
      price: 8.75,
      isControlled: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Cardiovasculares
    {
      id: '8',
      name: 'Atorvastatina',
      genericName: 'Atorvastatina Cálcica',
      brand: 'Lipitor',
      category: 'CARDIOVASCULAR',
      form: 'TABLET',
      strength: '20mg',
      unit: 'mg',
      description: 'Inhibidor de HMG-CoA reductasa',
      indications: ['Hipercolesterolemia', 'Prevención cardiovascular'],
      contraindications: ['Enfermedad hepática activa', 'Embarazo'],
      sideEffects: ['Mialgia', 'Cefalea', 'Elevación de transaminasas'],
      interactions: ['Amlodipina', 'Ciclosporina'],
      pregnancy: 'X',
      price: 18.9,
      isControlled: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Respiratorios
    {
      id: '9',
      name: 'Salbutamol',
      genericName: 'Sulfato de Salbutamol',
      brand: 'Ventolin',
      category: 'RESPIRATORY',
      form: 'INHALER',
      strength: '100mcg',
      unit: 'mcg',
      description: 'Broncodilatador beta2 agonista',
      indications: ['Asma', 'EPOC'],
      contraindications: ['Hipersensibilidad'],
      sideEffects: ['Temblor', 'Taquicardia', 'Nerviosismo'],
      interactions: ['Beta-bloqueadores'],
      pregnancy: 'C',
      price: 22.5,
      isControlled: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Gastrointestinales
    {
      id: '10',
      name: 'Omeprazol',
      genericName: 'Omeprazol',
      brand: 'Prilosec',
      category: 'GASTROINTESTINAL',
      form: 'CAPSULE',
      strength: '20mg',
      unit: 'mg',
      description: 'Inhibidor de bomba de protones',
      indications: ['Úlcera péptica', 'ERGE', 'Gastritis'],
      contraindications: ['Hipersensibilidad'],
      sideEffects: ['Cefalea', 'Diarrea', 'Dolor abdominal'],
      interactions: ['Clopidogrel', 'Warfarina'],
      pregnancy: 'C',
      price: 11.4,
      isControlled: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Neurológicos
    {
      id: '11',
      name: 'Gabapentina',
      genericName: 'Gabapentina',
      brand: 'Neurontin',
      category: 'NEUROLOGICAL',
      form: 'CAPSULE',
      strength: '300mg',
      unit: 'mg',
      description: 'Anticonvulsivante y analgésico neuropático',
      indications: ['Epilepsia', 'Dolor neuropático'],
      contraindications: ['Hipersensibilidad'],
      sideEffects: ['Somnolencia', 'Mareo', 'Fatiga'],
      interactions: ['Antiácidos'],
      pregnancy: 'C',
      price: 25.75,
      isControlled: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Hormonales
    {
      id: '12',
      name: 'Levotiroxina',
      genericName: 'Levotiroxina Sódica',
      brand: 'Synthroid',
      category: 'HORMONAL',
      form: 'TABLET',
      strength: '50mcg',
      unit: 'mcg',
      description: 'Hormona tiroidea sintética',
      indications: ['Hipotiroidismo'],
      contraindications: ['Tirotoxicosis', 'IAM reciente'],
      sideEffects: ['Palpitaciones', 'Insomnio', 'Pérdida de peso'],
      interactions: ['Anticoagulantes', 'Antidiabéticos'],
      pregnancy: 'A',
      price: 9.25,
      isControlled: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]

  return (
    <Layout title="Nueva Receta Médica">
      <div className="max-w-5xl mx-auto">
        <PrescriptionForm
          patients={mockPatients}
          doctors={mockDoctors}
          medications={mockMedications}
        />
      </div>
    </Layout>
  )
}

export default NewPrescriptionPage
