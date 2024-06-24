import { gql } from "@apollo/client";

export const ADMIN_DASHBOARD = gql`
  query($dateRange: String){
    adminDashboard(dateRange: $dateRange){
      data
    }
  }
`