import { gql } from "@apollo/client";

export const DEFAULT_MUTATION = gql`
  mutation DefaultMutation (
    $address: String
    $contact: String
    $coverPhotoUrl: String
    $formationDate: Date
    $logoUrl: String
    $name: String!
    $slogan: String
    $socialMediaLinks: JSONString
  ){
    defaultMutation (
      address: $address
      contact: $contact
      coverPhotoUrl: $coverPhotoUrl
      formationDate: $formationDate
      logoUrl: $logoUrl
      name: $name
      slogan: $slogan
      socialMediaLinks: $socialMediaLinks
    ){
      message
    }
  }
`

export const ADD_NEW_ADMINISTRATOR = gql`
  mutation AddNewAdministrator ($input: AddAdministratorInput!){
    addNewAdministrator(input:$input){
      message
    }
  }
`

export const USER_PASSWORD_RESET = gql`
  mutation UserPasswordReset ($id:ID!, $password: String!){
    userPasswordReset(id:$id, password:$password){
      message
    }
  }
`

export const USER_DELETE = gql`
  mutation UserDelete ($email:String!){
    userDelete(email:$email){
      message
    }
  }
`