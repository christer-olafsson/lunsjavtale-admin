import { gql } from "@apollo/client";

export const VENDORS = gql`
  query($name: String,$hasProduct: Boolean){
    vendors(name: $name,hasProduct:$hasProduct){
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
          isDeleted
          products{
            edges{
              node{
                id
              }
            }
          }
          users{
          edges{
            node{
              id
              username
              firstName
              lastName
              role
              photoUrl
            }
          }
        }
        }
      }
   }
}
`

export const VENDOR = gql`
  query($id:ID){
  vendor(id:$id){
    id
    createdOn
    name
    email
    contact
    postCode
    logoUrl
    formationDate
    socialMediaLinks
    soldAmount
    withdrawnAmount
    balance
    isDeleted
    name
    contact
    isBlocked
    owner{
    id
    firstName
    lastName
    address
    gender
    dateOfBirth
    about
    phone
    email
    username
    
  }
    products{
      edges{
        node{
          id
          createdOn
          actualPrice
          taxPercent
          priceWithTax
          name
          title
          description
          contains
          isDeleted
          availability
          discountAvailability
          # productRatings
          attachments{
            edges{
              node{
                id
                fileUrl
                isCover
              }
            }
          }
          ingredients{
            edges{
              node{
                id
                name
                isDeleted
              }
            }
          }
          category{
            id
            name
            isActive
          }
        }
      }
    }
    owner{
      id
      username
      email
      phone
      photoUrl
      postCode
      dateJoined
      dueAmount 
    }
  }
}
`