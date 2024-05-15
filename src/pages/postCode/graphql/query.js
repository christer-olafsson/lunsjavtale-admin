import { gql } from "@apollo/client";

export const VALID_AREAS = gql`
  query{
    validAreas{
      edges{
        node{
          id
          createdOn
          updatedOn
          name
          postCode
          isActive
        }
      }
    }
  }
`