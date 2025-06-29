import type { Property } from "../interface/PropertyInterface";
import { mapPropertyFromDataToProperty } from "../mappers/mapPropertyFromDataToProperty"
import PROPERTIES_DATA_RAW from "../../../data/properties.json"


export function getProperties(): Property[] {
    // ? This function use data from a local JSON file
    const response = PROPERTIES_DATA_RAW

    return mapPropertyFromDataToProperty(response)
}