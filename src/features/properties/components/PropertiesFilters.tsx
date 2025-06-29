import { usePropertiesContext } from "../context/PropertiesContext"
import { Filter, Search } from "lucide-react"

export function PropertyFilters() {
  const { searchTerm, setSearchTerm, cityFilter, setCityFilter, typeFilter, setTypeFilter, cities, types, clearFilters } = usePropertiesContext()

  return (
    <section className="card bg-base-100 shadow-sm" aria-label="Filtros de propiedades">
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="form-control w-full">
            <label htmlFor="search-input" className="label">
              <span className="label-text">Buscar propiedades</span>
            </label>
            <div className="input w-full flex items-center">
              <Search aria-hidden="true" />
              <input
                id="search-input"
                type="text"
                placeholder="Buscar propiedades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar propiedades"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="form-control">
            <label htmlFor="city-select" className="label">
              <span className="label-text">Ciudad</span>
            </label>
            <select
              id="city-select"
              className="select select-bordered w-full"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              aria-label="Filtrar por ciudad"
            >
              <option value="all">Todas las ciudades</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label htmlFor="type-select" className="label">
              <span className="label-text">Tipo</span>
            </label>
            <select
              id="type-select"
              className="select select-bordered w-full"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filtrar por tipo"
            >
              <option value="all">Todos los tipos</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-outline"
            onClick={clearFilters}
            aria-label="Limpiar filtros"
            type="button"
          >
            <Filter aria-hidden="true" />
            <span className="sr-only">Limpiar filtros</span>
            Limpiar filtros
          </button>
        </div>
      </div>
    </section>
  )
}