import React from 'react'
import type { NextPage } from 'next'
import { Layout } from '@/components/layout/Layout'
import { LabOrderForm } from '@/components/laboratory/LabOrderForm'

// Tipos locales para la página
interface Patient {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  dateOfBirth: Date
  gender: 'M' | 'F' | 'OTHER'
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

interface LabTest {
  id: string
  code: string
  name: string
  category: string
  description: string
  normalRange: string
  units: string
  preparationInstructions: string
  price: number
  estimatedTime: number
  isActive: boolean
}

const NewLabOrderPage: NextPage = () => {
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

  const mockAvailableTests: LabTest[] = [
    // Hematología
    {
      id: '1',
      code: 'CBC',
      name: 'Hemograma Completo',
      category: 'HEMATOLOGY',
      description: 'Conteo completo de células sanguíneas',
      normalRange: 'Variable según edad y sexo',
      units: 'cells/μL',
      preparationInstructions: 'No requiere ayuno',
      price: 25.0,
      estimatedTime: 2,
      isActive: true,
    },
    {
      id: '2',
      code: 'ESR',
      name: 'Velocidad de Sedimentación',
      category: 'HEMATOLOGY',
      description: 'Velocidad de sedimentación globular',
      normalRange: 'H: <15 mm/h, M: <20 mm/h',
      units: 'mm/h',
      preparationInstructions: 'No requiere preparación especial',
      price: 18.0,
      estimatedTime: 1,
      isActive: true,
    },
    // Bioquímica
    {
      id: '3',
      code: 'GLUC',
      name: 'Glucosa en Sangre',
      category: 'BIOCHEMISTRY',
      description: 'Nivel de glucosa en sangre',
      normalRange: '70-100 mg/dL',
      units: 'mg/dL',
      preparationInstructions: 'Ayuno de 8-12 horas',
      price: 15.0,
      estimatedTime: 1,
      isActive: true,
    },
    {
      id: '4',
      code: 'HBA1C',
      name: 'Hemoglobina Glicosilada',
      category: 'BIOCHEMISTRY',
      description: 'Control glicémico de los últimos 3 meses',
      normalRange: '<5.7%',
      units: '%',
      preparationInstructions: 'No requiere ayuno',
      price: 35.0,
      estimatedTime: 3,
      isActive: true,
    },
    {
      id: '5',
      code: 'CHOL',
      name: 'Colesterol Total',
      category: 'BIOCHEMISTRY',
      description: 'Nivel de colesterol total en sangre',
      normalRange: '<200 mg/dL',
      units: 'mg/dL',
      preparationInstructions: 'Ayuno de 9-12 horas',
      price: 20.0,
      estimatedTime: 2,
      isActive: true,
    },
    {
      id: '6',
      code: 'CREA',
      name: 'Creatinina',
      category: 'BIOCHEMISTRY',
      description: 'Función renal',
      normalRange: 'H: 0.7-1.3 mg/dL, M: 0.6-1.1 mg/dL',
      units: 'mg/dL',
      preparationInstructions: 'No requiere ayuno',
      price: 18.0,
      estimatedTime: 1,
      isActive: true,
    },
    // Cardiología
    {
      id: '7',
      code: 'TROP',
      name: 'Troponina I',
      category: 'CARDIOLOGY',
      description: 'Marcador de daño cardíaco',
      normalRange: '<0.04 ng/mL',
      units: 'ng/mL',
      preparationInstructions: 'No requiere preparación',
      price: 45.0,
      estimatedTime: 1,
      isActive: true,
    },
    {
      id: '8',
      code: 'CK-MB',
      name: 'Creatina Quinasa MB',
      category: 'CARDIOLOGY',
      description: 'Enzima cardíaca específica',
      normalRange: '<6.3 ng/mL',
      units: 'ng/mL',
      preparationInstructions: 'No requiere preparación',
      price: 30.0,
      estimatedTime: 2,
      isActive: true,
    },
    // Inmunología
    {
      id: '9',
      code: 'PCR',
      name: 'Proteína C Reactiva',
      category: 'IMMUNOLOGY',
      description: 'Marcador de inflamación',
      normalRange: '<3.0 mg/L',
      units: 'mg/L',
      preparationInstructions: 'No requiere preparación especial',
      price: 22.0,
      estimatedTime: 2,
      isActive: true,
    },
    {
      id: '10',
      code: 'ANTI-HIV',
      name: 'Anticuerpos VIH',
      category: 'IMMUNOLOGY',
      description: 'Detección de anticuerpos contra VIH',
      normalRange: 'No reactivo',
      units: 'Cualitativo',
      preparationInstructions: 'No requiere preparación especial',
      price: 40.0,
      estimatedTime: 4,
      isActive: true,
    },
    // Microbiología
    {
      id: '11',
      code: 'UROCULT',
      name: 'Urocultivo',
      category: 'MICROBIOLOGY',
      description: 'Cultivo de orina para detectar infecciones',
      normalRange: '<100,000 UFC/mL',
      units: 'UFC/mL',
      preparationInstructions: 'Muestra de primera orina de la mañana, aseo genital previo',
      price: 35.0,
      estimatedTime: 48,
      isActive: true,
    },
    // Endocrinología
    {
      id: '12',
      code: 'TSH',
      name: 'Hormona Estimulante de Tiroides',
      category: 'ENDOCRINOLOGY',
      description: 'Función tiroidea',
      normalRange: '0.27-4.2 mIU/L',
      units: 'mIU/L',
      preparationInstructions: 'No requiere ayuno',
      price: 28.0,
      estimatedTime: 3,
      isActive: true,
    },
    {
      id: '13',
      code: 'T4L',
      name: 'Tiroxina Libre',
      category: 'ENDOCRINOLOGY',
      description: 'Hormona tiroidea libre',
      normalRange: '0.93-1.7 ng/dL',
      units: 'ng/dL',
      preparationInstructions: 'No requiere ayuno',
      price: 32.0,
      estimatedTime: 3,
      isActive: true,
    },
  ]

  return (
    <Layout title="Nueva Orden de Laboratorio">
      <div className="max-w-5xl mx-auto">
        <LabOrderForm
          patients={mockPatients}
          doctors={mockDoctors}
          availableTests={mockAvailableTests}
        />
      </div>
    </Layout>
  )
}

export default NewLabOrderPage
