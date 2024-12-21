import { gql } from "@apollo/client";

export const VENDOR_CREATION = gql`
  mutation VendorCreation ($input: VendorCreateFormInput, $postCode: [Int]){
    vendorCreation(input:$input,postCode:$postCode){
      message
    }
  }
`
export const VENDOR_UPDATE = gql`
  mutation VendorUpdate ($input: VendorUpdateFormInput,$postCode: [Int]){
    vendorUpdate(input:$input,postCode:$postCode){
      message
    }
  }
`
export const VENDOR_DELETE = gql`
  mutation VendorDelete ($id: ID!){
    vendorDelete(id:$id){
      message
    }
  }
`