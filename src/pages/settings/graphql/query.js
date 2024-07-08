import { gql } from "@apollo/client";

export const CLIENT_DETAILS = gql`
  query{
  clientDetails{
    id
    name
    email
    slogan
    socialMediaLinks
    logoUrl
    coverPhotoUrl
    logoFileId
    coverPhotoFileId
    address
    formationDate
    contact
  }
}
`

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