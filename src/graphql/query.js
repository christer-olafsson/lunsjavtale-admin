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

export const CHECk_POST_CODE = gql`
  query CheckPostCode ($postCode: Int){
    checkPostCode(postCode: $postCode)
  }
`
