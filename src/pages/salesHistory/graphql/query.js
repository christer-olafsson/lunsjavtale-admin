import { gql } from "@apollo/client";

export const SALES_HISTORIES = gql`
  query($supplierNameEmail: String){
  salesHistories(supplierNameEmail: $supplierNameEmail){
    edges{
      node{
        id
        createdOn
        updatedOn
        quantity
        priceWithTax
        totalPriceWithTax
        orderedQuantity
        dueAmount
        vendor{
          id
          name
          email
          contact
          postCode
          logoUrl
        }
        order{
          id
          deliveryDate
          paidAmount
          finalPrice
          companyAllowance
          dueAmount
          status
          company{
            id
            name
            email
            contact
            postCode
          }
        }
        item{
          id
          priceWithTax
          name
          description
          attachments{
            edges{
              node{
                fileUrl
                isCover
              }
            }
          }
          category{
            id
            name
          }
        }
      }
    }
  }
}
`

export const ORDERS = gql`
  query{
    orders{
      edges{
        node{
          id
          createdOn
          isDeleted
          deletedOn
          finalPrice
          status
          deliveryDate
          finalPrice
          orderCarts{
            edges{
              node{
                id
                quantity
                priceWithTax
                totalPriceWithTax
                orderedQuantity
                item{
                  id
                  priceWithTax
                  name
                  attachments{
                  edges{
                    node{
                      fileUrl
                      isCover
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
}
`

export const ORDER = gql`
  query($id:ID!) {
    order(id:$id){
    id
    createdOn
    isDeleted
    deliveryDate
    finalPrice
    status
    orderCarts{
      edges{
        node{
          id
          cancelled
          orderedQuantity
          priceWithTax
          totalPriceWithTax
          item{
            id
            priceWithTax
            name
            attachments{
              edges{
                node{
                  id
                  fileUrl
                  isCover
                }
              }
            }
            category{
              id
              name
            }
          }
          users{
            edges{
              node{
                id
                addedFor{
                  id
                  username
                  email
                  firstName
                  lastName
                  postCode
                  photoUrl
                  role
                  isDeleted
                  phone
                  dueAmount
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