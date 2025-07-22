import React from 'react'
import type { NextPage } from 'next'
import { Layout } from '@/components/layout/Layout'
import { PatientForm } from '@/components/patients/PatientForm'

const NewPatientPage: NextPage = () => {
  return (
    <Layout title="Nuevo Paciente">
      <div className="max-w-4xl mx-auto">
        <PatientForm />
      </div>
    </Layout>
  )
}

export default NewPatientPage
