import { gql } from "@apollo/client";

export const GET_ALL_CATEGORY = gql`
query{
  categories{
  edges{
    node{
      id
      name
      description
      isActive
      logoUrl
      fileId
      products(isDeleted: false){
        edges{
          node{
            id
            name
            title
            actualPrice
            priceWithTax
            contains
            description
            availability
            discountAvailability
            isDeleted
            category{
              id
              name
            }
            ingredients{
              edges{
                node{
                  id
                  name
                }
              }
            }
            attachments{
              edges{
                node{
                  id
                  fileUrl
                  fileId
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
`

export const GET_SINGLE_CATEGORY = gql`
  query SingleCategory ($id: ID){
    category(id: $id){
      name
      products(isDeleted: false){
        edges{
          node{
            id
            name
            title
            actualPrice
            priceWithTax
            description
            isDeleted
            category{
            name
          }
            attachments{
              edges{
                node{
                  fileUrl
                  fileId
              }
            }
          }
        }
      }
    }
    }
  }
`

export const PRODUCTS = gql`
  query Products ($id: ID, $category: String, $title: String) {
      products(id:$id, category: $category, title: $title){
        edges{
          node{
          id
          name
          priceWithTax
          actualPrice
          description
          availability
          discountAvailability
          isDeleted
          title
          contains
          ingredients{
            edges{
              node{
                id
                name
                description
                isActive
              }
            }
          }
          attachments{
            edges{
              node{
                id
                fileUrl
                fileId
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

`

// export const PRODUCTS = gql`
//   query Products = ($category: String)
// `