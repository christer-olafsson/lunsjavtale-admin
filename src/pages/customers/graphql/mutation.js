import { gql } from "@apollo/client";

export const COMPANY_MUTATION = gql`
  mutation CompanyMutation ($input:CompanyMutationForAdminInput!){
    companyMutation(input:$input){
      message
      success
    }
  }
`

export const COMPANY_DELETE = gql`
  mutation CompanyDelete ($id: ID!){
    companyDelete(id:$id){
      success
      message
    }
  }
`