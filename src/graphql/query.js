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
            priceWithTax
            name
            description
            photoUrl
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
