import { Navbar } from './features/core/components/navbar/Navbar'
import { PropertyFilters } from './features/properties/components/PropertiesFilters'
import { PropertiesProvider } from './features/properties/context/PropertiesContext'
import { PropertiesListContainer } from './features/properties/components/PropertiesListContainer'
import { PropertiesRecommendationsPanel } from './features/properties/components/PropertiesRecommendationsPanel'

export default function App() {
  return (
    <PropertiesProvider>
      <div className="min-h-screen bg-base-200">
        <Navbar />
        <section className='max-w-11/12 mx-auto px-4 py-6 gap-8 flex flex-col lg:flex-row lg:items-start lg:gap-8'>
          <div className="flex gap-4 flex-col">
            <header>
              <PropertyFilters />
            </header>
            <div className='flex flex-1 flex-col items-center gap-8'>
              <PropertiesListContainer />
            </div>
          </div>
          <div className="lg:col-span-1">
            <PropertiesRecommendationsPanel />
          </div>
        </section>
      </div>
    </PropertiesProvider>
  )
}