import { gql } from "@apollo/client";

export const VALID_AREAS = gql`
  query($postCode: Int){
    validAreas(postCode:$postCode){
      edges{
        node{
          id
          createdOn
          updatedOn
          name
          postCode
          isActive
          vendorSet{
          edges{
            node{
              id
              name
              email
              logoUrl
              postCode
            }
          }
        }
        }
      }
    }
  }
`