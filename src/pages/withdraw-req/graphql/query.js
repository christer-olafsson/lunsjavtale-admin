import { gql } from "@apollo/client";

export const WITHDRAW_REQ = gql`
  query($vendorTitle: String, $status: String){
  withdrawRequests(vendorTitle: $vendorTitle, status: $status){
    edges{
      node{
        id
        createdOn
        isDeleted
        withdrawAmount
        status
        note
        vendor{
          id
          name
          email
          contact
          isBlocked
          logoUrl
          soldAmount
        }
      }
    }
  }
}
`