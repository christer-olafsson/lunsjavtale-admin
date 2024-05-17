import { gql } from "@apollo/client";

export const GET_ALL_CATEGORY = gql`
query{
  categories{
  edges{
    node{
      id
      name
      description
      products{
        edges{
          node{
            id
            actualPrice
            name
            description
            attachments(isCover:true){
              edges{
                node{
                  id
                  fileUrl
                }
              }
            }
          }
        }
      }
    }
  }
}
}
`

export const GET_INGREDIENTS = gql`
  query{
    ingredients{
      edges{
        node{
          id
          name
          isActive
      }
    }
  }
}
`

export const CHECk_POST_CODE = gql`
  query CheckPostCode ($postCode: Int){
    checkPostCode(postCode: $postCode)
  }
`

export const COMPANIES = gql`
  query{
  companies{
    edges{
      node{
        id
        isDeleted
        isBlocked
        name
        description
        email
        contact
        workingEmail
        postCode
        allowancePercentage
        noOfEmployees
        formationDate
        orderedAmount
        invoiceAmount
        logoUrl
        fileId
        paidAmount
        isValid
       totalEmployee
       owner{
          id
          username
          email
          firstName
          lastName
          photoUrl
        }
       users{
          edges{
            node{
              id
              username
              email
              firstName
              isVerified
              isActive
              isStaff
              phone
              postCode
              gender
              role
              photoUrl
              allergies{
                edges{
                  node{
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`
