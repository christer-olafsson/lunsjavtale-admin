import { gql } from "@apollo/client";

export const SUPPORTED_BRANDS = gql`
  query{
  supportedBrands{
    edges{
      node{
        id
        name
        siteUrl
        logoUrl
        fileId
        isActive
      }
    }
  }
}
`