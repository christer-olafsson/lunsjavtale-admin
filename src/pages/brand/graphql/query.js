import { gql } from "@apollo/client";

export const SUPPORTED_BRANDS = gql`
  query($name: String){
  supportedBrands(name: $name){
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