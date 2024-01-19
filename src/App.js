import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import Cities from "./components/cities/Cities";
// import Consignees from "./components/consignees/Consignees";
import Accounting from "./components/accounting/Accounting";
import Checkout from "./components/checkout/Checkout";
import Countries from "./components/countries/Countries";
import Customer from "./components/customers/Customer";
import Customers from "./components/customers/Customers";
import DestinationExport from "./components/destination/DestinationExport";
import DestinationExports from "./components/destination/DestinationExports";
import Export from "./components/exports/Export";
import Exports from "./components/exports/Exports";
import Home from "./components/home/Home";
import Locations from "./components/locations/Locations";
import Notes from "./components/notes/Notes";
import Dashboard from "./components/pages/dashboard/Dashboard";
import Login from "./components/pages/login/Login";
import TrackingVehicleStatus from "./components/pages/login/TrackingVehicleStatus";
import Signup from "./components/pages/signup/Signup";
import PortOfDischarge from "./components/ports/PortOfDischarges";
import PortOfLoading from "./components/ports/PortOfLoadings";
import Role from "./components/roles/Role";
import Roles from "./components/roles/Roles";
import UserRole from "./components/roles/UserRole";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import States from "./components/states/States";
import User from "./components/user/User";
import UserManagement from "./components/user/UserManagement";
import Paginate from "./components/vehicles/Paginate";
import Vehicle from "./components/vehicles/Vehicle";
import VehiclesTable from "./components/vehicles/VehiclesTable";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/tracking-vehicle-status" element={<PublicRoute><TrackingVehicleStatus /></PublicRoute>}  /> 

          <Route path="/" element={<Navigate to="/dashboard" />} />  
          <Route path="/*" element={<PrivateRoute><Dashboard /></PrivateRoute>}>
            <Route path="dashboard" element={<Home />} /> 
            <Route path="locations" element={<Locations />} /> 
            <Route path="countries" element={<Countries />} /> 
            <Route path="states" element={<States />} /> 
            <Route path="cities" element={<Cities />} /> 
            <Route path="roles" element={<Roles />} /> 
            <Route path="roles/:id" element={<Role />} /> 
            <Route path="customers" element={<Customers />} /> 
            <Route path="customers/:id" element={<Customer />} /> 
            {/* <Route path="consignees" element={<Consignees />} />  */}
            {/* <Route path="vehicles" element={<Vehicles />} />  */}
            <Route path="vehicles" element={<VehiclesTable />} /> 
            <Route path="vehicles/:id" element={<Vehicle />} /> 
            <Route path="exports" element={<Exports />} /> 
            <Route path="exports/:id" element={<Export />} /> 
            <Route path="destination-exports" element={<DestinationExports />} /> 
            <Route path="destination-exports/:id" element={<DestinationExport />} /> 
            <Route path="user-management" element={<UserManagement />} /> 
            <Route path="acl/users/:id" element={<UserRole />} /> 
            <Route path="notes" element={<Notes />} /> 
            <Route path="pagination" element={<Paginate />} /> 
            <Route path="port-of-loading" element={<PortOfLoading />} /> 
            <Route path="port-of-discharge" element={<PortOfDischarge />} /> 
            <Route path="checkout" element={<Checkout />} /> 
            <Route path="accounting" element={<Accounting />} /> 
            <Route path="user-management/:id" element={<User />} /> 
            {/* <Route path="paginationb" element={<PaginateB />} />  */}
          </Route>  
        </Routes>
      </Router>
    </>
  );
};

export default App;
