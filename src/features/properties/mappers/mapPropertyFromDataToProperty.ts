import type { PropertyFromData } from "../interface/PropertyFromDataInterface";
import type { Property } from "../interface/PropertyInterface";

export function mapPropertyFromDataToProperty(data: PropertyFromData[]): Property[] {
    return data.map(item => ({
        id: item.id,
        title: item.titulo,
        city: item.ciudad,
        type: item.tipo,
        price: item.precio,
        bedrooms: item.ambientes,
        squareMeters: item.metros_cuadrados,
        image: item.imagen || "/placeholder.svg",
    }));
}