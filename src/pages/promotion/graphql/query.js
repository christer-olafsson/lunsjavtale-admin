import { gql } from "@apollo/client";

export const PROMOTIONS = gql`
  query{
    promotions{
      edges{
        node{
          id
          title
          description
          photoUrl
          fileId
          productUrl
          startDate
          endDate
          isActive
        }
      }
  }
}
`