import { gql } from "@apollo/client";

export const ORDER_PAYMENTS = gql`
  query($companyNameEmail: String, $status: String){
  orderPayments(companyNameEmail: $companyNameEmail, status: $status){
    edges{
      node{
        id
        createdOn
        paymentInfo
        paidAmount
        paymentType
        status
        paymentFor{
          id
          username
          email
          firstName
          lastName
      }
        company{
        id
        name
        email
        contact
        postCode
        isBlocked
        status
        logoUrl
        isDeleted
      }
      }
    }
  }
}
`

export const USERS = gql`
  query($company: String){
  users(company:$company){
    edges{
      node{
        id
        username
        email
        firstName
        lastName
        photoUrl
        dueAmount
      }
    }
  }
}
`