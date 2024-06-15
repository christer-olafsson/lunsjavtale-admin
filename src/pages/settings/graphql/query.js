import { gql } from "@apollo/client";

export const SYSTEM_USERS = gql`
  query{
  systemUsers{
    edges{
      node{
        id
        username
        email
        firstName
        lastName
        role
        password
        isSuperuser
        isDeleted
      }
    }
  }
}
`