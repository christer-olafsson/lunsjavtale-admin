import { gql } from "@apollo/client";

export const VENDOR_CREATION = gql`
  mutation VendorCreation ($input: VendorMutationInput!){
    vendorCreation(input:$input){
      message
    }
  }
`
export const VENDOR_UPDATE = gql`
  mutation VendorUpdate ($input: VendorUpdateMutationInput!){
    vendorUpdate(input:$input){
      message
    }
  }
`