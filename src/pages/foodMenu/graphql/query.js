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
            price
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

export const GET_SINGLE_CATEGORY = gql`
  query SingleCategory ($id: ID){
    category(id: $id){
      name
      products{
        edges{
          node{
            id
            name
            title
            price
            description
            category{
            name
          }
            attachments{
              edges{
                node{
                  fileUrl
              }
            }
          }
        }
      }
    }
    }
  }
`