import { createLoader, parseAsArrayOf, parseAsString, parseAsStringLiteral } from "nuqs/server"

export const sortOptions = ['curated', 'trending', 'hot_and_new'] as const

const params = {
  sort: parseAsStringLiteral(sortOptions).withDefault('curated'),
  minPrice: parseAsString.withOptions({clearOnDefault: true}).withDefault(''),
  maxPrice: parseAsString.withOptions({clearOnDefault: true}).withDefault(''),
  tags: parseAsArrayOf(parseAsString).withOptions({clearOnDefault: true}).withDefault([]),
}


export const productFiltersLoader = createLoader(params)