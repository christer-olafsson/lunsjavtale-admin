import { gql } from "@apollo/client";

export const COUPONS = gql`
  query($name: String){
    coupons(name: $name){
      edges{
        node{
          id
          isDeleted
          deletedOn
          createdOn
          updatedOn
          name
          promoType
          maxUsesLimit
          maxLimitPerUser
          value
          minAmount
          maxAmount
          isActive
          startDate
          endDate
          addedFor{
            edges{
              node{
                id
                name
                email
                postCode
                contact
                isBlocked
                
              }
            }
          }
        }
      }
    }
}
`