import { gql } from "@apollo/client";

export const FAQ_LIST = gql`
  query{
    FAQList{
      edges{
        node{
          id
          question
          answer
          isActive
        }
      }
    }
}
`