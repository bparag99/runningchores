import { ArihantProvider, useArihant } from '../context/ArihantContext'
import { HomePage } from '../pages/HomePage'
import { DashboardPage } from '../pages/DashboardPage'
import { ImmovablesPage } from '../pages/ImmovablesPage'
import { SettingsPage } from '../pages/SettingsPage'
import { Layout } from '../components/Layout'

function MainApp() {
  const { view } = useArihant()
  if (view === 'home') return <HomePage />
  return <Layout>{view === 'dashboard' && <DashboardPage />}{view === 'summary' && <ImmovablesPage />}{view === 'settings' && <SettingsPage />}</Layout>
}

export default function ArihantAssociatesApp() {
  return <ArihantProvider><MainApp /></ArihantProvider>
}
