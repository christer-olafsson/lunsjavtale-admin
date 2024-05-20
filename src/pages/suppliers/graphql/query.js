import { gql } from "@apollo/client";

export const VENDORS = gql`
  query{
    vendors{
      edges{
        node{
          id
          createdOn
          name
          email
          contact
          postCode
          soldAmount
          isBlocked
          logoUrl
          fileId
          users{
          edges{
            node{
              id
              username
              firstName
              lastName
              role
            }
          }
        }
          # firstName
        }
      }
   }
}
`