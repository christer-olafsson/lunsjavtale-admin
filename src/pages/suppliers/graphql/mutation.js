import { gql } from "@apollo/client";

export const VENDOR_CREATION = gql`
  mutation VendorCreation ($input: VendorMutationInput!){
    vendorCreation(input:$input){
      message
    }
  }
`