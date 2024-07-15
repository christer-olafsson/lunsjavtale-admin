import { gql } from "@apollo/client";

export const GET_ALL_CATEGORY = gql`
query($isVendorProduct: Boolean, $vendor: String,$isFeatured: Boolean, $availability: Boolean){
  categories{
  edges{
    node{
      id
      name
      description
      isActive
      logoUrl
      fileId
      order
      products(isDeleted: false,isVendorProduct:$isVendorProduct, vendor: $vendor, isFeatured: $isFeatured, availability: $availability){
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
  query Products (
        $id: ID,
        $category: String,
        $title: String,
        $availability: Boolean,
        $isVendorProduct: Boolean,
        $offset:Int,
        $first: Int,
        $vendor: String,
        $isFeatured: Boolean
       ) {
        products(
          id:$id, 
          category: 
          $category, 
          title: $title,
          availability: $availability,
          isVendorProduct: $isVendorProduct,
          offset: $offset,
          first: $first,
          vendor: $vendor,
          isFeatured: $isFeatured
        ){
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
          isFeatured
          vendor{
            id
            name
            email
            isDeleted
          }
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